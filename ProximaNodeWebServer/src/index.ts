import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { BankInfo, DocumentBlock } from "./GlobalTypes";
import { constructTransactionBlock } from "./blockchain";
import axios from "axios";
import { createSignature } from "./cryptography/helper";

const app = express();
const port = 11111;
var cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(fileUpload());
app.use(express.static("static"));
app.use(cors({ credentials: true, origin: true }));

const ABI_CLIENT_FILE = path.resolve(
  __dirname,
  "./resources/ABI-Bank/client-network.json"
);
const CITI_CLIENT_FILE = path.resolve(
  __dirname,
  "./resources/CITI-Bank/client-network.json"
);
const BANK_NETWORK_FILE = path.resolve(
  __dirname,
  "./resources/banks-network.json"
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/add_transactions", (req, res) => {
  const allTransactions = req.body.transactions;
  const bankName = req.body.bankName;
  let bankInfo: BankInfo = getBankInfo(bankName);
  // console.log(allTransactions);

  const block = constructTransactionBlock(bankInfo, allTransactions);
  console.log(block);
  axios.post("http://0.0.0.0:8080/mine", block);
  res.send("recieved");
});

app.post("/add_document", (req, res) => {
  const clientHash = req.body.clientHash;
  const documentId = req.body.documentId;
  const bankName = req.body.bankName;
  let bankInfo: BankInfo = getBankInfo(bankName);

  const request = req as any;
  if (!request.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  const myFile = request.files.file;
  //  mv() method places the file inside public directory
  fs.closeSync(fs.openSync(`${__dirname}/public/${myFile.name}`, "w"));
  myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    // returing the response with file path and name
    return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });

  const checksum = myFile.md5;
  const documentBlock: DocumentBlock = {
    type: "com.omega.models.Block.DocumentBlock",
    bankHash: bankInfo.publicKey,
    clientHash: clientHash,
    documentHash: checksum,
    documentId,
    clientSignature: "",
    bankSignature: createSignature(
      `${bankInfo.publicKey}|${clientHash}|${documentId}`,
      bankInfo.privateKey
    ),
    header: {
      previousBlockHash: "",
      timestamp: 0,
      version: "",
    },
  };
  console.log(documentBlock);
  axios.post("http://0.0.0.0:8080/mine", documentBlock);
});

app.get("/nacl", (req, res) => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024,
  });
  const sign = crypto.createSign("SHA256");
  sign.update("some data to sign");
  sign.end();
  const signature = sign.sign(privateKey);

  const verify = crypto.createVerify("SHA256");
  verify.update("some data to sign");
  verify.end();
  res.json({
    signature,
    length: signature.length,
    status: verify.verify(publicKey, signature),
    publicKey,
    privateKey,
  });
});

app.post("/add_client", (req, res) => {
  console.log(req.body);
  console.log(__dirname);
  const clientName = req.body.clientName;
  const file = fs.readFileSync(ABI_CLIENT_FILE, {
    encoding: "utf-8",
  });
  const existingClients = JSON.parse(file);
  console.log(existingClients);
  crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 1024,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    (err, publicKey: string, privateKey: string) => {
      const opaquePublickKey = publicKey
        .replace("-----BEGIN PUBLIC KEY-----\n", "")
        .replace("\n-----END PUBLIC KEY-----\n", "")
        .replace(/[\r\n]+/g, "");
      const opaquePrivatekKey = privateKey
        .replace("-----BEGIN PRIVATE KEY-----\n", "")
        .replace("\n-----END PRIVATE KEY-----\n", "")
        .replace(/[\r\n]+/g, "");

      const response = {
        clientName: clientName,
        publicKey: opaquePublickKey,
        privateKey: opaquePrivatekKey,
      };
      existingClients.clients.push(response);
      console.log(existingClients);
      fs.writeFileSync(ABI_CLIENT_FILE, JSON.stringify(existingClients));

      res.json(response);
    }
  );
});

app.post("/get_clients", (req, res) => {
  const bankName = req.body.bankName;
  console.log(bankName);
  if (bankName === "ABI Bank") {
    const file = fs.readFileSync(ABI_CLIENT_FILE, {
      encoding: "utf-8",
    });
    const existingClients = JSON.parse(file);
    res.json({ status: "success", ...existingClients });
  } else if (bankName === "CITI Bank") {
    const file = fs.readFileSync(CITI_CLIENT_FILE, {
      encoding: "utf-8",
    });
    const existingClients = JSON.parse(file);
    res.json({ status: "success", ...existingClients });
  } else {
    res.json({ status: "failed", reason: "Invalid Bank Name" });
  }
});

app.post("/get_transactions", async (req, res) => {
  const clientHash = req.body.clientHash;
  console.log("Found Client Hash " + clientHash.length);

  if (clientHash) {
    try {
      const output = await axios.post("http://0.0.0.0:8080/get_transactions", {
        clientHash,
      });
      return res.json({ status: "success", transactions: output.data });
    } catch {
      return res.json({ status: "failed" });
    }
  }

  return res.json({ status: "failed", reason: "client hash invalid" });
});

const getBankInfo = (bankName: string) => {
  const file = fs.readFileSync(BANK_NETWORK_FILE, {
    encoding: "utf-8",
  });
  const networks = JSON.parse(file).banks;
  if (bankName === "ABI Bank") {
    return networks[0];
  } else {
    return networks[1];
  }
};

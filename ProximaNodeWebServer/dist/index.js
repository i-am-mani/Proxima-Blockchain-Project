"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const blockchain_1 = require("./blockchain");
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./cryptography/helper");
const app = express_1.default();
const port = 11111;
var cors = require("cors");
const fileUpload = require("express-fileupload");
app.use(express_1.default.json());
app.use(fileUpload());
app.use(express_1.default.static("static"));
app.use(cors({ credentials: true, origin: true }));
const ABI_CLIENT_FILE = path_1.default.resolve(__dirname, "./resources/ABI-Bank/client-network.json");
const CITI_CLIENT_FILE = path_1.default.resolve(__dirname, "./resources/CITI-Bank/client-network.json");
const BANK_NETWORK_FILE = path_1.default.resolve(__dirname, "./resources/banks-network.json");
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
app.post("/add_transactions", (req, res) => {
    const allTransactions = req.body.transactions;
    const bankName = req.body.bankName;
    let bankInfo = getBankInfo(bankName);
    // console.log(allTransactions);
    const block = blockchain_1.constructTransactionBlock(bankInfo, allTransactions);
    console.log(block);
    axios_1.default.post("http://0.0.0.0:8080/mine", block);
    res.send("recieved");
});
app.post("/add_document", (req, res) => {
    const clientHash = req.body.clientHash;
    const documentId = req.body.documentId;
    const bankName = req.body.bankName;
    let bankInfo = getBankInfo(bankName);
    const request = req;
    if (!request.files) {
        return res.status(500).send({ msg: "file is not found" });
    }
    const myFile = request.files.file;
    //  mv() method places the file inside public directory
    fs_1.default.closeSync(fs_1.default.openSync(`${__dirname}/public/${myFile.name}`, "w"));
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({ name: myFile.name, path: `/${myFile.name}` });
    });
    const checksum = myFile.md5;
    const documentBlock = {
        type: "com.omega.models.Block.DocumentBlock",
        bankHash: bankInfo.publicKey,
        clientHash: clientHash,
        documentHash: checksum,
        documentId,
        clientSignature: "",
        bankSignature: helper_1.createSignature(`${bankInfo.publicKey}|${clientHash}|${documentId}`, bankInfo.privateKey),
        header: {
            previousBlockHash: "",
            timestamp: 0,
            version: "",
        },
    };
    console.log(documentBlock);
    axios_1.default.post("http://0.0.0.0:8080/mine", documentBlock);
});
app.get("/nacl", (req, res) => {
    const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 1024,
    });
    const sign = crypto_1.default.createSign("SHA256");
    sign.update("some data to sign");
    sign.end();
    const signature = sign.sign(privateKey);
    const verify = crypto_1.default.createVerify("SHA256");
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
    const file = fs_1.default.readFileSync(ABI_CLIENT_FILE, {
        encoding: "utf-8",
    });
    const existingClients = JSON.parse(file);
    console.log(existingClients);
    crypto_1.default.generateKeyPair("rsa", {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    }, (err, publicKey, privateKey) => {
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
        fs_1.default.writeFileSync(ABI_CLIENT_FILE, JSON.stringify(existingClients));
        res.json(response);
    });
});
app.post("/get_clients", (req, res) => {
    const bankName = req.body.bankName;
    console.log(bankName);
    if (bankName === "ABI Bank") {
        const file = fs_1.default.readFileSync(ABI_CLIENT_FILE, {
            encoding: "utf-8",
        });
        const existingClients = JSON.parse(file);
        res.json(Object.assign({ status: "success" }, existingClients));
    }
    else if (bankName === "CITI Bank") {
        const file = fs_1.default.readFileSync(CITI_CLIENT_FILE, {
            encoding: "utf-8",
        });
        const existingClients = JSON.parse(file);
        res.json(Object.assign({ status: "success" }, existingClients));
    }
    else {
        res.json({ status: "failed", reason: "Invalid Bank Name" });
    }
});
app.post("/get_transactions", (req, res) => {
    const clientHash = req.body.clientHash;
    console.log("Found Client Hash");
    if (clientHash) {
        axios_1.default
            .post("http://0.0.0.0:8080/get_transactions", { clientHash })
            .then((res) => {
            console.log(res);
        });
        res.json({ status: "success" });
        return;
    }
    res.json({ status: "failed", reason: "client hash invalid" });
});
const getBankInfo = (bankName) => {
    const file = fs_1.default.readFileSync(BANK_NETWORK_FILE, {
        encoding: "utf-8",
    });
    const networks = JSON.parse(file).banks;
    if (bankName === "ABI Bank") {
        return networks[0];
    }
    else {
        return networks[1];
    }
};
//# sourceMappingURL=index.js.map
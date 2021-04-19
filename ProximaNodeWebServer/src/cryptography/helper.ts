import * as crypto from "crypto";

export const convertKeyToPrivatePEM = (key: string) => {
  var nChunks = key.split(/(.{64})/).filter((c) => c.length > 0);
  var finalPrivateKey =
    "-----BEGIN PRIVATE KEY-----\n" +
    nChunks.join("\n") +
    "\n-----END PRIVATE KEY-----\n";
  return finalPrivateKey;
};

export const convertKeyToPublicPEM = (key: string) => {
  var nChunks = key.split(/(.{64})/).filter((c) => c.length > 0);
  var finalPublicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    nChunks.join("\n") +
    "\n-----END PUBLIC KEY-----\n";
  return finalPublicKey;
};

export const createSignature = (message: string, privateKey: string) => {
  var signer = crypto.createSign("RSA-SHA256");
  signer.update(message);
  signer.end();
  const finalPrivateKey = convertKeyToPrivatePEM(privateKey);
  return signer.sign(finalPrivateKey, "base64");
};

export const verifySignature = (
  message: string,
  signatureToVerify: string,
  publickKey: string
) => {
  var signer = crypto.createVerify("RSA-SHA256");
  signer.update(message);
  signer.end();
  const finalPublicKey = convertKeyToPublicPEM(publickKey);
  signer.verify(publickKey, signatureToVerify);
};

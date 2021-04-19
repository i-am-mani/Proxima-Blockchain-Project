"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.createSignature = exports.convertKeyToPublicPEM = exports.convertKeyToPrivatePEM = void 0;
const crypto = __importStar(require("crypto"));
const convertKeyToPrivatePEM = (key) => {
    var nChunks = key.split(/(.{64})/).filter((c) => c.length > 0);
    var finalPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
        nChunks.join("\n") +
        "\n-----END PRIVATE KEY-----\n";
    return finalPrivateKey;
};
exports.convertKeyToPrivatePEM = convertKeyToPrivatePEM;
const convertKeyToPublicPEM = (key) => {
    var nChunks = key.split(/(.{64})/).filter((c) => c.length > 0);
    var finalPublicKey = "-----BEGIN PUBLIC KEY-----\n" +
        nChunks.join("\n") +
        "\n-----END PUBLIC KEY-----\n";
    return finalPublicKey;
};
exports.convertKeyToPublicPEM = convertKeyToPublicPEM;
const createSignature = (message, privateKey) => {
    var signer = crypto.createSign("RSA-SHA256");
    signer.update(message);
    signer.end();
    const finalPrivateKey = exports.convertKeyToPrivatePEM(privateKey);
    return signer.sign(finalPrivateKey, "base64");
};
exports.createSignature = createSignature;
const verifySignature = (message, signatureToVerify, publickKey) => {
    var signer = crypto.createVerify("RSA-SHA256");
    signer.update(message);
    signer.end();
    const finalPublicKey = exports.convertKeyToPublicPEM(publickKey);
    signer.verify(publickKey, signatureToVerify);
};
exports.verifySignature = verifySignature;
//# sourceMappingURL=helper.js.map
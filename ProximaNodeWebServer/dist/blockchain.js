"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructTransactionBlock = void 0;
const helper_1 = require("./cryptography/helper");
const constructTransactionBlock = (bankInfo, transactions) => {
    const transactionsWithSignature = transactions.map((transaction) => {
        if ("documentId" in transaction) {
            // add client signature here
        }
        else {
            console.log("---------------------");
            console.log(`${bankInfo.publicKey}|${transaction.clientHash}|${transaction.amount}`);
            transaction.bankSignature = helper_1.createSignature(`${bankInfo.publicKey}|${transaction.clientHash}|${transaction.amount}`, bankInfo.privateKey);
        }
        transaction.bankHash = bankInfo.publicKey;
        return transaction;
    });
    const block = {
        type: "com.omega.models.Block.TransactionBlock",
        // left empty for blockchain to fill in
        header: {
            timestamp: 0,
            previousBlockHash: "",
            version: "",
        },
        transactions: transactionsWithSignature,
    };
    return block;
};
exports.constructTransactionBlock = constructTransactionBlock;
//# sourceMappingURL=blockchain.js.map
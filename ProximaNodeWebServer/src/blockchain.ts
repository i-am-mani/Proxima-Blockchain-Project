import { Transaction, Block, BankInfo } from "./GlobalTypes";
import { createSignature } from "./cryptography/helper";

export const constructTransactionBlock = (
  bankInfo: BankInfo,
  transactions: Transaction[]
) => {
  const transactionsWithSignature = transactions.map((transaction) => {
    if ("documentId" in transaction) {
      // add client signature here
    } else {
      console.log("---------------------");
      console.log(
        `${bankInfo.publicKey}|${transaction.clientHash}|${transaction.amount}`
      );
      transaction.bankSignature = createSignature(
        `${bankInfo.publicKey}|${transaction.clientHash}|${transaction.amount}`,
        bankInfo.privateKey
      );
    }
    transaction.bankHash = bankInfo.publicKey;
    return transaction;
  });
  const block: Block = {
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

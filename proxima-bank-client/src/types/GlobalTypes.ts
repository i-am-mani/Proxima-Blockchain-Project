export type LoanTransaction = {
  type: "com.omega.models.Transaction.LoanTransaction";
  transactionType: string;
  bankHash: string;
  clientHash: string;
  amount: number;
  bankSignature: string;
};

export type Transaction = LoanTransaction | DocumentRequestTransaction;

export type LoanTransactionType =
  | "LOAN_GRANT"
  | "EMI_TRANSACTION"
  | "EMI_BOUNCE"
  | "LOAN_DEFAULT"
  | "LOAN_COMPLETED";

export type DocumentRequestTransaction = {
  type: "com.omega.models.Transaction.DocumentTransaction";
  bankHash: string;
  clientHash: string;
  documentId: string;
  // Signature = bankHash + clientHash + documentId
  bankSignature: string; // - To prevent Non-Repudiation Case
  clientSignature: string;
};

export type Header = {
  version: string;
  previousBlockHash: string;
  timestamp: number;
};

export type TransactionBlock = {
  type: "com.omega.models.Block.TransactionBlock";
  header: Header;
  transactions: LoanTransaction[];
};

// Sealed Class paths for kotlin
export type BlockType =
  | "com.omega.models.Block.DocumentBlock"
  | "com.omega.models.Block.TransactionBlock";

export type TransactionType =
  | "com.omega.models.Transaction.LoanTransaction"
  | "com.omega.models.Transaction.DocumentTransaction";

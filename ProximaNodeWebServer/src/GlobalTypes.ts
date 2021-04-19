export type BankInfo = {
  name: string;
  keyLength: string;
  privateKey: string;
  publicKey: string;
};

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

export type Block = {
  type: BlockType;
  header: Header;
  transactions: Transaction[];
};

// Sealed Class paths for kotlin
export type BlockType =
  | "com.omega.models.Block.DocumentBlock"
  | "com.omega.models.Block.TransactionBlock";

export type TransactionType =
  | "com.omega.models.Transaction.LoanTransaction"
  | "com.omega.models.Transaction.DocumentTransaction";

export type DocumentBlock = {
  type: BlockType;
  header: Header;
  // Later used by Nodes to request document from bank (matching hash)
  documentId: String;

  // Unqiue MD5 Checksum
  documentHash: String;

  // public key of the user - uniquely identifies a user
  clientHash: String;

  // public key of the bank - uniquely identifies a bank in consortium
  bankHash: String;

  // Signed by the bank through its private key: non-repudiation and verification.
  // Signature = clientHash + bankHash + documentHash + documentId
  bankSignature: String;

  // Signed by the Client: Non-Repudiation
  // Signature = clientHash + bankHash + documentHash + documentId ( + Private Key of Client for encryption )
  clientSignature: String;
};

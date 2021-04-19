import * as React from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { InputWithLabel } from "./Inputs";
import { OptionSelector } from "./OptionSelector";
import { ClientSelector } from "./ClientSelector";
import { Transaction, LoanTransaction } from "../types/GlobalTypes";

export const AddTransactions: React.FC<{
  addTransaction: (transaction: Transaction) => void;
}> = ({ addTransaction }) => {
  const history = useHistory();
  const state = history.location.state as any;
  const bankName = state.bankName;
  const [clientHash, setClientHash] = React.useState<string>("");
  const [type, updateType] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const allOptions = [
    "LOAN_GRANT",
    "EMI_TRANSACTION",
    "EMI_BOUNCE",
    "LOAN_DEFAULT",
    "LOAN_COMPLETED",
  ];
  const onSubmit = () => {
    console.log(clientHash);
    console.log(type);
    console.log(amount);
    if (clientHash && type && amount) {
      const ctype: LoanTransaction = {
        type: "com.omega.models.Transaction.LoanTransaction",
        amount: parseFloat(amount),
        bankHash: "",
        bankSignature: "",
        clientHash,
        transactionType: type,
      };
      console.log(ctype);
      addTransaction(ctype);
    }
  };

  return (
    <main className="w-full">
      <div className="w-full space-y-4">
        <p className="text-2xl text-center tracking-wider font-bold">
          New Transaction
        </p>
        <OptionSelector
          label="Choose Transaction Type"
          allOptions={allOptions}
          onSelected={(t) => {
            updateType(t);
          }}
          value={type}
        />

        <ClientSelector
          bankName={bankName}
          onClientSelected={(client) => {
            console.log(client);
            setClientHash(client.publicKey);
          }}
        />

        <InputWithLabel
          label={"Amount"}
          onChangeCallback={(text) => setAmount(text)}
          value={amount}
          key="amount"
          placeholder="₹₹₹₹₹₹₹₹₹"
        />
        <div className="flex justify-center">
          <button className="primary-btn mx-autos" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </main>
  );
};

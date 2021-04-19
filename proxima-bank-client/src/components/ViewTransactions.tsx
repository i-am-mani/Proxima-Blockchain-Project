/* eslint-disable no-extend-native */
import * as React from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { ClientSelector, Client } from "./ClientSelector";
import {
  Transaction,
  LoanTransaction,
} from "../../../ProximaNodeWebServer/src/GlobalTypes";

function toHex(str: string) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

export const ViewTransactions: React.FC = () => {
  const history = useHistory();
  const state = history.location.state as any;
  const bankName = state.bankName;
  const [selectedClient, setSelectedClient] = React.useState<Client>(
    {} as Client
  );
  const [transactions, setTransactions] = React.useState<LoanTransaction[]>([]);

  const onSubmit = () => {
    fetch("http://localhost:11111/get_transactions", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientHash: selectedClient.publicKey }),
    }).then(async (response) => {
      const resultData = await response.json();
      console.log(resultData);
      if (response.ok) {
        const tlist = resultData.transactions.listOfTransaction;
        setTransactions(tlist);
        toast.success("Transaction Commited To Server");
      } else {
        toast.error("Failed Commit Transaction");
      }
    });
  };

  const colors = [
    "red",
    "yellow",
    "gray",
    "indigo",
    "blue",
    "pink",
    "purple",
    "green",
  ];

  return (
    <main>
      <div className="w-full space-y-4">
        <p className="text-2xl text-center tracking-wider font-bold">
          View Transactions
        </p>
        <ClientSelector
          bankName={bankName}
          onClientSelected={(c) => setSelectedClient(c)}
        />
        <div className="flex justify-center">
          <button className="primary-btn mx-autos" onClick={onSubmit}>
            Submit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {transactions.map((transaction, idx) => (
            <div
              className={` text-dark font-eczar shadow-lg
             grid grid-cols-2 py-4 px-2 gap-y-3 rounded-xl      
             bg-${colors[Math.floor(Math.random() * 10) % colors.length]}-50`}
            >
              <p className="font-eczar col-span-full text-center text-xl font-bold tracking-wider">
                Transaction Block #{idx}
              </p>

              <p className="font-eczar place-self-center text-gray-400">Type</p>
              <p className="font-eczar text-lg tracking-wider">
                {transaction.transactionType}
              </p>

              <p className="font-eczar place-self-center text-gray-400">
                Bank Hash
              </p>
              <p className="font-eczar text-lg tracking-wider overflow-y-hidden overflow-x-auto bg-scroll">
                0x{toHex(transaction.bankHash)}
              </p>

              <p className="font-eczar place-self-center text-gray-400">
                Client Hash
              </p>
              <p className="font-eczar text-lg tracking-wider overflow-y-hidden overflow-x-auto">
                0x{toHex(transaction.clientHash)}
              </p>

              <p className="font-eczar place-self-center text-gray-400">
                Client Hash
              </p>
              <p className="font-bold font-eczar text-lg tracking-wider">
                ₹{transaction.amount}
              </p>

              <p className="font-eczar place-self-center text-gray-400">
                Bank Signature
              </p>
              <p className="font-bold font-eczar text-lg tracking-wider overflow-y-hidden overflow-x-auto">
                0x{toHex(transaction.bankSignature)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

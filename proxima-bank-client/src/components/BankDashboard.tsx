import * as React from "react";
import { Route, Switch, useHistory } from "react-router";
import { BrowserRouter, HashRouter, useRouteMatch } from "react-router-dom";
import { AddTransactions } from "./AddTransactions";
import { CreateClient } from "./CreateClient";
import { DocumentRequest } from "./DocumentRequest";
import { BankRoute } from "./Home";
import { ViewTransactions } from "./ViewTransactions";
import { Transaction } from "../types/GlobalTypes";
import { toast } from "react-toastify";
import { UploadDocument } from "./UploadDocument";

type BankDashboardFeature = {
  name: string;
  slug: string;
};

const dashboardFeatures: BankDashboardFeature[] = [
  { name: "Add Transaction", slug: "add_transaction" },
  { name: "Upload Document", slug: "upload_document" },
  { name: "Document Request", slug: "document_request" },
  { name: "View Transactions", slug: "view_transactions" },
  { name: "Create New Client", slug: "add_client" },
];

export const BankDashboard: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const state = history.location.state as any;
  console.log(state);
  const bankName = state.bankName;

  const [transactionQueue, setTransactionQueue] = React.useState<Transaction[]>(
    []
  );

  const addTransaction = (transaction: Transaction) => {
    setTransactionQueue([...transactionQueue, transaction]);
  };

  const pushToServer = () => {
    fetch("http://localhost:11111/add_transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions: transactionQueue, bankName }),
    }).then((response) => {
      if (response.ok) {
        toast.success("Transaction Commited To Server");
      } else {
        toast.error("Failed Commit Transaction");
      }
    });
  };

  return (
    <main className="">
      <div className="">
        <p className="text-4xl pt-4 text-gray-300 font-eczar tracking-widest text-center">Dashboard</p>
        <div
          className=" relative
      flex flex-wrap max-w-7xl space-x-4 
      space-y-4 justify-center
      border mx-auto shadow-md rounded-lg px-8 pb-7"
        >
          <div className="absolute w-full h-3 bg-red-300 ">

          </div>
          <div></div>
          {dashboardFeatures.map((feature) => (
            <div
              key={feature.name}
              className="cursor-pointer text-xl tracking-wider border font-eczar shadow-xl rounded-xl p-8 
             bg-white whitespace-nowrap"
              onClick={() => {
                history.push(`${match.url}/${feature.slug}`, { bankName });
              }}
            >
              {feature.name}
            </div>
          ))}
          <div
            className="cursor-pointer text-xl tracking-wider border font-eczar shadow-xl 
        rounded-xl p-8  bg-white whitespace-nowrap"
            onClick={() => pushToServer()}
          >
            Flush Transactins - {transactionQueue.length}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <div className="shadow-xl border p-4 rounded-xl  w-4/6">
          <Switch>
            <Route path={`${match.path}/add_transaction`}>
              <AddTransactions addTransaction={addTransaction} />
            </Route>
            <Route path={`${match.path}/document_request`}>
              <DocumentRequest />
            </Route>
            <Route path={`${match.path}/add_client`}>
              <CreateClient />
            </Route>
            <Route path={`${match.path}/view_transactions`}>
              <ViewTransactions />
            </Route>
            <Route path={`${match.path}/upload_document`}>
              <UploadDocument />
            </Route>
          </Switch>
        </div>
      </div>
    </main>
  );
};

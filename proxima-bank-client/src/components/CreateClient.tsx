import * as React from "react";
import { toast } from "react-toastify";
import { InputWithLabel } from "./Inputs";
import { useHistory } from "react-router";

export const CreateClient: React.FC = () => {
  const [clientName, setClientHash] = React.useState<string>("");
  const history = useHistory();
  const state = history.location.state as any;
  const bankName = state.bankName;
  const onSubmit = () => {
    fetch("http://localhost:11111/add_client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bankName: bankName, clientName: clientName }),
    }).then(async (response) => {
      if (response.ok) {
        const jsonRespo = await response.json();
        console.log(jsonRespo);
        toast.success("Transaction Commited To Server");
      } else {
        toast.error("Failed Commit Transaction");
      }
    });
  };
  return (
    <main>
      <div className="w-full space-y-4">
        <p className="text-2xl text-center tracking-wider font-bold">
          Add Client
        </p>
        <InputWithLabel
          label={"Client Hash"}
          onChangeCallback={(text) => setClientHash(text)}
          value={clientName}
          key="clientHash"
          placeholder="Full Name"
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

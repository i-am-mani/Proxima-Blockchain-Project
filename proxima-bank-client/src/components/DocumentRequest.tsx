import * as React from "react";
import { useHistory } from "react-router";
import { InputWithLabel } from "./Inputs";
import { toast } from "react-toastify";
import { ClientSelector } from "./ClientSelector";

export const DocumentRequest: React.FC = () => {
  const history = useHistory();
  const state = history.location.state as any;
  const bankName = state.bankName;
  const [clientHash, setClientHash] = React.useState<string>("");
  const [consentCode, setConsentCode] = React.useState<string>("");

  const onSubmit = () => {
    fetch("localhost:6000/document_request", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consentCode, clientHash }),
    }).then((response) => {
      if (response.ok) {
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
          Request Document
        </p>
        <ClientSelector
          bankName={bankName}
          onClientSelected={(c) => setClientHash(c.publicKey)}
        />
        <InputWithLabel
          label="User Consent Code"
          onChangeCallback={(text) => setConsentCode(text)}
          placeholder="%%%%%%%%%%%%%%%%%%%%%%"
          value={consentCode}
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

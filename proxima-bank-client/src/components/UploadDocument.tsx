import * as React from "react";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { ClientSelector } from "./ClientSelector";
import { InputWithLabel } from "./Inputs";
import { toast } from "react-toastify";
import axios from "axios";

export const UploadDocument: React.FC = () => {
  const history = useHistory();
  const state = history.location.state as any;
  const bankName = state.bankName;
  const [clientHash, setClientHash] = React.useState<string>("");
  const [consentCode, setConsentCode] = React.useState<string>("");
  const [docId, setDocId] = React.useState("");
  const [file, setFile] = React.useState<File>();
  const onSubmit = () => {
    console.log("on submit");
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // appending file
      formData.append("bankName", bankName);
      formData.append("clientHash", clientHash);
      formData.append("documentId", docId);
      axios
        .post("http://localhost:11111/add_document", formData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else {
      toast.warning("No File Selected");
    }
  };

  return (
    <main>
      <div className="w-full space-y-4">
        <p className="text-2xl text-center tracking-wider font-bold">
          Upload Document
        </p>
        <ClientSelector
          bankName={bankName}
          onClientSelected={(c) => setClientHash(c.publicKey)}
        />

        <InputWithLabel
          label="Enter Document ID"
          onChangeCallback={(t) => setDocId(t)}
          value={docId}
          placeholder="Eg. 000001 - Addhar Document"
        />

        <div className="space-y-2">
          <p className="text-xl tracking-wide">Upload Document</p>
          <input
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const file = files[0];
                setFile(file);
              } else {
                toast.warning("No File Selected!", { position: "top-center" });
              }
            }}
          />
        </div>

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

import * as React from "react";
import { OptionSelector } from "./OptionSelector";
import { toast } from "react-toastify";
export type Client = {
  clientName: string;
  publicKey: string;
};

export const ClientSelector: React.FC<{
  bankName: string;
  onClientSelected: (client: Client) => void;
}> = ({ bankName, onClientSelected }) => {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<Client>();

  React.useEffect(() => {
    if (selectedClient) {
      onClientSelected(selectedClient);
      console.log('onClientSelected Called');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  React.useEffect(() => {
    fetch("http://localhost:11111/get_clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bankName }),
    }).then(async (response) => {
      if (response.ok) {
        const jsonRespo = await response.json();
        console.log(jsonRespo.clients);
        setClients(jsonRespo.clients);
        toast("Reloaded Clients", {
          autoClose: 1000,
          position: "bottom-center",
        });
      } else {
        toast.error("Failed to reload clients");
      }
    });
  }, [bankName]);

  return (
    <OptionSelector
      label="Choose Client"
      allOptions={clients ? clients.map(({ clientName: name }) => name) : []}
      onSelected={(t) => {
        const find = clients.find((c) => c.clientName === t);
        setSelectedClient(find);
      }}
      value={selectedClient ? selectedClient.clientName : ""}
    />
  );
};

import * as React from "react";

export type BankNetworkInfo = {
  name: string;
  port: string;
  publicKey: string;
};

export type BanksData = {
  banks: BankNetworkInfo[];
};

export const BankContext = React.createContext<BanksData>({} as BanksData);

export const BankContextProvider: React.FC = ({ children }) => {
    const [banks, setBanks] = React.useState([])
  React.useEffect(() => {
      fetch("localhost:")
  }, []);

  return (
    <BankContext.Provider value={{ banks }}>{children}</BankContext.Provider>
  );
};

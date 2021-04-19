import * as React from "react";
import backgroundImage from "../static/background.png";
import { useHistory } from "react-router";

export type BankRoute = {
  name: string;
};
export const banks = [
  { name: "ABI Bank", slug: "abi-bank" },
  { name: "CITI Bank", slug: "citi-bank" },
];
export const Home: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <header className="App-header flex flex-col justify-center items-center">
        <p
          className="text-7xl shadow-lg animate-pulse font-bold font-lora text-golden rounded-full w-min p-4
        bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
        >
          M
        </p>
        <p className="text-3xl font-bold text-gray-700 font-eczar text-center tracking-wider p-6">
          Bank Consortium
        </p>
      </header>

      <div className="grid grid-cols-12">
        <img
          className="row-start-1 col-start-3 col-end-11 opacity-30"
          src={backgroundImage}
          alt=""
        />
        <div className="row-start-1 col-start-4 col-end-10 grid grid-cols-2">
          {banks.map((bank) => (
            <div
              className="bg-white shadow-2xl py-20 px-20 place-self-center
             text-2xl text-gray-700 rounded-xl font-thin z-20 font-eczar cursor-pointer
             hover:text-gray-800 hover:shadow-2xl transition-all transform hover:scale-105"
              onClick={() =>
                history.push("/dashboard", { bankName: bank.name })
              }
            >
              <span className=" text-6xl text-gray-500">
                {bank.name.charAt(0)}
              </span>
              {bank.name.substring(1, bank.name.length)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

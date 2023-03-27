import { Chain } from "@rainbow-me/rainbowkit";

const Mumbai: Chain = {
  id: 80001,
  name: "Mumbai",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  network: "Mumbai",
  rpcUrls: {
    default: "https://rpc-mumbai.maticvigil.com",
  },
  // testnet: true,
};

export default Mumbai;

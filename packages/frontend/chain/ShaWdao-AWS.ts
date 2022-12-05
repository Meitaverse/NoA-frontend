import {
  Chain,
} from "@rainbow-me/rainbowkit";

const ShaWdao:Chain =  {
  id: 31337,
  name: "ShaWdao",
  nativeCurrency: {
    decimals: 18,
    name: "ShaWdao",
    symbol: "HARD",
  },
  network: "ShaWdao",
  rpcUrls: {
    default: "http://16.163.166.55:8545",
  },
  // testnet: true,
};

export default ShaWdao
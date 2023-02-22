import { Chain } from "@rainbow-me/rainbowkit";

const BitSoul: Chain = {
  id: 31337,
  name: "BitSoul",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  network: "BitSoul",
  rpcUrls: {
    default: "http://192.168.20.203:8545/",
  },
  // testnet: true,
};

export default BitSoul;

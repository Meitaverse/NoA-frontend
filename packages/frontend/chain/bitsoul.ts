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
    default: "http://52.77.164.208:8545/",
  },
  // testnet: true,
};

export default BitSoul;

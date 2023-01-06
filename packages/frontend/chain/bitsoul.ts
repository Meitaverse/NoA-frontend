import { Chain } from "@rainbow-me/rainbowkit";

const BitSoul: Chain = {
  id: 31337,
  name: "BitSoul",
  nativeCurrency: {
    decimals: 18,
    name: "BitSoul",
    symbol: "BitSoul",
  },
  network: "BitSoul",
  rpcUrls: {
    default: "http://192.168.20.205:8545/",
  },
  // testnet: true,
};

export default BitSoul;

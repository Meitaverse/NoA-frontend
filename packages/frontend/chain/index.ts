import { chain, createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

import ShaWdao from "./ShaWdao-AWS";
import BitSoul from "./bitsoul";

const { chains, provider } = configureChains(
  // 扩展不同的网络
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ShaWdao,
    BitSoul,
  ],
  [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "create-web3",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, wagmiClient };

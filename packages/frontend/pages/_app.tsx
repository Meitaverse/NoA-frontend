import * as React from "react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

// Imports
import { WagmiConfig } from "wagmi";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { useIsMounted } from "../hooks";
import { chains, wagmiClient } from "@/chain";

import CommonHeader from "@/components/header/index";
import "./index.scss";
import Sider from "@/components/sider";
import CurrentPanel from "@/components/currentPanel";
import client from "@/services/apollo";
import { ApolloProvider } from "@apollo/client";

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <ApolloProvider client={client}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider coolMode chains={chains}>
          <NextHead>
            <title>NoA</title>
          </NextHead>
          <div id="app">
            {/* 
              外围的布局：
              header header header header header header
              side side current route title
              side side component
              side side 
              side side
              side side 
              side side
            */}
            <CommonHeader></CommonHeader>
            <div
              className="main"
              style={{ flex: 1, display: "flex", background: "#F5f5f5" }}
            >
              <Sider></Sider>
              <div
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <CurrentPanel></CurrentPanel>
                <Component {...pageProps} />
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
};

export default App;

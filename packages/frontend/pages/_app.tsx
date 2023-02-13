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

// 这些组件可以动态导入来优化，懒得搞了。
import CommonHeader from "@/components/header/index";
import Sider from "@/components/sider";
import CurrentPanel from "@/components/currentPanel";
import client from "@/services/apollo";
import { ApolloProvider } from "@apollo/client";
import { useRouter } from "next/router";
import FHeader from "@/components/fHeader";

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();
  const { pathname } = useRouter();

  const isManagerRoute = React.useMemo(() => {
    return pathname.includes("forBkMU");
  }, [pathname]);

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
            {isManagerRoute && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                <CommonHeader></CommonHeader>
                <div
                  className="main"
                  style={{ flex: 1, display: "flex", background: "#F5f5f5" }}
                >
                  <Sider></Sider>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <CurrentPanel></CurrentPanel>
                    <Component {...pageProps} />
                  </div>
                </div>
              </div>
            )}

            {!isManagerRoute && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  background:
                    "linear-gradient(180deg, rgba(16, 20, 78, 0.2) 18.01%, rgba(0, 0, 0, 0) 100%), #0C1048",
                }}
              >
                <FHeader></FHeader>
              </div>
            )}
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
};

export default App;

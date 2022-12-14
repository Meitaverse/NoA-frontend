import Head from "next/head";

import { GetGreeter, SetGreeter } from "../components/contract";
import { getCinemaDetail } from "@/services/test";
import { useMount } from "ahooks";

export default function Home() {
  const testGet = async () => {
    await getCinemaDetail();
  };

  useMount(() => {
    console.log(1231);
  });

  return (
    <div className={""}>
      <Head>
        <title>Create-Web3 App</title>
        <meta name="description" content="Generated by npx create-web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header style={{ padding: "1rem" }}></header>

      <main
        style={{
          minHeight: "60vh",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></main>
    </div>
  );
}

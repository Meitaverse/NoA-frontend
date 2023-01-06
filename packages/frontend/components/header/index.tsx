import { SearchOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { FC } from "react";
import { useAccount, useConnect } from "wagmi";
import styles from "./styles.module.scss";

interface IProps {}

const Header: FC<IProps> = props => {
  const { address, isConnected } = useAccount();

  return (
    <div className={styles.header}>
      <div
        style={{
          fontSize: "18px",
          color: "#fff",
        }}
      >
        Bitsoul logo
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <SearchOutlined />
        <SearchOutlined />
        <SearchOutlined />
        {/* {isConnected && <div>{address}</div>}
        {!isConnected && (
          <div className={styles.connectButton}>
            <ConnectButton />
          </div>
        )} */}
        <ConnectButton></ConnectButton>
      </div>
    </div>
  );
};
export default Header;

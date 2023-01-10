import { useSBTContract } from "@/hooks/useSBTContract";
import { getProfile, IGetProfile } from "@/services/graphql";
import { RightOutlined, SearchOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMount } from "ahooks";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import styles from "./styles.module.scss";

interface IProps {}

const Header: FC<IProps> = props => {
  const { address, isConnected } = useAccount();
  const [_, prov] = useSBTContract();

  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);

  const [currentBalance, setCurrentBalance] = useState(0);

  const getProfileResult = async () => {
    const res = await getProfile({});

    setProfiles(res.data.profiles);
  };

  const getBalance = async () => {
    const profile = profiles.find(
      item => item.wallet.toLowerCase() === address?.toLowerCase()
    );
    if (!profile) {
      setCurrentBalance(0);
      return;
    }
    const res = await prov["balanceOf(uint256)"](profile.soulBoundTokenId, {
      from: address,
    });

    setCurrentBalance(+res);
  };

  const currentProfile = useMemo(() => {
    return profiles.find(
      item => item.wallet.toLowerCase() === address?.toLowerCase()
    );
  }, [profiles, address]);

  useEffect(() => {
    getBalance();
  }, [address, profiles]);

  useMount(() => {
    getProfileResult();
  });

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
        <div style={{ marginRight: "100px" }}>
          <span style={{ marginRight: "20px" }}>
            Current Wallet Soul nickName:{" "}
            <span style={{ color: "#1677ff" }}>{currentProfile?.nickName}</span>
          </span>
          Current Wallet SoulBoundTokenId: {currentProfile?.soulBoundTokenId}
        </div>

        <div
          style={{ marginRight: "100px", cursor: "pointer" }}
          onClick={() => {
            getBalance();
          }}
        >
          SBT Balance：{currentBalance}
          <RightOutlined />
        </div>

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

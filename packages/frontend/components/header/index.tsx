import { DERIVATIVE_ADDRESS, MANAGER_ADDRESS } from "@/config";
import { useBankTreasury } from "@/hooks/useBankTreasury";
import { useDerivative } from "@/hooks/useDerivativeContact";
import { useSBTContract } from "@/hooks/useSBTContract";
import { getProfile, IGetProfile } from "@/services/graphql";
import { RightOutlined, SearchOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMount } from "ahooks";
import { Button, message } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import styles from "./styles.module.scss";

interface IProps {}

const Header: FC<IProps> = props => {
  const { address, isConnected } = useAccount();
  const [_, prov] = useSBTContract();
  const [__, prov2] = useDerivative();
  const [bankTreasury] = useBankTreasury();

  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);

  const [currentBalance, setCurrentBalance] = useState(0);

  const getProfileResult = async () => {
    const res = await getProfile({});

    setProfiles(res.data.profiles);
  };

  const getBalance = async () => {
    return;
    // const profile = profiles.find(
    //   item => item.wallet.toLowerCase() === address?.toLowerCase()
    // );
    // if (!profile) {
    //   setCurrentBalance(0);
    //   return;
    // }

    // await new Promise(resolve => {
    //   setTimeout(resolve, 2500);
    // });

    // const res = await prov["balanceOf(uint256)"](profile.soulBoundTokenId, {
    //   from: address,
    // });

    // setCurrentBalance(+res);
  };

  const charge = async () => {
    try {
      const res = await bankTreasury.buySBT(4, {
        value: 10000000,
        from: address,
      });

      message.success("充值成功");
    } catch (e) {
      console.error(e);
      console.warn(
        "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
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

        <Button style={{ marginLeft: "10px" }} onClick={charge}>
          Charge
        </Button>
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

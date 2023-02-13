import { signin } from "@/services/sign";
import { activeTab } from "@/store/tabs";
import { isLogin } from "@/store/userDetail";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useUpdate } from "ahooks";
import { MenuProps, message } from "antd";
import { Button, Dropdown, Modal, Tabs, TabsProps } from "antd";
import { useAtom, useAtomValue } from "jotai";
import React, { FC, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import LogoImg from "@/images/logo.jpeg";
import styles from "./index.module.scss";

interface IProps {}

const items: TabsProps["items"] = [
  {
    key: "Home",
    label: `Home`,
  },
  {
    key: "Projects",
    label: `Projects`,
  },
  {
    key: "CreativeHubs",
    label: `Creative Hubs`,
  },
  {
    key: "Dashboard",
    label: `Dashboard`,
  },
];

const FHeader: FC<IProps> = props => {
  const [actTab, setActTab] = useAtom(activeTab);
  const [isLoginStatus, setIsLoginStatus] = useAtom(isLogin);
  const { address, isConnected } = useAccount();
  const connect = useConnect();
  const { disconnect } = useDisconnect();
  const [metaMask] = useState(new MetaMaskConnector());
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { status, signMessageAsync } = useSignMessage();

  const update = useUpdate();

  const dropdownItems: MenuProps["items"] = [
    {
      key: "logOut",
      label: (
        <span
          onClick={() => {
            disconnect();
            localStorage.removeItem("token");
            setIsLoginStatus(false);
          }}
        >
          log out
        </span>
      ),
    },
  ];

  const signinWeb2 = async () => {
    const timestamp = +new Date();
    try {
      const signMsg = await signMessageAsync({
        message: `signin${timestamp}AABBCC`,
      });
      const { data, err_code } = await signin({
        wallet_address: address || "",
        timestamp,
        nonce: "AABBCC",
        signed: signMsg,
      });
      if (err_code === 0) {
        setIsLoginStatus(true);
        localStorage.setItem("token", data.jwt || "");
        message.success("登录成功");
      }
    } catch (e) {
      message.error("签名已拒绝");
    }
  };

  const initLogin = async () => {
    // 存在token的情况下尝试进行登录
    // 检查及登录步骤：
    //    调用接口获取用户信息失败则signinWeb2
    //    成功则setLoginStatus和userInfo。
    if (localStorage.getItem("token")) {
      return;
    }

    signinWeb2();
  };

  useEffect(() => {
    if (isConnected) {
      setOpenConnectModal(false);

      // 这里也需要考虑到调起签名失败的情况如何让用户重试。
      if (!isLoginStatus) {
        setTimeout(initLogin, 1000);
      }
    }
  }, [isConnected, isLoginStatus]);

  return (
    <div className={styles.fHeader}>
      <div className={styles.logoChunk}>
        <div className={styles.logo}>
          <img src={LogoImg.src} alt="" />
        </div>
        Bitsoul
      </div>

      <div className={styles.tab}>
        <Tabs
          activeKey={actTab}
          defaultActiveKey={actTab}
          items={items}
          onChange={key => {
            setActTab(key);
          }}
        ></Tabs>
      </div>

      {!isConnected && (
        <Button
          style={{
            border: "none",
            background:
              "linear-gradient(117.55deg, #1E50FF -3.37%, #00DFB7 105.51%)",
            height: "56px",
            width: "114px",
            borderRadius: "16px",
            fontSize: "16px",
            color: "#FFF",
          }}
          onClick={() => {
            setOpenConnectModal(true);
          }}
        >
          Connect
        </Button>
      )}

      {!isConnected && (
        <Modal
          className={styles.connectModal}
          open={openConnectModal}
          closeIcon={<CloseCircleOutlined style={{ fontSize: "22px" }} />}
          closable
          footer={null}
          onCancel={() => {
            setOpenConnectModal(false);
          }}
          width={1200}
        >
          <div className={styles.connectInner}>
            <div className={styles.connectLeft}>这里应该放一张图片</div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "64px",
                  lineHeight: "80px",
                  marginBottom: "8px",
                }}
              >
                Connect wallet
              </div>

              <div
                style={{
                  fontSize: "22px",
                  lineHeight: "160%",
                  marginBottom: "30px",
                }}
              >
                Choose a wallet you want to connect
              </div>

              <Button
                className={styles.connectButton}
                style={{ marginBottom: "20px" }}
                onClick={() => {
                  connect.connect({
                    connector: metaMask,
                  });
                }}
              >
                Metamask
              </Button>
              <Button className={styles.connectButton}>Wallet Connect</Button>
            </div>
          </div>
        </Modal>
      )}

      {isConnected && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src=""
            alt=""
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              marginRight: "16px",
            }}
          />

          <Dropdown menu={{ items: dropdownItems }}>
            <div
              style={{
                fontSize: "20px",
                color: "#fff",
                width: "102px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                wordBreak: "keep-all",
                overflow: "hidden",
              }}
            >
              {address}
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};
export default FHeader;

import { activeTab } from "@/store/tabs";
import { isLogin } from "@/store/userDetail";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Button, Dropdown, Modal, Tabs, TabsProps } from "antd";
import { useAtom } from "jotai";
import React, { FC, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import LogoImg from "@/images/logo.jpeg";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import PurchaseDialog from "../purchaseDialog";
import { useUserInfo } from "@/hooks/useUserInfo";
import Login from "../login";
import { toSoul } from "@/utils/toSoul";
import { useIsCurrentNetwork } from "@/hooks/useIsCurrentNetwork";
import { useSwitchToSoul } from "@/hooks/useSwitchToSoul";

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

const navRouter = {
  Home: "/home",
  Dashboard: "/dashboard",
};

const FHeader: FC<IProps> = props => {
  const router = useRouter();
  const [actTab, setActTab] = useAtom(activeTab);
  const [isLoginStatus, setIsLoginStatus] = useAtom(isLogin);
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const [userInfo, initUserInfo] = useUserInfo();
  const isCurrentNetwork = useIsCurrentNetwork();
  const { switchToSoul } = useSwitchToSoul();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(false);

  const dropdownItems: MenuProps["items"] = [
    {
      key: "logOut",
      label: (
        <span
          onClick={() => {
            logOut();
          }}
        >
          log out
        </span>
      ),
    },
  ];

  const logOut = async () => {
    try {
      await disconnectAsync();
      localStorage.removeItem("token");
      setIsLoginStatus(false);
      initUserInfo();
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    if (router.pathname.includes("dashboard")) {
      setActTab("Dashboard");
    }
  }, []);

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
            router.push(navRouter[key] || "");
          }}
          onTabClick={key => {
            setActTab(key);
            router.push(navRouter[key] || "");
          }}
        ></Tabs>
      </div>

      {!isLoginStatus && (
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

      {(!isLoginStatus || (isLoginStatus && !userInfo?.email)) && (
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
          <Login
            onConnect={() => {
              setOpenConnectModal(false);
            }}
          ></Login>
        </Modal>
      )}

      {isLoginStatus && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isCurrentNetwork && (
            <div
              style={{
                fontSize: "16px",
                background: "#373963",
                borderRadius: "16px",
                padding: "12px 10px",
                marginRight: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                switchToSoul();
              }}
            >
              <ExclamationCircleOutlined
                style={{ marginRight: "6px", color: "#fff", fontSize: "24px" }}
              />
              Wrong Network
            </div>
          )}
          <div
            style={{
              fontSize: "20px",
              background: "#373963",
              borderRadius: "16px",
              padding: "12px 10px",
              marginRight: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenPurchase(true);
            }}
          >
            soul: {toSoul(userInfo?.balance, false)}
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#fff",
              width: "166px",
              height: "48px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              wordBreak: "keep-all",
              overflow: "hidden",
              background: "#373963",
              borderRadius: "16px",
              padding: "12px 10px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {`${address?.slice(0, 6)}...${address?.slice(address.length - 4)}`}
          </div>

          <Dropdown menu={{ items: dropdownItems }}>
            <img
              src={userInfo?.avatar}
              alt=""
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            />
          </Dropdown>
        </div>
      )}

      <PurchaseDialog
        open={openPurchase}
        onChange={() => {
          setOpenPurchase(false);
        }}
      ></PurchaseDialog>
    </div>
  );
};
export default FHeader;

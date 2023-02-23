import { bindAccount, sendValidateCode, signin } from "@/services/sign";
import { activeTab } from "@/store/tabs";
import { isLogin, userDetail } from "@/store/userDetail";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Input, InputNumber, MenuProps, message } from "antd";
import { Button, Dropdown, Modal, Tabs, TabsProps } from "antd";
import { useAtom } from "jotai";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import LogoImg from "@/images/logo.jpeg";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import PurchaseDialog from "../purchaseDialog";
import { useUserInfo } from "@/hooks/useUserInfo";

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
  const connect = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [metaMask] = useState(new MetaMaskConnector());

  const [userInfo, initUserInfo] = useUserInfo();

  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [verifyStage, setVerifyStage] = useState<
    "SignIn" | "InputEmail" | "Verify"
  >("SignIn");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(new Array(6).fill(""));
  const verifyRefs = useRef<any[]>([]);
  const { signMessageAsync } = useSignMessage();
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

  const signinWeb2 = async (account?: string) => {
    const timestamp = +new Date();
    try {
      const signMsg = await signMessageAsync({
        message: `signin${timestamp}AABBCC`,
      });
      const { data, err_code } = await signin(
        {
          wallet_address: address || account || "",
          timestamp,
          nonce: "AABBCC",
          signed: signMsg,
        },
        {
          loading: true,
        }
      );
      if (err_code === 0) {
        localStorage.setItem("token", data.jwt || "");
        return true;
      }
    } catch (e) {
      message.error("登录失败");
      // 暂时的容错。
      message.destroy("loadingPluginKey");
      return false;
    }
  };

  const sendValidate = async () => {
    const { err_code } = await sendValidateCode(
      {
        account: verifyEmail,
        account_type: "email",
        scene: "bindAccount",
      },
      {
        loading: true,
      }
    );
    if (err_code === 0) {
      return true;
    }

    return false;
  };

  const bindAccountAsync = async () => {
    const { err_code } = await bindAccount({
      account_type: "email",
      code: verifyCode.join(""),
    });

    if (err_code === 0) {
      message.success("verify success");
      router.push("/dashboard");
      setShowSignInDialog(false);
      setVerifyStage("InputEmail");

      initUserInfo();
    }
  };

  const logOut = async () => {
    try {
      await disconnectAsync();
      localStorage.removeItem("token");
      setIsLoginStatus(false);
    } catch (e) {
      return;
    }
  };

  // const init = async () => {
  //   const initStatus = await initUserInfo();

  //   if (!initStatus) {
  //     logOut();
  //   }
  // };

  useEffect(() => {
    if (isConnected) {
      setOpenConnectModal(false);

      if (!isLoginStatus) {
        initUserInfo();
      }
    }
  }, [isConnected, isLoginStatus]);

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
            if (!isConnected) {
              setOpenConnectModal(true);
              return;
            }

            setShowSignInDialog(true);
          }}
        >
          Connect
        </Button>
      )}

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
              onClick={async () => {
                await logOut();
                const connectorInfo = await connect.connectAsync({
                  connector: metaMask,
                });

                const status = await signinWeb2(connectorInfo.account);
                if (!status) {
                  logOut();
                  return;
                }
                const userInfo = await initUserInfo(connectorInfo.account);
                if (!userInfo) {
                  message.error("登录失败");
                  logOut();
                  return;
                }
                // 不存在email的话则走验证verify的流程。
                if (!userInfo.email) {
                  setShowSignInDialog(true);
                }
              }}
            >
              Metamask
            </Button>
            <Button
              className={styles.connectButton}
              // onClick={async () => {
              //   await connect.connectAsync({
              //     connector: wall,
              //   });

              //   setShowSignInDialog(true);
              // }}
            >
              Wallet Connect
            </Button>
          </div>
        </div>
      </Modal>

      {/* TODO: 下面这个组件应该抽离出去，可预见的需要复用，后面再说。 */}
      {isConnected && isLoginStatus && (
        <Modal
          className={styles.verifyDialog}
          width={600}
          open={showSignInDialog}
          closable
          footer={null}
          onCancel={() => {
            setShowSignInDialog(false);
            setVerifyStage("SignIn");
            setVerifyEmail("");
            setVerifyCode(new Array(6).fill(""));
            logOut();
          }}
        >
          {verifyStage === "SignIn" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                }}
              >
                Sign In
              </div>
              <div style={{ fontSize: "20px", marginBottom: "48px" }}>
                You need to sign a message to prove ownership of the Ethreum
                address you are connected with.
              </div>
              <div style={{ fontSize: "24px" }}>Signing with this address:</div>

              <div
                style={{
                  color: "#609FFF",
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "48px",
                }}
              >
                {address?.slice(0, 6)}...
                {address?.slice(address.length - 4, address.length)}
              </div>

              <Button
                style={{
                  border: "none",
                  background:
                    "linear-gradient(117.55deg, #1E50FF -3.37%, #00DFB7 105.51%)",
                  height: "56px",
                  width: "400px",
                  borderRadius: "16px",
                  fontSize: "20px",
                  color: "#FFF",
                }}
                onClick={async () => {
                  // const u = await signinWeb2();
                  // if (u) {
                  //   setVerifyStage("InputEmail");
                  // }
                  setVerifyStage("InputEmail");
                }}
              >
                Continue
              </Button>
            </div>
          )}
          {verifyStage === "InputEmail" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                }}
              >
                Verify Mail
              </div>
              <div style={{ fontSize: "20px", marginBottom: "48px" }}>
                Please verify your mail to generate your soul bonding profile
                and get your soul reward
              </div>

              <Input
                className={styles.inputVerify}
                placeholder="Email Address"
                value={verifyEmail}
                onChange={e => {
                  setVerifyEmail(e.target.value);
                }}
              ></Input>

              <Button
                className={styles.sendButton}
                disabled={!verifyEmail.includes("@")}
                onClick={async () => {
                  const u = await sendValidate();
                  if (u) {
                    setVerifyStage("Verify");
                  }
                }}
              >
                Send
              </Button>
            </div>
          )}
          {verifyStage === "Verify" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                }}
              >
                Verify Mail
              </div>
              <div style={{ fontSize: "20px", marginBottom: "48px" }}>
                Please input the numbers in the mail you received
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {new Array(6).fill("").map((_, index) => {
                  return (
                    <InputNumber
                      key={index}
                      ref={el => (verifyRefs.current[index] = el)}
                      className={styles.inputVerifyCode}
                      value={verifyCode[index]}
                      min={0}
                      max={9}
                      maxLength={1}
                      autoFocus={index === 0}
                      onChange={val => {
                        const newV = verifyCode.slice();
                        newV[index] = val;
                        setVerifyCode(newV);

                        if (newV[index] && verifyRefs.current[index + 1]) {
                          verifyRefs.current[index + 1].focus();
                        }
                      }}
                      controls={false}
                    ></InputNumber>
                  );
                })}
              </div>

              <Button
                className={styles.verifyButton}
                disabled={!verifyEmail.includes("@")}
                onClick={async () => {
                  await bindAccountAsync();
                }}
              >
                Verify
              </Button>

              <div
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                You don't received?{" "}
                <span style={{ color: "#2C9AFF", cursor: "pointer" }}>
                  Resend
                </span>
              </div>
            </div>
          )}
        </Modal>
      )}

      {isLoginStatus && (
        <div style={{ display: "flex", alignItems: "center" }}>
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

          <div
            style={{
              fontSize: "20px",
              background: "#303654",
              borderRadius: "8px",
              padding: "12px 10px",
              marginRight: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenPurchase(true);
            }}
          >
            soul: {(Number(userInfo?.balance) || 0) / 10 ** 18}
          </div>

          <Dropdown menu={{ items: dropdownItems }}>
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
                background: "#303654",
                borderRadius: "8px",
                padding: "12px 10px",
                cursor: "pointer",
              }}
            >
              {address}
            </div>
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

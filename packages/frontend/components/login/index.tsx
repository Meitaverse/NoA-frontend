import { useUserInfo } from "@/hooks/useUserInfo";
import { bindAccount, sendValidateCode, signin } from "@/services/sign";
import { isLogin } from "@/store/userDetail";
import { Button, Input, InputNumber, message, Modal } from "antd";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import loginPng from "@/images/login.png";
import styles from "./index.module.scss";
import { useSwitchToSoul } from "@/hooks/useSwitchToSoul";

interface IProps {
  onConnect?: () => void;
}

const Login: FC<IProps> = props => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const connect = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();
  const [isLoginStatus, setIsLoginStatus] = useAtom(isLogin);
  const [userInfo, initUserInfo] = useUserInfo();
  const [metaMask] = useState(new MetaMaskConnector());
  const { switchToSoulAsync } = useSwitchToSoul();

  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [verifyStage, setVerifyStage] = useState<
    "SignIn" | "InputEmail" | "Verify"
  >("SignIn");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(new Array(6).fill(""));
  const verifyRefs = useRef<any[]>([]);
  const [signLoading, setSignLoading] = useState(false);

  const signinWeb2 = async (account?: string) => {
    const timestamp = +new Date();
    try {
      setSignLoading(true);
      const signMsg = await signMessageAsync({
        message: `Welcome to BitSoul!

        Click to sign in and accept the BitSoul Terms of Service: [https://bitsoul.net](https://bitsoul.net)
        
        This request will not trigger a blockchain transaction or cost any gas fees.
        
        Your authentication status will reset after 48 hours.
        
        Wallet address:
        ${address}
        
        Nonce:
        signin${timestamp}AABBCC`,
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
    } finally {
      setSignLoading(false);
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
      router.push("/dashboard/editProfile");
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
      initUserInfo();
    } catch (e) {
      return;
    }
  };

  const init = async () => {
    const initStatus = await initUserInfo();

    if (initStatus) {
      if (!initStatus.email) {
        setShowSignInDialog(true);
        setVerifyStage("InputEmail");
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      if (!isLoginStatus) {
        init();
      }
    }
  }, [isConnected, isLoginStatus]);

  return (
    <div className={styles.login}>
      <div
        className={styles.connectInner}
        style={{
          display: isLoginStatus && !userInfo?.email ? "none" : "flex",
        }}
      >
        <div className={styles.connectLeft}>
          <img src={loginPng.src} alt="" />
        </div>

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

              try {
                const connectorInfo = await connect.connectAsync({
                  connector: metaMask,
                });

                setShowSignInDialog(true);
                if (props.onConnect) {
                  props.onConnect();
                }
              } catch (e) {
                message.error("cannot found Metamask");
              }
            }}
          >
            Metamask
          </Button>
          <Button className={styles.connectButton}>Wallet Connect</Button>
        </div>
      </div>

      {isConnected && (
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
                  const status = await signinWeb2(address);
                  if (!status) {
                    logOut();
                    return;
                  }
                  const userInfo = await initUserInfo(address);
                  if (!userInfo) {
                    message.error("登录失败");
                    logOut();
                    return;
                  }
                  // 不存在email的话则走验证verify的流程。
                  if (!userInfo.email) {
                    setVerifyStage("InputEmail");
                  } else {
                    setShowSignInDialog(false);
                    return;
                  }
                }}
                loading={signLoading}
              >
                {signLoading ? "Waiting for signing" : "Continue"}
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

                        if (
                          newV[index] !== "" &&
                          verifyRefs.current[index + 1]
                        ) {
                          verifyRefs.current[index + 1].focus();
                        }
                      }}
                      onPaste={event => {
                        event.preventDefault();
                        const pasteVal = event.clipboardData.getData("text");
                        setVerifyCode(
                          new Array(6).fill("").map((i, index) => {
                            return pasteVal[index] || "";
                          })
                        );

                        const lastIndex = verifyCode.findIndex(i => i === "");

                        verifyRefs.current[lastIndex || 5].focus();
                      }}
                      onKeyUp={key => {
                        // console.log(key);
                        if (key.code === "Backspace" && !verifyCode[index]) {
                          if (index - 1 >= 0) {
                            verifyRefs.current[index - 1].focus();
                          }
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
    </div>
  );
};
export default Login;

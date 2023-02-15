import { Button, Input, message } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { getUserInfo, linkSoulBoundTokenId } from "@/services/sign";
import { useAtom } from "jotai";
import { isLogin, userDetail } from "@/store/userDetail";
import { useManagerContract } from "@/hooks/useManagerContract";

interface IProps {}

const Dashboard: FC<IProps> = props => {
  const { address, isConnected } = useAccount();
  const loginLoading = useRef(false);
  const [isLoginStatus, setIsLoginStatus] = useAtom(isLogin);
  const [userInfo, setUserInfo] = useAtom(userDetail);
  const [userName, setUserName] = useState(userInfo?.username);
  const [manager] = useManagerContract();

  const initUserInfo = async () => {
    if (loginLoading.current) return;
    loginLoading.current = true;
    // 存在token的情况下尝试进行登录
    // 检查及登录步骤：
    //    调用接口获取用户信息失败则signinWeb2
    //    成功则setLoginStatus和userInfo。
    try {
      if (localStorage.getItem("token")) {
        const { data } = await getUserInfo({
          walletAddress: address || "",
        });

        if (data.wallet_address) {
          setIsLoginStatus(true);
          setUserInfo(data);
          return data;
        }
      }
    } finally {
      loginLoading.current = false;
    }

    return false;
  };

  console.log(userInfo);

  useEffect(() => {
    if (isConnected) {
      initUserInfo();
    }
  }, [isConnected]);

  useEffect(() => {
    setUserName(userInfo?.username);
  }, [userInfo]);

  return (
    <div className={styles.dashboard}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* 上下结构 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `url(${BgPng.src})`,
            height: "270px",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div style={{ fontSize: "52px", lineHeight: "78px" }}>
            Edit Profile
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Home <span style={{ margin: "0 10px" }}>/</span>{" "}
            <span style={{ color: "#fff" }}>Edit Profile </span>
          </div>
        </div>

        <div style={{ padding: "80px 286px", display: "flex" }}>
          {/* 左右 */}
          <div
            style={{
              display: "flex",
              marginRight: "33px",
            }}
          >
            <img
              src={userInfo?.avatar}
              alt=""
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "50%",
                marginRight: "32px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  lineHeight: "24px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                Profile photo
              </span>

              <span
                style={{
                  width: "145px",
                  fontSize: "14px",
                  lineHeight: "22px",
                  opacity: "0.6",
                  marginBottom: "10px",
                  fontFamily: "Poppins",
                }}
              >
                Recommanded resolution is 640*640 with file size less than 2MB,
                keep visual elements centered
              </span>
              <div className={styles.uploadButtonBg}>
                <Button className={styles.uploadButton}>Upload</Button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "20px",
                lineHeight: "30px",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            >
              Personal Setting
            </div>
            <span
              style={{
                fontSize: "12px",
                lineHeight: "18px",
                marginBottom: "20px",
                opacity: 0.8,
              }}
            >
              You can change your avatar and your user name
            </span>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                marginBottom: "15px",
              }}
            >
              Username <span style={{ color: "red" }}>*</span>
            </div>

            <Input
              className={styles.inputWrapper}
              value={userName}
              defaultValue={userName}
              onChange={e => {
                setUserName(e.target.value);
              }}
            ></Input>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                marginBottom: "15px",
              }}
            >
              Email <span style={{ color: "red" }}>*</span>
            </div>

            <Input
              value={userInfo?.email}
              placeholder="Email Address"
              disabled
              className={styles.inputWrapper}
              defaultValue={userInfo?.email}
            ></Input>

            <div className={styles.line}></div>

            <div
              style={{
                fontSize: "20px",
                lineHeight: "30px",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            >
              Social Links
            </div>
            <span
              style={{
                fontSize: "12px",
                lineHeight: "18px",
                marginBottom: "20px",
                opacity: 0.8,
              }}
            >
              Add your existing social links to build a stronger reputation
            </span>

            <Button
              style={{
                border: "none",
                background:
                  "linear-gradient(117.55deg, #1E50FF -3.37%, #00DFB7 105.51%)",
                height: "56px",
                width: "200px",
                borderRadius: "16px",
                fontSize: "16px",
                color: "#FFF",
              }}
              onClick={async () => {
                if (userInfo?.soul_bound_token_id) {
                  // 更新Profile信息
                  return;
                }

                await manager.createProfile(
                  {
                    nickName: userName || "",
                    imageURI: userInfo?.avatar || "",
                    wallet: address || "",
                  },
                  {
                    from: address,
                  }
                );

                await linkSoulBoundTokenId();

                message.success("save success");
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
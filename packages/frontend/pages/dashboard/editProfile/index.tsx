import { Button, Input, message } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { linkSoulBoundTokenId } from "@/services/sign";
import { useAtom } from "jotai";
import { isLogin, userDetail } from "@/store/userDetail";
import { useManagerContract } from "@/hooks/useManagerContract";
import {
  getSingleProfile,
  profileCreatorWhitelistedRecord,
} from "@/services/graphql";
import { useInterval } from "ahooks";
import { useUserInfo } from "@/hooks/useUserInfo";
import { waitForSomething } from "@/utils/waitForSomething";
import Login from "@/components/login";
import { useSBTContract } from "@/hooks/useSBTContract";

interface IProps {}

const EditProfile: FC<IProps> = props => {
  const { address, isConnected } = useAccount();
  const [userInfo, initUserInfo] = useUserInfo();
  const [, setUserInfo] = useAtom(userDetail);
  const [userName, setUserName] = useState(userInfo?.username);
  const [manager] = useManagerContract();
  const [isLoginStatus] = useAtom(isLogin);

  const clear = useInterval(() => {
    if (!userInfo) return;
    if (userInfo?.create_profile_whitelisted) clear();

    getUserIsWhiteList();
  }, 1000);

  const getUserIsWhiteList = async () => {
    if (!address || !userInfo) return;
    if (!userInfo?.create_profile_whitelisted) {
      const isWhite = await profileCreatorWhitelistedRecord(
        address.toLowerCase()
      );

      if (isWhite.data.profileCreatorWhitelistedRecord) {
        setUserInfo({
          ...userInfo,
          create_profile_whitelisted: !!isWhite,
        });
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      initUserInfo();
    }
  }, [isConnected]);

  useEffect(() => {
    setUserName(userInfo?.username);
  }, [userInfo]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return (
    <div className={styles.editProfile}>
      {isLoginStatus && (
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
                  Recommanded resolution is 640*640 with file size less than
                  2MB, keep visual elements centered
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
                disabled={!userInfo?.create_profile_whitelisted}
                onClick={async () => {
                  if (userInfo?.soul_bound_token_id) {
                    // 更新Profile信息

                    return;
                  }

                  try {
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

                    message.loading({
                      content: "loading",
                      key: "pollingKey",
                    });

                    try {
                      await waitForSomething({
                        func: async () => {
                          const p = await getSingleProfile(address);
                          return p.data;
                        },
                      });
                    } finally {
                      message.destroy("pollingKey");
                    }

                    try {
                      await linkSoulBoundTokenId();
                      initUserInfo();
                    } catch (e) {
                      console.error(e);
                      message.error(JSON.stringify(e));
                    }
                    message.success("save success");
                  } catch (e) {
                    console.error(e);
                    message.error("save error");
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      {(!isLoginStatus || (isLoginStatus && !userInfo?.email)) && (
        <div
          style={{ width: "1200px", padding: "200px 80px", margin: "0 auto" }}
        >
          <Login></Login>
        </div>
      )}
    </div>
  );
};
export default EditProfile;

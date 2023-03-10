import { Button, Input } from "antd";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useAccount, useEnsName } from "wagmi";
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
import { useIsCurrentNetwork } from "@/hooks/useIsCurrentNetwork";
import { useRouter } from "next/router";
import messageBox from "@/components/messageBox";
import { useUpload } from "@/hooks/useUpload";
import { getIpfsUrl } from "@/utils/getIpfsUrl";
import { useSBTContract } from "@/hooks/useSBTContract";
import { useTransctionPending } from "@/hooks/useTransctionPending";

interface IProps {}

const EditProfile: FC<IProps> = props => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [userInfo, initUserInfo] = useUserInfo();
  const [, setUserInfo] = useAtom(userDetail);
  const [manager] = useManagerContract();
  const [sbt] = useSBTContract();
  const [isLoginStatus] = useAtom(isLogin);
  const isCurrentNetwork = useIsCurrentNetwork();
  const refreshTrans = useTransctionPending();
  const [currentAvatar, setCurrentAvatar] = useState(
    userInfo?.avatar.includes("http")
      ? userInfo.avatar
      : getIpfsUrl(userInfo?.avatar || "")
  );
  const { uploadBlob } = useUpload();

  const { data: ensName } = useEnsName({
    address,
  });

  const [userName, setUserName] = useState(
    userInfo?.soul_bound_token_id
      ? userInfo?.username
      : ensName
      ? ensName
      : userInfo?.username
  );
  const [contractLoading, setContractLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

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

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const cid = await uploadBlob(file);
      setCurrentAvatar(getIpfsUrl(cid));
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
              {userInfo?.soul_bound_token_id
                ? "Edit Profile"
                : "Create Your Profile"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {userInfo?.soul_bound_token_id ? (
                <span>
                  Home <span style={{ margin: "0 10px" }}>/</span>{" "}
                  <span style={{ color: "#fff" }}>Edit Profile </span>
                </span>
              ) : (
                <span>
                  Complete your profile，create your BitSoul id, and get your
                  SOUL rewards. Please do not close this page until the
                  transaction is confirmed
                </span>
              )}
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
                src={currentAvatar}
                alt=""
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  marginRight: "32px",
                  objectFit: "cover",
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
                  <input
                    type="file"
                    hidden
                    ref={uploadRef}
                    onChange={e => {
                      uploadAvatar(e);
                    }}
                  />
                  <Button
                    className={styles.uploadButton}
                    onClick={() => {
                      uploadRef.current?.click();
                    }}
                  >
                    Upload
                  </Button>
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
                disabled
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

              {/* <div
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
              </span> */}

              <Button
                style={{
                  border: "none",
                  background:
                    "linear-gradient(117.55deg, #1E50FF -3.37%, #00DFB7 105.51%)",
                  height: "56px",
                  minWidth: "200px",
                  borderRadius: "16px",
                  fontSize: "16px",
                  color: "#FFF",
                }}
                disabled={
                  !userInfo?.create_profile_whitelisted || !isCurrentNetwork
                }
                loading={transactionLoading || contractLoading}
                onClick={async () => {
                  if (userInfo?.soul_bound_token_id) {
                    // 更新Profile信息
                    try {
                      setContractLoading(true);
                      const { hash } = await sbt.updateProfile(
                        userInfo.soul_bound_token_id,
                        userName || "",
                        currentAvatar,
                        {
                          from: address,
                        }
                      );
                      setTransactionLoading(true);
                      setContractLoading(false);
                      await refreshTrans(hash);
                    } finally {
                      setContractLoading(false);
                      setTransactionLoading(false);
                    }

                    initUserInfo();
                    return;
                  }

                  try {
                    setContractLoading(true);
                    await manager.createProfile(
                      {
                        nickName: userName || "",
                        imageURI: currentAvatar || "",
                        wallet: address || "",
                      },
                      {
                        from: address,
                      }
                    );

                    try {
                      setTransactionLoading(true);
                      setContractLoading(false);
                      await waitForSomething({
                        func: async () => {
                          const p = await getSingleProfile(address);
                          return !!p.data;
                        },
                      });
                    } catch (e) {
                      console.error(e);
                    }

                    await linkSoulBoundTokenId();
                    await initUserInfo();

                    router.push("/dashboard");
                    messageBox.success("Update success");
                  } catch (e) {
                    console.error(e);
                    messageBox.error("error");
                  } finally {
                    setContractLoading(false);
                    setTransactionLoading(false);
                  }
                }}
              >
                {transactionLoading
                  ? "Transaction Pending"
                  : contractLoading
                  ? "Confirm transaction in wallet"
                  : userInfo?.soul_bound_token_id
                  ? "Update"
                  : "Create"}
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

import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button, Tabs, TabsProps } from "antd";
import PurchaseDialog from "@/components/purchaseDialog";
import MintCard from "./components/mintCard";
import { formatBalance } from "@/utils/format";
import { useAtom } from "jotai";
import { isLogin } from "@/store/userDetail";
import Login from "@/components/login";
import { voucherAssets, VoucherAssets } from "@/services/graphql";
import Recharge from "./components/recharge";
import { getBgNow } from "@/services/voucher";
import logoPng from "@/images/logo.jpeg";
import dayjs from "dayjs";
import { toSoul } from "@/utils/toSoul";
import messageBox from "@/components/messageBox";
import { useInterval } from "ahooks";

interface IProps {}

const items: TabsProps["items"] = [
  {
    key: "balance",
    label: "My Balance",
  },
  {
    key: "DNFT",
    label: "My DNFT",
  },
];

const Dashboard: FC<IProps> = props => {
  const [userInfo, initUserInfo] = useUserInfo();
  const { address } = useAccount();

  const [actTab, setActTab] = useState("balance");
  const [showPurchase, setShowPurchase] = useState(false);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [myCards, setMyCards] = useState<VoucherAssets["voucherAssets"]>([]);
  const [nowBg, setNowBg] = useState("");
  const getNowBg = async () => {
    const data = await getBgNow();

    if (data.err_code === 0) {
      setNowBg(data.data.url);
    }
  };
  const router = useRouter();

  const [isLoginStatus] = useAtom(isLogin);

  const getMyCards = async () => {
    const cards = await voucherAssets({
      first: 10,
      skip: 0,
      wallet: address?.toLowerCase() || "",
    });
    if (cards.data.voucherAssets) {
      setMyCards(cards.data.voucherAssets);
    }
  };

  const clear = useInterval(() => {
    initUserInfo("", true);
  }, 2000);

  useEffect(() => {
    if (!address) return;
    getMyCards();
  }, [address]);

  useEffect(() => {
    getNowBg();

    return () => {
      clear();
    };
  }, []);

  return (
    <div>
      {isLoginStatus && (
        <div className={styles.dashboard}>
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
            <div
              style={{ fontSize: "52px", lineHeight: "78px", color: "#fff" }}
            >
              My Asset Library
            </div>
          </div>

          <div className={styles.main}>
            {/* left to right */}

            <div className={styles.userCard}>
              <div className={styles.avatarWrapper}>
                <img
                  src={userInfo?.avatar}
                  alt=""
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "24px",
                  lineHeight: "36px",
                  fontWeight: "700",
                }}
              >
                <span>{userInfo?.username}</span>
                <EditOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("/dashboard/editProfile");
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 2,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    marginRight: "15px",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >{`${address?.slice(0, 6)}...${address?.slice(
                  address.length - 5
                )}`}</span>
                <CopyOutlined />
              </div>

              {/* <div className={styles.followers}>
                <div className={styles.followerChunk}>
                  <span className={styles.followerCount}>96</span>
                  <span className={styles.followerTitle}>Followers</span>
                </div>

                <div className={styles.followerChunk}>
                  <span className={styles.followerCount}>96</span>
                  <span className={styles.followerTitle}>Followers</span>
                </div>

                <div className={styles.followerChunk}>
                  <span className={styles.followerCount}>96</span>
                  <span className={styles.followerTitle}>Followers</span>
                </div>
              </div> */}
            </div>

            <div className={styles.myTabs}>
              <Tabs
                activeKey={actTab}
                defaultActiveKey={actTab}
                items={items}
                onChange={key => {
                  setActTab(key);
                }}
              ></Tabs>

              {actTab === "balance" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      background: "#242759",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                      borderRadius: "16px",
                      height: "116px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      fontSize: "20px",
                      color: "#fff",
                    }}
                  >
                    <span style={{ marginBottom: "10px" }}>My Balance</span>
                    <span>
                      {toSoul(userInfo?.balance)}
                      Soul
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginTop: 24,
                      marginBottom: 48,
                    }}
                  >
                    <div
                      style={{
                        background: "#242759",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        borderRadius: "16px",
                        height: "200px",
                        padding: "24px 34px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: "1",
                        marginRight: 24,
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          lineHeight: "32px",
                        }}
                      >
                        Deposit
                      </span>
                      <Button
                        className={styles.linearButton}
                        style={{ marginBottom: "24px", marginTop: "16px" }}
                        onClick={() => {
                          setShowPurchase(true);
                        }}
                      >
                        Buy SOUL
                      </Button>
                      <Button
                        className={styles.linearButton}
                        onClick={() => {
                          setShowRecharge(true);
                        }}
                      >
                        Recharge From SOUL Card
                      </Button>
                    </div>

                    <div
                      style={{
                        background: "#242759",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        borderRadius: "16px",
                        height: "200px",
                        padding: "24px 34px",
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          lineHeight: "32px",
                          marginBottom: "16px",
                        }}
                      >
                        Withdraw
                      </span>
                      <Button
                        className={styles.linearButton}
                        onClick={() => {
                          setShowMintCard(true);
                        }}
                      >
                        Mint SOUL Card
                      </Button>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(230, 232, 236, 0.5)",
                      padding: "48px 0",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: "20px", lineHeight: "30px" }}>
                      My SOUL Cards
                    </div>
                    <span
                      style={{
                        opacity: "0.8",
                        fontSize: "12px",
                        lineHeight: "18px",
                        marginTop: "4px",
                      }}
                    >
                      Add your existing social links to build a stronger
                      reputation
                    </span>

                    <div className={styles.soulCards}>
                      {myCards?.map(i => {
                        if (i.uri.uri) {
                          return (
                            <img
                              className={styles.soulCardImg}
                              src={i.uri.uri}
                              alt={`tokenId: ${i.tokenId}`}
                              title={i.tokenId}
                              key={i.tokenId}
                              style={{
                                background:
                                  "linear-gradient(117.55deg, #1e50ff -3.37%, #00dfb7 105.51%)",
                              }}
                            />
                          );
                        }

                        return (
                          <div
                            className={styles.mintCardPreview}
                            key={i.tokenId}
                          >
                            <img
                              className={styles.mintCardPreviewBg}
                              src={nowBg}
                              alt=""
                              style={{
                                borderRadius: "12px",
                                width: "327px",
                                height: "200px",
                              }}
                            />
                            <div className={styles.mintCardPreviewLeftTop}>
                              <img
                                src={logoPng.src}
                                alt=""
                                className={styles.cornerLogo}
                              />
                              <span
                                style={{
                                  fontStyle: "italic",
                                  fontWeight: 700,
                                  marginLeft: 4,
                                }}
                              >
                                BITSOUL
                              </span>
                            </div>
                            <div className={styles.mintCardPreviewRightTop}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  transform: "scale(0.5)",
                                  marginRight: 2,
                                }}
                              >
                                <span>MINT</span>
                                <span>DATE</span>
                              </div>
                              <div>{dayjs().format("DD/MM/YY")}</div>
                            </div>
                            <div className={styles.mintCardPreviewLeftBottom}>
                              <span
                                style={{
                                  fontSize: "32px",
                                  fontWeight: 700,
                                  marginRight: "4px",
                                  lineHeight: "1",
                                }}
                              >
                                {toSoul(i.value)}
                              </span>
                              <span style={{ fontSize: "16px" }}>SOUL</span>
                            </div>
                            <div className={styles.mintCardPreviewRightBottom}>
                              <i>#{i.tokenId}</i>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <PurchaseDialog
            open={showPurchase}
            onChange={() => {
              setShowPurchase(false);
            }}
          ></PurchaseDialog>

          <MintCard
            open={showMintCard}
            onChange={() => {
              setShowMintCard(false);
              getMyCards();
            }}
          ></MintCard>

          {showRecharge && (
            <Recharge
              open={showRecharge}
              onChange={() => {
                setShowRecharge(false);
                getMyCards();
              }}
            ></Recharge>
          )}
        </div>
      )}
      {(!isLoginStatus || (isLoginStatus && !userInfo?.email)) && (
        <div
          style={{
            width: "1200px",
            padding: "200px 80px",
            margin: "0 auto",
            color: "#fff",
          }}
        >
          <Login></Login>
        </div>
      )}
    </div>
  );
};
export default Dashboard;

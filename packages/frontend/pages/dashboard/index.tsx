import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import {
  CopyOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button, Tabs, TabsProps } from "antd";
import PurchaseDialog from "@/components/purchaseDialog";
import MintCard from "./components/mintCard";
import { useAtom } from "jotai";
import { isLogin } from "@/store/userDetail";
import Login from "@/components/login";
import {
  GetHubsByWallet,
  GetProjectsByWallet,
  IGetProjects,
  voucherAssets,
  VoucherAssets,
  WalletProjects,
} from "@/services/graphql";
import Recharge from "./components/recharge";
import { getBgNow } from "@/services/voucher";
import logoPng from "@/images/logo.jpeg";
import dayjs from "dayjs";
import { toSoul } from "@/utils/toSoul";
import { useInterval } from "ahooks";
import { useManagerContract } from "@/hooks/useManagerContract";
import { useTransctionPending } from "@/hooks/useTransctionPending";

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
  {
    key: "hub",
    label: "My Hub",
  },
  {
    key: "projects",
    label: "My Project",
  },
];

const ProjectItem: FC<
  WalletProjects[number] & { onPublish?: () => void }
> = props => {
  const [manager] = useManagerContract();
  const { address } = useAccount();
  const refreshTrans = useTransctionPending();
  const [pubLoading, setPubloading] = useState(false);
  const [transLoading, setTransloading] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.projectItem}>
      <div
        style={{ display: "flex", flexDirection: "column" }}
        onClick={() => {
          if (props.publishes[0].id) {
            router.push(`/home/projectDetail?id=${props.publishes[0].id}`);
          }
        }}
      >
        <img src={props.image} alt="" className={styles.projectCover} />
        <span className={styles.projectName}>{props.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            width: 6,
            height: 6,
            background: "#1890FF",
            borderRadius: "50%",
            marginRight: 8,
          }}
        ></span>
        <span>ongoing</span>
        <span style={{ flex: 1 }}></span>
        <EllipsisOutlined />
      </div>

      {props.publications.length && !props.publishes.length ? (
        <Button
          className="linearButton"
          style={{ marginTop: "16px" }}
          disabled={props.permitByHubOwner}
          onClick={async () => {
            setPubloading(true);
            try {
              const { hash } = await manager.publish(
                +props.publications[0].publishId,
                {
                  from: address,
                }
              );

              setPubloading(false);
              setTransloading(true);

              const result = await refreshTrans(hash);

              if (result) {
                props?.onPublish?.();
              }
            } finally {
              setPubloading(false);
              setTransloading(false);
            }
          }}
          loading={pubLoading || transLoading}
        >
          {transLoading
            ? "Transaction Pending"
            : pubLoading
            ? "Confirm in Wallet"
            : "Publish"}
        </Button>
      ) : (
        ""
      )}

      {!props.publications.length ? (
        <Button
          className="linearButton"
          style={{ marginTop: "16px" }}
          onClick={() => {
            router.push(`/creativeHub/projects/publish?id=${props.projectId}`);
          }}
        >
          Issue Genesis NFT
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

const Dashboard: FC<IProps> = props => {
  const [userInfo, initUserInfo] = useUserInfo();
  const { address } = useAccount();

  const [actTab, setActTab] = useState("balance");
  const [showPurchase, setShowPurchase] = useState(false);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [myCards, setMyCards] = useState<VoucherAssets["voucherAssets"]>([]);
  const [nowBg, setNowBg] = useState("");
  const [hub, setHub] = useState<{
    name: string;
    imageURI: string;
    id: string;
    hubId: string;
  }>();

  // 暂不分页
  const getProjectsParams = useRef({
    first: 50,
    skip: 0,
  });
  const loading = useRef(false);

  const [projects, setProjects] = useState<WalletProjects>([]);

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

  const getMyHub = async () => {
    const res = await GetHubsByWallet(address?.toLowerCase() || "");

    setHub(res.data.account.hub);
  };

  const fetchProjects = async (type?: "reset" | "next") => {
    if (type === "reset") {
      getProjectsParams.current.skip = 0;
    }
    if (loading.current) return;

    try {
      loading.current = true;
      const data = await GetProjectsByWallet(
        `first: ${getProjectsParams.current.first} skip: ${getProjectsParams.current.skip}`,
        address || ""
      );

      setProjects(data.data.account.hub.projects);
    } finally {
      loading.current = false;
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

                  if (key === "hub") {
                    getMyHub();
                  }

                  if (key === "projects") {
                    fetchProjects();
                  }
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
              {actTab === "hub" && (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {hub && (
                    <div
                      className={styles.hubItem}
                      onClick={() => {
                        router.push("/creativeHub/projects");
                      }}
                    >
                      <img
                        src={hub?.imageURI}
                        alt=""
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />

                      <div className={styles.hubName}>{hub?.name}</div>

                      <div
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/creativeHub/createMyHub?edit=1`);
                        }}
                      >
                        <EditOutlined />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {actTab === "projects" && (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {projects.map(proj => {
                    return (
                      <ProjectItem
                        key={proj.id}
                        {...proj}
                        onPublish={() => {
                          fetchProjects();
                        }}
                      ></ProjectItem>
                    );
                  })}
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

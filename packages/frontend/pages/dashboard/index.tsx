import React, { FC, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button, Tabs, TabsProps } from "antd";

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
  const [userInfo] = useUserInfo();
  const { address } = useAccount();

  const [actTab, setActTab] = useState("balance");

  const router = useRouter();

  return (
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
        <div style={{ fontSize: "52px", lineHeight: "78px", color: "#fff" }}>
          My Asset Library
        </div>
      </div>

      <div className={styles.main}>
        {/* left to right */}

        <div className={styles.userCard}>
          <div className={styles.avatarWrapper}>
            <img src={userInfo?.avatar} alt="" />
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
            <span>John haha</span>
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

          <div className={styles.followers}>
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
          </div>
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
                <span>1,111,111 Soul</span>
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
                  >
                    Buy SOUL
                  </Button>
                  <Button className={styles.linearButton}>
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
                  <Button className={styles.linearButton}>
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
                  Add your existing social links to build a stronger reputation
                </span>

                <div className={styles.soulCards}>
                  <img src="" alt="" />
                  <img src="" alt="" />
                  <img src="" alt="" />
                  <img src="" alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

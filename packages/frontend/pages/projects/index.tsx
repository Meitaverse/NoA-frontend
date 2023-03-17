import React, { FC } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Button, Input, Select } from "antd";
import { FullscreenOutlined, RedoOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface IProps {}

const Projects: FC<IProps> = props => {
  const [userInfo] = useUserInfo();
  const router = useRouter();

  return (
    <div className={styles.projects}>
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
          Projects
        </div>
      </div>

      <div className={styles.userInfo}>
        <img
          src={userInfo?.avatar}
          style={{
            width: 72,
            height: 72,
            border: "2px solid #EFECEC",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          alt=""
        />

        <div
          style={{
            margin: "12px 0",
            fontSize: "20px",
            lineHeight: "28px",
            fontWeight: "600",
          }}
        >
          {userInfo?.username}
        </div>
        <div
          style={{
            maxWidth: 640,
            fontSize: "14px",
            lineHeight: "22px",
            textAlign: "center",
          }}
        >
          {userInfo?.username}
        </div>
      </div>

      <div className={styles.operationBar}>
        <div className={styles.opItem}>
          <span className={styles.opItemTitle}>Project Name:</span>
          <Input></Input>
        </div>
        <div className={styles.opItem}>
          <span className={styles.opItemTitle}>Description:</span>
          <Input></Input>
        </div>

        <div
          className="linearBorderButtonBg"
          style={{ minWidth: 70, marginRight: 4 }}
        >
          <Button className="linearBorderButton" style={{ minWidth: 68 }}>
            Reset
          </Button>
        </div>

        <Button className="linearButton">Query</Button>
      </div>

      <div className={styles.projTables}>
        <div className={styles.filterBar}>
          <span>My Projects </span>

          <span style={{ flex: 1 }}></span>

          <Select defaultValue="12321"></Select>

          <div
            className="linearBorderButtonBg"
            style={{ width: 166, height: 32, minHeight: 32, borderRadius: 12 }}
          >
            <Button
              className="linearBorderButton"
              style={{ width: 164, height: 30, borderRadius: 12 }}
              onClick={() => {
                router.push("projects/publish");
              }}
            >
              Create New Project
            </Button>
          </div>

          <RedoOutlined style={{ marginLeft: 16, marginRight: 12 }} />
          <FullscreenOutlined />
        </div>
      </div>
    </div>
  );
};
export default Projects;

import { getHubs, IGetHubs } from "@/services/graphql";
import { getMyHubDetail, IGetMyHubDetail } from "@/services/hub";
import { Button } from "antd";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";

interface IProps {}

const CreativeHub: FC<IProps> = props => {
  const router = useRouter();
  const [hubs, setHubs] = useState<IGetHubs["hubs"]>([]);
  const [hubDetail, setHubDetail] = useState<IGetMyHubDetail | null>(null);

  const fetchHubs = async () => {
    const data = await getHubs();

    setHubs(data.data.hubs);
  };

  const getHubDetail = async () => {
    const res = await getMyHubDetail();

    if (res.err_code === 0) {
      setHubDetail(res.data);
      return res.data;
    }

    return false;
  };

  useEffect(() => {
    getHubDetail();
    fetchHubs();
  }, []);

  return (
    <div className={styles.creativeHub}>
      <h1>Explore Hubs</h1>

      <Button
        className="linearButton"
        style={{
          width: "100%",
          height: "72px",
          fontSize: "24px",
          lineHeight: "29px",
        }}
        onClick={() => {
          if (hubDetail?.blockchain_hub_id) {
            router.push("/creativeHub/projects");
            return;
          }
          router.push("/creativeHub/createMyHub");
        }}
      >
        {hubDetail?.blockchain_hub_id ? "Enter My Hub" : "Apply My Hub"}
      </Button>

      <div className={styles.main}>
        {hubs.map(hub => {
          return (
            <div className={styles.hubItem} key={hub.hubId}>
              <img
                src={hub.imageURI}
                alt=""
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />

              <div className={styles.hubName}>{hub.name}</div>
              <div className={styles.hubDetail}>
                Total Sales:
                <span
                  style={{ color: "#fff", fontSize: "16px", lineHeight: 1.4 }}
                >
                  34 ETH
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CreativeHub;

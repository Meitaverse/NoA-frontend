import { getHubs, IGetHubs } from "@/services/graphql";
import { getMyHubDetail, IGetMyHubDetail } from "@/services/hub";
import { Button } from "antd";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";

interface IProps {}

const CreativeHub: FC<IProps> = props => {
  const router = useRouter();
  const account = useAccount();
  const [hubs, setHubs] = useState<IGetHubs["hubs"]>([]);
  const [hubDetail, setHubDetail] = useState<any>(null);

  const fetchHubs = async () => {
    const data = await getHubs();

    setHubs(data.data.hubs);
  };

  const getHubDetail = async () => {
    const resG = await getHubs();

    const find = resG.data.hubs.find(
      i => i.hubOwner.id.toLowerCase() === account.address?.toLowerCase()
    );
    const res = await getMyHubDetail();

    if (res.err_code === 0) {
      setHubDetail({
        ...res.data,
        blockchain_hub_id: find?.hubId || "",
      });
      return res.data;
    }

    return false;
  };

  useEffect(() => {
    getHubDetail();
    fetchHubs();
  }, []);
  console.log(hubDetail);
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CreativeHub;

import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { Button, Form, Input, Switch } from "antd";
import Upload from "@/components/upload";
import { useManagerContract } from "@/hooks/useManagerContract";
import { useUserInfo } from "@/hooks/useUserInfo";
import messageBox from "@/components/messageBox";
import { useAccount } from "wagmi";
import { useUpdate } from "ahooks";
import { getMyHubDetail, IGetMyHubDetail } from "@/services/hub";
import { useTransctionPending } from "@/hooks/useTransctionPending";

import { useRouter } from "next/router";
import { getHubs, getProjects, GetProjectsByWallet } from "@/services/graphql";

interface IProps {}

const CreateProject: FC<IProps> = props => {
  const bgRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const account = useAccount();
  const update = useUpdate();
  const [form] = Form.useForm();
  const [manager] = useManagerContract();
  const [userInfo] = useUserInfo();
  const refreshTrans = useTransctionPending();

  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTrans, setLoadingTrans] = useState(false);
  const [myHubDetail, setMyHubDetail] = useState<any>();

  const getHubDetail = async () => {
    const resG = await getHubs();

    const find = resG.data.hubs.find(
      i => i.hubOwner.id.toLowerCase() === account.address?.toLowerCase()
    );

    // 正常情况应该用下面那个，但现在后端没写好
    const res = await getMyHubDetail();

    if (res.err_code === 0) {
      setMyHubDetail({
        ...res.data,
        blockchain_hub_id: find?.hubId || "",
      });

      return res.data;
    }

    return false;
  };

  useEffect(() => {
    getHubDetail();
  }, []);

  return (
    <div className={styles.createProject}>
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
          Publish New dNFTs
        </div>
      </div>

      <div style={{ padding: "80px 286px", display: "flex" }}>
        {/* 上下 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "33px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", color: "#fff" }}
          >
            <span
              style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 700 }}
            >
              Preview Item
            </span>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "12px",
                lineHeight: "18px",
                marginTop: "4px",
              }}
            >
              Your Project will look like this
            </span>
          </div>
          <img
            src={form.getFieldValue("media")}
            alt=""
            style={{
              width: "530px",
              height: "521px",
              borderRadius: "20px",
              objectFit: "cover",
              marginTop: "16px",
            }}
          />

          <span
            style={{
              fontSize: "20px",
              color: "#fff",
              lineHeight: "30px",
              fontWeight: "700",
              marginTop: 16,
            }}
          >
            {form.getFieldValue("name")}
          </span>
        </div>

        <div>
          <Form
            className={styles.form}
            layout="vertical"
            form={form}
            initialValues={{}}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  The new collection name you are publishing
                </span>

                <Input
                  placeholder="eg: MAYC #9754 Family"
                  className={styles.formInput}
                  value={form.getFieldValue("name")}
                  onChange={e => {
                    form.setFieldValue("name", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="media" label="Media">
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  File types supported: JPG, PNG, GIF, SVG, MP4, Max size: 100MB
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    placeholder="NFT URL"
                    className={styles.formInput}
                    value={form.getFieldValue("media")}
                    disabled
                  ></Input>
                  <Upload
                    ref={bgRef}
                    style={{
                      width: "120px",
                      height: "64px",
                      marginLeft: "10px",
                    }}
                    buttonText="Select"
                    onChange={val => {
                      form.setFieldValue("media", val);
                      update();
                    }}
                  ></Upload>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="desc"
              label="Description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  Detailed description of your NFT included in the metadata
                </span>

                <Input.TextArea
                  placeholder="Provide a detailed description of your item"
                  className={styles.formInput}
                  rows={8}
                  value={form.getFieldValue("desc")}
                  onChange={e => {
                    form.setFieldValue("desc", e.target.value);
                    update();
                  }}
                ></Input.TextArea>
              </div>
            </Form.Item>

            <Form.Item name="secondaryCreation" label="Secondary Creation">
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  Whether to support secondary creation
                </span>
                <Switch
                  className={styles.formInput}
                  checked={form.getFieldValue("secondaryCreation") as boolean}
                  onChange={e => {
                    form.setFieldValue("secondaryCreation", e);
                    update();
                  }}
                ></Switch>
              </div>
            </Form.Item>
          </Form>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "48px" }}
          >
            <Button
              className="linearButton"
              loading={loadingOne || loadingTrans}
              style={{ width: 528, height: 54, borderRadius: 16 }}
              onClick={async () => {
                const values = await form.validateFields();
                if (!myHubDetail?.blockchain_hub_id) {
                  messageBox.error("you don't have hub, please create first.");
                  return;
                }
                setLoadingOne(true);

                try {
                  const { hash } = await manager.createProject(
                    {
                      hubId: myHubDetail.blockchain_hub_id,
                      soulBoundTokenId: userInfo?.soul_bound_token_id || "",
                      name: form.getFieldValue("name"),
                      image: form.getFieldValue("media"),
                      metadataURI: form.getFieldValue("media") || "",
                      description: form.getFieldValue("desc"),
                      descriptor: account.address || "",
                      defaultRoyaltyPoints: 0,
                      permitByHubOwner: false,
                    },
                    {
                      from: account.address,
                    }
                  );

                  setLoadingOne(false);
                  setLoadingTrans(true);
                  const result = await refreshTrans(hash);
                  if (result) {
                    messageBox.success("Create Success");
                    // router.push("/dashboard");
                    const data = await GetProjectsByWallet(
                      `first: 1 orderBy: timestamp orderDirection: desc`,
                      account.address || ""
                    );
                    router.push(
                      `/creativeHub/projects/publish?id=${data.data.account.hub.projects[0].projectId}`
                    );
                  }
                } finally {
                  setLoadingOne(false);
                  setLoadingTrans(false);
                }
              }}
            >
              {loadingTrans
                ? "Transaction Pending"
                : loadingOne
                ? "Confirm Transaction in wallet"
                : "Create Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProject;

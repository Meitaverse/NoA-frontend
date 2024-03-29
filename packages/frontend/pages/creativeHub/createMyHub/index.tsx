import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { Button, Form, Input, Radio } from "antd";
import Upload from "@/components/upload";
import { useManagerContract } from "@/hooks/useManagerContract";
import { useUserInfo } from "@/hooks/useUserInfo";
import messageBox from "@/components/messageBox";
import { useAccount } from "wagmi";
import { useUpdate } from "ahooks";
import {
  createHub,
  getMyHubDetail,
  IGetMyHubDetail,
  updateHub,
} from "@/services/hub";
import { useTransctionPending } from "@/hooks/useTransctionPending";
import { waitForSomething } from "@/utils/waitForSomething";
import { useRouter } from "next/router";

interface IProps {}

const CreateMyHub: FC<IProps> = props => {
  const [currentHubLogo, setCurrentHubLogo] = useState("");
  const bgRef = useRef<HTMLInputElement>(null);

  const account = useAccount();
  const router = useRouter();
  const update = useUpdate();
  const [form] = Form.useForm();
  const [manager] = useManagerContract();
  const [userInfo] = useUserInfo();
  const refreshTrans = useTransctionPending();

  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTrans, setLoadingTrans] = useState(false);

  const [hubDetail, setHubDetail] = useState<IGetMyHubDetail | null>(null);

  const isEdit = useMemo(() => {
    return router.query.edit;
  }, [router.query]);

  const getHubDetail = async () => {
    const res = await getMyHubDetail();

    if (res.err_code === 0) {
      setHubDetail(res.data);
      if (res.data) {
        setCurrentHubLogo(res.data.background);
        form.setFieldsValue(res.data);
      }
      return res.data;
    }

    return false;
  };

  useEffect(() => {
    if (router.query.edit) {
      getHubDetail();
    }
  }, [router.query]);

  return (
    <div className={styles.createMyHub}>
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
          Creat my hub
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <span>
            Creative Hubs <span style={{ margin: "0 10px" }}>/</span>{" "}
            <span style={{ color: "#fff" }}>Creat My Hub</span>
          </span>
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
            src={currentHubLogo}
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
              Logo*:
            </span>

            <span
              style={{
                width: "145px",
                fontSize: "14px",
                lineHeight: "22px",
                opacity: "0.6",
                marginBottom: "10px",
                fontFamily: "Poppins",
                color: "#fff",
              }}
            >
              Recommanded resolution is 640*640 with file size less than 2MB,
              keep visual elements centered
            </span>
            <Upload
              onChange={val => {
                setCurrentHubLogo(val);
              }}
            ></Upload>
          </div>
        </div>

        <div>
          <Form
            className={styles.form}
            layout="vertical"
            form={form}
            initialValues={hubDetail || {}}
          >
            <Form.Item name="background" label="Background">
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  Drag or choose your file to upload
                </span>

                <div
                  style={{
                    width: 816,
                    height: 260,
                    border: "1px dashed rgba(255, 255, 255, 0.5)",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    bgRef.current?.click();
                  }}
                >
                  {form.getFieldValue("background") ? (
                    <img
                      src={form.getFieldValue("background")}
                      style={{
                        maxHeight: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: "30px",
                      }}
                    >
                      Recommanded resolution is 1200*320 with file size less
                      than 2MB, keep visual elements centered
                    </span>
                  )}

                  <Upload
                    ref={bgRef}
                    style={{
                      display: form.getFieldValue("background")
                        ? "none"
                        : "block",
                    }}
                    buttonText="Select"
                    onChange={val => {
                      form.setFieldValue("background", val);
                      update();
                    }}
                  ></Upload>
                </div>
              </div>
            </Form.Item>

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
                <span className={styles.formItemDesc}>Name of your Hub</span>

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("name")}
                  onChange={e => {
                    form.setFieldValue("name", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  description your hub
                </span>

                <Input.TextArea
                  placeholder="Provide a detailed description of your hub"
                  className={styles.formInput}
                  rows={8}
                  value={form.getFieldValue("description")}
                  onChange={e => {
                    form.setFieldValue("description", e.target.value);
                    update();
                  }}
                ></Input.TextArea>
              </div>
            </Form.Item>

            <Form.Item
              name="hubSetting"
              label="Hub Setting"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue={false}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  who can create project under your hub
                </span>

                <Radio.Group
                  value={form.getFieldValue("hubSetting")}
                  onChange={v => {
                    form.setFieldValue("hubSetting", v);
                    update();
                  }}
                >
                  <Radio value={true}>Private</Radio>
                  <Radio value={false}>Publish</Radio>
                </Radio.Group>
              </div>
            </Form.Item>

            <Form.Item name="website" label="Website">
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>official website</span>

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("website")}
                  onChange={e => {
                    form.setFieldValue("website", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="official" label="official Twitter">
              <div className={styles.formItem}>
                {/* <span className={styles.formItemDesc}>official website</span> */}

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("official")}
                  onChange={e => {
                    form.setFieldValue("official", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="discord" label="Discord">
              <div className={styles.formItem}>
                {/* <span className={styles.formItemDesc}>official website</span> */}

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("discord")}
                  onChange={e => {
                    form.setFieldValue("discord", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>official website</span>

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("email")}
                  onChange={e => {
                    form.setFieldValue("email", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>
          </Form>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "48px" }}
          >
            <div
              className="linearBorderButtonBg"
              style={{
                width: 530,
                height: 56,
                borderRadius: 16,
              }}
            >
              <Button
                className="linearBorderButton"
                loading={loadingOne || loadingTrans}
                style={{ width: 528, height: 54, borderRadius: 16 }}
                onClick={async () => {
                  const values = await form.validateFields();
                  if (!currentHubLogo) {
                    messageBox.error("logo is required");
                    return;
                  }

                  if (!userInfo?.soul_bound_token_id) {
                    messageBox.error("User don't registe");
                    return;
                  }

                  try {
                    setLoadingOne(true);

                    if (isEdit) {
                      await updateHub({ ...values });
                      const res = await manager.updateHub(
                        hubDetail?.blockchain_hub_id || 0,
                        form.getFieldValue("name"),
                        form.getFieldValue("description"),
                        form.getFieldValue("background"),
                        {
                          from: account.address,
                        }
                      );
                      setLoadingOne(false);
                      setLoadingTrans(true);

                      const result = await refreshTrans(res.hash);

                      if (result) {
                        messageBox.success("hub update success");
                        router.push("/creativeHub/projects");
                      }
                      return;
                    }
                    if (hubDetail?.blockchain_hub_id) {
                      messageBox.error("You has been created hub");
                      return;
                    }
                    if (!hubDetail) {
                      // 如果不存在hub，则需要先告诉后端，等待创建，之后一直轮询到后端加入白名单为止。
                      const backendRes = await createHub({
                        ...values,
                      });

                      if (backendRes.err_code === 0) {
                        await waitForSomething({
                          func: async () => {
                            const r = await getHubDetail();
                            if (r) {
                              return r.create_hub_whitelisted;
                            }
                            return false;
                          },
                          splitTime: 300,
                        });
                      }
                    }

                    if (!hubDetail?.blockchain_hub_id) {
                      const res = await manager.createHub(
                        {
                          soulBoundTokenId: userInfo?.soul_bound_token_id,
                          name: values.name,
                          description: values.description,
                          imageURI: currentHubLogo,
                        },
                        {
                          from: account.address,
                        }
                      );

                      setLoadingOne(false);
                      setLoadingTrans(true);

                      const result = await refreshTrans(res.hash);

                      if (result) {
                        messageBox.success("hub create success");
                        router.push("/creativeHub/projects");
                      }
                    }
                  } catch (e) {
                    console.error(e);
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
                  : isEdit
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateMyHub;

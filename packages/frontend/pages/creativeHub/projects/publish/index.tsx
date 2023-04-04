import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { Button, DatePicker, Form, Input, Modal, Radio, Select } from "antd";
import Upload from "@/components/upload";
import { useManagerContract } from "@/hooks/useManagerContract";
import { useUserInfo } from "@/hooks/useUserInfo";
import messageBox from "@/components/messageBox";
import { useAccount, useSignMessage, useSwitchNetwork } from "wagmi";
import { useUpdate } from "ahooks";
import { createHub, getMyHubDetail } from "@/services/hub";
import { useTransctionPending } from "@/hooks/useTransctionPending";
import { waitForSomething } from "@/utils/waitForSomething";
import {
  CurrencyWhitelist,
  getHubs,
  ICurrencyWhiteList,
  TreasuryFee,
} from "@/services/graphql";
import { toSoul } from "@/utils/toSoul";
import { CaretDownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import {
  FEE_ADDRESS,
  PUBLISH_ADDRESS,
  SBT_ADDRESS,
  TEMPLATE_ADDRESS,
} from "@/config";
import { defaultAbiCoder } from "ethers/lib/utils";
import Mumbai from "@/chain/Mumbai";
import { useNftContracts } from "@/hooks/useNftContracts";
import { signLog } from "@/services/sign";
import { useSwitchToSoul } from "@/hooks/useSwitchToSoul";

interface IProps {}
// 临时方案
const tempCurLabel = {};

tempCurLabel[SBT_ADDRESS] = "SBT";

const nftNetworks = [
  {
    label: "Mumbai",
    value: Mumbai.id,
  },
];

const CreateMyHub: FC<IProps> = props => {
  const bgRef = useRef<HTMLInputElement>(null);

  const account = useAccount();
  const router = useRouter();
  const update = useUpdate();
  const [form] = Form.useForm();
  const [manager] = useManagerContract();
  const { setNftAddress, caller } = useNftContracts();
  const [userInfo] = useUserInfo();
  const refreshTrans = useTransctionPending();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { switchToSoulAsync } = useSwitchToSoul();
  const { signMessageAsync } = useSignMessage();

  // 位
  const [fee, setFee] = useState<number>(0);
  const [curSelectCurrency, setCurSelectCurrency] = useState(SBT_ADDRESS);
  const [currencyList, setCurrencyList] = useState<
    { value: string; label: string }[]
  >([
    {
      label: "SBT",
      value: SBT_ADDRESS,
    },
  ]);
  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTrans, setLoadingTrans] = useState(false);

  const [myHubDetail, setMyHubDetail] = useState<any>();

  const [showImport, setShowImport] = useState(false);
  const [importStage, setImportStage] = useState<"One" | "Two" | "Three">(
    "One"
  );
  const [importContractAddress, setImportContractAddress] = useState("");
  const [importTokenId, setImportTokenId] = useState("");
  const [importURI, setImportURI] = useState("");
  const [importImageMetaData, setImportImageMetaData] = useState<{
    image: string;
    name: string;
    description: string;
  }>({
    image: "",
    name: "",
    description: "",
  });

  const [checkOwnLoading, setCheckOwnLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);

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

  const getFeeSetting = async () => {
    const { data } = await TreasuryFee();

    if (data?.treasuryFeeRecord?.newTreasuryFee) {
      setFee(data.treasuryFeeRecord.newTreasuryFee);
    }
  };

  // const getCurCurrencry = async () => {
  //   const { data } = await CurrencyWhitelist();

  //   setCurrencyList(
  //     data.currencyWhitelists
  //       .filter(i => i.whitelisted)
  //       .map(i => {
  //         return {
  //           value: i.currency,
  //           label: tempCurLabel[i.currency],
  //         };
  //       })
  //   );

  //   setCurSelectCurrency(
  //     data.currencyWhitelists.filter(i => i.whitelisted)[0].currency || ""
  //   );
  // };

  const reset = async () => {
    await switchToSoulAsync();
    setShowImport(false);
    setImportStage("One");
    setImportContractAddress("");
    setImportTokenId("");
    setImportURI("");
  };

  useEffect(() => {
    getFeeSetting();
    // getCurCurrencry();
    getHubDetail();
  }, []);

  return (
    <div className={styles.publish}>
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
              Your NFT will look like this
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

          <span
            style={{
              fontSize: "14px",
              lineHeight: "18px",
              opacity: "0.8",
              margin: "12px 0",
              fontFamily: "Poppins",
              color: "#fff",
            }}
          >
            {form.getFieldValue("desc")}
          </span>

          <div
            style={{
              display: "flex",
              marginTop: 12,
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "55px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  color: "#F5F7FA",
                  marginBottom: 7,
                  opacity: "0.6",
                }}
              >
                Price
              </span>
              <span>
                {form.getFieldValue("mintPrice")}{" "}
                {currencyList.find(i => i.value === curSelectCurrency)?.label}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  color: "#F5F7FA",
                  marginBottom: 7,
                  opacity: "0.6",
                }}
              >
                Total Supple
              </span>
              <span>{form.getFieldValue("totalSupply")}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              marginTop: "14px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                lineHeight: "18px",
                color: "#F5F7FA",
                marginBottom: 7,
                opacity: "0.6",
              }}
            >
              Publish Fee
            </span>
            <span>
              {+form.getFieldValue("totalSupply") > 1
                ? toSoul(+form.getFieldValue("totalSupply") * fee, false)
                : 0}{" "}
              SOUL
            </span>
          </div>

          <span
            style={{
              fontSize: "14px",
              lineHeight: "18px",
              color: "#F5F7FA",
              marginBottom: 7,
              opacity: "0.6",
              marginTop: 16,
              width: "530px",
            }}
          >
            Mint 1 NFT for free, if you need to mint more than 1 dNFT, then you
            need to pay SOUL as publishing fees
          </span>
        </div>

        <div>
          <Form
            className={styles.form}
            layout="vertical"
            form={form}
            initialValues={{}}
          >
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

                  <div
                    className="linearBorderButtonBg"
                    style={{
                      width: "120px",
                      height: "64px",
                      marginLeft: "10px",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      setShowImport(true);
                      setImportStage("One");
                    }}
                  >
                    <Button
                      className="linearBorderButton"
                      style={{
                        width: "118px",
                        height: "62px",
                      }}
                    >
                      Select
                    </Button>
                  </div>

                  <Upload
                    ref={bgRef}
                    style={{
                      width: "120px",
                      height: "64px",
                      marginLeft: "10px",
                      display: "none",
                    }}
                    buttonText="Select"
                    onChange={val => {
                      form.setFieldValue("media", val);
                      update();
                      setShowImport(false);
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

            <div style={{ display: "flex" }}>
              <Form.Item
                name="totalSupply"
                label="Total Supply"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <div className={styles.formItem}>
                  <span className={styles.formItemDesc}>
                    How many dNFTs you want to publish
                  </span>

                  <Input
                    placeholder="eg: MAYC #9754 Family"
                    className={styles.formInput}
                    value={form.getFieldValue("totalSupply")}
                    onChange={e => {
                      form.setFieldValue("totalSupply", e.target.value);
                      update();
                    }}
                  ></Input>
                </div>
              </Form.Item>
              <Form.Item
                name="issueMethod"
                label="Issue Method"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ marginLeft: "67px" }}
                initialValue={"true"}
              >
                <div className={styles.formItem}>
                  <span className={styles.formItemDesc}>description</span>

                  <Radio.Group
                    style={{ display: "flex", flexDirection: "column" }}
                    defaultValue={"true"}
                  >
                    <Radio value={"true"}>Paid Mint</Radio>
                    <Radio value={"false"} style={{ marginTop: "15px" }}>
                      Free Airdrop
                    </Radio>
                  </Radio.Group>
                </div>
              </Form.Item>
            </div>

            <Form.Item
              name="mintPrice"
              label="Mint Price"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  Set up the price of your dNFT
                </span>

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("mintPrice")}
                  onChange={e => {
                    form.setFieldValue("mintPrice", e.target.value);
                    update();
                  }}
                  addonAfter={
                    <Select
                      value={curSelectCurrency}
                      suffixIcon={
                        <CaretDownOutlined style={{ color: "#fff" }} />
                      }
                      options={currencyList}
                      onChange={val => {
                        setCurSelectCurrency(val);
                      }}
                    />
                  }
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="time" label="Start" initialValue={0}>
              <div className={styles.formItem}>
                {/* separator={"to"} */}
                <DatePicker
                  showTime
                  value={form.getFieldValue("time")}
                  onChange={e => {
                    form.setFieldValue("time", e);
                    update();
                  }}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="mintLimit"
              label="Mint limit per address"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem}>
                <span className={styles.formItemDesc}>
                  set a limit of how many items a single address can mint
                </span>

                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("mintLimit")}
                  onChange={e => {
                    form.setFieldValue("mintLimit", e.target.value);
                    update();
                  }}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item
              name="royalties"
              label="Royalties"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className={styles.formItem} style={{ color: "#fff" }}>
                <span className={styles.formItemDesc}>
                  Earning receive for every sale
                </span>
                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("royalties")}
                  onChange={e => {
                    form.setFieldValue("royalties", e.target.value);
                    update();
                  }}
                  suffix={"%"}
                ></Input>
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

                if (!router.query.id) {
                  messageBox.error("unexcept error");
                  return;
                }
                try {
                  const collectModuleInitData = defaultAbiCoder.encode(
                    ["uint256", "uint16", "uint16", "uint32"],
                    [
                      +form.getFieldValue("mintPrice"),
                      50,
                      +form.getFieldValue("mintLimit"),
                      Math.floor(+form.getFieldValue("time") / 1000),
                    ]
                  );

                  const publishModuleInitData = defaultAbiCoder.encode(
                    ["address", "uint256"],
                    [TEMPLATE_ADDRESS, 1]
                  );

                  const { hash } = await manager.prePublish(
                    {
                      hubId: myHubDetail.blockchain_hub_id,
                      soulBoundTokenId: userInfo?.soul_bound_token_id || "",
                      projectId: +router.query.id || 1,
                      name: form.getFieldValue("name"),
                      description: form.getFieldValue("desc"),
                      salePrice: form.getFieldValue("mintPrice"),
                      currency: curSelectCurrency,
                      canCollect:
                        form.getFieldValue("issueMethod") === "true"
                          ? true
                          : false,
                      materialURIs: form.getFieldValue("media")
                        ? [form.getFieldValue("media")]
                        : [],
                      fromTokenIds: [],
                      amount: form.getFieldValue("totalSupply"),
                      collectModule: FEE_ADDRESS,
                      publishModule: PUBLISH_ADDRESS,
                      collectModuleInitData: collectModuleInitData,
                      publishModuleInitData: publishModuleInitData,
                      royaltyBasisPoints:
                        +form.getFieldValue("royalties") * 100,
                    },
                    {
                      from: account.address,
                    }
                  );

                  setLoadingOne(false);
                  setLoadingTrans(true);
                  const result = await refreshTrans(hash);
                  if (result) {
                    messageBox.success("Prepare publish Success");
                    router.push("/dashboard?tab=projects");
                    // const data = await getProjects(
                    //   "first:1, orderBy: timestamp orderDirection: desc"
                    // );
                    // router.push(
                    //   `/creativeHub/projects/publish?id=${data.data.projects[0].projectId}`
                    // );
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
                : "Pre Publish"}
            </Button>
          </div>

          <Modal
            className="darkModal"
            open={showImport}
            footer={null}
            closeIcon={
              <CloseCircleOutlined
                style={{ fontSize: "22px", color: "#FFF" }}
              />
            }
            closable
            width={720}
            onCancel={() => {
              reset();
            }}
          >
            <>
              {importStage === "One" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      marginBottom: "24px",
                    }}
                  >
                    Create New Project
                  </div>
                  <div
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                  >
                    choos the way to continue
                  </div>

                  <Button
                    className={styles.selectButton}
                    style={{ marginTop: "24px" }}
                    onClick={() => {
                      setImportStage("Two");
                    }}
                  >
                    Import NFT From Your Wallet
                  </Button>
                  <Button
                    className={styles.selectButton}
                    onClick={() => {
                      bgRef.current?.click?.();
                    }}
                    style={{ marginTop: "16px" }}
                  >
                    Create New NFT
                  </Button>
                </div>
              )}

              {importStage === "Two" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      marginBottom: "24px",
                    }}
                  >
                    Import Your NFT
                  </div>
                  <div
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                  >
                    Enter the contract address and token ID to import your NFT
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      padding: "0 55px",
                    }}
                  >
                    <div style={{ margin: "15px 0" }}>Select a mainet *</div>

                    <Select
                      className="blackSelect"
                      placeholder="Select a network"
                      style={{ width: "240px" }}
                      options={nftNetworks}
                      onChange={async val => {
                        await switchNetworkAsync?.(val);
                      }}
                    ></Select>

                    <div style={{ margin: "15px 0" }}>Contract Address *</div>

                    <Input
                      className="blackInput"
                      value={importContractAddress}
                      onChange={v => {
                        setImportContractAddress(v.target.value);
                        setNftAddress(v.target.value);
                      }}
                    ></Input>

                    <div style={{ margin: "15px 0" }}>Token ID *</div>

                    <Input
                      className="blackInput"
                      value={importTokenId}
                      onChange={v => {
                        setImportTokenId(v.target.value);
                      }}
                    ></Input>
                  </div>

                  <div
                    style={{
                      padding: "0 55px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Button
                      className="linearButton"
                      style={{
                        marginTop: "36px",
                        width: "100%",
                        height: "48px",
                      }}
                      loading={checkOwnLoading}
                      onClick={async () => {
                        setCheckOwnLoading(true);

                        try {
                          const data = await caller[1].ownerOf(importTokenId);

                          if (
                            data.toLowerCase() ===
                            account.address?.toLowerCase()
                          ) {
                            const tokenURIBase64 = await caller[1].tokenURI(
                              importTokenId
                            );

                            const jsonData = JSON.parse(
                              Buffer.from(
                                tokenURIBase64.split(",")[1],
                                "base64"
                              ).toString()
                            );

                            setImportURI(jsonData.image);
                            setImportImageMetaData(jsonData);
                            setImportStage("Three");
                          } else {
                            messageBox.error("This is not your nft");
                          }
                        } finally {
                          setCheckOwnLoading(false);
                        }
                      }}
                    >
                      Start Import
                    </Button>
                  </div>
                </div>
              )}

              {importStage === "Three" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      marginBottom: "24px",
                    }}
                  >
                    Signing Message
                  </div>

                  <div
                    style={{
                      display: "flex",
                      background: "#494B60",
                    }}
                  >
                    <img
                      src={importURI}
                      alt=""
                      style={{ width: "240px", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "360px",
                        padding: "36px 30px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "20px",
                          lineHeight: "30px",
                          fontWeight: 600,
                          marginBottom: 36,
                        }}
                      >
                        {importImageMetaData.name}
                      </span>
                      <span
                        style={{
                          opacity: 0.8,
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "600",
                        }}
                      >
                        Contract Address: {importContractAddress}
                      </span>
                      <span
                        style={{
                          opacity: 0.8,
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "600",
                          margin: "16px 0",
                        }}
                      >
                        Token ID: {importTokenId}
                      </span>
                      <span
                        style={{
                          opacity: 0.8,
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "600",
                        }}
                      >
                        Owner: {account.address}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      margin: "24px 0",
                    }}
                  >
                    Please sign the message in your wallet to continue.
                  </div>

                  <div
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                  >
                    By signing this message, you agree to license your NFT
                    intellectual property rights to the BitSoul Protocol to
                    publish new dNFTs.
                  </div>

                  <div
                    style={{
                      padding: "0 55px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Button
                      className="linearButton"
                      style={{
                        marginTop: "36px",
                        width: "100%",
                        height: "48px",
                      }}
                      loading={signLoading}
                      onClick={async () => {
                        setSignLoading(true);

                        try {
                          const msg = `
                          ${importImageMetaData.name}
                          Contract Address: ${importContractAddress}
                          Token ID: ${importTokenId}
                          Owner: ${account.address}
                          `;
                          const signMsg = await signMessageAsync({
                            message: msg,
                          });

                          const res = await signLog({
                            content: msg,
                            sign: signMsg,
                          });

                          if (res.err_code === 0) {
                            form.setFieldValue("media", importURI);
                            form.setFieldValue(
                              "name",
                              importImageMetaData.name
                            );
                            form.setFieldValue(
                              "description",
                              importImageMetaData.description
                            );
                            await reset();
                          }
                        } finally {
                          setSignLoading(false);
                        }
                      }}
                    >
                      Sign
                    </Button>
                  </div>
                </div>
              )}
            </>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default CreateMyHub;

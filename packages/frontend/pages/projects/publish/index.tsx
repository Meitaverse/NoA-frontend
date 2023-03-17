import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import Upload from "@/components/upload";
import { useManagerContract } from "@/hooks/useManagerContract";
import { useUserInfo } from "@/hooks/useUserInfo";
import messageBox from "@/components/messageBox";
import { useAccount } from "wagmi";
import { useUpdate } from "ahooks";
import { createHub } from "@/services/hub";
import { useTransctionPending } from "@/hooks/useTransctionPending";
import { waitForSomething } from "@/utils/waitForSomething";
import {
  CurrencyWhitelist,
  ICurrencyWhiteList,
  TreasuryFee,
} from "@/services/graphql";
import { toSoul } from "@/utils/toSoul";
import { CaretDownOutlined } from "@ant-design/icons";

interface IProps {}
// 临时方案
const tempCurLabel = {
  "0x04c89607413713ec9775e14b954286519d836fef": "SBT",
  "0x82e01223d51eb87e16a03e24687edf0f294da6f1": "ETH",
};

const CreateMyHub: FC<IProps> = props => {
  const bgRef = useRef<HTMLInputElement>(null);

  const account = useAccount();
  const update = useUpdate();
  const [form] = Form.useForm();
  const [manager] = useManagerContract();
  const [userInfo] = useUserInfo();
  const refreshTrans = useTransctionPending();

  // 位
  const [fee, setFee] = useState<number>(0);
  const [curSelectCurrency, setCurSelectCurrency] = useState("");
  const [currencyList, setCurrencyList] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTrans, setLoadingTrans] = useState(false);

  const getFeeSetting = async () => {
    const { data } = await TreasuryFee();

    if (data?.treasuryFeeRecord?.newTreasuryFee) {
      setFee(data.treasuryFeeRecord.newTreasuryFee);
    }
  };

  const getCurCurrencry = async () => {
    const { data } = await CurrencyWhitelist();

    console.log(
      data.currencyWhitelists
        .filter(i => i.whitelisted)
        .map(i => {
          return {
            value: i.currency,
            label: tempCurLabel[i.currency],
          };
        })
    );

    setCurrencyList(
      data.currencyWhitelists
        .filter(i => i.whitelisted)
        .map(i => {
          return {
            value: i.currency,
            label: tempCurLabel[i.currency],
          };
        })
    );
  };

  useEffect(() => {
    getFeeSetting();
    getCurCurrencry();
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
                initialValue={false}
                style={{ marginLeft: "67px" }}
              >
                <div className={styles.formItem}>
                  <span className={styles.formItemDesc}>description</span>

                  <Radio.Group
                    value={form.getFieldValue("issueMethod")}
                    onChange={v => {
                      form.setFieldValue("issueMethod", v);
                      update();
                    }}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Radio value={true}>Paid Mint</Radio>
                    <Radio value={false} style={{ marginTop: "15px" }}>
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

            <Form.Item name="time" label="Start & End Time">
              <div className={styles.formItem}>
                <DatePicker.RangePicker
                  separator={"to"}
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

            <Form.Item label="Royalties">
              <div className={styles.formItem} style={{ color: "#fff" }}>
                <span className={styles.formItemDesc}>
                  Earning receive for every sale
                </span>
              </div>
            </Form.Item>

            <Form.Item name="publish">
              <div
                className={styles.formItem}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "160px",
                    marginRight: 20,
                    flexShrink: 0,
                    color: "#fff",
                  }}
                >
                  Publisher(You)
                </span>
                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("publish")}
                  onChange={e => {
                    form.setFieldValue("publish", e.target.value);
                    update();
                  }}
                  suffix={"%"}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="owner">
              <div
                className={styles.formItem}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "160px",
                    marginRight: 20,
                    flexShrink: 0,
                    color: "#fff",
                  }}
                >
                  Owner
                </span>
                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("owner")}
                  onChange={e => {
                    form.setFieldValue("owner", e.target.value);
                    update();
                  }}
                  suffix={"%"}
                ></Input>
              </div>
            </Form.Item>

            <Form.Item name="community">
              <div
                className={styles.formItem}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "160px",
                    marginRight: 20,
                    flexShrink: 0,
                    color: "#fff",
                  }}
                >
                  Community(BitSoul)
                </span>
                <Input
                  placeholder="eg: MAYC Family"
                  className={styles.formInput}
                  value={form.getFieldValue("community")}
                  onChange={e => {
                    form.setFieldValue("community", e.target.value);
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
              }}
            >
              {loadingTrans
                ? "Transaction Pending"
                : loadingOne
                ? "Confirm Transaction in wallet"
                : "Pre Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateMyHub;

import { useManagerContract } from "@/hooks/useManagerContract";
import { LoadingOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  Switch,
  Radio,
  Button,
  message,
} from "antd";
import React, { FC, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";

interface IProps {}

const CreateEvent: FC<IProps> = props => {
  const account = useAccount();
  const loading = false;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const [manager] = useManagerContract();

  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");

  const create = async () => {
    if (!account.address) return;
    if (!nickname) return;
    const res = await manager.createProfile(
      {
        to: address || account.address,
        nickName: nickname,
        imageURI:
          "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      },
      {
        from: account.address,
      }
    );

    message.success("创建成功");
  };

  return (
    <div className={styles.createEvent}>
      <div className={styles.createEventBoard}>
        <Form>
          <Form.Item
            label="Upload"
            name="Upload"
            rules={[{ required: false, message: "Please upload" }]}
          >
            <Upload listType="picture-card" showUploadList={false}>
              {uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="nickName"
            name="nickName"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="toAddress"
            name="toAddress"
            rules={[{ required: false, message: "Please upload" }]}
          >
            <Input
              placeholder="default is current account address"
              value={address}
              onChange={e => {
                setAddress(e.target.value);
              }}
            ></Input>
          </Form.Item>
        </Form>

        <div style={{ display: "flex" }}>
          <Button>Cancel</Button>
          <Button
            style={{ marginLeft: "8px" }}
            onClick={() => {
              create();
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateEvent;

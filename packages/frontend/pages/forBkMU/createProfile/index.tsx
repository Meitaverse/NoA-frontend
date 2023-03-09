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
  Table,
} from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import { getProfile, IGetProfile } from "@/services/graphql";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import messageBox from "@/components/messageBox";
interface IProps {}

const columns: ColumnsType<IGetProfile["profiles"][number]> = [
  {
    title: "soulBoundTokenId",
    dataIndex: "soulBoundTokenId",
  },
  {
    title: "creator",
    dataIndex: "creator",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "nickName",
    dataIndex: "nickName",
  },
  {
    title: "timestamp",
    dataIndex: "timestamp",
    render: (text: string) => (
      <div>{dayjs(Number(text) * 1000).format("YYYY-MM-DD hh:mm")}</div>
    ),
  },
];

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
  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);

  const cycle = useRef<ReturnType<typeof setInterval>>();

  const create = async () => {
    if (!account.address) return;
    if (!nickname) return;

    try {
      const res = await manager.createProfile(
        {
          wallet: account.address,
          nickName: nickname,
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        },
        {
          from: account.address,
        }
      );
      messageBox.success("创建成功");

      setTimeout(() => {
        getProfileResult();
      }, 1500);
    } catch (e) {
      console.error(e);
      console.warn("检查地址是否正确");
      console.warn(
        "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
  };

  const getProfileResult = async () => {
    const res = await getProfile();
    setProfiles(res.data.profiles);
  };

  useEffect(() => {
    getProfileResult();

    cycle.current = setInterval(() => {
      getProfileResult();
    }, 1000);

    return () => {
      clearInterval(cycle.current);
    };
  }, []);

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

      <br />

      <div>
        <Table rowKey="eventId" dataSource={profiles} columns={columns}></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

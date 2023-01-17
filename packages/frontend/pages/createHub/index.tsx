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
import { getHubs, getProfile, IGetHubs, IGetProfile } from "@/services/graphql";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useModuleGlobalContract } from "@/hooks/useModuleGlobalContract";
interface IProps {}

const columns: ColumnsType<IGetHubs["hubs"][number]> = [
  {
    title: "hubId",
    dataIndex: "hubId",
  },
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
    title: "name",
    dataIndex: "name",
  },
  {
    title: "description",
    dataIndex: "description",
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
  const [_, moduleGlobalProv] = useModuleGlobalContract();

  const [name, setName] = useState("bitSoul");
  const [description, setDescription] = useState("Bitsoulhub");
  const [soulBoundTokenId, setSoulBoundTokenId] = useState("");
  const [address, setAddress] = useState("");
  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [hubs, setHubs] = useState<IGetHubs["hubs"]>([]);
  const cycle = useRef<ReturnType<typeof setInterval>>();
  const create = async () => {
    if (!account.address) return;
    if (!name) return;
    if (!description) return;
    if (!soulBoundTokenId) return;
    try {
      const res = await manager.createHub(
        {
          soulBoundTokenId,
          name,
          description,
          imageURI:
            "https://ipfs.io/ipfs/QmVnu7JQVoDRqSgHBzraYp7Hy78HwJtLFi6nUFCowTGdzp/11.png",
        },
        {
          from: account.address,
        }
      );

      message.success("创建成功");
    } catch (e) {
      message.error("创建失败，该账号可能未加入白名单");
      console.error(e);
      console.warn(
        "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
  };

  const getProfileResult = async () => {
    const res = await getProfile({});

    const filterd: IGetProfile["profiles"] = [];

    for (let item of res.data.profiles) {
      const isHubCreator = await moduleGlobalProv.isWhitelistHubCreator(
        item.soulBoundTokenId,
        {
          from: account.address,
        }
      );

      if (isHubCreator) {
        filterd.push(item);
      }
    }

    setProfiles(filterd);
  };

  const getHubsResult = async () => {
    const res = await getHubs({});
    setHubs(res.data.hubs);
  };

  useEffect(() => {
    getProfileResult();
    getHubsResult();
    cycle.current = setInterval(() => {
      getHubsResult();
    }, 500);

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
            label="soulBoundToken"
            name="soulBoundToken"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setSoulBoundTokenId(val);
              }}
              options={profiles.map(item => {
                return {
                  value: item.soulBoundTokenId,
                  label: item.nickName,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="hub name"
            name="hub name"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              value={name}
              onChange={e => {
                setName(e.target.value);
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
        <Table rowKey="eventId" dataSource={hubs} columns={columns}></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

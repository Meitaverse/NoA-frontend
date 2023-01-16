import { useManagerContract } from "@/hooks/useManagerContract";
import { LoadingOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload, Button, message, Table } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import {
  getHubs,
  getProfile,
  getProjects,
  IGetHubs,
  IGetProfile,
  IGetProjects,
} from "@/services/graphql";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
interface IProps {}

const columns: ColumnsType<IGetProjects["projects"][number]> = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "projectId",
    dataIndex: "projectId",
  },
  {
    title: "soulBoundTokenId",
    dataIndex: "soulBoundTokenId",
  },
  {
    title: "derivativeNFT",
    dataIndex: "derivativeNFT",
  },
  {
    title: "timestamp",
    dataIndex: "timestamp",
    render: (text: string) => (
      <div>{dayjs(Number(text) * 1000).format("YYYY-MM-DD hh:mm")}</div>
    ),
  },
];

// soulBoundTokenId: SECOND_PROFILE_ID,
// hubId: FIRST_HUB_ID,
// name: "bitsoul",
// description: "Hub for bitsoul",
// image: "image",
// metadataURI: "metadataURI",
// descriptor: metadataDescriptor.address,
// defaultRoyaltyPoints: 0,
// feeShareType: 0,

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

  const [name, setName] = useState("bitSoul");
  const [description, setDescription] = useState("Bitsoulhub");
  const [metadataURI, setMetadataURI] = useState("Bitsoulhub");
  const [defaultRoyaltyPoints, setDefaultRoyaltyPoints] = useState("0");
  const [feeShareType, setFeeShareType] = useState("0");
  const [soulBoundTokenId, setSoulBoundTokenId] = useState("");
  const [hubId, setHubId] = useState("");
  const [address, setAddress] = useState("");

  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [hubs, setHubs] = useState<IGetHubs["hubs"]>([]);
  const [projects, setProjects] = useState<IGetProjects["projects"]>([]);

  const cycle = useRef<ReturnType<typeof setInterval>>();

  const create = async () => {
    if (!account.address) return;
    if (!name) return;
    if (!description) return;
    if (!soulBoundTokenId) return;
    try {
      const res = await manager.createProject(
        {
          hubId,
          soulBoundTokenId,
          name,
          description,
          descriptor: account.address,
          image:
            "https://ipfs.io/ipfs/QmVnu7JQVoDRqSgHBzraYp7Hy78HwJtLFi6nUFCowTGdzp/11.png",
          metadataURI,
          defaultRoyaltyPoints,
          feeShareType,
        },
        {
          from: account.address,
        }
      );

      message.success("创建成功");
      setTimeout(() => getProjectsResult(), 1500);
    } catch (e) {
      console.error(e);
      console.warn(
        "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
  };

  const getProfileResult = async () => {
    const res = await getProfile({});

    setProfiles(res.data.profiles);
  };

  const getHubsResult = async () => {
    const res = await getHubs({});

    setHubs(res.data.hubs);
  };

  const getProjectsResult = async () => {
    const res = await getProjects({});

    setProjects(res.data.projects);
  };

  useEffect(() => {
    getProfileResult();
    getHubsResult();
    getProjectsResult();

    cycle.current = setInterval(() => {
      getProjectsResult();
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
            label="Hub"
            name="Hub"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setHubId(val);
              }}
              options={hubs.map(item => {
                return {
                  value: item.hubId,
                  label: item.name,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="nickName"
            name="nickName"
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
            label="metadataURI"
            name="metadataURI"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              value={metadataURI}
              onChange={e => {
                setMetadataURI(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="defaultRoyaltyPoints"
            name="defaultRoyaltyPoints"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={defaultRoyaltyPoints}
              onChange={e => {
                setDefaultRoyaltyPoints(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="feeShareType"
            name="feeShareType"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={feeShareType}
              onChange={e => {
                setFeeShareType(e.target.value);
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
        <Table rowKey="eventId" dataSource={projects} columns={columns}></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

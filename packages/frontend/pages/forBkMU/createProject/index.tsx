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
import messageBox from "@/components/messageBox";
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
          // @ts-ignore
          feeShareType,
        },
        {
          from: account.address,
        }
      );

      messageBox.success("创建成功");
      setTimeout(() => getProjectsResult(), 1500);
    } catch (e) {
      console.error(e);
      console.warn(
        "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
  };

  const getProfileResult = async () => {
    const res = await getProfile();

    setProfiles(res.data.profiles);
  };

  const getHubsResult = async () => {
    const res = await getHubs({});
    setHubs(res.data.hubs);
  };

  const getProjectsResult = async () => {
    // const res = await getProjects({});
    // setProjects(res.data.projects);
  };

  useEffect(() => {
    getProfileResult();
    getHubsResult();
    getProjectsResult();

    cycle.current = setInterval(() => {
      getProjectsResult();
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
            label="soulBoundToken"
            name="soulBoundToken"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setSoulBoundTokenId(val);
              }}
              options={profiles
                .filter(item => {
                  return (
                    item.wallet.toLowerCase() === account.address?.toLowerCase()
                  );
                })
                .map(item => {
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
            label="project name"
            name="project name"
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
            <Select
              value={metadataURI}
              onChange={item => {
                setMetadataURI(item);
              }}
              options={[
                {
                  value:
                    "https://img1.baidu.com/it/u=38231409,2215725747&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
                  label: (
                    <img
                      src="https://img1.baidu.com/it/u=38231409,2215725747&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
                      style={{ width: "140px" }}
                    />
                  ),
                },
                {
                  value:
                    "https://upload.pig66.com/uploadfile/2017/0511/20170511075802322.jpg",
                  label: (
                    <img
                      src="https://upload.pig66.com/uploadfile/2017/0511/20170511075802322.jpg"
                      style={{ width: "140px" }}
                    />
                  ),
                },
                {
                  value:
                    "https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
                  label: (
                    <img
                      src="https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
                      style={{ width: "140px" }}
                    />
                  ),
                },
                {
                  value:
                    "https://img1.baidu.com/it/u=1960110688,1786190632&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281",
                  label: (
                    <img
                      src="https://img1.baidu.com/it/u=1960110688,1786190632&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281"
                      style={{ width: "140px" }}
                    />
                  ),
                },
              ]}
            ></Select>
            {/* <Input
              value={metadataURI}
              onChange={e => {
                setMetadataURI(e.target.value);
              }}
            ></Input> */}
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

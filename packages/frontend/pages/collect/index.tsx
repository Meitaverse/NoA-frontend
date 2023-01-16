import { useManagerContract } from "@/hooks/useManagerContract";
import { LoadingOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload, Button, message, Table } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import {
  getCollectHistory,
  getHubs,
  getPreparePublish,
  getProfile,
  getProjects,
  getPublishHistory,
  IGetCollectHistory,
  IGetHubs,
  IGetPreparePublish,
  IGetProfile,
  IGetProjects,
  IGetPublishHistory,
} from "@/services/graphql";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { FEE_ADDRESS, PUBLISH_ADDRESS, TEMPLATE_ADDRESS } from "@/config";
import { AbiCoder, defaultAbiCoder } from "ethers/lib/utils";
interface IProps {}

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

  const [name, setName] = useState("BitSoul");
  const [amount, setAmount] = useState("0");
  const [salePrice, setSalePrice] = useState("10");
  const [royaltyBasisPoints, setRoyaltyBasisPoints] = useState("50");
  const [description, setDescription] = useState("Bitsoulhub");
  const [metadataURI, setMetadataURI] = useState("Bitsoulhub");
  const [defaultRoyaltyPoints, setDefaultRoyaltyPoints] = useState("0");
  const [collectValue, setCollectValue] = useState("0");
  const [soulBoundTokenId, setSoulBoundTokenId] = useState("");
  const [publishId, setPublishId] = useState("");
  const cycle = useRef<ReturnType<typeof setInterval>>();
  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [publishes, setPublishes] = useState<
    IGetPublishHistory["publishCreatedHistories"]
  >([]);
  const [collect, setCollect] = useState<
    IGetCollectHistory["feesForCollectHistories"]
  >([]);

  const columnsPublish: ColumnsType<
    IGetCollectHistory["feesForCollectHistories"][number]
  > = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "collectorSoulBoundTokenId",
      dataIndex: "collectorSoulBoundTokenId",
    },
    {
      title: "publishId",
      dataIndex: "publishId",
    },
    {
      title: "treasuryAmount",
      dataIndex: "treasuryAmount",
    },
    {
      title: "genesisAmount",
      dataIndex: "genesisAmount",
    },
    {
      title: "adjustedAmount",
      dataIndex: "adjustedAmount",
    },
    {
      title: "timestamp",
      dataIndex: "timestamp",
      render: (text: string) => (
        <div>{dayjs(Number(text) * 1000).format("YYYY-MM-DD hh:mm")}</div>
      ),
    },
  ];

  const create = async () => {
    if (!account.address) return;
    if (!name) return;
    if (!description) return;
    if (!soulBoundTokenId) return;
    try {
      const res = await manager.collect(
        {
          publishId,
          collectorSoulBoundTokenId: soulBoundTokenId,
          collectValue,
          data: [],
        },
        {
          from: account.address,
        }
      );

      message.success("collect成功");
      getCollectResult();
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

  const getPublishResult = async () => {
    const res = await getPublishHistory({});

    setPublishes(res.data.publishCreatedHistories);
  };

  const getCollectResult = async () => {
    const res = await getCollectHistory({});

    setCollect(res.data.feesForCollectHistories);
  };

  useEffect(() => {
    getProfileResult();
    getPublishResult();
    getCollectResult();

    cycle.current = setInterval(() => {
      getCollectResult();
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
            label="collectId"
            name="collectId"
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
            label="PublishId"
            name="PublishId"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setPublishId(val);
              }}
              options={publishes.map(item => {
                return {
                  value: item.publishId,
                  label: item.publishId,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="collectValue"
            name="collectValue"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={collectValue}
              onChange={e => {
                setCollectValue(e.target.value);
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
            collect
          </Button>
        </div>
      </div>

      <br />

      <div>
        <Table
          rowKey="eventId"
          dataSource={collect}
          columns={columnsPublish}
        ></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

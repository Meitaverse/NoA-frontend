import { useManagerContract } from "@/hooks/useManagerContract";
import { LoadingOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload, Button, message, Table } from "antd";
import React, { FC, useEffect, useState } from "react";
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
import {
  DERIVATIVE_ADDRESS,
  FEE_ADDRESS,
  MANAGER_ADDRESS,
  PUBLISH_ADDRESS,
  TEMPLATE_ADDRESS,
} from "@/config";
import { AbiCoder, defaultAbiCoder } from "ethers/lib/utils";
import { useDerivative } from "@/hooks/useDerivativeContact";
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
  const [derivative] = useDerivative();

  const [name, setName] = useState("BitSoul");
  const [amount, setAmount] = useState("0");
  const [salePrice, setSalePrice] = useState("10");
  const [royaltyBasisPoints, setRoyaltyBasisPoints] = useState("50");
  const [description, setDescription] = useState("Bitsoulhub");
  const [metadataURI, setMetadataURI] = useState("Bitsoulhub");
  const [defaultRoyaltyPoints, setDefaultRoyaltyPoints] = useState("0");
  const [feeShareType, setFeeShareType] = useState("0");
  const [soulBoundTokenId, setSoulBoundTokenId] = useState("");
  const [hubId, setHubId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [address, setAddress] = useState("");
  const [materialURIs, setMaterialURIs] = useState([]);
  const [fromTokenIds, setFromTokenIds] = useState<any[]>([]);

  const [collect, setCollect] = useState<
    IGetCollectHistory["feesForCollectHistories"]
  >([]);

  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [hubs, setHubs] = useState<IGetHubs["hubs"]>([]);
  const [projects, setProjects] = useState<IGetProjects["projects"]>([]);
  const [publishes, setPublishes] = useState<
    IGetPublishHistory["publishCreatedHistories"]
  >([]);

  const [preparePublish, setPreparePublish] = useState<
    IGetPreparePublish["publications"]
  >([]);

  const columns: ColumnsType<IGetPreparePublish["publications"][number]> = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "publishId",
      dataIndex: "publishId",
    },
    {
      title: "hubId",
      dataIndex: "hubId",
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
      title: "name",
      dataIndex: "name",
    },
    {
      title: "amount",
      dataIndex: "amount",
    },
    {
      title: "timestamp",
      dataIndex: "timestamp",
      render: (text: string) => (
        <div>{dayjs(Number(text) * 1000).format("YYYY-MM-DD hh:mm")}</div>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (val, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                publish(record);
              }}
              disabled={
                !!publishes.find(item => item.publishId === record.publishId)
              }
            >
              Publish
            </Button>
          </div>
        );
      },
    },
  ];

  const columnsPublish: ColumnsType<
    IGetPublishHistory["publishCreatedHistories"][number]
  > = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "publishId",
      dataIndex: "publishId",
    },
    {
      title: "hubId",
      dataIndex: "hubId",
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
      title: "amount",
      dataIndex: "amount",
    },
    {
      title: "timestamp",
      dataIndex: "timestamp",
      render: (text: string) => (
        <div>{dayjs(Number(text) * 1000).format("YYYY-MM-DD hh:mm")}</div>
      ),
    },
  ];

  const publish = async (
    record: IGetPreparePublish["publications"][number]
  ) => {
    try {
      const res = await manager.publish(record.publishId, {
        from: account.address,
      });

      message.success("发布成功");
      setTimeout(() => {
        getPublishResult();
      }, 1500);
    } catch (e) {
      console.error(e);
      message.error("发布失败，可能余额不足，需充值");
    }
  };

  const create = async () => {
    if (!account.address) return;
    if (!name) return;
    if (!description) return;
    if (!soulBoundTokenId) return;

    const collectModuleInitData = defaultAbiCoder.encode(
      ["uint256", "uint16", "uint256", "uint256"],
      [2, "0", salePrice, royaltyBasisPoints]
    );

    const publishModuleInitData = defaultAbiCoder.encode(
      ["address", "uint256"],
      [TEMPLATE_ADDRESS, 1]
    );

    try {
      const res = await manager.prePublish(
        {
          soulBoundTokenId,
          hubId,
          projectId,
          amount,
          salePrice,
          royaltyBasisPoints,
          name,
          description,
          materialURIs,
          fromTokenIds,

          collectModule: FEE_ADDRESS,
          collectModuleInitData: collectModuleInitData,
          publishModule: PUBLISH_ADDRESS,
          publishModuleInitData: publishModuleInitData,
        },
        {
          from: account.address,
        }
      );

      message.success("预发布成功");
      setTimeout(() => {
        getPreparePublishResult();
      }, 1500);
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

  const getPublishResult = async () => {
    const res = await getPublishHistory({});

    setPublishes(res.data.publishCreatedHistories);
  };

  const getPreparePublishResult = async () => {
    const res = await getPreparePublish({});

    setPreparePublish(res.data.publications);
  };

  const getCollectResult = async () => {
    const res = await getCollectHistory({});

    setCollect(res.data.feesForCollectHistories);
  };

  const approve = async () => {
    const res = await derivative.setApprovalForAll(DERIVATIVE_ADDRESS, true, {
      from: account.address,
    });

    message.success("approve成功");
  };

  useEffect(() => {
    getProfileResult();
    getHubsResult();
    getProjectsResult();
    getPublishResult();
    getPreparePublishResult();
    getCollectResult();
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
            label="project"
            name="project"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setProjectId(val);
              }}
              options={projects.map(item => {
                return {
                  value: item.projectId,
                  label: item.id,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="from tokens"
            name="from tokens"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setFromTokenIds([val]);
              }}
              options={collect.map(item => {
                return {
                  value: 2,
                  label: 2,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="amount"
            name="amount"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="salePrice"
            name="salePrice"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={salePrice}
              onChange={e => {
                setSalePrice(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="royaltyBasisPoints"
            name="royaltyBasisPoints"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={royaltyBasisPoints}
              onChange={e => {
                setRoyaltyBasisPoints(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="name"
            name="name"
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
            prepare Publish
          </Button>
          <Button onClick={approve}>approve</Button>
        </div>
      </div>

      <br />

      <div>
        <h1>prepare publish</h1>
        <Table
          rowKey="eventId"
          dataSource={preparePublish}
          columns={columns}
        ></Table>
      </div>

      <div>
        <h1>published</h1>
        <Table
          rowKey="eventId"
          dataSource={publishes}
          columns={columnsPublish}
        ></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

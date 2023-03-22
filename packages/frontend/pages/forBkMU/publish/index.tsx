// @ts-nocheck
import { useManagerContract } from "@/hooks/useManagerContract";
import { LoadingOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload, Button, message, Table } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import {
  getCollectHistory,
  getDerivativeNFTAssets,
  getHubs,
  getPreparePublish,
  getProfile,
  getProjects,
  getPublishHistory,
  IGetCollectHistory,
  IGetDerivativeNFTAssets,
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
  SBT_ADDRESS,
  TEMPLATE_ADDRESS,
} from "@/config";
import { AbiCoder, defaultAbiCoder } from "ethers/lib/utils";
import { useDerivative } from "@/hooks/useDerivativeContact";
import messageBox from "@/components/messageBox";

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
    IGetPublishHistory["publishRecords"]
  >([]);

  const [preparePublish, setPreparePublish] = useState<
    IGetPreparePublish["publications"]
  >([]);

  const [NFTAssets, setNFTAssets] = useState<
    IGetDerivativeNFTAssets["derivativeNFTAssets"]
  >([]);

  const [collectModuleSBTID, setCollectModuleSBTID] = useState("");

  const cycle = useRef<ReturnType<typeof setInterval>>();

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
    IGetPublishHistory["publishRecords"][number]
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

      messageBox.success("发布成功");
      setTimeout(() => {
        getPublishResult();
      }, 1500);
    } catch (e) {
      console.error(e);
      messageBox.error("发布失败，可能余额不足，需充值");
    }
  };

  const create = async () => {
    // if (!account.address) return;
    // if (!name) return;
    // if (!description) return;
    // if (!soulBoundTokenId) return;

    // if (preparePublish.find(x => x.name === name)) {
    //   messageBox.error("已有相同名称，请更换名称");
    //   return;
    // }

    const collectModuleInitData = defaultAbiCoder.encode(
      ["uint256", "uint16", "uint16"],
      [10, 50, 0]
    );

    const publishModuleInitData = defaultAbiCoder.encode(
      ["address", "uint256"],
      [TEMPLATE_ADDRESS, 1]
    );

    const res = await manager.prePublish(
      {
        soulBoundTokenId,
        hubId,
        projectId,
        salePrice,
        royaltyBasisPoints,
        currency: SBT_ADDRESS,
        amount,
        name,
        description,
        canCollect: true,
        materialURIs: [],
        fromTokenIds: [],
        collectModule: FEE_ADDRESS,
        publishModule: PUBLISH_ADDRESS,
        collectModuleInitData: collectModuleInitData,
        publishModuleInitData: publishModuleInitData,
      },
      {
        from: account.address,
      }
    );

    messageBox.success("预发布成功");
    //   setTimeout(() => {
    //     getPreparePublishResult();
    //   }, 1500);
    // } catch (e) {
    //   console.error(e);
    //   console.warn(
    //     "按照里面的方法重置一下钱包：https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
    //   );
    // }
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
    const res = await getProjects({});

    setProjects(res.data.projects);
  };

  const getPublishResult = async () => {
    // const res = await getPublishHistory({});
    // setPublishes(res.data.publishRecords);
  };

  const getPreparePublishResult = async () => {
    const res = await getPreparePublish({});

    setPreparePublish(res.data.publications);
  };

  const getCollectResult = async () => {
    // const res = await getCollectHistory({});
    // setCollect(res.data.feesForCollectHistories);
  };

  const getNFTAssets = async () => {
    // const res = await getDerivativeNFTAssets({});
    // setNFTAssets(
    //   res.data.derivativeNFTAssets.filter(val => {
    //     return (
    //       val.wallet.toLowerCase() === account.address?.toLowerCase() &&
    //       +val.value > 0
    //     );
    //   })
    // );
  };

  const approve = async () => {
    const res = await derivative.setApprovalForAll(DERIVATIVE_ADDRESS, true, {
      from: account.address,
    });

    messageBox.success("approve成功");
  };

  useEffect(() => {
    getProfileResult();
    getHubsResult();
    getProjectsResult();
    getPublishResult();
    getPreparePublishResult();
    getCollectResult();
    getNFTAssets();
    cycle.current = setInterval(() => {
      getPreparePublishResult();
      getPublishResult();
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
            <Select
              value={materialURIs}
              onChange={items => {
                setMaterialURIs(items);
              }}
              mode="multiple"
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

          <div>二创需填写字段：</div>

          <Form.Item label="from tokens" name="from tokens">
            <Select
              onChange={val => {
                setFromTokenIds([val]);
              }}
              options={NFTAssets.map(item => {
                return {
                  value: item.tokenId,
                  label: `${item.tokenId} - pubid: ${item.publishId}`,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="collectSoulBoundTokenId(选择一创对应的sbt)"
            name="collectSoulBoundTokenId"
          >
            <Select
              onChange={val => {
                setCollectModuleSBTID(val);
              }}
              options={profiles.map(item => {
                return {
                  value: item.soulBoundTokenId,
                  label: item.nickName,
                };
              })}
            ></Select>
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
          <Button onClick={approve} style={{ marginLeft: "10px" }}>
            二创需要先 approve
          </Button>
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

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
import React, { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import {
  getHubs,
  getMintSBTValueHistories,
  getProfile,
  IGetHubs,
  IGetMintSBTValueHistories,
  IGetProfile,
} from "@/services/graphql";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { profile } from "console";
interface IProps {}

const columns: ColumnsType<
  IGetMintSBTValueHistories["mintSBTValueHistories"][number]
> = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "soulBoundTokenId",
    dataIndex: "soulBoundTokenId",
  },
  {
    title: "value",
    dataIndex: "value",
    render: (text: string) => <a>{text}</a>,
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

  const [name, setName] = useState("bitSoul");
  const [description, setDescription] = useState("Bitsoulhub");
  const [selectAddress, setSelectAddress] = useState("");
  const [chargeAmount, setChargeAmount] = useState("100");
  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [mintHistories, setMintHistories] = useState<
    IGetMintSBTValueHistories["mintSBTValueHistories"]
  >([]);

  const addresses = [
    {
      value: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      label: "user",
    },
    {
      value: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      label: "userTwo",
    },
    {
      value: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      label: "userThree",
    },
  ];

  const charge = async () => {
    if (account.address !== "0x70997970C51812dc3A010C7d01b50e0d17dc79C8") {
      message.error("??????????????????Governance?????????????????????");
      return;
    }

    if (!selectAddress) return;
    try {
      const res = await manager.mintSBTValue(selectAddress, chargeAmount, {
        from: account.address,
      });

      message.success("????????????");
      getMintSBTValueResult();
    } catch (e) {
      console.error(e);
      console.warn(
        "??????????????????????????????????????????https://ethereum.stackexchange.com/questions/109625/received-invalid-block-tag-87-latest-block-number-is-0"
      );
    }
  };

  const getProfileResult = async () => {
    const res = await getProfile({});

    setProfiles(res.data.profiles);
  };

  const getMintSBTValueResult = async () => {
    const res = await getMintSBTValueHistories({});
    setMintHistories(res.data.mintSBTValueHistories);
  };

  useEffect(() => {
    getProfileResult();
    getMintSBTValueResult();
    // getHubsResult();
  }, []);

  return (
    <div className={styles.createEvent}>
      <div className={styles.createEventBoard}>
        <Form>
          <Form.Item
            label="charge account"
            name="charge account"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select
              onChange={val => {
                setSelectAddress(val);
              }}
              options={profiles.map(item => {
                return {
                  value: item.soulBoundTokenId,
                  label: item.wallet,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            label="charge amount"
            name="charge amount"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              type="number"
              value={chargeAmount}
              onChange={e => {
                setChargeAmount(e.target.value);
              }}
            ></Input>
          </Form.Item>
        </Form>

        <div style={{ display: "flex" }}>
          <Button>Cancel</Button>
          <Button
            style={{ marginLeft: "8px" }}
            onClick={() => {
              charge();
            }}
          >
            Charge
          </Button>
        </div>
      </div>

      <br />

      <div>
        <Table
          rowKey="eventId"
          dataSource={mintHistories}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
};
export default CreateEvent;

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
import { useBankTreasury } from "@/hooks/useBankTreasury";
import messageBox from "@/components/messageBox";
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

  // const [manager] = useManagerContract();
  const [bankTreasury] = useBankTreasury();

  const [name, setName] = useState("bitSoul");
  const [description, setDescription] = useState("Bitsoulhub");
  const [selectAddress, setSelectAddress] = useState("");
  const [chargeAmount, setChargeAmount] = useState("100");
  const [profiles, setProfiles] = useState<IGetProfile["profiles"]>([]);
  const [mintHistories, setMintHistories] = useState<
    IGetMintSBTValueHistories["mintSBTValueHistories"]
  >([]);

  const cycle = useRef<ReturnType<typeof setInterval>>();

  const charge = async () => {
    // if (
    //   account.address?.toLowerCase() !==
    //   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8".toLowerCase()
    // ) {
    //   messageBox.error("当前账号不是Governance账号，充值失败");
    //   return;
    // }

    if (!selectAddress) return;
    try {
      // const res = await manager.mintSBTValue(selectAddress, chargeAmount, {
      //   from: account.address,
      // });
      const res = await bankTreasury.buySBT("4", {
        value: 100000,
        from: account.address,
      });
      // {
      //   from: account.address,
      // }

      messageBox.success("充值成功");
      getMintSBTValueResult();
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

  const getMintSBTValueResult = async () => {
    const res = await getMintSBTValueHistories({});
    setMintHistories(res.data.mintSBTValueHistories);
  };

  useEffect(() => {
    getProfileResult();
    // getMintSBTValueResult();

    // cycle.current = setInterval(() => {
    //   getMintSBTValueResult();
    // }, 1000);

    return () => {
      clearInterval(cycle.current);
    };
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

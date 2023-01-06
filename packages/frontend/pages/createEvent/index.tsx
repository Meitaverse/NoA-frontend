import { useNoaContractEvent } from "@/hooks/useNoaContractEvent";
import { Manager } from "@/typechain";
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
import React, { FC } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import styles from "./index.module.scss";
import abi from "@/contracts/manager_contracts.json";

interface IProps {}

// "inputs": [
//   {
//     "components": [
//       {
//         "internalType": "address",
//         "name": "organizer",
//         "type": "address"
//       },
//       {
//         "internalType": "string",
//         "name": "eventName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventDescription",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventImage",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventMetadataURI",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256",
//         "name": "mintMax",
//         "type": "uint256"
//       }
//     ],
//     "internalType": "struct INoAV1.Event",
//     "name": "event_",
//     "type": "tuple"
//   }
// ]

const managerAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

const CreateEvent: FC<IProps> = props => {
  // const { setContract, getContract } = useNoaContract();
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const manager = useContract<Manager>({
    addressOrName: managerAddress,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const account = useAccount();
  const loading = false;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // useNoaContractEvent("EventAdded", (a, b, c, d) => {
  //   console.log(a, b, c, d);
  //   message.success("创建成功");
  // });

  const create = async () => {
    if (!account.address) return;
    const p = await manager.createProfile(
      {
        to: account.address,
        nickName: "testNickname",
        imageURI:
          "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      },
      {
        from: account.address,
      }
    );
    debugger;
    // const p = await contarct.getGovernance();
    // setContract.createProfile({
    //   to: userAddress,
    //   nickName: 'test-nickname',
    //   imageURI: "",
    // })
    // setContract.createEvent({
    //   organizer: account.address,
    //   eventName: "testName",
    //   eventDescription: "testDesc",
    //   eventImage: "no image",
    //   eventMetadataURI: "test",
    //   mintMax: 1,
    // });
    // getContract.name();
  };

  return (
    <div className={styles.createEvent}>
      <div className={styles.createEventBoard}>
        <Form>
          <Form.Item
            label="Upload"
            name="Upload"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Upload listType="picture-card" showUploadList={false}>
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Category"
            name="Category"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select></Select>
          </Form.Item>
          <Form.Item
            label="PoAP"
            name="PoAP"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Secret"
            name="Secret"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Organize"
            name="Organize"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="Time"
            name="Time"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item
            label="Where the event held"
            name="Where the event held"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Switch defaultChecked></Switch>
          </Form.Item>
          <Form.Item
            label="URL"
            name="URL"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input addonBefore="http://" defaultValue="mysite" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="Country"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Select></Select>
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Warning with prefix"
            />
          </Form.Item>
          <Form.Item
            label="Image contribution"
            name="Image contribution"
            rules={[{ required: true, message: "Please upload" }]}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Radio>
                <span>Time limit，until</span>
                <DatePicker></DatePicker>
              </Radio>
              <Radio>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ flexShrink: 0 }}>Contributor limit</span>
                  <Input></Input>
                </div>
              </Radio>
              <Radio>
                <span>No limit</span>
              </Radio>
            </div>
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

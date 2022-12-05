import { useNoaContract } from "@/hooks/useNoaContract";
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
} from "antd";
import React, { FC } from "react";
import styles from "./index.module.scss";

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

const CreateEvent: FC<IProps> = props => {
  const { setContract, getContract } = useNoaContract();
  const loading = false;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const create = () => {
    setContract.createEvent({
      components: [
        // {
        //   organizer: "test",
        //   eventName: "testName",
        //   eventDescription: "testDesc",
        //   eventImage: "no image",
        //   eventMetadataURI: "test",
        //   mintMax: 1,
        // },
        {
          organizer: "test",
        },
        {
          eventName: "testName",
        },
        {
          eventDescription: "testDesc",
        },
        {
          eventImage: "no image",
        },
        {
          eventMetadataURI: "test",
        },
        {
          mintMax: 1,
        },
      ],
    });
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
            Creat
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateEvent;

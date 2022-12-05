import {
  FullscreenOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Table } from "antd";
import React, { FC, useState } from "react";
import styles from "./index.module.scss";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
interface IProps {}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sidney No. 1 Lake Park",
  },
];

const EventTable: FC<IProps> = props => {
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );

  const router = useRouter();

  return (
    <div className={styles.eventTable}>
      <div className={styles.filter}>
        <div className={styles.filterItem}>
          <span className={styles.filterItemLabel}>
            Event Name <QuestionCircleOutlined />:
          </span>

          <Input placeholder="Please enter"></Input>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterItemLabel}>Description:</span>

          <Input placeholder="Please enter"></Input>
        </div>

        <Button>Reset</Button>
        <Button type="primary" style={{ marginLeft: "8px" }}>
          Query
        </Button>
      </div>

      <div className={styles.contentTable}>
        <div className={styles.contentTableHeader}>
          <span>Event Table</span>
          <span style={{ flex: 1 }}></span>
          <Select
            defaultValue="Event Name"
            bordered={false}
            options={[
              {
                value: "Event Name",
                label: "Event Name",
              },
            ]}
          ></Select>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{ marginLeft: "16px" }}
            onClick={() => {
              router.push("/createEvent");
            }}
          >
            Create New Event
          </Button>
          <RedoOutlined style={{ margin: "0 16px" }} />
          <FullscreenOutlined />
        </div>

        <Table
          rowSelection={{
            type: selectionType,
          }}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
};
export default EventTable;

import {
  FullscreenOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Table } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import {
  getEventList,
  IGetEventList,
  IGetEventListParams,
} from "@/services/graphql";

interface IProps {}

// eventDescription: string,
//     eventId: string,
//     eventName: string,
//     id: string

const columns: ColumnsType<IGetEventList["eventItems"][number]> = [
  {
    title: "eventId",
    dataIndex: "eventId",
  },
  {
    title: "eventName",
    dataIndex: "eventName",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "eventDescription",
    dataIndex: "eventDescription",
  },
];

const EventTable: FC<IProps> = props => {
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const getEventListParams = useRef<IGetEventListParams>({
    skip: 0,
    limit: 10,
    eventName: "",
    eventDescription: "",
    orderBy: "id",
  });

  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [orderBy, setOrderBy] = useState("id");

  const [eventItems, setEventItems] = useState<IGetEventList["eventItems"]>([]);

  const router = useRouter();

  const getList = async () => {
    const { data, status } = await getEventList(getEventListParams.current);

    setEventItems(data.eventItems);
  };

  useEffect(() => {
    // getList();
  }, []);

  return (
    <div className={styles.eventTable}>
      <div className={styles.filter}>
        <div className={styles.filterItem}>
          <span className={styles.filterItemLabel}>
            Event Name <QuestionCircleOutlined />:
          </span>

          <Input
            value={eventName}
            placeholder="Please enter"
            onChange={e => {
              getEventListParams.current.eventName = e.target.value;
              setEventName(e.target.value);
            }}
          ></Input>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterItemLabel}>Description:</span>

          <Input
            value={eventDesc}
            placeholder="Please enter"
            onChange={e => {
              getEventListParams.current.eventDescription = e.target.value;
              setEventDesc(e.target.value);
            }}
          ></Input>
        </div>

        <Button
          onClick={() => {
            getEventListParams.current = {
              skip: 0,
              limit: 10,
              eventName: "",
              eventDescription: "",
              orderBy: "id",
            };
            setEventName("");
            setEventDesc("");
          }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "8px" }}
          onClick={() => {
            getEventListParams.current.skip = 0;
            getList();
          }}
        >
          Query
        </Button>
      </div>

      <div className={styles.contentTable}>
        <div className={styles.contentTableHeader}>
          <span>Event Table</span>
          <span style={{ flex: 1 }}></span>
          <Select
            value={orderBy}
            bordered={false}
            options={[
              {
                value: "id",
                label: "Id",
              },
              {
                value: "eventName",
                label: "Event Name",
              },
            ]}
            onChange={v => {
              getEventListParams.current.orderBy = v;
              setOrderBy(v);
              getList();
            }}
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
          rowKey="eventId"
          dataSource={eventItems}
          rowSelection={{
            type: selectionType,
            // onChange: (selectedKeys: string[]) => {
            //   setSelectionType(selectedKeys);
            // },
          }}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
};
export default EventTable;

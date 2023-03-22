import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import BgPng from "@/images/editProfile.png";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Button, Input, Select, Table } from "antd";
import { FullscreenOutlined, RedoOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { ColumnsType } from "antd/es/table";
import { getHubs, getProjects, IGetProjects } from "@/services/graphql";
import { useAccount } from "wagmi";
import { getMyHubDetail } from "@/services/hub";

interface IProps {}

const Projects: FC<IProps> = props => {
  const [userInfo] = useUserInfo();
  const router = useRouter();
  const account = useAccount();
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );

  const getProjectsParams = useRef({
    first: 5,
    skip: 0,
  });

  // const finished = useRef(false);
  const loading = useRef(false);

  const columns: ColumnsType<IGetProjects["projects"][number]> = [
    {
      title: "Image",
      dataIndex: "image",
      render: val => (
        <img
          src={val}
          alt=""
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Project Name",
      dataIndex: "name",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    // },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  const [myHubDetail, setMyHubDetail] = useState<any>({});
  const [projects, setProjects] = useState<IGetProjects["projects"]>([]);

  const getHubDetail = async () => {
    const resG = await getHubs();

    const find = resG.data.hubs.find(
      i => i.hubOwner.id.toLowerCase() === account.address?.toLowerCase()
    );

    // 正常情况应该用下面那个，但现在后端没写好
    const res = await getMyHubDetail();

    if (res.err_code === 0) {
      setMyHubDetail({
        ...res.data,
        blockchain_hub_id: find?.hubId || "",
        logo: find?.imageURI,
        description: find?.description,
        name: find?.name,
      });

      return res.data;
    }

    return false;
  };

  const fetchProjects = async (type?: "reset" | "next") => {
    if (type === "reset") {
      getProjectsParams.current.skip = 0;
    }
    if (loading.current) return;

    try {
      loading.current = true;
      const data = await getProjects(
        `first: ${getProjectsParams.current.first} skip: ${getProjectsParams.current.skip} where: {  }`
      );

      setProjects(data.data.projects);
    } finally {
      loading.current = false;
    }
  };

  useEffect(() => {
    getHubDetail();
    fetchProjects();
  }, []);

  return (
    <div className={styles.projects}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `url(${BgPng.src})`,
          height: "270px",
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div style={{ fontSize: "52px", lineHeight: "78px", color: "#fff" }}>
          Projects
        </div>
      </div>

      <div className={styles.userInfo}>
        <img
          src={myHubDetail.logo}
          style={{
            width: 72,
            height: 72,
            border: "2px solid #EFECEC",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          alt=""
        />

        <div
          style={{
            margin: "12px 0",
            fontSize: "20px",
            lineHeight: "28px",
            fontWeight: "600",
          }}
        >
          {myHubDetail.name}
        </div>
        <div
          style={{
            maxWidth: 640,
            fontSize: "14px",
            lineHeight: "22px",
            textAlign: "center",
          }}
        >
          {myHubDetail.description}
        </div>
      </div>

      <div className={styles.operationBar}>
        <div className={styles.opItem}>
          <span className={styles.opItemTitle}>Project Name:</span>
          <Input></Input>
        </div>
        <div className={styles.opItem}>
          <span className={styles.opItemTitle}>Description:</span>
          <Input></Input>
        </div>

        <div
          className="linearBorderButtonBg"
          style={{ minWidth: 70, marginRight: 4 }}
        >
          <Button className="linearBorderButton" style={{ minWidth: 68 }}>
            Reset
          </Button>
        </div>

        <Button className="linearButton">Query</Button>
      </div>

      <div className={styles.projTables}>
        <div className={styles.filterBar}>
          <span>My Projects </span>

          <span style={{ flex: 1 }}></span>

          <Select defaultValue="Project Name"></Select>

          <div
            className="linearBorderButtonBg"
            style={{ width: 166, height: 32, minHeight: 32, borderRadius: 12 }}
          >
            <Button
              className="linearBorderButton"
              style={{ width: 164, height: 30, borderRadius: 12 }}
              onClick={() => {
                router.push("/creativeHub/projects/createProject");
              }}
            >
              Create New Project
            </Button>
          </div>

          <RedoOutlined style={{ marginLeft: 16, marginRight: 12 }} />
          <FullscreenOutlined />
        </div>

        <Table
          className={styles.projTable}
          rowSelection={{
            type: selectionType,
          }}
          rowKey={"id"}
          columns={columns}
          dataSource={projects}
          pagination={{
            pageSize: 5,
            onChange(page, pageSize) {
              getProjectsParams.current.skip = (page - 1) * pageSize;
              fetchProjects();
            },
          }}
        ></Table>
      </div>
    </div>
  );
};
export default Projects;

import { Menu } from "antd";
import React, { FC, useState } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface IProps {
  children?: React.ReactNode;
}

import type { MenuProps, MenuTheme } from "antd/es/menu";
import {
  CalendarOutlined,
  LeftOutlined,
  MailOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAtom } from "jotai";
import { activeMenu } from "@/store/menu";
import { animated, useSpring } from "@react-spring/web";
import useMeasure from "react-use-measure";
import ApiPannel from "./apiPannel";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const keyRouter = {
  createProfile: "/createProfile",
  createHub: "/createHub",
  createProject: "/createProject",
  publish: "/publish",
  // eventTable: "/eventTable",
};

const Sider: FC<IProps> = props => {
  const router = useRouter();
  const [activeMenuVal, setAactiveMenuVal] = useAtom(activeMenu);
  const [expand, setExpand] = useState(true);
  const [ref, { width }] = useMeasure();
  const [bind, api] = useSpring(() => ({
    marginLeft: 0,
  }));
  return (
    <div ref={ref} style={{ display: "flex" }}>
      <animated.div className={styles.sider} style={bind}>
        <Menu
          className={styles.firstLevel}
          style={{
            width: "47px",
          }}
          items={[
            getItem("", "1", <MailOutlined />),
            getItem("", "2", <CalendarOutlined />),
          ]}
        ></Menu>

        <Menu
          selectedKeys={[activeMenuVal.secondLevel]}
          className={styles.secondLevel}
          style={{ minWidth: "160px" }}
          items={[
            getItem("createProfile", "createProfile", ""),
            getItem("createHub", "createHub", ""),
            getItem("createProject", "createProject", ""),
            getItem("publish", "publish", ""),
            // getItem("eventTable", "eventTable", ""),
            // getItem("Account", "Account", ""),
            // getItem("Organize Event", "Organize Event", ""),
          ]}
          onSelect={({ key }) => {
            router.push(keyRouter[key] || "/");

            setAactiveMenuVal({
              ...activeMenuVal,
              secondLevel: key,
            });
          }}
        ></Menu>
        {/* <ApiPannel></ApiPannel> */}
        <div
          className={styles.expandArrow}
          onClick={() => {
            setExpand(!expand);
            api.start({
              marginLeft: !expand ? 0 : -width,
            });
          }}
        >
          {expand ? (
            <LeftOutlined
              width={11}
              height={11}
              style={{ fontSize: "11px", fontWeight: "bold" }}
            />
          ) : (
            <RightOutlined
              width={11}
              height={11}
              style={{ fontSize: "11px", fontWeight: "bold" }}
            ></RightOutlined>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 66"
            style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }}
          >
            <path
              id="cover"
              d="M 0 0 L 14 8 L 14 55 L 0 66"
              fill="white"
            ></path>
          </svg>
        </div>
      </animated.div>
    </div>
  );
};
export default Sider;

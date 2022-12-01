import { Menu } from "antd";
import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {}

import type { MenuProps, MenuTheme } from "antd/es/menu";
import { CalendarOutlined, MailOutlined } from "@ant-design/icons";

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

const Sider: FC<IProps> = props => {
  return (
    <div className={styles.sider}>
      {/* <div>Sider</div> */}
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
        className={styles.secondLevel}
        style={{ minWidth: "160px" }}
        items={[
          getItem("Events", "Events", ""),
          getItem("Memories", "Memories", ""),
          getItem("Account", "Account", ""),
          getItem("Organize Event", "Organize Event", ""),
        ]}
      ></Menu>
    </div>
  );
};
export default Sider;

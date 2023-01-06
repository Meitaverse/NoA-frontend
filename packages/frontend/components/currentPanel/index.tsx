import { useAtom } from "jotai";
import React, { FC } from "react";
import styles from "./index.module.scss";
import { activeMenu } from "@/store/menu";

interface IProps {}

// 后面需要与sider中选中的内容联动。
const CurrentPanel: FC<IProps> = props => {
  const [activeMenuVal] = useAtom(activeMenu);
  return (
    <div className={styles.currentPanel}>
      <div>
        {activeMenuVal.firstLevel} / {activeMenuVal.secondLevel}
      </div>
    </div>
  );
};
export default CurrentPanel;

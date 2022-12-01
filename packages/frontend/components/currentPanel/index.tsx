import React, { FC } from "react";
import styles from "./index.module.scss";

interface IProps {}

// 后面需要与sider中选中的内容联动。
const CurrentPanel: FC<IProps> = props => {
  return (
    <div className={styles.currentPanel}>
      <div>CurrentPanel</div>
    </div>
  );
};
export default CurrentPanel;

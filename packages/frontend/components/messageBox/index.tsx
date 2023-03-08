import withShowFn from "@/utils/withShowFn";
import React, { FC } from "react";
import styles from "./index.module.scss";

interface IProps {}

const MessageBox: FC<IProps> = props => {
  return (
    <div className={styles.messageBox}>
      <div>MessageBox</div>
    </div>
  );
};

export default withShowFn(MessageBox);

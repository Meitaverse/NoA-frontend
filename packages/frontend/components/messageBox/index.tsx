import withShowFn from "@/utils/withShowFn";
import React, { FC, useEffect } from "react";
import styles from "./index.module.scss";

interface IProps {
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}

const MessageBox: FC<IProps> = props => {
  const { visible } = props;

  return (
    <>
      {visible && (
        <div className={styles.messageBox}>
          <div>MessageBox</div>
        </div>
      )}
    </>
  );
};

export default withShowFn(MessageBox);

import withShowFn from "@/utils/withShowFn";
import {
  CheckCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import React, { FC, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import styles from "./index.module.scss";

interface IProps {
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  duration?: number;
  title?: React.ReactNode;
  content: React.ReactNode;
  type?: "success" | "error" | "pending";
}

let currentIndex = 1000;

let currentMsgBoxCount = 0;

const typeIcon = {
  success: (
    <div className={styles.successIconWrapper}>
      <CheckCircleFilled />
    </div>
  ),
  error: (
    <div className={styles.errorIconWrapper}>
      <ExclamationCircleFilled />
    </div>
  ),
};

const MessageBox: FC<IProps> = props => {
  const {
    visible,
    content,
    title,
    duration = 3000,
    type = "success",
    onClose,
    afterClose,
  } = props;

  const [bind, api] = useSpring(() => ({
    from: {
      translateX: 384,
    },
    to: {
      translateX: 0,
    },
    config: {
      duration: 200,
    },
  }));

  useEffect(() => {
    let clear: any = null;
    if (visible) {
      clear = setTimeout(() => {
        api.start({
          translateX: 384,
          onResolve: () => {
            onClose?.();
            afterClose?.();
          },
        });
      }, duration);
    }

    return () => {
      if (clear) {
        clearTimeout(clear);
      }
    };
  }, [visible]);

  useEffect(() => {
    currentIndex += 1;
    currentMsgBoxCount += 1;
    return () => {
      currentMsgBoxCount -= 1;
    };
  }, []);
  return (
    <>
      {
        <animated.div
          className={[styles.messageBox].join(" ")}
          style={{
            ...bind,
            zIndex: currentIndex,
            bottom: (currentMsgBoxCount - 1) * 220,
          }}
        >
          {typeIcon[type]}

          <div className={styles.main}>
            <CloseOutlined
              onClick={async () => {
                onClose?.();
                api.start({
                  translateX: 384,
                  onResolve: () => {
                    afterClose?.();
                  },
                });
              }}
            />
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{content}</div>
          </div>
        </animated.div>
      }
    </>
  );
};

export default withShowFn(MessageBox);

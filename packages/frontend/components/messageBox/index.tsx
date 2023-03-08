import withShowFn from "@/utils/withShowFn";
import { CheckCircleFilled, CloseOutlined } from "@ant-design/icons";
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

const MessageBox: FC<IProps> = props => {
  const {
    visible,
    content,
    title,
    duration = 5000,
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

  // useEffect(() => {
  //   let clear: any = null;
  //   if (visible) {
  //     clear = setTimeout(() => {
  //       onClose?.();
  //       setTimeout(() => {
  //         afterClose?.();
  //       }, 450);
  //     }, duration);
  //   }

  //   return () => {
  //     if (clear) {
  //       clearTimeout(clear);
  //     }
  //   };
  // }, [visible]);

  return (
    <>
      {
        <animated.div
          className={[styles.messageBox].join(" ")}
          style={{ ...bind }}
        >
          <div className={styles.successIconWrapper}>
            <CheckCircleFilled />
          </div>

          <div className={styles.main}>
            <CloseOutlined
              onClick={async () => {
                onClose?.();
                await api.start({
                  translateX: 384,
                  onResolve: () => {
                    // afterClose?.();
                  },
                });
                // afterClose?.();
                // setTimeout(() => {
                //   afterClose?.();
                // }, 450);
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

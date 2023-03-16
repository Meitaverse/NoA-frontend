import { useUpload } from "@/hooks/useUpload";
import { getIpfsUrl } from "@/utils/getIpfsUrl";
import { Button, message } from "antd";
import React, {
  ChangeEvent,
  FC,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
// import styles from './index,.scss';

interface IProps {
  buttonText?: string;
  children?: React.ReactNode;
  uploadCheck?: () => boolean;
  onChange?: (url: string) => void;
  style?: any;
}

const Upload = forwardRef<
  {
    click: () => void;
  },
  IProps
>((props, upRef) => {
  const { buttonText = "Upload", uploadCheck = () => true } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const { uploadBlob } = useUpload();

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!uploadCheck()) return;
    const file = event.target.files?.[0];
    if (file) {
      try {
        message.loading({
          content: "loading",
          key: "cidLoading",
        });
        const cid = await uploadBlob(file);
        const url = await getIpfsUrl(cid);
        props?.onChange?.(url);
        return url;
      } finally {
        message.destroy("cidLoading");
      }
    }

    return "";
  };

  useImperativeHandle(upRef, () => ({
    click: () => {
      uploadRef.current?.click();
    },
  }));

  return (
    <div style={{ ...props.style }}>
      <div className="linearBorderButtonBg">
        <input
          style={{ display: "none" }}
          type="file"
          hidden
          ref={uploadRef}
          onChange={e => {
            upload(e);
          }}
        />
        <div
          onClick={e => {
            e.stopPropagation();
            uploadRef.current?.click();
          }}
        >
          {props.children ? (
            props.children
          ) : (
            <Button className="linearBorderButton">{buttonText}</Button>
          )}
        </div>
      </div>
    </div>
  );
});
export default Upload;

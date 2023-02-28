import { usePropsValue } from "@/hooks/usePropsValue";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useVoucher } from "@/hooks/useVoucherContact";
import { formatBalance } from "@/utils/format";
import { strip } from "@/utils/strip";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal } from "antd";
import React, { FC, useState } from "react";
import { useAccount } from "wagmi";
import { BigNumber } from "bignumber.js";
import styles from "./index.module.scss";

interface IProps {
  open: boolean;
  onChange: () => void;
}

const MintCard: FC<IProps> = props => {
  const [openState, setOpenState] = usePropsValue({
    value: props.open,
    defaultValue: props.open,
    onChange: props.onChange,
  });

  const { address } = useAccount();
  const [mintVal, setMintVal] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [userInfo] = useUserInfo();
  const [voucher] = useVoucher();

  const mint = async () => {
    try {
      setMintLoading(true);
      if (!userInfo?.soul_bound_token_id || !address) return;
      await voucher.mintBaseNew(
        userInfo.soul_bound_token_id,
        [address],
        [new BigNumber(+mintVal * 10 ** 18).toFixed()],
        ["https://img.tukuppt.com/photo-big/00/00/94/6152bc0ce6e5d805.jpg"],
        {
          from: address,
        }
      );

      message.success("mint success");
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <Modal
      className={styles.mintCard}
      open={openState}
      closeIcon={
        <CloseCircleOutlined style={{ fontSize: "22px", color: "#FFF" }} />
      }
      closable
      footer={null}
      width={576}
      onCancel={() => {
        setOpenState(false);
      }}
    >
      <div className={styles.mintCardInner}>
        <div
          style={{ fontSize: "32px", lineHeight: "40px", marginBottom: "25px" }}
        >
          Mint SOUL Card
        </div>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px",
            lineHeight: "18px",
            marginBottom: "12px",
          }}
        >
          Enter amount of SOUL you want to withdraw
        </span>
        <Input
          className={styles.amountInput}
          value={mintVal}
          onChange={e => {
            setMintVal(e.target.value);
          }}
          placeholder="enter amount"
          prefix={<div style={{ color: "#fff" }}>SOUL</div>}
        ></Input>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            color: "rgba(255, 255, 255, 0.7)",
            marginTop: "12px",
          }}
        >
          Your balance:{" "}
          <span style={{ color: "#fff" }}>
            {formatBalance(strip((Number(userInfo?.balance) || 0) / 10 ** 18))}
          </span>
        </div>

        <img
          src=""
          alt=""
          style={{
            borderRadius: "10px",
            width: "327px",
            height: "200px",
            marginTop: "24px",
            marginBottom: "19px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            lineHeight: "21px",
            color: "#fff",
            fontStyle: "italic",
          }}
        >
          <span>Card Info: </span>
          <span>
            In the forest, there is a rabbit, she is very cute, obedient and
            careful. There is a pair of crystal clear and beautiful eyes
            embedded in that cute little face.{" "}
          </span>
        </div>

        <div
          style={{
            marginTop: "36px",
            display: "flex",
            marginBottom: "40px",
            alignItems: "flex-start",
          }}
        >
          <InfoCircleOutlined
            style={{
              color: "#fff",
              fontSize: "20px",
              marginRight: "10px",
              lineHeight: "32px",
            }}
          />
          <span style={{ color: "#fff", fontSize: "16px", lineHeight: "21px" }}>
            SOUL is not a erc20 token,it can only be used within the BitSoul
            Protocol ecosystem,we do not provide any refund machanism.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "424px",
          }}
        >
          <div className={styles.cancelBg}>
            <Button
              className={styles.cancelButton}
              onClick={() => {
                setOpenState(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <Button
            className={styles.mintButton}
            loading={mintLoading}
            disabled={!mintVal || Number(mintVal) > (userInfo?.balance || 0)}
            onClick={() => {
              mint();
            }}
          >
            Mint
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default MintCard;

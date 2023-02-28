import { usePropsValue } from "@/hooks/usePropsValue";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useVoucher } from "@/hooks/useVoucherContact";
import { formatBalance } from "@/utils/format";
import { strip } from "@/utils/strip";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BigNumber } from "bignumber.js";
import styles from "./index.module.scss";
import { VoucherAssets, voucherAssets } from "@/services/graphql";
import { useBankTreasury } from "@/hooks/useBankTreasury";

interface IProps {
  open: boolean;
  onChange: () => void;
}

const Recharge: FC<IProps> = props => {
  const [openState, setOpenState] = usePropsValue({
    value: props.open,
    defaultValue: props.open,
    onChange: props.onChange,
  });

  const { address } = useAccount();
  const [mintLoading, setRechargeLoading] = useState(false);
  const [userInfo] = useUserInfo();
  const [bankTreasury] = useBankTreasury();
  const [myCards, setMyCards] = useState<VoucherAssets["voucherAssets"]>([]);
  const [selectedCard, setSelectedCard] = useState("");

  const recharge = async () => {
    try {
      setRechargeLoading(true);
      if (!userInfo?.soul_bound_token_id || !address) return;
      await bankTreasury.depositFromVoucher(
        selectedCard,
        userInfo.soul_bound_token_id,
        {
          from: address,
        }
      );

      message.success("recharge success");

      getMyCards();
    } finally {
      setRechargeLoading(false);
    }
  };

  const getMyCards = async () => {
    const cards = await voucherAssets(address?.toLowerCase());

    if (cards.data.voucherAssets) {
      setMyCards(cards.data.voucherAssets);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    getMyCards();
  }, [address, openState]);

  return (
    <Modal
      className={styles.recharge}
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
      <div className={styles.rechargeInner}>
        <div
          style={{ fontSize: "32px", lineHeight: "40px", marginBottom: "25px" }}
        >
          Recharge From SOUL Card
        </div>
        <Select
          value={selectedCard}
          options={myCards?.map(card => {
            return {
              value: card.tokenId,
              label: card.tokenId,
            };
          })}
          onChange={v => {
            setSelectedCard(v);
          }}
        ></Select>
        {/* <div
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
        </div> */}

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

        <span
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px",
            lineHeight: "18px",
            marginBottom: "12px",
            marginTop: "25px",
            width: "100%",
          }}
        >
          The amount of SOUL you need to deposit
        </span>
        <Input
          className={styles.amountInput}
          disabled
          value={
            formatBalance(
              new BigNumber(
                Number(myCards?.find(i => i.tokenId === selectedCard)?.value) /
                  10 ** 18
              ).toFixed()
            ) || 0
          }
          placeholder="enter amount"
          prefix={<div style={{ color: "#fff" }}>SOUL</div>}
        ></Input>

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
            disabled={!selectedCard}
            onClick={() => {
              recharge();
            }}
          >
            Recharge
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default Recharge;

import { usePropsValue } from "@/hooks/usePropsValue";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useVoucher } from "@/hooks/useVoucherContact";
import { formatBalance } from "@/utils/format";
import { strip } from "@/utils/strip";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Select } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { BigNumber } from "bignumber.js";
import styles from "./index.module.scss";
import { VoucherAssets, voucherAssets } from "@/services/graphql";
import { useBankTreasury } from "@/hooks/useBankTreasury";
import useScrollBottom from "@/hooks/useScrollBottom";
import { getBgNow } from "@/services/voucher";

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
      <RechargeInner {...{ ...props, openState, setOpenState }}></RechargeInner>
    </Modal>
  );
};

interface InnerProps extends IProps {
  openState: boolean;
  setOpenState: (...args: any) => void;
}
const RechargeInner: FC<InnerProps> = (props: InnerProps) => {
  const { openState, setOpenState } = props;
  const { address } = useAccount();
  const [mintLoading, setRechargeLoading] = useState(false);
  const [userInfo] = useUserInfo();
  const [bankTreasury] = useBankTreasury();
  const [myCards, setMyCards] = useState<VoucherAssets["voucherAssets"]>([]);
  const [selectedCard, setSelectedCard] = useState("");
  const cardArea = useRef<HTMLDivElement>(null);

  const loading = useRef(false);
  const finished = useRef(false);
  const getMyCardParams = useRef({
    first: 10,
    skip: 0,
  });

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

  const getMyCards = async (type: "reset" | "next" = "next") => {
    if (type === "reset") {
      finished.current = false;
      getMyCardParams.current.skip = 0;
    }
    if (finished.current) return;
    if (loading.current) return;

    try {
      loading.current = true;
      const cards = await voucherAssets({
        ...getMyCardParams.current,
        wallet: address?.toLowerCase() || "",
      });

      if (cards.data.voucherAssets) {
        if (!cards.data.voucherAssets.length) {
          finished.current = true;
          return;
        }
        if (type === "next") {
          setMyCards([...(myCards as any[]), ...cards.data.voucherAssets]);
        } else {
          setMyCards(cards.data.voucherAssets);
        }
        getMyCardParams.current.skip += cards.data.voucherAssets.length;
      } else {
        finished.current = true;
      }
    } finally {
      loading.current = false;
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    getMyCards("reset");
  }, [address, openState]);

  useScrollBottom(() => {
    getMyCards();
  }, cardArea);

  return (
    <div className={styles.rechargeInner}>
      <div
        style={{ fontSize: "32px", lineHeight: "40px", marginBottom: "25px" }}
      >
        Recharge From SOUL Card
      </div>

      <div className={styles.chooseCard}>
        <div className={styles.chooseCardTitle}>choose a card</div>

        <div className={styles.cardArea} ref={cardArea}>
          {myCards?.map(card => {
            return (
              <div
                key={card.tokenId}
                className={[
                  styles.cardWrapper,
                  selectedCard === card.tokenId ? styles.choosen : "",
                ].join(" ")}
                onClick={() => {
                  setSelectedCard(card.tokenId);
                }}
                style={{
                  background:
                    "linear-gradient(117.55deg, #1e50ff -3.37%, #00dfb7 105.51%)",
                }}
              >
                <img src={card.uri.uri} alt={card.tokenId} />
              </div>
            );
          })}
        </div>
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
  );
};

export default Recharge;

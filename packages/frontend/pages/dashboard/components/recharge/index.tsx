import { usePropsValue } from "@/hooks/usePropsValue";
import { useUserInfo } from "@/hooks/useUserInfo";

import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Select } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";
import { VoucherAssets, voucherAssets } from "@/services/graphql";
import { useBankTreasury } from "@/hooks/useBankTreasury";
import useScrollBottom from "@/hooks/useScrollBottom";
import { useTransctionPending } from "@/hooks/useTransctionPending";
import { toSoul } from "@/utils/toSoul";
import { useIsCurrentNetwork } from "@/hooks/useIsCurrentNetwork";

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
      <div>
        {openState && <RechargeInner openState={openState}></RechargeInner>}
      </div>
    </Modal>
  );
};

interface InnerProps {
  openState: boolean;
}
const RechargeInner: FC<InnerProps> = (props: InnerProps) => {
  const { openState } = props;
  const { address } = useAccount();
  const refreshHash = useTransctionPending();
  const isCurrentNetwork = useIsCurrentNetwork();

  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [transctionLoading, setTransctionLoading] = useState(false);
  const [userInfo, initUserInfo] = useUserInfo();
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
      const { hash } = await bankTreasury.depositFromVoucher(
        selectedCard,
        userInfo.soul_bound_token_id,
        {
          from: address,
        }
      );

      setTransctionLoading(true);
      setRechargeLoading(false);
      const result = await refreshHash(hash);
      if (result) {
        const newMyCards = myCards?.filter(i => i.tokenId !== selectedCard);
        setMyCards(newMyCards);
        setSelectedCard("");
        if (getMyCardParams.current.skip > 0) {
          getMyCardParams.current.skip -= 1;
        }
        initUserInfo();
        message.success("recharge success");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRechargeLoading(false);
      setTransctionLoading(false);
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
    if (openState) {
      getMyCards("reset");
    }
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
              >
                <img
                  src={card.uri.uri}
                  alt={card.tokenId}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
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
          selectedCard
            ? toSoul(myCards?.find(i => i.tokenId === selectedCard)?.value)
            : 0
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
        <Button
          className={styles.mintButton}
          loading={rechargeLoading || transctionLoading}
          disabled={!selectedCard || !isCurrentNetwork}
          onClick={() => {
            recharge();
          }}
        >
          {transctionLoading
            ? "Transaction Pending"
            : rechargeLoading
            ? "Confirm transction in wallet"
            : "Recharge"}
        </Button>
      </div>
    </div>
  );
};

export default Recharge;

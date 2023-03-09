import { Button, Input, message, Modal } from "antd";
import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { usePropsValue } from "@/hooks/usePropsValue";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useAccount, useBalance } from "wagmi";
import { useBankTreasury } from "@/hooks/useBankTreasury";
import { SBT_ADDRESS } from "@/config";
import { useUserInfo } from "@/hooks/useUserInfo";
import { BigNumber } from "bignumber.js";
import { useTransctionPending } from "@/hooks/useTransctionPending";
import { getExchangePrices } from "@/services/graphql";
import logoPng from "@/images/logo.jpeg";
import ethSvg from "@/images/eth.svg";
import downArrowPng from "@/images/downArrow.png";
import { useIsCurrentNetwork } from "@/hooks/useIsCurrentNetwork";
import messageBox from "../messageBox";
interface IProps {
  open: boolean;
  onChange: () => void;
}

const PurchaseDialog: FC<IProps> = props => {
  const [openState, setOpenState] = usePropsValue({
    value: props.open,
    onChange: () => {
      setInputEth("");
      setBuying(false);
      setConfirmBuy(false);
      props.onChange();
    },
    defaultValue: false,
  });

  const [bankTreasury] = useBankTreasury();
  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address,
    watch: true,
  });
  const [userInfo, initUserInfo] = useUserInfo();
  const refreshTransction = useTransctionPending();
  const isCurrentNetwork = useIsCurrentNetwork();

  const [inputEth, setInputEth] = useState("");
  const [currentCurrency, setCurrentCurrency] = useState(0);
  const [buying, setBuying] = useState(false);
  const [confirmBuy, setConfirmBuy] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const getSBTExchangeEthRate = async () => {
    try {
      const prices = await getExchangePrices();
      const ethPrice = prices.data.exchangePrices.find(
        i => i.currencySymbol === "ETH"
      );
      if (ethPrice) {
        setCurrentCurrency(+ethPrice?.sbtAmount || 0);
      }
    } catch (e) {
      messageBox.error("获取SBT汇率失败");
    }
  };

  const buySBT = async () => {
    if (!userInfo?.soul_bound_token_id) {
      messageBox.error("user dont register");
      return false;
    }
    try {
      setBuying(true);
      const { hash } = await bankTreasury.buySBT(userInfo.soul_bound_token_id, {
        value: new BigNumber(+inputEth * 10 ** 18).toFixed(),
        from: address,
      });
      setBuying(false);
      setTransactionLoading(true);
      const result = await refreshTransction(hash);

      if (result) {
        messageBox.success("bought success");
      } else {
        messageBox.success(
          "bought may fail transction timeout, please wait for a while."
        );
      }
      setConfirmBuy(false);
      return hash;
    } catch (e) {
      messageBox.error(JSON.stringify(e));
      return false;
    } finally {
      setBuying(false);
      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && openState) {
      getSBTExchangeEthRate();
    }
  }, [isConnected, openState]);

  return (
    <Modal
      className={styles.purchaseDialog}
      open={openState}
      closeIcon={
        <CloseCircleOutlined style={{ fontSize: "22px", color: "#FFF" }} />
      }
      closable
      footer={null}
      width={544}
      onCancel={() => {
        setOpenState(false);
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", color: "#FFF" }}>
        <div
          style={{
            fontSize: "24px",
            lineHeight: "36px",
            marginBottom: "4px",
          }}
        >
          Purchase SOUL
        </div>
        <div style={{ fontSize: "18px", marginBottom: "37px" }}>
          Choose currency from your wallet
        </div>

        <span style={{ fontSize: "14px", lineHeight: "18px" }}>From</span>
        <div
          style={{
            background: "rgba(217, 217, 217, 0.2)",
            border: "1px solid rgba(101, 103, 107, 0.5)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
          }}
        >
          {/* outter left to right */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",

                border: "1px solid rgb(140 140 141)",
                padding: "8px",
                width: "170px",
                height: "48px",
                borderRadius: "16px",
              }}
            >
              <img
                src={ethSvg.src}
                alt=""
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{ fontSize: "16px", lineHeight: "1", color: "#FFF" }}
                >
                  ETH
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    lineHeight: "1",
                    marginTop: "4px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Ether
                </span>
              </div>
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px" }}>
              {`Balance ${data?.formatted.slice(0, 9)} eth`}
            </div>
          </div>
          <Input
            className={styles.inputEth}
            placeholder="Enter Amount"
            style={{
              background: "transparent",
              color: "rgba(255,255,255)",
              textAlign: "right",
              fontSize: "24px",
              border: "none",
            }}
            value={inputEth}
            onChange={e => {
              setInputEth(e.target.value);
            }}
          ></Input>
        </div>
        <span style={{ marginTop: "33px", marginBottom: "3px" }}>To</span>
        <div
          style={{
            background: "rgba(217, 217, 217, 0.2)",
            border: "1px solid rgba(101, 103, 107, 0.5)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* outter left to right */}
          <div
            style={{
              display: "flex",
              border: "1px solid rgb(140 140 141)",
              padding: "8px",
              width: "170px",
              height: "48px",
              borderRadius: "16px",
              alignItems: "center",
            }}
          >
            <img
              src={logoPng.src}
              alt=""
              style={{ width: "32px", height: "32px", marginRight: "10px" }}
            />
            <span>SOUL</span>
          </div>

          <div style={{ color: "#fff", fontSize: "24px", lineHeight: "18px" }}>
            {new BigNumber(+inputEth * currentCurrency).toFixed()}
          </div>
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
          <span style={{ color: "#fff", fontSize: "14px", lineHeight: "21px" }}>
            SOUL is not a erc20 token,it can only be used within the BitSoul
            Protocol ecosystem,we do not provide any refund machanism.
          </span>
        </div>

        <Button
          disabled={
            !!!inputEth ||
            !isCurrentNetwork ||
            +inputEth > Number(data?.formatted.slice(0, 9))
          }
          className={styles.approveButton}
          onClick={() => {
            setConfirmBuy(true);
          }}
          loading={buying}
        >
          Purchase
        </Button>

        <Modal
          open={confirmBuy}
          className={styles.purchaseDialog}
          closeIcon={
            <CloseCircleOutlined style={{ fontSize: "22px", color: "#FFF" }} />
          }
          closable
          footer={null}
          width={600}
          onCancel={() => {
            setConfirmBuy(false);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                lineHeight: "40px",
                marginBottom: "37px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Confirm Purchase
            </div>
            <span style={{ fontSize: "14px", lineHeight: "18px" }}>From</span>
            <div
              style={{
                background: "rgba(217, 217, 217, 0.2)",
                border: "1px solid rgba(101, 103, 107, 0.5)",
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    border: "1px solid rgb(140 140 141)",
                    padding: "8px",
                    width: "170px",
                    height: "48px",
                    borderRadius: "16px",
                  }}
                >
                  <img
                    src={ethSvg.src}
                    alt=""
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "contain",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        lineHeight: "1",
                        color: "#FFF",
                      }}
                    >
                      ETH
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        lineHeight: "1",
                        marginTop: "4px",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Ether
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  color: "#fff",
                  fontSize: "24px",
                  lineHeight: "18px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {inputEth}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "32px",
                width: "170px",
                background: "#414463",
                borderRadius: "12px",
                margin: "20px auto",
              }}
            >
              <img
                src={downArrowPng.src}
                alt=""
                style={{ marginRight: "5px" }}
              />
              <span>{`1ETH=${currentCurrency} Bitsoul`}</span>
            </div>

            <span style={{ marginBottom: "3px" }}>To</span>
            <div
              style={{
                background: "rgba(217, 217, 217, 0.2)",
                border: "1px solid rgba(101, 103, 107, 0.5)",
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* outter left to right */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgb(140 140 141)",
                  padding: "8px",
                  width: "170px",
                  height: "48px",
                  borderRadius: "16px",
                }}
              >
                <img
                  src={logoPng.src}
                  alt=""
                  style={{ width: "32px", height: "32px", marginRight: "10px" }}
                />
                <span>SOUL</span>
              </div>

              <div
                style={{ color: "#fff", fontSize: "24px", lineHeight: "18px" }}
              >
                {new BigNumber(+inputEth * currentCurrency).toFixed()}
              </div>
            </div>

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                marginBottom: "40px",
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
              <span
                style={{ color: "#fff", fontSize: "14px", lineHeight: "21px" }}
              >
                SOUL is not a erc20 token,it can only be used within the BitSoul
                Protocol ecosystem,we do not provide any refund machanism.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className={styles.approveButton}
                onClick={async () => {
                  const state = await buySBT();
                  if (state) {
                    initUserInfo();
                    const close = Modal.success({
                      width: 600,
                      className: styles.purchaseSuccessModal,
                      title: "",
                      footer: null,
                      content: (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            color: "#fff",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "32px",
                              lineHeight: "32px",
                              marginBottom: "24px",
                            }}
                          >
                            Successfully Purchase
                          </div>
                          <div
                            style={{
                              fontSize: "24px",
                              lineHeight: "32px",
                              marginBottom: "24px",
                            }}
                          >
                            View on{" "}
                            <a
                              href={`https://etherscan.io/tx/${state}`}
                              target="_blank"
                            >
                              Explorer
                            </a>
                          </div>
                          <Button
                            className={styles.closeButton}
                            style={{ width: "200px", height: "56px" }}
                            onClick={() => {
                              close.destroy();
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      ),
                    });
                  }
                }}
                loading={buying || transactionLoading}
              >
                {transactionLoading
                  ? "Transaction Pending"
                  : buying
                  ? "Confirm Transaction In Wallet"
                  : "Confirm Purchase"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Modal>
  );
};
export default PurchaseDialog;

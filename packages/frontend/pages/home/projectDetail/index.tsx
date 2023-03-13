import { Breadcrumb, Button } from "antd";
import React, { FC } from "react";
import styles from "./index.module.scss";

interface IProps {}

const ProjectDetail: FC<IProps> = props => {
  return (
    <div className={styles.projectDetail}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Project Detail</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "56px" }}
      >
        {/* 上下 */}
        <div style={{ display: "flex" }}>
          {/* 整体是左右 */}
          <div style={{ position: "relative", marginRight: "40px" }}>
            <img
              src="https://gateway.pinata.cloud/ipfs/bafybeieq6z2m56ji4mea4q242uxmdgf52dni7uiztvs4qnyfohsl277wxi"
              alt=""
              style={{
                width: 600,
                height: 677,
                borderRadius: "20px",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "560px",
            }}
          >
            <div className={styles.detailTitle}>
              The Five People's signature NFT debut
            </div>
            <div className={styles.publisher}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src=""
                  alt=""
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "16px",
                  }}
                >
                  <span style={{ color: "#8F9CA9" }}>Publisher</span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "24px",
                      lineHeight: 1.5,
                      fontWeight: "600",
                    }}
                  >
                    0Xae3...3456
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.desc}>
              <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Description：
              </span>
              <span>
                Description : Participate in the five-person online concert,
                enter the activity code during the event time to receive,
                limited to 1,000 copies, while stocks last.
              </span>
            </div>
            <div
              className={styles.secondCreation}
              style={{ marginTop: "24px" }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Second Creation:
              </span>
              <span>
                Description : Participate in the five-person online concert,
                enter the activity code during the event time to receive,
                limited to 1,000 copies, while stocks last.
              </span>
            </div>

            <div className={styles.mintInfo}>
              <div className={styles.price}>
                <span style={{ color: "#8F9CA9", fontSize: "16px" }}>
                  Mint Price
                </span>
                <span
                  style={{
                    marginTop: "16px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  10.89 ETH
                </span>
              </div>
              <div className={styles.supply}>
                <span style={{ color: "#8F9CA9", fontSize: "16px" }}>
                  Supply
                </span>
                <span
                  style={{
                    marginTop: "16px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  245/100
                </span>
              </div>
            </div>

            <Button
              className="linearButton"
              style={{ marginTop: "40px", height: "56px", fontSize: "20px" }}
            >
              Mint
            </Button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 120,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "48px",
                lineHeight: "64px",
                fontWeight: "700",
              }}
            >
              Second Creation
            </span>

            <div style={{ display: "flex" }}>
              <div
                className="linearBorderButtonBg"
                style={{ width: "145px", height: "56px", borderRadius: "16px" }}
              >
                <Button
                  className="linearBorderButton"
                  style={{
                    width: "143px",
                    height: "54px",
                    borderRadius: "16px",
                  }}
                >
                  Sort By Price
                </Button>
              </div>

              <div
                className="linearBorderButtonBg"
                style={{
                  width: "96px",
                  height: "56px",
                  borderRadius: "16px",
                  marginLeft: "20px",
                }}
              >
                <Button
                  className="linearBorderButton"
                  style={{
                    width: "94px",
                    height: "54px",
                    borderRadius: "16px",
                  }}
                >
                  More
                </Button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              marginRight: "-26px",
              marginTop: "56px",
            }}
          >
            <div
              className="scItem"
              style={{
                width: "280px",
                height: "397px",
                overflow: "hidden",
                borderRadius: "20px",
              }}
            >
              <img
                src=""
                alt=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectDetail;

import React, { FC } from "react";
import { useAccount, useBalance } from "wagmi";
import styles from "./index.module.scss";

interface IProps {}

const Home: FC<IProps> = props => {
  const { address } = useAccount();
  const { data } = useBalance({
    addressOrName: address,
  });

  return (
    <div className={styles.home}>
      <div style={{ color: "#fff" }}>
        <div>{JSON.stringify(data)}</div>
      </div>
    </div>
  );
};
export default Home;

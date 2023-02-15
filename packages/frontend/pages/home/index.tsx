import React, { FC } from "react";
import styles from "./index.module.scss";

interface IProps {}

const Home: FC<IProps> = props => {
  return (
    <div className={styles.home}>
      <div>Home</div>
    </div>
  );
};
export default Home;

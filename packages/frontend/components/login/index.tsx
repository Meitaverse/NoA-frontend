import React, { FC } from "react";
import styles from "./index.module.scss";

interface IProps {}

const Login: FC<IProps> = props => {
  return (
    <div className={styles.login}>
      <div>Login</div>
    </div>
  );
};
export default Login;

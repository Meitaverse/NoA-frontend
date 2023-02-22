import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

interface IProps {}

const Index: FC<IProps> = props => {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);

  return (
    <div>
      <div>12312312</div>
    </div>
  );
};
export default Index;

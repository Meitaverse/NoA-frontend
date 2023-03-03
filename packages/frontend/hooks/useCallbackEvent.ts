import { waitForSomething } from "@/utils/waitForSomething";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useWaitForTransaction } from "wagmi";

export const useCallbackEvent = (hash = "") => {
  const [myHash, setMyHash] = useState(hash);
  const { data, isSuccess } = useWaitForTransaction({
    hash: myHash,
  });
  const resultRef = useRef(isSuccess);
  const resultData = useRef(data);

  const refreshNew = async hash => {
    // 等待此哈希结果的完成
    setMyHash(hash);
    await waitForSomething({
      func: () => {
        if (resultData.current?.transactionHash === hash) {
          return true;
        }
      },
      timeout: 15000,
    });

    return resultRef.current;
  };

  useEffect(() => {
    resultRef.current = isSuccess;
    resultData.current = data;
  }, [data]);

  return refreshNew;
};

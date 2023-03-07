import { getTransactionHistory } from "@/services/graphql";
import { waitForSomething } from "@/utils/waitForSomething";

export const useTransctionPending = (hash = "") => {
  const refreshNew = async hash => {
    // 等待此哈希结果的完成
    // setMyHash(hash);
    const result = await waitForSomething({
      func: async () => {
        const hashResult = await getTransactionHistory(hash);
        if (hashResult.data.transactionHashHistories.length) return true;
        return false;
      },
      timeout: 15000,
      splitTime: 200,
    });

    return result;
  };

  // useEffect(() => {
  //   resultRef.current = isSuccess;
  //   resultData.current = data;
  // }, [data]);

  return refreshNew;
};

import { getUserDetailResponse, getUserInfo } from "@/services/sign";
import { isLogin, userDetail } from "@/store/userDetail";
import { useAtom } from "jotai";
import { useRef } from "react";
import { useAccount } from "wagmi";

export const useUserInfo: () => [
  getUserDetailResponse | null,
  (adr?: string) => Promise<false | getUserDetailResponse>
] = () => {
  const { address } = useAccount();
  const [userInfo, setUserInfo] = useAtom(userDetail);
  const [, setIsLoginStatus] = useAtom(isLogin);
  const loginLoading = useRef(false);

  const initUserInfo = async (adr = "") => {
    if (loginLoading.current) return false;
    loginLoading.current = true;
    // 存在token的情况下尝试进行登录
    // 检查及登录步骤：
    //    调用接口获取用户信息失败则signinWeb2
    //    成功则setLoginStatus和userInfo。
    try {
      if (localStorage.getItem("token")) {
        const { err_code, data } = await getUserInfo(
          {
            walletAddress: address || adr,
          },
          {
            loading: true,
          }
        );
        if (err_code === 0 && data.wallet_address) {
          setIsLoginStatus(true);
          setUserInfo(data);
          return data;
        }
      }
    } finally {
      loginLoading.current = false;
    }

    return false;
  };

  return [userInfo, initUserInfo];
};

import BitSoul from "@/chain/bitsoul";
import { useSwitchNetwork } from "wagmi";

export const useSwitchToSoul = () => {
  const { switchNetwork, switchNetworkAsync } = useSwitchNetwork();
  const switchToSoul = () => {
    switchNetwork?.(BitSoul.id);
  };

  const switchToSoulAsync = async () => {
    await switchNetworkAsync?.(BitSoul.id);
  };

  return {
    switchToSoul,
    switchToSoulAsync,
  };
};

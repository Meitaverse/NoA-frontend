import { useNetwork } from "wagmi";
import BitSoul from "@/chain/bitsoul";
import { useEffect, useState } from "react";
export const useIsCurrentNetwork = () => {
  const { chain } = useNetwork();
  const [isBitSoulNetwork, setIsBitSoulNetwork] = useState(
    chain?.id === BitSoul.id
  );

  useEffect(() => {
    if (chain?.id === BitSoul.id) {
      setIsBitSoulNetwork(true);
    } else {
      setIsBitSoulNetwork(false);
    }
  }, [chain?.id]);

  return isBitSoulNetwork;
};

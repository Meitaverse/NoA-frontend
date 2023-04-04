import { useState } from "react";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/nft_contracts.json";

export const useNftContracts = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  // 必须被替换后才可以使用
  const [nftAddress, setNftAddress] = useState(
    "0x9bd03768a7DCc129555dE410FF8E85528A4F88b5"
  );

  const signer = useContract({
    addressOrName: nftAddress,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract({
    addressOrName: nftAddress,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return {
    setNftAddress,
    caller: [signer, prov],
  };
};

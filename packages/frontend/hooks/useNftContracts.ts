import { useState } from "react";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/nft_contracts.json";

export const useNftContracts = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const [nftAddress, setNftAddress] = useState("");

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

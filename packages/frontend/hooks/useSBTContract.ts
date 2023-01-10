import { NFTDerivativeProtocolTokenV1 } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/sbt_contracts.json";

import { SBT_ADDRESS } from "@/config";

export const useSBTContract = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<NFTDerivativeProtocolTokenV1>({
    addressOrName: SBT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<NFTDerivativeProtocolTokenV1>({
    addressOrName: SBT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
};

import { DerivativeNFT } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/derivative_contracts.json";

import { DERIVATIVE_ADDRESS } from "@/config";

export const useDerivative = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<DerivativeNFT>({
    addressOrName: DERIVATIVE_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<DerivativeNFT>({
    addressOrName: DERIVATIVE_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
};

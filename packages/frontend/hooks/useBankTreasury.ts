import { BankTreasury } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/bank_treasury_contracts.json";

import { BANK_TREASURY_ADDRESS } from "@/config";

export const useBankTreasury = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<BankTreasury>({
    addressOrName: BANK_TREASURY_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<BankTreasury>({
    addressOrName: BANK_TREASURY_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
};

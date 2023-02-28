import { Voucher } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/voucher_contracts.json";

import { VOUCHER_ADDRESS } from "@/config";

export const useVoucher = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<Voucher>({
    addressOrName: VOUCHER_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<Voucher>({
    addressOrName: VOUCHER_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
};

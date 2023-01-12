import { ModuleGlobals } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/module_global_contracts.json";

import { MODULEG_GLOBAL_ADDRESS } from "@/config";

export const useModuleGlobalContract = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<ModuleGlobals>({
    addressOrName: MODULEG_GLOBAL_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<ModuleGlobals>({
    addressOrName: MODULEG_GLOBAL_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
};

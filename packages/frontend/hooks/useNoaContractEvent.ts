import contracts from "@/contracts/noa_contracts.json";
import { useContractEvent } from "wagmi";

const address = contracts['31337'][0].contracts.ShaWdao.address
const abi = contracts['31337'][0].contracts.ShaWdao.abi

export const useNoaContractEvent = (eventName, callback) => {
  useContractEvent({
    addressOrName: address,
    contractInterface: abi,
    eventName,
    listener: callback
  })
}
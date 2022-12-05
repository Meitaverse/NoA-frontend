import contracts from "@/contracts/noa_contracts.json";
import { useContract, useProvider, useSigner } from "wagmi";

const address = contracts['31337'][0].contracts.ShaWdao.address
const abi = contracts['31337'][0].contracts.ShaWdao.abi


// "inputs": [
//   {
//     "components": [
//       {
//         "internalType": "address",
//         "name": "organizer",
//         "type": "address"
//       },
//       {
//         "internalType": "string",
//         "name": "eventName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventDescription",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventImage",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "eventMetadataURI",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256",
//         "name": "mintMax",
//         "type": "uint256"
//       }
//     ],
//     "internalType": "struct INoAV1.Event",
//     "name": "event_",
//     "type": "tuple"
//   }
// ]

export const useNoaContract = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();
  const setContract = useContract({
    addressOrName: address,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const getContract = useContract({
    addressOrName: address,
    contractInterface: abi,
    signerOrProvider: provider,
  });
  
  return {setContract, getContract}
}
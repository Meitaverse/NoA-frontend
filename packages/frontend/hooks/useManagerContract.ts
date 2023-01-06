import contracts from "@/contracts/noa_contracts.json";
import { Manager } from "@/typechain";
import { useContract, useProvider, useSigner } from "wagmi";

import abi from "@/contracts/manager_contracts.json";

import { MANAGER_ADDRESS } from "@/config";

export const useManagerContract = () => {
  const { data: signerData } = useSigner();
  const provider = useProvider();

  const signer = useContract<Manager>({
    addressOrName: MANAGER_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const prov = useContract<Manager>({
    addressOrName: MANAGER_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  return [signer, prov];
  // const [contract, setContract] = useState<Manager>();
  // const init = async () => {
  //   const ethereum = (window as any).ethereum;
  //   const accounts = await ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     "http://192.168.20.205:8545/",
  //     31337
  //   );
  //   const signer = provider.getSigner();
  //   debugger;
  //   // const manager = await .connect(managerAddress, provider);
  //   const manager = await Manager__factory.connect(managerAddress, signer);
  //   setContract(manager);
  //   return manager;
  // };
  // useEffect(() => {
  //   init();
  // }, []);
  // return contract;
  // const { data: signerData } = useSigner();
  // const provider = useProvider();
  // const setContract = useContract<Manager>({
  //   addressOrName: address,
  //   contractInterface: abi,
  //   signerOrProvider: signerData,
  // });
  // setContract.createProfile({
  //   to: "123123",
  //   nickName: "123",
  //   imageURI: "image",
  // });
  // const getContract = useContract({
  //   addressOrName: address,
  //   contractInterface: abi,
  //   signerOrProvider: provider,
  // });
  // return { setContract, getContract };
};

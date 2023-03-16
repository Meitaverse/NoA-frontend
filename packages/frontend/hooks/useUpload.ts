import { message } from "antd";
import { NFT_STORAGE_TOKEN } from "@/config";
import { NFTStorage } from "nft.storage";

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const useUpload = () => {
  const uploadBlob = async (file: File) => {
    // const blob =
    try {
      const cid = await client.storeBlob(file);

      return cid;
    } finally {
    }
  };

  const uploadNFT = async (file: File) => {
    try {
      message.loading({
        content: "loading",
        key: "cidKey",
      });
      const cid = await client.store({
        name: "",
        description: "",
        image: file,
      });

      return cid;
    } finally {
      message.destroy("cidKey");
    }
  };

  return {
    uploadBlob,
    uploadNFT,
  };
};

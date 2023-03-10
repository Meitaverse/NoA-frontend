export const getIpfsUrl = (cid: string) => {
  // 理论上这里应该ping gateway选一个最快的。
  // 但是先埋伏一手。
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

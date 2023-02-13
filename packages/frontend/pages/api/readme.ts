// 该API目录用作中间件，此项目下有些接口需要同时查询GraphQL和后端，统一通过这里定义的中间件来处理为统一的(聚合)返回格式。
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}

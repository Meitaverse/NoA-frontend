// 该API目录用作中间件，此项目下有些接口需要同时查询GraphQL和后端，统一通过这里定义的中间件来处理为统一的(聚合)返回格式。
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getProfile, sbtasset } from "@/services/graphql";
import { wrapFetch } from "@/services/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    res.status(200).json({ err_code: 400, msg: "method not allow" });
    return;
  }

  if (!req.query.walletAddress) {
    res.status(200).json({ err_code: 400, msg: "walletAddress need" });
    return;
  }

  try {
    const profiles = await getProfile(
      `first: 1 where: {wallet: "${req.query.walletAddress
        .toString()
        .toLowerCase()}"}`
    );

    const profile = profiles.data.profiles[0];

    const balance = await sbtasset(
      req.query.walletAddress.toString().toLowerCase()
    );

    const myBalance = balance.data.sbtasset?.balance;

    console.log("headers", req.headers);

    const userInfo = await wrapFetch("/getUserInfo", {
      headers: req.headers,
    });

    const data = await userInfo.json();

    const response = {
      ...data,
      data: {
        ...data.data,
        username:
          profile?.nickName ||
          `${req.query.walletAddress.slice(
            0,
            4
          )}....${req.query.walletAddress.slice(
            req.query.walletAddress.length - 4
          )}`,
        avatar: profile?.imageURI || "",
        balance: myBalance || "0",
      },
    };

    if (response.err_code === 0) {
      res.status(200).json(response);
      return;
    } else {
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(200).json({ err_code: 500, msg: e });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from "@/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "typings";

type Data = {
  messages: Message[];
};

type Err = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Err>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ body: "Method not Allowed" });
    return;
  }

  const messagesRes = await redis.hvals('messages');
  const messages: Message[] = messagesRes
    .map((message) => (JSON.parse(message)))
    .sort((a, b) => b.created_at - a.create_at);
  res.status(200).json({ messages });
}

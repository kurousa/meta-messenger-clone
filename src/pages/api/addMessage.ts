// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from "@/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "typings";

type Data = {
  message: Message;
};

type Err = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Err>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ body: "Method not Allowed" });
    return;
  }

  const { message } = req.body;

  const newMessage: Message = {
    ...message,
    // Replace the timestamp of the user to the timestamp of the server
    created_at: Date.now()
  }

  await redis.hset('messages', newMessage.id, JSON.stringify(newMessage));

  res.status(200).json({ message: newMessage });
}

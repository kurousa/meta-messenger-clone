'use client'

import React, { useEffect } from 'react'
import useSWR from 'swr';
import fetcher from '@/utils/fetchMessages';
import { Message } from 'typings';
import MessageComponent from './MessageComponent';
import { clientPusher } from '@/lib/pusher';

type Props = {
  initialMessages: Message[];
};

function MessageList({ initialMessages }: Props) {
  const {
    data: messages,
    error,
    mutate
  } = useSWR<Message[]>('/api/getMessages', fetcher);

  useEffect(() => {
    const channel = clientPusher.subscribe('messages');
    channel.bind('new-message', async (data: Message) => {
      // dont update cache when exist message.
      if (messages?.find((message) => message.id === data.id)) return;
      // if messages undefined, only mutate.
      if (!messages) {
        mutate(fetcher);
      } else {
        mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,
        })
      }
    });

    // clear connection
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages, mutate, clientPusher]);

  return (
    <div className='space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto'>
      {(messages || initialMessages)?.map((message) => (
        <MessageComponent
          key={message.id}
          message={message}
        />
      ))}

    </div>
  )
}

export default MessageList
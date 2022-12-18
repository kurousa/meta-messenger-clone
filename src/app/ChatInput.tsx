'use client'

import React, { FormEvent, useState } from 'react'
import { Message } from 'typings';
import { v4 as uuid } from 'uuid';
import useSWR from 'swr';
import fetcher from '@/utils/fetchMessages';

function ChatInput() {
  const [input, setInput] = useState("");
  const { data: messages, error, mutate } = useSWR('/api/getMessages', fetcher);

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    const messageToSend = input;

    setInput("");

    const id = uuid();
    const message: Message = {
      id: id,
      message: messageToSend,
      created_at: Date.now(),
      username: 'dummy',
      profilePic: 'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg',
      email: 'example@example.com'
    };

    await mutate(uploadMessageToUpstash(message), {
      optimisticData: [message, ...messages!],
      rollbackOnError: true,
    });
  }

  const uploadMessageToUpstash = async (message: Message) => {
    const res = await fetch('/api/addMessage', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      })
    });

    const data = await res.json();
    return [data.message, ...messages!]

  };


  return (
    <form
      onSubmit={addMessage}
      className='fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2
      border-t border-gray-100 bg-white'>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Message here..."
        className="flex-1 rounded border border-gray-300 px-5 py-3
        focus:outline-none forcus:ring-2 foucs:ring-blue-600 focus:border-transparent
        disabled:opactiy-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!input}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput
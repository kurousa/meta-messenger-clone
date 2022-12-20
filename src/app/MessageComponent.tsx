import Image from 'next/image';
import { Message } from 'typings';

type Props = {
  key: string;
  message: Message;
};

function MessageComponent({ message }: Props) {
  // TODO: user authentication
  const isUser = true;

  return (
    <div className={`flex w-fit ${isUser && "ml-auto"}`}>
      <div className={`flex-shrink-0 ${isUser && "order-2"}`}>
        <Image
          className='rounded-full mx-2'
          src={message.profilePic}
          height={10}
          width={50}
          alt="profilePic"
        />
      </div>
      <div>
        {/* change color and text-align with user session*/}
        <p className={`text-[0.65rem] px-[2px] pb-[2px]
          ${isUser ? "text-blue-400 text-right" : "text-red-400 text-left"}`}
        >
          {message.username}
        </p>

        <div className='flex items-end'>
          {/* change bg-color with user session*/}
          <div className={`px-3 py-2 rounded-lg w-fit text-white
            ${isUser ? "bg-blue-400 ml-auto order-2" : "bg-red-400"}`}
          >
            <p>{message.message}</p>
          </div>
          {/* change text-align with user session*/}
          <p className={`text-[0.65rem] italic px-2 text-gray-300
            ${isUser && "text-right"}`}
          >
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageComponent
import { FormEvent, useEffect, useState } from "react";
import {
  ChatDotsFill,
  SymmetryHorizontal,
  XCircleFill,
} from "react-bootstrap-icons";
import { AnimatePresence, motion } from "framer-motion";
import { PixInput, PixTextArea } from "../inputs/pixInputs";
import { useForm } from "react-hook-form";
import { getCookie } from "cookies-next";
import { GetMessagesEndpoint, getMessagesType } from "@/routes/routes";

interface PixInputSupportChatFields {
  message: string;
}

export default function SupportChat() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket>();
  const { register } = useForm<PixInputSupportChatFields>();
  const [messages, setMessages] = useState<getMessagesType[]>();

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    socket?.send(JSON.stringify({ message: event.currentTarget.message.value }))
    event.currentTarget.message.value = ""
  }

  useEffect(() => {
    if (isOpened) {
      // const newSocket = new WebSocket(`ws://localhost:8000/api_v1/chat/ws?auth=${getCookie("token")!.split(" ")[1]}`)
      const newSocket = new WebSocket(`wss://pixlogistic.com/api_v1/chat/ws?auth=${getCookie("token")!.split(" ")[1]}`)
      setSocket(newSocket)
      newSocket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data)
        setMessages((prev) => {
          if (prev) return [message, ...prev]
          else return [message]
        })
      }
    }
    else socket?.close()
  }, [isOpened])

  useEffect(() => {
    GetMessagesEndpoint().then((response) => {
      setMessages(response.data)
    })
  }, [])

  return (
    <AnimatePresence>
      {isOpened ? (
        <motion.div
          className="lg:w-[500px] lg:h-[600px] w-full h-full bg-gradient-radial from-[#ACCBEE] to-[#E7F0FD] fixed z-50 lg:bottom-10 lg:right-10 lg:rounded-xl shadow-[-2px_3px_8px_0px_rgba(0,0,0,0.3)]"
          key={"opened"}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.3 }}
          exit={{ opacity: 0, scale: 0, right: -200, bottom: -250 }}
        >
          <div className="bg-[#314255] h-[75px] w-full lg:rounded-t-xl text-white flex justify-between items-center px-4">
            <div>
              <h3>Поддержка</h3>

              <div className="flex items-center gap-1.5 font-light">
                <div className="bg-green-400 rounded-full w-2 h-2"></div>
                <p>В сети</p>
              </div>
            </div>
            <XCircleFill
              className="cursor-pointer hover:text-red-200 transition-all"
              size={24}
              onClick={() => setIsOpened(false)}
            />
          </div>
          <div className="h-[calc(100%-175px)]">
            <div className="h-full flex flex-col-reverse gap-2 py-2 overflow-y-auto">
              {messages?.map((item, index) => {
                return <Message key={index} isSender={item.from_user_id == item.to_chat_room_id} message={item.message} />
              })}
              <Message
                isSender={false}
                message="Здравствуйте! Если у вас возникли какие-либо вопросы, задайте их в этом чате."
              />
            </div>
            <form onSubmit={sendMessage}>
              <div className="h-[100px] p-2 relative flex justify-between items-center">
                <PixTextArea
                  className="w-full"
                  name="message"
                  register={register}
                  placeholder="Введите сообщение..."
                />
                <button type="submit" className="text-white bg-[#314255] w-12 h-12 flex justify-center items-center rounded-full absolute right-8 hover:scale-110 transition-all cursor-pointer active:scale-100">
                  <SymmetryHorizontal size={24} className="relative left-0.5" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={"closed"}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: "easeOut", duration: 0.1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpened(true)}
          className="bg-[#314255] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.5)] rounded-full fixed z-50 bottom-4 right-4 w-16 h-16 flex justify-center items-center text-white hover:scale-110 transition-all cursor-pointer"
        >
          <ChatDotsFill size={32} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Message({
  isSender,
  message,
}: {
  isSender: boolean;
  message: string;
}) {
  return isSender ? (
    <div className="max-w-[80%] bg-white border border-[#314255] px-2 py-2 rounded-xl ms-2 place-self-start text-start">
      {message}
    </div>
  ) : (
    <div className="max-w-[80%] bg-[#314255] px-2 py-2 rounded-xl place-self-end text-white font-light text-end me-2">
      {message}
    </div>
  );
}

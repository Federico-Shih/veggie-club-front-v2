import { authAxios } from "@/config/axios-config";
import { Message } from "@/domain/messages";

export interface BackendMessage extends Omit<Message, "endDate"> {
  endDate: {
    _seconds: number;
    _nanoseconds: number;
  };
}

const getAllMessagesBase = async (route: string): Promise<Message[]> => {
  const { data } = await authAxios.get<BackendMessage[]>(`${route}/message/all`);
  return data.map((message) => ({ ...message, endDate: new Date(message.endDate._seconds * 1000) }));
};

export const getAllMessages = () => {
  return getAllMessagesBase("/api");
};

export const getAllMessagesSSR = () => {
  return getAllMessagesBase(process.env.BACKEND_URL || "");
};

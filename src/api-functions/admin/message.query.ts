import { authAxios } from "@/config/axios-config";
import { Message } from "@/domain/messages";

interface BackendMessage extends Omit<Message, "endDate"> {
  endDate: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export const getAllMessages = async (): Promise<Message[]> => {
  const { data } = await authAxios.get<BackendMessage[]>("/api/message/all");
  return data.map((message) => ({ ...message, endDate: new Date(message.endDate._seconds * 1000) }));
};

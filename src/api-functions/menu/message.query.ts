import { Message } from "@/domain/messages";
import { authAxios } from "@/config/axios-config";
import { BackendMessage } from "@/api-functions/admin/message.query";

export const getMessages = async (): Promise<Message[]> => {
  const { data } = await authAxios.get<BackendMessage[]>(`/api/message?date=${(new Date()).toISOString().substring(0, 10)}`);
  return data.map((message) => ({ ...message, endDate: new Date(message.endDate._seconds * 1000) }));
};

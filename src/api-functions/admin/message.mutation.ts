import { Message, MessageDTO } from "@/domain/messages";
import { authAxios } from "@/config/axios-config";

export const saveMessage = async ({ id, ...messageDTO }: MessageDTO): Promise<Message> => {
  let route = "/api/message";
  if (id) {
    route = `${route}/${id}`;
  }
  const { data } = await authAxios.post<Message>(route, messageDTO);
  return data;
};

export const removeMessage = ({ id }: Message) => {
  return authAxios.delete(`/api/message/${id}`);
};

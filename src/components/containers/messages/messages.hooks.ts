import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllMessages } from "@/api-functions/admin/message.query";
import { Message, MessageDTO } from "@/domain/messages";
import { removeMessage, saveMessage } from "@/api-functions/admin/message.mutation";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

export const useAdminMessages = () => {
  return useQuery(["messages", "admin"], getAllMessages);
};

export const useSaveMessage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (messageDTO: MessageDTO) => {
      return saveMessage(messageDTO);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["messages", "admin"]);
      toast({
        title: t("created-message"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: async () => {
      toast({
        title: t("error-creating-message"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useRemoveMessage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  return useMutation({
    mutationFn: removeMessage,
    onSuccess: async (data, message) => {
      queryClient.setQueryData(["messages", "admin"], (prev: Message[] | undefined) => {
        return prev?.filter((value) => (value.id !== message.id)) || [];
      });
      await queryClient.invalidateQueries(["messages", "admin"]);
      toast({
        title: t("error-creating-message"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: t("error-creating-message"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

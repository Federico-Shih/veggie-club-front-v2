import { Button, Center, CircularProgress, Container, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { useAdminMessages, useRemoveMessage, useSaveMessage } from "@components/containers/messages/messages.hooks";
import { Message } from "@/domain/messages";
import MessageCard from "@components/containers/messages/message/MessageCard";
import { MdAdd } from "react-icons/md";
import { useTranslation } from "next-i18next";
import { useQueryClient } from "react-query";
import { useCallback } from "react";

const getEmptyMessage = () => ({
  title: "",
  content: "",
  endDate: new Date(),
  id: "",
  active: true,
});

interface MutableMessageProps {
  message: Message,
  index: number,
  onRemove: (index: number) => void
}

function MutableMessageCard({ message, index, onRemove }: MutableMessageProps) {
  const { mutate: onSaveMessage, isLoading: isSavingLoading } = useSaveMessage();
  const { mutate: onDeleteMessage, isLoading: isRemovingLoading } = useRemoveMessage();
  return (
    <MessageCard
      message={message}
      onSubmit={onSaveMessage}
      onDelete={(message) => {
        console.log(message.id);
        if (message.id.length !== 0) {
          return onDeleteMessage(message);
        }
        return onRemove(index);
      }}
      isLoading={isSavingLoading || isRemovingLoading}
    />
  );
}

function MessagesAdminPage() {
  const { t } = useTranslation();
  const { data, isLoading, isSuccess } = useAdminMessages();
  const queryClient = useQueryClient();

  const addMessage = useCallback(() => {
    queryClient.setQueryData(["messages", "admin"], (prev: Message[] | undefined) => {
      prev?.push(getEmptyMessage());
      return prev || [];
    });
  }, [queryClient]);

  const removeUnsavedMessage = useCallback((index: number) => {
    queryClient.setQueryData(["messages", "admin"], (prev: Message[] | undefined) => {
      prev?.splice(index, 1);
      return prev || [];
    });
  }, [queryClient]);

  return (
    <Container>
      {
        (isLoading) && (
          <VStack>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </VStack>
        )
      }
      {
        (isSuccess && data) && (
          data.length !== 0 ? (
            data?.map((message, key) => (
                <MutableMessageCard
                  message={message}
                  key={key}
                  onRemove={removeUnsavedMessage}
                  index={key}
                />
              ),
            )) : (
            <Center>
              <Heading as={"h1"} size={"md"}>
                {t("no-messages")}
              </Heading>
            </Center>
          )
        )
      }
      {
        (isLoading) && (
          <Center>
            <CircularProgress isIndeterminate />
          </Center>
        )
      }
      <Button
        aria-label={"agregar mensaje"}
        leftIcon={<MdAdd />}
        style={{
          position: "fixed",
          bottom: "1.5em",
          right: "1.5em",
        }}
        colorScheme={"orange"}
        onClick={addMessage}
      >
        {t("message-add")}
      </Button>
    </Container>
  );
}

export default MessagesAdminPage;

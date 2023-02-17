import { Message, MessageDTO } from "@/domain/messages";
import { Card, CardBody } from "@chakra-ui/card";
import useMessageEditor from "@components/containers/messages/message/useMessageEditor";
import {
  Button,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { MdDelete, MdDone } from "react-icons/md";
import styles from "./message.module.css";

export interface IProps {
  message: Message;
  onSubmit: (message: MessageDTO) => void;
  onDelete: (message: Message) => void;
  isLoading: boolean;
}

function MessageCard({ message, onSubmit, onDelete, isLoading }: IProps) {
  const { t } = useTranslation();
  const {
    editedMessage,
    actions,
    hasChanged,
    getMessage,
  } = useMessageEditor(message);

  const { title, content, endDate, active } = editedMessage;
  return (
    <Card>
      <CardBody>
        <Flex justifyContent={"flex-end"}>
          <Heading flex={1} as={"h3"} size={"md"}>
            <Editable value={title} onChange={actions.setTitle} placeholder={"titulo"}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Heading>
          <Checkbox isChecked={active} onChange={() => actions.setActive(!active)} />
        </Flex>
        <Editable value={content} onChange={actions.setContent} placeholder={"descripcion"}>
          <EditablePreview />
          <EditableTextarea />
        </Editable>
        <Flex justifyContent={"space-between"}>
          <div className={styles["date-container"]}>
            <Input
              variant={"filled"}
              colorScheme={"orange"}
              placeholder={"dia de expiracion"}
              size={"md"}
              type={"date"}
              value={endDate}
              className={styles["date-input"]}
              onChange={({ target }) => actions.setDate(target.value)}
            />
          </div>
          <Button
            rightIcon={<MdDelete />}
            colorScheme={"red"}
            onClick={() => onDelete(message)}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {t("delete")}
          </Button>
          {
            (hasChanged || message.id.length === 0) && (
              <IconButton
                aria-label={"confirm"}
                icon={<MdDone />}
                colorScheme={"green"}
                onClick={() => {
                  const messageDTO = getMessage();
                  if (messageDTO) {
                    onSubmit(messageDTO);
                  }
                }}
                isLoading={isLoading}
                disabled={isLoading}
              />
            )
          }
        </Flex>
      </CardBody>
    </Card>
  );
}

export default MessageCard;

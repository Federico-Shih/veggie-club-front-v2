import { Message, MessageDTO } from "@/domain/messages";
import { useMemo, useState } from "react";

function useMessageEditor(initialMessage: Message) {
  const [title, setTitle] = useState(initialMessage.title);
  const [content, setContent] = useState(initialMessage.content);
  const [date, setDate] = useState(initialMessage.endDate.toISOString().substring(0, 10));
  const [active, setActive] = useState(initialMessage.active);
  const getMessage = (): MessageDTO | undefined => {
    if (!isNaN(Date.parse(date))) {
      return {
        title,
        content,
        endDate: new Date(date),
        active,
        id: initialMessage.id,
      };
    }
  };
  const hasChanged = useMemo(() => {
    return (title !== initialMessage.title || content !== initialMessage.content || date !== initialMessage.endDate.toISOString().substring(0, 10) || active !== initialMessage.active);
  }, [active, content, date, initialMessage.active, initialMessage.content, initialMessage.endDate, initialMessage.title, title]);
  return {
    editedMessage: {
      title,
      content,
      endDate: date,
      active,
      id: initialMessage.id,
    },
    hasChanged,
    actions: {
      setTitle,
      setContent,
      setDate,
      setActive,
    },
    getMessage,
  };
}

export default useMessageEditor;

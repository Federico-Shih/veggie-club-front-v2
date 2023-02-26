import { Category } from "@/domain/categories";
import { HStack, Tag } from "@chakra-ui/react";
import styles from "../menu/taglist.module.css";

interface IProps {
  categories: Category[];
  selectedId: string;
  onSelectTag: (selectedId: string) => void;
}

function TagList({ categories, selectedId, onSelectTag }: IProps) {
  return (
    <HStack spacing="10px" overflowX="scroll" overflowY="hidden">
      {
        categories.map(({ name, id }) => (
          <div key={id} className={styles.tag}>
            <Tag
              size={"lg"}
              variant={(selectedId === id) ? "solid" : "outline"}
              onClick={() => {
                if (selectedId !== id) {
                  onSelectTag(id);
                } else {
                  onSelectTag("");
                }
              }}
              colorScheme={"orange"}
              style={{
                textTransform: "capitalize",
              }}
            >
              {name.toLowerCase()}
            </Tag>
          </div>
        ))
      }
    </HStack>
  );
}

export default TagList;

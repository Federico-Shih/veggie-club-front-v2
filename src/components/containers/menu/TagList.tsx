import { Category } from "@/domain/categories";
import { HStack, Tag } from "@chakra-ui/react";
import styles from "./taglist.module.css";

interface IProps {
  categories: Category[];
  selectedId: string;
  onSelectTag: (selectedId: string) => void;
}

function TagList({ categories, selectedId, onSelectTag }: IProps) {
  return (
    <HStack spacing="10px" overflowX="scroll">
      {
        categories.map(({ name, id }) => (
          <div key={id} className={styles.tag}>
            <Tag
              size={"lg"}
              variant={(selectedId === id) ? "solid" : "outline"}
              onClick={() => {
                onSelectTag(id);
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

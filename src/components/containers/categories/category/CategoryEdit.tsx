import { Category } from "@/domain/categories";
import { Editable, EditableInput, EditablePreview, IconButton } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

import styles from "../category.module.css";

interface IProps {
  category: Category;
  onSave: (category: Category) => void;
  onDelete: (category: Category) => void;
}

/*
<TagLabel>{category.name}</TagLabel>
 */

function CategoryEdit({ category, onSave, onDelete }: IProps) {
  const [categoryName, setCategoryName] = useState(category.name);
  return (
    <Editable
      value={categoryName}
      onChange={setCategoryName}
      onSubmit={(value) => {
        if (value !== category.name) {
          onSave({ ...category, name: value });
        }
      }}
      className={styles["editable-tag"]}
    >
      <EditablePreview className={styles.full} />
      <EditableInput className={styles.full} />
      <IconButton
        aria-label={"borrar-categoria"}
        icon={<MdDelete />}
        colorScheme={"red"}
        variant={"ghost"}
        onClick={() => onDelete(category)}
      />
    </Editable>
  );
}

export default CategoryEdit;

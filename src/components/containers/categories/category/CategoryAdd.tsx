import { Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/modal";
import { Button, Input } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { CategoryDTO } from "@/domain/categories";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryDTO: CategoryDTO) => Promise<void>;
  isLoading: boolean;
}

function CategoryAdd({ isOpen, onClose, onSubmit, isLoading }: IProps) {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");
  const onSubmitClicked = () => {
    return onSubmit({ name: categoryName });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Input
            placeholder={"horno"}
            value={categoryName}
            onChange={
              ({ target }) => setCategoryName(target.value)
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={"red"} onClick={onClose} marginRight={5}>
            {t("admin.category.delete.cancel")}
          </Button>
          <Button colorScheme={"green"} onClick={onSubmitClicked} isLoading={isLoading} disabled={isLoading}>
            {t("admin.category.save.add")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CategoryAdd;

import { Food } from "@/domain/foods";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import { useRef } from "react";
import { Button } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  pendingFood: Food | null;
}

function FoodDeleteModal({ isOpen, onClose, pendingFood, onSubmit }: IProps) {
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("admin.delete.title")}
          </AlertDialogHeader>

          <AlertDialogBody>
            {t("admin.delete.body").replace("%", pendingFood?.name || "")}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("admin.delete.cancelbutton")}
            </Button>
            <Button colorScheme="red" onClick={() => onSubmit()} ml={3}>
              {t("admin.delete.deletebutton")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default FoodDeleteModal;

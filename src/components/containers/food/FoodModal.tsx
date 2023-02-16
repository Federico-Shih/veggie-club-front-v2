import { Food } from "@/domain/foods";
import { Category } from "@/domain/categories";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import Image from "next/image";
import { Box, HStack, Tag, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { getImageUrl, mapCategories } from "../menu.helpers";

interface IProps {
  food: Food | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

function FoodModal({ food, categories: loadedCategories, isOpen, onClose }: IProps) {
  const categoryMapper = useMemo(() => {
    return mapCategories(loadedCategories);
  }, [loadedCategories]);
  if (food === null) {
    return <></>;
  }
  const { name, imageSource, description, categories } = food;
  return (
    <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px) hue-rotate(20deg)"
      />
      <ModalContent>
        <ModalHeader style={{ position: "relative" }}>
          <div style={{ height: "10em", position: "relative" }}>
            <Image fill src={getImageUrl(imageSource)} alt={name} style={{ objectFit: "cover" }} />
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems={"start"}>
            <Box textStyle={"h1"}>
              {name}
            </Box>
            <div>
              {description}
            </div>
            <HStack>
              {categories.map((categoryId) => (
                categoryMapper.has(categoryId) &&
                <Tag key={categoryId}>
                  {categoryMapper.get(categoryId)?.name}
                </Tag>
              ))}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default React.memo(FoodModal);

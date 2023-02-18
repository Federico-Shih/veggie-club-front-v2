import { Food } from "@/domain/foods";
import { Category } from "@/domain/categories";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import Image from "next/image";
import { Box, HStack, Tag, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { getImageUrl, mapCategories } from "../menu.helpers";
import { dayMapper } from "@components/containers/menu/day-selector/DaySelector";

interface IProps {
  food: Food | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onDayTagClick: (day: number) => void;
  onCategoryTagClick: (categoryId: string) => void;
}

function FoodModal({ food, categories: loadedCategories, isOpen, onClose, onDayTagClick, onCategoryTagClick }: IProps) {
  const categoryMapper = useMemo(() => {
    return mapCategories(loadedCategories);
  }, [loadedCategories]);
  if (food === null) {
    return <></>;
  }
  const { name, imageSource, description, categories, weekdays } = food;
  return (
    <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px) hue-rotate(20deg)"
      />
      <ModalContent gap={5}>
        <ModalHeader style={{ position: "relative" }}>
          <ModalCloseButton />
        </ModalHeader>
        <div style={{ height: "14em", position: "relative", width: "100%" }}>
          <Image fill src={getImageUrl(imageSource)} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <ModalBody>
          <VStack alignItems={"start"} gap={2}>
            <Box textStyle={"h1"}>
              {name}
            </Box>
            <div>
              {description}
            </div>
            <HStack>
              {categories.map((categoryId) => (
                categoryMapper.has(categoryId) &&
                <Tag key={categoryId} onClick={() => {
                  onCategoryTagClick(categoryId);
                }}>
                  {categoryMapper.get(categoryId)?.name}
                </Tag>
              ))}
            </HStack>
            <HStack>
              {weekdays.map((number) => (
                <Tag key={number} colorScheme={"orange"} onClick={() => {
                  onDayTagClick(number);
                }}>
                  {dayMapper[number]}
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

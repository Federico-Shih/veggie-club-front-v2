import { Food, FoodDTO } from "@/domain/foods";
import { Category } from "@/domain/categories";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { mapCategories } from "../menu.helpers";
import { Field, FieldArray, Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import TagSelector from "@components/containers/food/categories/TagSelector";
import DaySelector from "@components/containers/food/weekdays/MultipleSelector";
import { dayMapper } from "@components/containers/menu/day-selector/DaySelector";
import EditImageModal from "@components/containers/food/image/EditImageModal";
import SelectImageInput from "@components/containers/food/image/SelectImageInput";
import { MdDelete, MdSave } from "react-icons/md";

const emptyFood: FoodDTO = {
  name: "",
  description: "",
  imageSource: "",
  categories: [],
  weekdays: [],
  active: true,
};

function getEmptyCategory(): Category {
  return { id: "", name: "" };
}

interface IProps {
  food: Food | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: FoodDTO) => Promise<void>;
  onDelete: () => void;
  isDeleting: boolean;
}

function FoodAdminModal({
                          food,
                          categories: loadedCategories,
                          isOpen,
                          onClose,
                          onSave,
                          onDelete,
                          isDeleting = true,
                        }: IProps) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageBlob, setEditedImageBlob] = useState<Blob>();

  useEffect(() => {
    if (isOpen) {
      setSelectedImage("");
      setEditedImage("");
      setEditedImageBlob(undefined);
    }
  }, [isOpen]);

  const { onClose: onCloseImage, onOpen: onOpenImage, isOpen: isImageOpen } = useDisclosure();

  const categoryMapper = useMemo(() => {
    return mapCategories(loadedCategories);
  }, [loadedCategories]);
  const shownFood = useMemo(() => {
    return food ? food : emptyFood;
  }, [food]);

  const { imageSource } = shownFood;

  return (
    <>
      <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(8px) hue-rotate(20deg)"
        />
        <ModalContent>
          <ModalCloseButton />
          <Formik
            initialValues={food || emptyFood}
            onSubmit={
              async (values, actions) => {
                if (editedImageBlob) {
                  values.imageSource = editedImageBlob;
                }
                await onSave(values);
                actions.setSubmitting(false);
              }
            }
          >
            {
              ({ isSubmitting, values }) => (
                <Form>
                  <ModalHeader />
                  <div style={{ marginTop: 10 }}>
                    <SelectImageInput
                      onImageSelected={(src) => {
                        if (editedImageBlob) {
                          URL.revokeObjectURL(editedImage);
                        }
                        setSelectedImage(src);
                        onOpenImage();
                      }}
                      src={imageSource as string}
                      editedImage={editedImage}
                      style={{ objectFit: "cover" }}
                      fill
                      alt={"input"}
                    />
                  </div>
                  <ModalBody>
                    <VStack alignItems={"start"}>
                      <Field name={"name"}>
                        {
                          ({ field, form }: any) => (
                            <FormControl>
                              <FormLabel>{t("admin.edit.name")}</FormLabel>
                              <Input {...field} placeholder={"name"} />
                              <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                          )
                        }
                      </Field>
                      <Field name={"description"}>
                        {
                          ({ field, form }: any) => (
                            <FormControl>
                              <FormLabel>{t("admin.edit.description")}</FormLabel>
                              <Textarea {...field} placeholder={"description"} />
                              <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                            </FormControl>
                          )
                        }
                      </Field>
                      <FieldArray
                        name={"categories"}
                        render={arrayHelpers => (
                          <FormControl>
                            <FormLabel>{t("admin.edit.categories")}</FormLabel>
                            <TagSelector
                              removeElement={(category) => {
                                const index = values.categories.findIndex((categoryId) => (category.id === categoryId));
                                if (index !== -1) {
                                  arrayHelpers.remove(index);
                                }
                              }}
                              addElement={
                                (category) => {
                                  arrayHelpers.push(category.id);
                                }
                              }
                              selected={values.categories.map((id) => categoryMapper.get(id) || getEmptyCategory())}
                              elements={loadedCategories}
                              getLabel={(category) => category.name}
                              equals={(category1, category2) => category1.id === category2.id}
                            />
                          </FormControl>
                        )}
                      />
                      <FieldArray
                        name={"weekdays"}
                        render={arrayHelpers => (
                          <FormControl>
                            <FormLabel>{t("admin.edit.weekdays")}</FormLabel>
                            <DaySelector
                              addElement={arrayHelpers.push}
                              removeElement={(day) => {
                                const index = values.weekdays.findIndex((selectedDay) => selectedDay === day);
                                if (index !== -1) return arrayHelpers.remove(index);
                              }}
                              selected={values.weekdays}
                              options={[0, 1, 2, 3, 4, 5, 6]}
                              getLabel={(day) => dayMapper[day]}
                            />
                          </FormControl>
                        )}
                      />
                      <Field type={"checkbox"} name={"active"}>
                        {
                          ({ field }: any) => (
                            <Checkbox {...field} defaultChecked isChecked={values.active}>
                              {t("admin.edit.active")}
                            </Checkbox>
                          )
                        }
                      </Field>
                      <Flex gap={5}>
                        <Button
                          type={"submit"}
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                          colorScheme={"green"}
                          leftIcon={<MdSave />}
                        >
                          Guardar
                        </Button>
                        <Button
                          colorScheme={"red"}
                          leftIcon={<MdDelete />}
                          disabled={!food || isDeleting}
                          onClick={() => onDelete()}
                          isLoading={isDeleting}
                        >
                          Borrar
                        </Button>
                      </Flex>
                    </VStack>
                  </ModalBody>
                </Form>
              )
            }
          </Formik>
        </ModalContent>
      </Modal>
      <EditImageModal
        imgSrc={selectedImage}
        onFinishEditing={(source, blob) => {
          setEditedImage(source);
          setEditedImageBlob(blob);
        }}
        isOpen={isImageOpen}
        onClose={onCloseImage}
      />
    </>
  );
}

export default React.memo(FoodAdminModal);

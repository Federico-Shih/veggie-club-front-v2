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
import { MdDelete, MdSave } from "react-icons/md";
import dynamic from "next/dynamic";
import { dayMapper } from "@components/containers/menu/day-selector/DaySelector";
import TagSelector from "@components/containers/food/categories/TagSelector";
import MultipleSelector from "@components/containers/food/weekdays/MultipleSelector";

const EditImageModal = dynamic(() => import("@components/containers/food/image/EditImageModal"), { ssr: false });
const SelectImageInput = dynamic(() => import("@components/containers/food/image/SelectImageInput"), { ssr: false });

const emptyFood: FoodDTO = {
  name: "",
  description: "",
  imageSource: "",
  categories: [],
  weekdays: [0, 1, 2, 3, 4, 5, 6],
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
  onSave: (params: { foodDTO: FoodDTO, prevFood: Food | null }) => void;
  onDelete: () => void;
  isDeleting: boolean;
  isSaving: boolean;
}

function FoodAdminModal({
                          food,
                          categories: loadedCategories,
                          isOpen,
                          onClose,
                          onSave,
                          onDelete,
                          isDeleting,
                          isSaving,
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

  const validateLength = (fieldName: string) => {
    return (value: string) => {
      if (value.trim().length >= 30) return t("admin.edit.save.error.length").replace("%", t(fieldName));
      return undefined;
    };
  };

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
                /*
                 Prevenir submit si:
                 1. No tiene nombre
                 2. Si son iguales y no se cambio la imagen
                 */
                const _ = (await import("lodash")).default;
                if ((_.isEqual(values, food) && !editedImageBlob) || values.name === "") {
                  return;
                }

                const submitValues = { ...values, id: food?.id };
                // Reemplazar imagen actual
                if (editedImageBlob) {
                  submitValues.imageSource = editedImageBlob;
                } else {
                  // Si no se eligio imagen, el valor inicial es el plato original
                  if (food) {
                    submitValues.imageSource = food?.imageSource;
                  } else {
                    // Si no se eligio imagen y se quiere subir, agregar una imagen default
                    const emptyImage = await fetch("/empty.jpg");
                    submitValues.imageSource = await emptyImage.blob();
                  }
                }
                await onSave({ foodDTO: submitValues, prevFood: food });
              }
            }
          >
            {
              ({ values }) => (
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
                      <Field name={"name"} validate={validateLength("admin.edit.field.name")}>
                        {
                          ({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
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
                              removeElement={(category: Category) => {
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
                            <MultipleSelector
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
                          isLoading={isSaving}
                          disabled={isSaving}
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

import { Flex, Select, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { useMemo } from "react";

interface IProps<T> {
  removeElement: (element: T) => void;
  addElement: (element: T) => void;
  selected: T[];
  elements: T[];
  getLabel: (element: T) => string;
  equals: (element1: T, element2: T) => boolean;
}

function TagSelector<T>(
  {
    removeElement,
    addElement,
    selected,
    elements,
    getLabel,
    equals,
  }: IProps<T>,
) {
  const availableOptions = useMemo(() => {
    return elements
      .filter(
        (category) =>
          (
            !selected
              .some(
                (selectedCategory) => equals(selectedCategory, category),
              )
          ),
      );
  }, [elements, equals, selected]);
  return (
    <Flex style={{ width: "100%" }} wrap={"wrap"} gap={2}>
      {
        selected.map((element, index) => (
          <Tag size={"md"} key={index} variant={"outline"} colorScheme={"orange"}>
            <TagLabel>{getLabel(element)}</TagLabel>
            <TagCloseButton onClick={() => {
              removeElement(element);
            }} />
          </Tag>
        ))
      }
      <div style={{ width: 45 }}>
        <Select style={{ height: 24 }} icon={<MdAdd />} onChange={(event) => {
          const { target } = event;
          addElement(availableOptions[parseInt(target.value, 10)]);
        }}>
          {
            availableOptions.map((element, index) => (
              <option key={index} value={index}>
                {getLabel(element)}
              </option>
            ))
          }
        </Select>
      </div>
    </Flex>
  );
}

export default TagSelector;

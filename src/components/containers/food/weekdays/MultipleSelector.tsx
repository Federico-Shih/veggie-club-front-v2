import { Button, Flex } from "@chakra-ui/react";

interface IProps<T> {
  addElement: (element: T) => void;
  removeElement: (element: T) => void;
  selected: T[];
  options: T[];
  getLabel: (element: T) => string;
}

function MultipleSelector<T>(props: IProps<T>) {
  const { addElement, removeElement, selected, options, getLabel } = props;
  const toggleElement = (isSelected: boolean, element: T) => {
    return isSelected ? removeElement(element) : addElement(element);
  };
  return (
    <Flex wrap={"wrap"} gap={2}>
      {
        options.map((option, index) => {
          const isSelected = selected.some((value) => value === option);
          return (
            <Button
              key={index}
              variant={
                isSelected ? "outline" : "solid"
              }
              colorScheme={"orange"}
              onClick={() => toggleElement(isSelected, option)}
            >
              {getLabel(option)}
            </Button>
          );
        })
      }
    </Flex>
  );
}

export default MultipleSelector;

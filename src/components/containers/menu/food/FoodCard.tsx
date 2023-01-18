import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import Image from "next/image";
import { Food } from "@/domain/foods";

interface IProps {
  food: Food;
  onClick: (food: Food) => void;
}

function FoodCard({ food, onClick }: IProps) {
  return (
    <Card onClick={() => onClick(food)}>
      <CardHeader style={{ position: "relative", height: "6em" }}>
        <Image fill src={food.imageSource} alt={food.name} style={{ objectFit: "cover", filter: "brightness(50%)" }} />
      </CardHeader>
      <CardBody>
        {food.name}
      </CardBody>
    </Card>
  );
}

export default FoodCard;

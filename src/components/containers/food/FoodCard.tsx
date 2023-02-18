import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import Image from "next/image";
import { Food } from "@/domain/foods";
import { getImageUrl } from "@components/containers/menu.helpers";

interface IProps {
  food: Food;
  onClick: (food: Food) => void;
}


function FoodCard({ food, onClick }: IProps) {
  return (
    <Card onClick={() => onClick(food)} w={"100%"}>
      <CardHeader style={{ position: "relative", height: "6em" }}>
        <Image
          fill
          priority={true}
          sizes="(max-width:768px) 40vw, (max-width: 1200px) 30vw, 150px"
          src={getImageUrl(food.imageSource)}
          alt={food.name}
          style={{ objectFit: "cover", filter: "brightness(50%)" }}
        />
      </CardHeader>
      <CardBody>
        {food.name}
      </CardBody>
    </Card>
  );
}

export default FoodCard;

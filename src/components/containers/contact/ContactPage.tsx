import { Divider, Grid, GridItem, Icon, VStack } from "@chakra-ui/react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";

const contactInfo = [{
  icon: MdLocationPin,
  title: "Visitanos",
  description: "Junín 1087",
  link: "https://goo.gl/maps/NewR4A1Wb3He4Tdn6",
},
  {
    icon: FaWhatsapp,
    title: "Escribínos",
    description: "+1550034171",
    link: "https://goo.gl/maps/NewR4A1Wb3He4Tdn6",
  },
  {
    icon: FaInstagram,
    title: "Síguenos",
    description: "@veggie.club",
    link: "https://www.instagram.com/veggie.club/",
  },
];

function ContactPage() {
  return (
    <VStack gap={10}>
      <iframe
        style={{ width: "100%", height: "45vh" }}
        src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.329169035132!2d-58.3995416847705!3d-34.59583698046152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca9660558e29%3A0x4937e3fe81b590a4!2sVeggie%20Club!5e0!3m2!1ses-419!2sar!4v1609964546301!5m2!1ses-419!2sar"} />
      <VStack>
        {
          contactInfo.map(({ icon, title, description, link }, index) => (
            <div key={index}>
              <Grid gridTemplateColumns={"30px 70vw"} gridTemplateRows={"25px 25px"} templateAreas={
                `"icon title"
              "icon description"`
              }>
                <GridItem area={"icon"}>
                  <Icon as={icon} />
                </GridItem>
                <GridItem style={{ fontWeight: 600 }} area={"title"}>
                  {title}
                </GridItem>
                <GridItem area={"description"}>
                  <a href={link}>{description}</a>
                </GridItem>
              </Grid>
              <Divider />
            </div>
          ))
        }
      </VStack>
    </VStack>
  );
}

export default ContactPage;

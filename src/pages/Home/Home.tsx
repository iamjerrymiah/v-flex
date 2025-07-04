import { Box } from "@chakra-ui/react";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import AnimateRoute from "../../common/AnimateRoute";
import HeroSection from "./components/HeroSection";
import PromotionalSection from "./components/PromotionalSection";
import TestimonialSection from "./components/TestimonialSection";
import FashionSection from "./components/FashionSection";
import WomenFashionSection from "./components/WomenFashionSection";
import SneakerCollection from "./components/SneakerCollection";
import { Container } from "../../styling/layout";
import VisionSection from "./components/VisionSection";

function HomeMain() {
  return (
    <Box bg="white" color="black" >
        <HeroSection />
        <Container>
            <VisionSection />
        </Container>
        <Container>
            <FashionSection />
        </Container>
        <PromotionalSection />
        <Container>
            <WomenFashionSection />
        </Container>
        <SneakerCollection />
        <Container>
            <TestimonialSection />
        </Container>
    </Box>
  );
};

export default function HomePage () {
    return(
        <PageMainContainer title='Home' description='Home'>
            <MainAppLayout px="">
                <AnimateRoute>
                    <HomeMain />
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}


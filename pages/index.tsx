import React from "react";

import { Card, Container, Footer, Header, Main } from "@components";
import { CardStatus } from "@components/card";

const Home: React.FC = () => {
  return (
    <Container>
      <Header />
      <Main />
      <Card status={CardStatus.BACKLOG} title={"제목"} description={"설명"} />
      <Footer />
    </Container>
  );
};

export default Home;

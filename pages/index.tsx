import React from "react";

import { Card, CardList, Container, Footer, Header } from "@components";
import { CardStatus } from "@components/card";

const taskCards = [
  { id: 1, title:"제목", desc: "설명" }, 
  { id: 2, title:"제목1", desc: "설명1" }, 
  { id: 3, title:"제목2", desc: "설명2" }
]

const Home: React.FC = () => {
  return (
    <Container>
      <Header />
      <main>
        <CardList title={"백로그"}>
          {taskCards.map((card) => {
            return <Card className={"my-2"} key={card.id} status={CardStatus.BACKLOG} title={card.title} description={card.desc} />
          })}
        </CardList>
        
      </main>
      <Footer />
    </Container>
  );
};

export default Home;

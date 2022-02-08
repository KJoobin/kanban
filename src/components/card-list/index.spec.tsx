import { render, screen } from "@test";
import { CardList } from "./index";
import { expect } from "@jest/globals";
import { Card } from "@components";
import { CardStatus } from "@components/card";

describe("카드 리스트 컴포넌트", () => {
  it("정상적으로 렌더가 된다", () => {
    render(<CardList title={"백로그"}/>);

    expect(screen).toBeTruthy();
  });

  it("title 이 정상적으로 렌더가 된다", async () => {
    render(<CardList title={"백로그"}/>);

    const title = await screen.findByText("백로그");
    expect(title).toBeTruthy();
  });

  it("Card 가 Card List 에 정상적으로 렌더된다", async () => {
    render(<CardList title={"백로그"}><Card status={CardStatus.BACKLOG} title={"할일"} description={"해야할 일"}></Card></CardList>)

    const cardTitle = await screen.findByText("할일");
    expect(cardTitle).toBeTruthy();

    const cardDesc = await screen.findByText("해야할 일");
    expect(cardDesc).toBeTruthy();
  })
  
  it("Cards 가 Card List 에 정상적으로 렌더된다", async () => {
    render(<CardList title={"백로그"}>
      <Card status={CardStatus.BACKLOG} title={"할일"} description={"해야할 일"} />
      <Card status={CardStatus.BACKLOG} title={"할일1"} description={"해야할 일1"} />
    </CardList>)

    const cardTitle = await screen.findByText("할일");
    const cardDesc = await screen.findByText("해야할 일");
    expect(cardTitle).toBeTruthy();
    expect(cardDesc).toBeTruthy();

    const card1Title = await screen.findByText("할일1");
    const card1Desc = await screen.findByText("해야할 일1");
    expect(card1Title).toBeTruthy();
    expect(card1Desc).toBeTruthy();
  })
});

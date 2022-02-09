import { render, screen } from "@test";
import { CardList } from "./index";
import { describe, expect, it, jest } from "@jest/globals";
import { Card } from "@components";
import { fireEvent } from "@testing-library/dom";

describe("카드 리스트 컴포넌트", () => {
  it("정상적으로 렌더가 된다", () => {
    render(<CardList title={"백로그"} onCreateCard={jest.fn()}/>);

    expect(screen).toBeTruthy();
  });

  it("title 이 정상적으로 렌더가 된다", async () => {
    render(<CardList title={"백로그"} onCreateCard={jest.fn()}/>);

    const title = await screen.findByText("백로그");
    expect(title).toBeTruthy();
  });

  it("Card 가 Card List 에 정상적으로 렌더된다", async () => {
    render(<CardList title={"백로그"} onCreateCard={jest.fn()}>
      <Card status={"backlog"} title={"할일"} description={"해야할 일"}></Card>
    </CardList>)

    const cardTitle = await screen.findByText("할일");
    expect(cardTitle).toBeTruthy();

    const cardDesc = await screen.findByText("해야할 일");
    expect(cardDesc).toBeTruthy();
  })
  
  it("Cards 가 Card List 에 정상적으로 렌더된다", async () => {
    render(<CardList title={"백로그"} onCreateCard={jest.fn()}>
      <Card status={"backlog"} title={"할일"} description={"해야할 일"} />
      <Card status={"backlog"} title={"할일1"} description={"해야할 일1"} />
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

describe("카드 새로 만들기", () => {
  it("should called onCreateCard function when fire click event in button", async () => {
    const onCreateCard = jest.fn();
    render(<CardList title={"백로그"} onCreateCard={onCreateCard}/>)
  
    const createCardBtn = await screen.findByText("새 카드 만들기");
    fireEvent.click(createCardBtn);

    expect(onCreateCard).toBeCalledTimes(1);
  })
  
})

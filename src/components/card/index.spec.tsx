import { render, screen } from "@test";
import { Card } from "./index";
import { TaskStatus } from "@recoil/atoms";
import { describe, expect, it } from "@jest/globals";


describe("카드 컴포넌트", () => {
  it("정상적으로 렌더가 된다", () => {
    render(<Card status={TaskStatus.BACKLOG} />);

    expect(screen).toBeTruthy();
  });

  it("title 과, description 이 정상적으로 렌더가 된다", async () => {
    render(<Card status={TaskStatus.BACKLOG} title={"할일1"} description={"해야하는일 1"} />);

    const title = await screen.findByText("할일1");
    expect(title).toBeTruthy();

    const desc = await screen.findByText("해야하는일 1");
    expect(desc).toBeTruthy();
  });
});

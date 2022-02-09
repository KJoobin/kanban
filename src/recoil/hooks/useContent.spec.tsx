import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders, render, screen, fireEvent } from "@test";

import { useContent } from "@recoil/hooks";

describe("Recoil useContent Hook", () => {
  it("should set initial value \"\" ", async () => {
    const { result } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });
    const [ content ] = result.current;

    expect(content).toBe("");
  });
  
  it("content 가 적절한 값으로 변해야 합니다.", async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });
    
    const [ _, { onChange } ] = result.current;
    render(<h1 contentEditable={true} onInput={onChange} data-testid={"heading"}/>)
    const heading = await screen.findByTestId("heading");
    act(() => {
      fireEvent.input(heading, { target: { textContent: "input heading" } });
      // debounce
      jest.runOnlyPendingTimers();
    });

    const [ content ] = result.current;

    expect(content).toBe("input heading");
  })

  it("2개 이상의 content hook 을 사용할때", async () => {
    jest.useFakeTimers();
    const { result:titleResult } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });
    const { result:descResult } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });

    const [ _, { onChange: onChangeTitle } ] = titleResult.current;
    const [ __, { onChange: onChangeDesc } ] = descResult.current;
    render(<>
      <h1 contentEditable={true} onInput={onChangeTitle} data-testid={"heading"}/>
      <p contentEditable onInput={onChangeDesc} data-testid={"paragraph"} />
    </>)
    const heading = await screen.findByTestId("heading");
    const paragraph = await screen.findByTestId("paragraph");

    act(() => {
      fireEvent.input(heading, { target: { textContent: "input heading" } });
      fireEvent.input(paragraph, { target: { textContent: "input paragraph" } });
      // debounce
      jest.runOnlyPendingTimers();
    });
    const [ title ] = titleResult.current;
    expect(title).toBe("input heading");

    const [ desc ] = descResult.current;
    expect(desc).toBe("input paragraph");
  })
});

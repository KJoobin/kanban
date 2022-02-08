import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders, render, screen, fireEvent } from "@test";

import { useContent } from "@recoil/hooks";

describe("Recoil useContent Hook", () => {
  it("should set initial value \"\" ", async () => {
    const { result } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });
    const [content] = result.current;

    expect(content).toBe("");
  });
  
  it("content 가 적절한 값으로 변해야 합니다.", async () => {
    const { result } = renderHook(() => useContent(), {
      wrapper: AllTheProviders,
    });
    
    const [_, { onChange }] = result.current;
    render(<h1 contentEditable={true} onInput={onChange} data-testid={"heading"}/>)
    const heading = await screen.findByTestId("heading");
    act(() => {
      fireEvent.input(heading, { target: { textContent: "input heading" } });
    });

    const [content] = result.current;

    expect(content).toBe("input heading");
  })
});

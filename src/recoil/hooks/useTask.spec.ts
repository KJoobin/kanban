import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders } from "@test";

import { useTask } from "./useTask";
import { TaskStatus } from "@recoil/atoms";

describe("Recoil useTask Hook", () => {
  it("should set initial value to empty object", async () => {
    const { result } = renderHook(() => useTask(), {
      wrapper: AllTheProviders,
    });
    const [taskList] = result.current;

    expect(taskList).toStrictEqual({});
  });

  it("should make task", async () => {
    const { result } = renderHook(() => useTask(), {
      wrapper: AllTheProviders,
    });
    const [_, { createTask }] = result.current;
    let key = "";
    act(() => {
      key = createTask({ status: TaskStatus.BACKLOG, title: "할일", desc: "해야할 일" });
    });

    const [taskList] = result.current;

    expect(taskList).toMatchObject({ [key]: { status: TaskStatus.BACKLOG, title:"할일", desc:"해야할 일" } })
  });

  it("should update task", async () => {
    const { result } = renderHook(() => useTask(), {
      wrapper: AllTheProviders,
    });
    const [_, { createTask }] = result.current;
    let id = "";

    act(() => {
      id = createTask({ status: TaskStatus.BACKLOG, title: "할할일", desc: "해야할 일" });
    });

    let updateTaskResult = false;
    const [__, { updateTask }] = result.current;
    act(() => {
      updateTaskResult = updateTask(id, { title: "할일" })
    });
    expect(updateTaskResult).toBe(true);
    
    const [taskList] = result.current
    expect(taskList).toMatchObject({ [id]: { status: TaskStatus.BACKLOG, title: "할일", desc:"해야할 일", id } })
  })

  it("should delete task", async () => {
    const { result } = renderHook(() => useTask(), {
      wrapper: AllTheProviders,
    });
    const [_, { createTask }] = result.current;
    let id = "";
    act(() => {
      id = createTask({ status: TaskStatus.BACKLOG, title: "지워질 일", desc: "다 한일" });
    });
    
    const [__, { deleteTask }] = result.current
    act(() => {
      deleteTask(id);
    })

    const [taskList] = result.current;
    expect(taskList).toStrictEqual({});
  })
});

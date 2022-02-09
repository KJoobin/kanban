import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders } from "@test";

import { useTasks } from "./useTasks";

describe("Recoil useTask Hook", () => {
  it("should set initial value to empty array", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: AllTheProviders,
    });
    const [taskList] = result.current;

    expect(taskList).toStrictEqual([]);
  });

  it("should make task", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: AllTheProviders,
    });

    let [tasks, { createTask }] = result.current;
    act(() => {
      createTask({ title: "할일", desc: "해야할 일" });
    });

    [tasks, { createTask }] = result.current;
    expect(tasks[0]).toMatchObject({ title:"할일", desc:"해야할 일" } )


    act(() => {
      createTask({ title: "할일1", desc: "해야할 일1" });
    })

    tasks = result.current[0];
    expect(tasks[1]).toMatchObject({ title:"할일1", desc:"해야할 일1" } )
  });

  it("should update task", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: AllTheProviders,
    });
    const [_, { createTask }] = result.current;

    let id = ""
    act(() => {
      id = createTask({ title: "할할일", desc: "해야할 일" }).id;
    });

    const [__, { updateTask }] = result.current;
    act(() => {
      updateTask(id, { title: "할일" })
    });

    const [tasks] = result.current;
    expect(tasks[0]).toMatchObject({ title: "할일", desc: "해야할 일" });
  })

  it("should delete task", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: AllTheProviders,
    });
    const [_, { createTask }] = result.current;
    let id = "";
    act(() => {
      id = createTask({ title: "지워질 일", desc: "다 한일" }).id;
    });
    
    const [__, { deleteTask }] = result.current
    act(() => {
      deleteTask(id);
    })

    const [taskList] = result.current;
    expect(taskList).toStrictEqual([]);
  })
});

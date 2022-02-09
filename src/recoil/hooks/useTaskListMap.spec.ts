import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders } from "@test";

import { useTaskListMap } from "@recoil/hooks/useTaskListMap";

describe("Recoil useTaskListMap Hook", () => {
  it("default value empty array", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders,
    });
    const [ taskListMap ] = result.current;
    expect(taskListMap).toStrictEqual([]);
  })

  it("should matching taskList and task into task id", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders,
    });
    
    const { createTaskList } = result.current[1]
    let taskListId = "";
    act(() => {
      taskListId = createTaskList({ status:"backlog", title:"백로그" }).id
    });
    
    const { createTask } = result.current[1]
    let taskId = "";
    act(() => {
      taskId = createTask(taskListId, { title: "백로그 입니다.", desc: "백로그 desc" }).id;
    })
    
    const taskListMap = result.current[0];
    
    expect(taskListMap).toBeTruthy();
    expect(taskListMap[0]).toMatchObject({ id:taskListId, title: "백로그", status:"backlog" });
    expect(taskListMap[0].tasks.get(0)).toMatchObject({ id:taskId, title:"백로그 입니다.", desc: "백로그 desc" });
  })
})
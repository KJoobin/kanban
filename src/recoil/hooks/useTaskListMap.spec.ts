import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-hooks";
import { AllTheProviders } from "@test";
import { v4 as uuid } from "uuid";

import { useTaskListMap } from "@recoil/hooks/useTaskListMap";

describe("Recoil useTaskListMap Hook", () => {
  it("should set initial value to empty array", async () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders,
    });
    const [taskList] = result.current;

    expect(taskList).toStrictEqual([]);
  });

  it("create taskList", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })
    
    const [_, { createTaskList }] = result.current;
    let id = "";
    act(() => {
      id = createTaskList({ title:"백 로그", status: "backlog" }).id;
    });
    
    const [taskListMap] = result.current;
    expect(taskListMap).toHaveLength(1);
    expect(taskListMap[0]).toMatchObject({ id, title:"백 로그", status: "backlog" });
  })
  
  it("update taskList", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current;
    let id = "";
    act(() => {
      id = createTaskList({ title:"백 로그", status: "backlog" }).id;
    });

    const [__, { updateTaskList }] = result.current;
    act(() => {
      updateTaskList(id, { title: "진행 중", status: "inProgress" });
    })

    const [taskListMap] = result.current;
    expect(taskListMap).toHaveLength(1);
    expect(taskListMap[0]).toMatchObject({ id, title:"진행 중", status: "inProgress" });
  })
  
  it("add task", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current;
    let id = "";
    act(() => {
      id = createTaskList({ title:"백 로그", status: "backlog" }).id;
    });

    const taskId = uuid();
    const [__, { addTask }] = result.current;
    act(() => {
      addTask(id, taskId);
    })
    
    let taskListMap = result.current[0];
    expect(taskListMap[0].tasks.size).toBe(1);
    expect(taskListMap[0].tasks.get(0)).toStrictEqual({ id: taskId });
    
    const task2Id = uuid(); 
    act(() => {
      result.current[1].addTask(id, task2Id);
    })

    taskListMap = result.current[0];
    expect(taskListMap[0].tasks.size).toBe(2);
    expect(taskListMap[0].tasks.get(1)).toStrictEqual({ id: task2Id });
  })

  it("add task nth", () => {
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current

    let taskListId = "";
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    let taskId = "";

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      taskId = uuid();
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const taskListMap = result.current[0];
    expect(taskListMap[0].tasks.size).toBe(10);
    expect(taskListMap[0].tasks.get(9)).toMatchObject({ id: taskId })
  })
});

describe("delete task", () => {
  it("delete first task", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { deleteTask } = result.current[1];
    act(() => {
      const result = deleteTask(taskListId, taskIds[0]);
      expect(result).toBe(true);
    })

    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(0)).toBeTruthy();
    expect(taskListMap[0].tasks.get(0)).toHaveProperty("id", taskIds[1]);
  })

  it("delete last task", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }
    
    const { deleteTask } = result.current[1];
    act(() => {
      deleteTask(taskListId, taskIds[9]);
    })

    const taskListMap = result.current[0]
    for(let i = 0; i < 9; i += 1) {
      expect(taskListMap[0].tasks.get(i)).toBeTruthy();
      expect(taskListMap[0].tasks.get(i)).toHaveProperty("id", taskIds[i]);
    }
  })

  it("delete 3th task", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { deleteTask } = result.current[1];
    act(() => {
      deleteTask(taskListId, taskIds[2]);
    })

    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(1)).toHaveProperty("id", taskIds[1]);
    expect(taskListMap[0].tasks.get(2)).toHaveProperty("id", taskIds[3]);
  })
})

describe("updateTaskOrder", () => {
  it("from last to first", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { updateTaskOrder } = result.current[1];
    act(() => {
      updateTaskOrder(taskListId, taskIds[9], 0);
    })


    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(0)).toHaveProperty("id", taskIds[9]);
    expect(taskListMap[0].tasks.get(1)).toHaveProperty("id", taskIds[0]);
    expect(taskListMap[0].tasks.get(9)).toHaveProperty("id", taskIds[8]);
  })
  it("from last to 5th", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { updateTaskOrder } = result.current[1];
    act(() => {
      updateTaskOrder(taskListId, taskIds[9], 5);
    })


    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(4)).toHaveProperty("id", taskIds[4]);
    expect(taskListMap[0].tasks.get(5)).toHaveProperty("id", taskIds[9]);
    expect(taskListMap[0].tasks.get(9)).toHaveProperty("id", taskIds[8]);
  })
  it("from fist to last", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { updateTaskOrder } = result.current[1];
    act(() => {
      updateTaskOrder(taskListId, taskIds[0], 9);
    })


    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(0)).toHaveProperty("id", taskIds[1]);
    expect(taskListMap[0].tasks.get(1)).toHaveProperty("id", taskIds[2]);
    expect(taskListMap[0].tasks.get(9)).toHaveProperty("id", taskIds[0]);
  })
  it("from fist to 3th", () => {
    let taskListId = "";
    const taskIds:Array<string> = [];
    const { result } = renderHook(() => useTaskListMap(), {
      wrapper: AllTheProviders
    })

    const [_, { createTaskList }] = result.current
    act(() => {
      taskListId = createTaskList({ title: "백 로그", status: "backlog" }).id;
    })

    for(let i = 0; i < 10; i += 1) {
      const { addTask } = result.current[1];
      const taskId = uuid();
      taskIds.push(taskId);
      act(() => {
        addTask(taskListId, taskId);
      })
    }

    const { updateTaskOrder } = result.current[1];
    act(() => {
      updateTaskOrder(taskListId, taskIds[0], 3);
    })


    const taskListMap = result.current[0]
    expect(taskListMap[0].tasks.get(0)).toHaveProperty("id", taskIds[1]);
    expect(taskListMap[0].tasks.get(3)).toHaveProperty("id", taskIds[0]);
    expect(taskListMap[0].tasks.get(4)).toHaveProperty("id", taskIds[4]);
  })
})

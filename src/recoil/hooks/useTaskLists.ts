import { useRecoilState } from "recoil";

import { TaskList, taskListsStatus } from "@recoil/atoms";
import { Atoms } from "@recoil/constants"
import { v4 as uuid } from "uuid";
import { deepCopy, storage } from "@utils";
import { useEffect } from "react";

type TaskListInput = Omit<TaskList, "id" | "created_at" | "updated_at" | "tasks">;

export interface UseTaskLists {
  taskLists: Array<TaskList>;
  createTaskList: (input: TaskListInput) => TaskList;
  updateTaskList: (id:string, input: Partial<TaskListInput>) => TaskList;
  addTask: (id: string, taskId:string) => string;
  deleteTask: (id:string, taskId:string) => boolean;
  updateTaskOrder: (id:string, taskId:string, to:number) => TaskList;
}

export const useTaskLists: () => [
  UseTaskLists["taskLists"],
  Omit<UseTaskLists, "taskLists">
] = () => {
  const [ taskLists, setTaskListMap ] = useRecoilState<UseTaskLists["taskLists"]>(taskListsStatus);

  const createTaskList:UseTaskLists["createTaskList"] = (input) => {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const tasks = new Map();

    const taskList:TaskList = { ...input, tasks, id, created_at:createdAt, updated_at:updatedAt };
    setTaskListMap([ ...deepCopy(taskLists), taskList ]);

    return deepCopy(taskList);
  }

  const updateTaskList:UseTaskLists["updateTaskList"] = (id, input) => {
    const copiedTaskListMap = deepCopy(taskLists);
    
    const taskListIndex = copiedTaskListMap.findIndex(taskList => taskList.id === id);
    if(taskListIndex === -1) throw new Error("id가 옳지 않습니다.");
    
    const updatedAt = new Date().toISOString();
    const taskList = { ...copiedTaskListMap[taskListIndex], ...input, updated_at:updatedAt };
    copiedTaskListMap[taskListIndex] = taskList;
    setTaskListMap(copiedTaskListMap);

    return deepCopy(taskList)
  }

  const addTask:UseTaskLists["addTask"] = (id, taskId) => {
    const copiedTaskListMap = deepCopy(taskLists);

    const taskListIndex = copiedTaskListMap.findIndex(taskList => taskList.id === id);
    if(taskListIndex === -1) throw new Error("id가 옳지 않습니다.");

    const tasks = copiedTaskListMap[taskListIndex].tasks;
    tasks.set(tasks.size, { id:taskId });
    copiedTaskListMap[taskListIndex].updated_at = new Date().toISOString();

    setTaskListMap(copiedTaskListMap);
    return taskId;
  }

  const deleteTask:UseTaskLists["deleteTask"] = (id, taskId) => {
    const copiedTaskListMap = deepCopy(taskLists);
    
    const taskListIndex = copiedTaskListMap.findIndex(taskList => taskList.id === id);
    if(taskListIndex === -1) throw new Error("id가 옳지 않습니다.");

    const tasks = copiedTaskListMap[taskListIndex].tasks;
    const tasksSize = tasks.size;
    let taskKey:number | undefined;
    tasks.forEach((value, key) => {
      if(value.id === taskId) {
        taskKey = key;
      }
    })
    if(taskKey === undefined) return false;
    
    tasks.delete(taskKey)
      
    for(let i = taskKey; i < tasksSize - 1; i += 1) {
      if(tasks.has(taskKey + 1)) {
        tasks.set(i, tasks.get(taskKey + 1)!);
      }
    }

    setTaskListMap(copiedTaskListMap);
    return true;
  }

  const updateTaskOrder:UseTaskLists["updateTaskOrder"] = (id, taskId, to) => {
    const copiedTaskListMap = deepCopy(taskLists);

    const taskListIndex = copiedTaskListMap.findIndex(taskList => taskList.id === id);
    if(taskListIndex === -1) throw new Error("id가 옳지 않습니다.");

    const tasks = copiedTaskListMap[taskListIndex].tasks;
    const tasksEntries = tasks.entries();

    let result = tasksEntries.next();
    while(!result.done && result.value[1].id !== taskId) {
      result = tasksEntries.next();
    }
    if(result.value[1].id !== taskId) throw new Error("존재하지 않는 task 입니다.");
    const fromTaskKey = result.value[0];
    const fromTaskValue = result.value[1];

    if(fromTaskKey === to) throw new Error("같은 자리로 옮길수 없습니다.");

    if(fromTaskKey > to) {
      for(let i = fromTaskKey; i > to; i -= 1) {
        tasks.set(i, tasks.get(i - 1)!);
      }
      tasks.set(to, fromTaskValue);
    } else {
      for(let i = fromTaskKey; i < to; i += 1) {
        tasks.set(i, tasks.get(i + 1)!);
      }
      tasks.set(to, fromTaskValue);
    }

    setTaskListMap(copiedTaskListMap);

    return deepCopy(copiedTaskListMap[taskListIndex]);
  }


  useEffect(() => {
    const storageTaskList = storage.get(Atoms.TaskLists);
    if(storageTaskList) {
      setTaskListMap(storageTaskList);
    }
  },[])

  useEffect(() => {
    const setTaskList = () => {
      storage.set(Atoms.TaskLists, taskLists);
    }
    window.addEventListener("beforeunload",setTaskList);
    return () => {
      window.removeEventListener("beforeunload",setTaskList);
    }
  },[ taskLists ])

  return [ taskLists, { createTaskList, updateTaskList, addTask, deleteTask, updateTaskOrder } ];
};

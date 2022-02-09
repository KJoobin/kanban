import { useRecoilState } from "recoil";

import { Task, tasksState } from "@recoil/atoms";
import { Atoms } from "@recoil/constants";
import { v4 as uuid } from "uuid";
import { deepCopy, storage } from "@utils";
import { useEffect } from "react";

export type TaskInput = Omit<Task, "id" | "created_at" | "updated_at">;

export interface UseTasks {
  tasks: Array<Task>;
  getTask: (id:string) => Task;
  createTask: (input:TaskInput) => Task;
  updateTask: (id:string, input: Partial<TaskInput>) => Task;
  deleteTask: (id:string) => boolean;
}

export const useTasks: () => [
  UseTasks["tasks"],
  Omit<UseTasks, "tasks">
] = () => {
  const [ tasks, setTasks ] = useRecoilState<UseTasks["tasks"]>(tasksState);

  const getTask:UseTasks["getTask"] = (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if(index === -1) throw new Error("테스크가 존재하지 않습니다.");

    return tasks[index];
  }

  const createTask:UseTasks["createTask"] = (taskInput) => {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const copiedTasks = deepCopy(tasks);
    const task = { ...taskInput, id, created_at:createdAt, updated_at:updatedAt };
    copiedTasks.push(task);
    
    setTasks(copiedTasks);
    return deepCopy(task);
  };
  
  const updateTask:UseTasks["updateTask"] = ( id, input) => {
    const copiedTasks = deepCopy(tasks);

    const taskIndex = copiedTasks.findIndex(taskList => taskList.id === id);
    if(taskIndex === -1) throw new Error("존재하지 않는 테스크 입니다.");

    const task = { ...copiedTasks[taskIndex], ...input, updated_at: new Date().toISOString() };
    copiedTasks[taskIndex] = task
    setTasks(copiedTasks);

    return deepCopy(task);
  }

  const deleteTask:UseTasks["deleteTask"] = (id: string) => {
    const copiedTasks = deepCopy(tasks);

    const taskIndex = copiedTasks.findIndex(taskList => taskList.id === id);
    if(taskIndex === -1) throw new Error("존재하지 않는 테스크 입니다.");

    setTasks([ ...copiedTasks.slice(0, taskIndex), ...copiedTasks.slice(taskIndex + 1) ]);

    return true;
  };
  
  useEffect(() => {
    const storageTaskList = storage.get(Atoms.Tasks);
    if(storageTaskList) {
      setTasks(storageTaskList);
    }
  },[])

  useEffect(() => {
    const setTaskList = () => {
      storage.set(Atoms.Tasks, tasks);
    }
    window.addEventListener("beforeunload",setTaskList);
    return () => {
      window.removeEventListener("beforeunload",setTaskList);
    }
  },[ tasks ])

  return [ tasks, { getTask, createTask, updateTask, deleteTask } ];
};

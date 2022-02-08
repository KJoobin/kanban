import { useRecoilState } from "recoil";

import { Task, taskListState } from "@recoil/atoms";
import { v4 as uuid } from "uuid";
import { deepCopy, storage } from "@utils";
import { useEffect } from "react";

export const useTask: () => [
  Record<string, Task>,
  {
    createTask: (task:Omit<Task, "id" | "created_at" | "updated_at">) => string;
    updateTask: (id:string, input: Partial<Omit<Task, "id" | "created_at" | "updated_at">>) => boolean;
    deleteTask: (id: string) => void
  },
] = () => {
  const [taskList, setTaskList] = useRecoilState<Record<string,Task>>(taskListState);

  const createTask = (task:Omit<Task, "id" | "created_at" | "updated_at">) => {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    setTaskList({ ...taskList, [id]: { ...task, id, created_at:createdAt, updated_at:updatedAt } })

    return id;
  };
  
  const updateTask = (id:string, input:Partial<Omit<Task, "id" | "created_at" | "updated_at">>) => {
    if(!taskList[id]) return false;
    
    const deepCopyTaskList = deepCopy(taskList);
    deepCopyTaskList[id] = { ...deepCopyTaskList[id], updated_at:new Date().toISOString() ,...input }
    setTaskList(deepCopyTaskList);

    return true;
  }

  const deleteTask = (id: string) => {
    const deepCopyTaskList = deepCopy(taskList)
    delete deepCopyTaskList[id];

    setTaskList(deepCopyTaskList);
  };
  
  useEffect(() => {
    const storageTaskList = storage.get("taskList");
    if(storageTaskList) {
      setTaskList(storageTaskList);
    }
  },[])

  useEffect(() => {
    const setTaskList = () => {
      storage.set("taskList", taskList);
    }
    window.addEventListener("beforeunload",setTaskList);
    return () => {
      window.removeEventListener("beforeunload",setTaskList);
    }
  },[taskList])

  return [taskList, { createTask, updateTask, deleteTask }];
};

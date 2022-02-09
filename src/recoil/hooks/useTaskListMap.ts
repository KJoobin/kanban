import { useTasks, useTaskLists, TaskInput, UseTaskLists, UseTasks } from "@recoil/hooks";
import { Task, taskListMapStatus, TaskListMap } from "@recoil/atoms";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { deepCopy } from "@utils";

interface UseTaskListMap {
  createTask: (listId:string, taskInput: TaskInput) => Task;
  createTaskList: UseTaskLists["createTaskList"];
  updateTaskOrder: UseTaskLists["updateTaskOrder"];
  updateTask: UseTasks["updateTask"];
}

export const useTaskListMap: () => [
  Array<TaskListMap>, UseTaskListMap
] = () => {
  const [ taskListMap, setTaskListMap ] = useRecoilState(taskListMapStatus);
  const [ originTasks, { createTask, deleteTask, getTask, updateTask } ] = useTasks();
  const [ originTaskLists, { createTaskList, addTask, updateTaskOrder } ] = useTaskLists();
  
  const createTaskMap:UseTaskListMap["createTask"] = (id, input) => {
    let task:Task |null = null;
    try{
      task = createTask(input);
      addTask(id, task.id);
    }catch (e) {
      if(task) {
        deleteTask(task.id);
      }
      throw e;
    }
    return task;
  } 
  
  useEffect(() => {
    const taskLists = deepCopy(originTaskLists);

    const mappingTaskList = taskLists.map(taskList => {
      const tasksMap = taskList.tasks.entries();

      const newTaskMap = new Map();
      let result = tasksMap.next();
      while(!result.done) {
        const [ key, value ] = result.value;
        newTaskMap.set(key, getTask(value.id));

        result = tasksMap.next();
      }
      return { ...taskList, tasks: newTaskMap };
    })

    setTaskListMap(mappingTaskList);
  },[ originTasks, originTaskLists ])
  
  return [ taskListMap, { createTask: createTaskMap, createTaskList, updateTaskOrder, updateTask } ];
};

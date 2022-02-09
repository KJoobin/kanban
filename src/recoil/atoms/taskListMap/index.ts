import { atom } from "recoil";
import { Atoms } from "@recoil/constants";
import { Task } from "@recoil/atoms/tasks";
import { TaskList } from "@recoil/atoms";


export interface TaskListMap extends TaskList {
  tasks: Map<number, Task>
}

export const taskListMapStatus = atom<Array<TaskListMap>>({
  key: Atoms.TaskListMap,
  default: []
});

import { atom } from "recoil";
import { Atoms } from "@recoil/constants";
import { Task } from "@recoil/atoms/tasks";

export interface TaskList {
  id: string;
  status: string;
  title: string;
  tasks: Map<number, Pick<Task, "id">>;
  created_at: string;
  updated_at: string;
}

export const taskListsStatus = atom<Array<TaskList>>({
  key: Atoms.TaskLists,
  default: []
});

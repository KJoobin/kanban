import { atom } from "recoil";
import { Atoms } from "@recoil/constants";

export enum TaskStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

export interface Task {
  id: string;
  status: TaskStatus
  title?: string;
  desc?: string;
  created_at: string;
  updated_at: string;
}

export const taskListState = atom<Record<string, Task>>({
  key: Atoms.Task,
  default: {}
});

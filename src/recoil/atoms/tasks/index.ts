import { atom } from "recoil";
import { Atoms } from "@recoil/constants";

export interface Task {
  id: string;
  title?: string;
  desc?: string;
  created_at: string;
  updated_at: string;
}

export const tasksState = atom<Array<Task>>({
  key: Atoms.Tasks,
  default: []
});

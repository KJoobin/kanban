import { atom } from "recoil";
import { Atoms } from "@recoil/constants";

export const contentState = atom<string>({
  key: Atoms.Content,
  default: ""
});

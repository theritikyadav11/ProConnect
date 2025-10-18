import { atom } from "recoil";

export const authAtom = atom({
  key: "authAtom",
  default: {
    token: null,
    user: null,
  },
});

import { atom } from "recoil";

export const feedTypeAtom = atom({
  key: "feedTypeAtom",
  default: "professional", // or 'community'
});

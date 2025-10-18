import { atom } from "recoil";

export const connectionsAtom = atom({
  key: "connectionsAtom",
  default: [], // array of connection requests or connections
});

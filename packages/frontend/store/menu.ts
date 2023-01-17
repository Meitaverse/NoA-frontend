import { atom } from "jotai";

const activeMenu = atom({
  firstLevel: "Governance",
  secondLevel: "",
});

export { activeMenu };

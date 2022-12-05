import { atom } from "jotai";

const activeMenu = atom({
  firstLevel: '',
  secondLevel: ''
})

export {
  activeMenu
}
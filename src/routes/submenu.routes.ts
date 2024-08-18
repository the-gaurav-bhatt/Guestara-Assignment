import express from "express";
import {
  createSubMenu,
  getSubMenusByMenu,
  getSubmenuByNameOrId,
} from "./submenu.controller";
import { upload } from "./menu.routes";

export const submenuRouter = express.Router();

submenuRouter.post(
  "/createSubMenu/:menuId",
  upload.single("subImg"),
  createSubMenu
);
submenuRouter.get("/getSubMenusByMenu/:menuId", getSubMenusByMenu);
submenuRouter.get("/getSubmenuByNameOrId/:idOrName", getSubmenuByNameOrId);
submenuRouter.patch(
  "uploadSubMenu/:subMenuI",
  upload.single("subImg"),
  createSubMenu
);

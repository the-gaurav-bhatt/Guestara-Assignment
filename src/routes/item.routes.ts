import express from "express";
import { upload } from "./menu.routes";
import {
  createItem,
  getAllItems,
  getMenuItem,
  getItemByNameOrId,
  updateItem,
  searchItemByName,
} from "./item.controller";

export const itemRouter = express.Router();

itemRouter.post("/createItem", upload.single("ItemImg"), createItem);
itemRouter.get("/getAllItems", getAllItems);
itemRouter.get("/getMenuItem/:menuId", getMenuItem);
itemRouter.get("/getItemByNameOrId/:idOrName", getItemByNameOrId);
itemRouter.patch("/updateItem/:itemId", upload.single("ItemImg"), updateItem);
itemRouter.get("/searchItemByName", searchItemByName);

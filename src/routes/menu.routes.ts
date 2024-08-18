import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createMenu, getMenu, updateMenu } from "./menu.controller";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "/uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
export const menuRouter = express.Router();

menuRouter.post("/createMenu", upload.single("menuImg"), createMenu);
menuRouter.get("/getMenu/:idOrName", getMenu);
menuRouter.patch("updateMenu/:menuId", upload.single("menuImg"), updateMenu);

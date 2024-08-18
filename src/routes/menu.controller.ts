import { NextFunction, Request, Response } from "express";
import { Menu } from "../model/menu";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { getImage, getMimeType } from "../utility/getImage";

// Type for Menu data without image
interface MenuData {
  name: string;
  description: string;
  taxApplicable: boolean;
  taxNumber: number;
  taxType: number;
}

// Create Menu
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuData: MenuData = JSON.parse(req.body.data);
    const img = req.file;

    const menu = new Menu({
      name: menuData.name,
      description: menuData.description,
      taxApplicable: menuData.taxApplicable,
      taxType: menuData.taxType,
      taxNumber: menuData.taxNumber,
      image: img?.path,
    });

    const savedMenu = await menu.save();
    res
      .status(201)
      .json({ message: "Menu created successfully", menu: savedMenu });
  } catch (error) {
    next(error);
  }
};

// Get All Menus
export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    next(error);
  }
};

// Get Menu by ID or Name
export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idOrName } = req.params;

    // Check if idOrName is a valid ObjectId
    const isValidObjectId = mongoose.isValidObjectId(idOrName);

    const query = isValidObjectId
      ? { _id: idOrName }
      : { name: new RegExp(idOrName, "i") };

    const menu = await Menu.findOne(query);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (menu.image) {
      const imagePath = menu.image;
      const imageData = await getImage(imagePath);
      return res.status(200).json({
        ...menu.toObject(),
        imageData: imageData, // Send the raw image data
        imageMimeType: getMimeType(imagePath), // Replace with correct MIME type (image/png, etc.)
      });
    } else {
      return res.status(200).json(menu);
    }
  } catch (error) {
    next(error);
  }
};

export const updateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuId = req.params.menuId; // Assuming menuId is a route parameter
    const updates = req.body; // Assuming updates are sent in the request body

    // Find the menu by ID
    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Handle image update separately (if needed)
    if (req.file) {
      const img = req.file;
      // Delete the old image if it exists
      if (menu.image) {
        const imagePath = menu.image;
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });
      }
      // Update with the new image path
      menu.image = img.path;
    }

    // Update other menu attributes
    Object.assign(menu, updates);

    // Save the updated menu
    await menu.save();

    res.status(200).json({ message: "Menu updated", menu: menu });
  } catch (error) {
    next(error);
  }
};

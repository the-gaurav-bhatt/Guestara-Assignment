import { NextFunction, Request, Response } from "express";
import { Menu } from "../model/menu";
import mongoose from "mongoose";
import { getImage, getMimeType } from "../utility/getImage";
import { subMenu } from "../model/sub-menu";
import fs from "fs";
// import { Category } from "../model/category"; // Assuming you have a Category model

export const createSubMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    console.log(req.body.data);
    const sub = JSON.parse(req.body.data);
    const img = req.file;

    // Use category values if not provided in the request
    const taxApplicable = sub.taxApplicable ?? menu.taxApplicable;
    const taxNumber = sub.taxNumber ?? menu.taxNumber;

    const subM = new subMenu({
      name: sub.name,
      description: sub.description,
      taxApplicable: taxApplicable,
      taxNumber: taxNumber,
      image: img?.path,
      menuId,
    });

    const result = await subM.save();

    res
      .status(201)
      .json({ message: "SubMenu created successfully", subMenu: result });
  } catch (error) {
    next(error);
  }
};
export const getSubMenusByMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { menuId } = req.params;
    const subMenus: any = await subMenu.find({ menuId });
    const subMenusWithImageData = await Promise.all(
      subMenus.map(async (subMenu: any) => {
        if (subMenu.image) {
          subMenu.imageData = await getImage(subMenu.image);
          subMenu.imageMimeType = getMimeType(subMenu.image);
        }
        return subMenu;
      })
    );

    res.status(200).json(subMenusWithImageData);
  } catch (error) {
    next(error);
  }
};

// Get SubMenu by Name or ID
export const getSubmenuByNameOrId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idOrName } = req.params;

    // Check if idOrName is a valid ObjectId
    const isValidObjectId = mongoose.isValidObjectId(idOrName);

    // Construct the query based on whether it's an ID or name
    const query = isValidObjectId
      ? { _id: idOrName }
      : { name: new RegExp(idOrName, "i") };

    const subMenuData = await subMenu.findOne(query);

    if (!subMenuData) {
      return res.status(404).json({ message: "SubMenu not found" });
    }

    if (subMenuData.image) {
      const imagePath = subMenuData.image;
      const imageData = await getImage(imagePath);
      return res.status(200).json({
        ...subMenuData.toObject(),
        imageData: imageData,
        imageMimeType: getMimeType(imagePath),
      });
    } else {
      // If no image, send the data without image details
      return res.status(200).json(subMenuData);
    }
  } catch (error) {
    next(error);
  }
};
export const updateSubMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subMenuId = req.params.subMenuId; // Assuming subMenuId is a route parameter
    const updates = req.body;

    // Find the submenu by ID
    const subMenuData = await subMenu.findById(subMenuId);

    if (!subMenuData) {
      return res.status(404).json({ message: "SubMenu not found" });
    }

    // Handle image update separately (if needed)
    if (req.file) {
      const img = req.file;
      // Delete the old image if it exists
      if (subMenuData.image) {
        const imagePath = subMenuData.image;
        fs.unlink(imagePath, (err: any) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });
      }
      // Update with the new image path
      subMenuData.image = img.path;
    }

    // Update other submenu attributes
    Object.assign(subMenuData, updates);

    // Save the updated submenu
    await subMenuData.save();

    res.status(200).json({ message: "SubMenu updated", subMenu: subMenuData });
  } catch (error) {
    next(error);
  }
};

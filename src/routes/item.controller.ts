import { NextFunction, Request, Response } from "express";
import { Menu } from "../model/menu";
import { Item } from "../model/item";
import mongoose from "mongoose";
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuId = (req.query.menuId as string) || null;
    const subMenuId = (req.query.subMenuId as string) || null;
    const ite = JSON.parse(req.body.data);
    const img = req.file;
    console.log(img?.path);
    const category = await Menu.findById(menuId);
    const subCategory = await Menu.findById(subMenuId);
    if (category || subCategory) {
      const newItem = new Item({
        ...ite,
        image: img?.path,
        menuId: category ? menuId : null,
        subMenuId: subCategory ? subMenuId : null,
      });
      if (!newItem.taxApplicable && category?.taxApplicable) {
        newItem.taxApplicable = true;
        //@ts-ignore
        newItem.taxNumber = category.taxNumber;
      }
      await newItem.save();
      return res.status(201).json(newItem);
    } else {
      return res
        .status(404)
        .json({ message: "Category or subCategory missing" });
    }
  } catch (error) {
    next(error);
  }
};
export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resp = await Item.find({});
    if (resp) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: "No items found" });
    }
  } catch (err) {
    next(err);
  }
};
export const getMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { menuId } = req.params;

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu with that id not found" });
    }
    const resp = await Item.find({ menuId });
    if (resp) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: "No items found" });
    }
  } catch (err) {
    next(err);
  }
};
export const getSubMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subMenuId } = req.params;

  try {
    const menu = await Menu.findById(subMenuId);
    if (!menu) {
      return res
        .status(404)
        .json({ message: "Submenu with that id not found" });
    }
    const resp = await Item.find({ subMenuId });
    if (resp) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: "No items found" });
    }
  } catch (err) {
    next(err);
  }
};
export const getItemByNameOrId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idOrName } = req.params;

  // Check if idOrName is a valid ObjectId
  const isValidObjectId = mongoose.isValidObjectId(idOrName);

  const query = isValidObjectId
    ? { _id: idOrName }
    : { name: new RegExp(idOrName, "i") };
  try {
    const resp = await Item.find(query);
    if (resp) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: "No items found" });
    }
    //   const resp = await Item.findById(itemId);
    //   if (resp) {
    //     return res.status(200).json(resp);
    //   }
    // }

    // if (itemName) {
    //   // Handle itemName query
    //   const resp = await Item.findOne({ name: new RegExp(itemName, "i") });
    //   if (resp) {
    //     return res.status(200).json(resp);
    //   }
    // }

    // If neither itemId nor itemName is provided or no matching item found
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.itemId;
    const updates = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Handle tax applicability based on new category
    if (updates.taxApplicable !== undefined) {
      item.taxApplicable = updates.taxApplicable;

      if (!updates.taxApplicable) {
        //@ts-ignore
        item.taxNumber = undefined;
      }
    }

    // Update other attributes
    Object.assign(item, updates);

    await item.save();

    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

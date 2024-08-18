import mongoose, { InferSchemaType, Model } from "mongoose";
import { subMenuSchema } from "./sub-menu";

const menuModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: String,
  taxApplicable: Boolean,
  taxNumber: {
    type: Number,
    required: false,
  },
  taxType: {
    type: String,
    default: null,
  },
});

export type Imenu = InferSchemaType<typeof menuModel>;
export const Menu: Model<Imenu> = mongoose.model("Menu", menuModel);

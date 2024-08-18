import mongoose, { InferSchemaType, Mongoose, Schema } from "mongoose";
import { Menu } from "./menu";
import { Item } from "./item";

export const subMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: String,
  taxApplicable: {
    type: Boolean,
    required: true,
  },
  taxNumber: {
    type: Number,
    default: null,
  },
  menuId: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
});
export type IsubMenu = InferSchemaType<typeof subMenu>;

// subMenuSchema.pre("save", async function (next) {
//   const thatMenu = await Menu.findOne({ subMenu: this._id });
//   if (this.taxApplicable === false) {
//     if (thatMenu) {
//       this.taxApplicable = thatMenu.taxApplicable;
//     }
//   }
//   if (!this.taxNumber) {

//   }
//   next();
// });
export const subMenu = mongoose.model("subMenu", subMenuSchema);
// export default subMenu;

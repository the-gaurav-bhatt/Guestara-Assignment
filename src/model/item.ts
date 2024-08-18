import mongoose, { Schema, Document } from "mongoose";

interface IItem extends Document {
  name: string;
  image: string;
  description: string;
  taxApplicable: boolean;
  tax?: number;
  baseAmount: number;
  discount: number;
  totalAmount: number;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicable: { type: Boolean, required: true },
  taxNumber: { type: Number },

  baseAmount: { type: Number, required: true },
  discount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  menuId: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
  },
  subMenuId: {
    type: Schema.Types.ObjectId,
    ref: "subMenu",
  },
});
ItemSchema.pre("save", function (next) {
  // @ts-ignore
  this.totalAmount = this.baseAmount - this.discount;
  next();
});
const Item = mongoose.model<IItem>("Item", ItemSchema);

export { Item, IItem };

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CustomerSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: "" },
    createdAt: { type: String, required: true },
    demo: { type: Boolean, default: false },
  },
  { versionKey: false, strict: false, collection: "customers" },
);

export type CustomerDoc = InferSchemaType<typeof CustomerSchema>;
export const CustomerModel: Model<CustomerDoc> =
  mongoose.models.Customer ?? mongoose.model("Customer", CustomerSchema);

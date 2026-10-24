import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "manager", "staff"], default: "admin" },
    mobile: { type: String, default: "" },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false },
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;
export const AdminUserModel: Model<AdminUserDoc> =
  mongoose.models.AdminUser ?? mongoose.model("AdminUser", AdminUserSchema);

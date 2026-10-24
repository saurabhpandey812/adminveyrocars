import mongoose, { Schema, type Model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "manager", "staff"], default: "admin" },
    /** Plain text for now — encrypt later */
    password: { type: String, required: true },
    mobile: { type: String, default: "" },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false, strict: false },
);

if (mongoose.models.AdminUser) {
  delete mongoose.models.AdminUser;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AdminUserModel: Model<any> = mongoose.model("AdminUser", AdminUserSchema);

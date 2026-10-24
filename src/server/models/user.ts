import mongoose, { Schema, type Model } from "mongoose";

const UserSchema = new Schema(
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
  { versionKey: false, collection: "users" },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserModel: Model<any> = mongoose.models.User ?? mongoose.model("User", UserSchema);

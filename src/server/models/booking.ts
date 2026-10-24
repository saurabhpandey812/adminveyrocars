import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BookingSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    carSlug: { type: String, required: true, index: true },
    pickupLocation: { type: String, required: true },
    pickupAt: { type: String, required: true },
    returnAt: { type: String, required: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    drivingLicenceNumber: { type: String, required: true },
    idProofType: { type: String, required: true, enum: ["aadhaar", "passport", "voter-id", "pan"] },
    message: { type: String },
    status: { type: String, required: true, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending", index: true },
    estimatedTotal: { type: Number, required: true },
    rentalAmount: { type: Number },
    demo: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

export type BookingDoc = InferSchemaType<typeof BookingSchema>;
export const BookingModel: Model<BookingDoc> = mongoose.models.Booking ?? mongoose.model("Booking", BookingSchema);

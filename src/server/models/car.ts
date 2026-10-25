import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ImageSchema = new Schema({ src: { type: String, required: true }, alt: { type: String, required: true } }, { _id: false });

const CarSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    carNumber: { type: String, default: "", index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, enum: ["Hatchback", "Sedan", "SUV", "Premium"] },
    year: { type: Number, required: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true, enum: ["Manual", "Automatic"] },
    fuel: { type: String, required: true, enum: ["Petrol", "Diesel", "CNG", "Electric"] },
    pricePerDay: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    images: { type: [ImageSchema], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, required: true, enum: ["available", "unavailable", "maintenance"], default: "available" },
  },
  { timestamps: true, versionKey: false, collection: "cars" },
);

export type CarDoc = InferSchemaType<typeof CarSchema>;
export const CarModel: Model<CarDoc> = mongoose.models.Car ?? mongoose.model("Car", CarSchema);

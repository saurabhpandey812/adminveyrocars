export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type IdProofType = "aadhaar" | "passport" | "voter-id" | "pan";

export interface BookingRequest {
  carSlug: string;
  pickupLocation: string;
  pickupAt: string; // ISO
  returnAt: string; // ISO
  fullName: string;
  mobile: string;
  email: string;
  drivingLicenceNumber: string;
  idProofType: IdProofType;
  message?: string;
}
export interface Booking extends BookingRequest {
  id: string;
  userId: string;
  status: BookingStatus;
  estimatedTotal: number; // rental + deposit
  rentalAmount?: number; // rental only (revenue)
  demo?: boolean;
  createdAt: string;
}

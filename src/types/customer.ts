export interface Customer {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  /** Present when customer registered on website (plain for now) */
  password?: string;
  createdAt: string;
  demo?: boolean;
}

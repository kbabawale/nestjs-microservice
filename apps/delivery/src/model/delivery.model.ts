export interface VehicleField {
  model: string;
  make: string;
  numberPlate: string;
  color: string;
  id?: string;
}
export class DispatchOperatorField {
  fullname: string;
  profileImage?: string;
  phone: string;
  id: string;
  vehicle: VehicleField;
  type?: string;
}

export interface AccompanyingDocumentField {
  title: string;
  fileURL?: string;
  filePublicID?: string;
  fileSignature?: string;
  issueDate?: Date;
  expiryDate?: Date;
}

export enum MeansOfPayment {
  CASH = 'CASH',
  DEBITCARD = 'DEBITCARD',
}

export enum OrderStatus {
  ORDER_CREATED = 'ORDER_CREATED', 
  ORDER_PROCESSED = 'ORDER_PROCESSED', 
  HEADING_TO_PICKUP = 'HEADING_TO_PICKUP',
  HEADING_TO_DROPOFF = 'HEADING_TO_DROPOFF',
  ORDER_DELIVERED = 'ORDER_DELIVERED', 
}
export enum TripStatus {
  HEADING_TO_PICKUP = 'HEADING_TO_PICKUP',
  HEADING_TO_DROPOFF = 'HEADING_TO_DROPOFF',
  COMPLETE = 'COMPLETE',
}
export interface OrderPaymentField {
  status: boolean;
  meansOfPayment: MeansOfPayment;
  paymentRef?: PaystackResponse;
}
export interface TripOrderField {
  orderID: string;
  distributorID: string;
}
export interface OrderRetailerField {
  id: string;
  businessName: string;
  email: string;
  profilePhoto: string;
  address: string;
}
export interface PaystackResponse {
  message?: string;
  redirecturl?: string;
  reference?: string;
  status?: string;
  trans?: string;
  transaction?: string;
  trxref?: string;
}
export interface TripPinField {
  pin: number;
  confirmed: boolean;
}
export interface ItemsField {
  name: string;
  id: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface DistributorField {
  name: string;
  id: string;
  profilePhoto?: string;
  address: string;
}
export interface CostBreakDownField {
  /**
   * @type {number}
   * total amount of goods purchased
   */
  items: number;
  /**
   * @type {number}
   * booking fee set by Storedash
   */
  booking: number;
  /**
   * @type {number}
   * delivery fee set by Storedash
   */
  delivery: number;
  /**
   * @type {number}
   * tax fee
   */
  tax: number;
}

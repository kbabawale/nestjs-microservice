export interface PriceField {
  currentPrice: number;
  sale: boolean;
  saleRate: number; //percentage
}

export interface ManufacturerField {
  name: string;
  country?: string;
  logo?: string;
}
export interface DistributorField {
  name: string;
  id: string;
  profilePhoto?: string;
  address: string;
  addressCoordinates: string;
}

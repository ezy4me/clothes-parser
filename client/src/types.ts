export interface IProduct {
  id?: string;
  name: string;
  price: string;
  link?: string;
  image?: string;
  brand?: string;
  images?: string[];
  sizes?: string[];
  prices?: IPrices[];
}

interface IPrices {
  id: number;
  price: number;
  date: string;
}

export interface IData {
  lamoda: IProduct[];
  brandshop: IProduct[];
  sneakerhead: IProduct[];
}

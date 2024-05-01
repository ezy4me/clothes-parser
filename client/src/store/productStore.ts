import { create } from "zustand";
import ProductAPI from "../api/productApi";
import { IData, IProduct } from "../types";

type ProductState = {
  products: IData | null;
  product: IProduct | null;
  count: number | null;
};

type ProductActions = {
  getData: (searchQuery: string) => Promise<void>;
  getOneProduct: (link: string) => Promise<void>;
  parseNewData: (searchQuery: string) => Promise<void>;
};

const useProductStore = create<ProductState & ProductActions>((set) => ({
  products: null,
  product: null,
  count: 0,
  getData: async (searchQuery) => {
    try {
      const response = await ProductAPI.getData(searchQuery);

      const data: IData = {
        lamoda: response.data.lamoda,
        brandshop: response.data.brandshop,
        sneakerhead: response.data.sneakerhead,
      };

      const count =
        data.brandshop.length + data.lamoda.length + data.sneakerhead.length;

      set({ products: data, count });
      return;
    } catch (error) {
      console.error("ERROR:", error);
    }
  },

  parseNewData: async (searchQuery) => {
    try {
      await ProductAPI.parseNewData(searchQuery);
      return;
    } catch (error) {
      console.error("ERROR:", error);
    }
  },

  getOneProduct: async (link) => {
    try {
      const response = await ProductAPI.getOneProduct(link);
      console.log(response.data);

      set({ product: response.data });
      return;
    } catch (error) {
      console.error("ERROR:", error);
    }
  },
}));

export default useProductStore;

import { apiInstance } from ".";

const ProductAPI = {
  async getData(searchQuery: string) {
    try {
      return await apiInstance.get(`api/product/?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      throw new Error();
    }
  },

  async parseNewData(searchQuery: string) {
    try {
      return await apiInstance.post(`api/product/?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      throw new Error();
    }
  },

  async getOneProduct(link: string) {
    try {
      console.log(link);
      
      return await apiInstance.get(`api/product/link/?link=${encodeURIComponent(link)}`);
    } catch (error) {
      throw new Error();
    }
  },
};

export default ProductAPI;

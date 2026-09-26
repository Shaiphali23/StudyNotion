
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  // No toast.loading here — the catalog page shows a single
  // page-level loader while all data is being fetched.
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOG_PAGE_DATA_API,
      { categoryId }
    );
    if (response.data.success) {
      result = response?.data;
    }
  } catch (error) {
    console.log("Category page details API ERROR............", error.response);
    toast.error(error?.response?.data?.message);
  }
  return result;
};

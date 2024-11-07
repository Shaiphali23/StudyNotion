
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
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
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

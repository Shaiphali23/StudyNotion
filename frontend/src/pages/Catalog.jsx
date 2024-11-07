import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/PageAndComponentData";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import CourseCard from "../components/core/Catalog/CourseCard";

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories from the backend
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const matchedCategory = res?.data?.categories?.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );
        if (matchedCategory) {
          setCategoryId(matchedCategory._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, [catalogName]);

  //Fetch category details based on the category ID
  useEffect(() => {
    const getCategoryDetails = async () => {
      if (categoryId) {
        try {
          const res = await getCatalogPageData(categoryId);
          setCatalogPageData(res);
        } catch (error) {
          console.log("Error fetching category page data:", error.message);
        }
      }
    };
    getCategoryDetails();
  }, [categoryId]);

  return (
    <div className="text-white min-h-screen">
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 py-14 mb-6">
          <p className="text-richblack-400">
            {`Home / Catalog /`}{" "}
            <span className="text-yellow-50">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-[30px] font-bold">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="text-richblack-400">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>

        <div>
          {/* Section-1 */}
          <div className="mb-24">
            <h2 className="text-2xl font-semibold mb-4">
              Courses to get you started
            </h2>
            <div className="flex gap-4 mb-4">
              <button>Most Popular</button>
              <button>New</button>
            </div>
            <CourseSlider
              Courses={catalogPageData?.data?.selectedCategory?.courses}
            />
          </div>

          {/* Section-2 */}
          <div className="mb-24">
            <div>
              {catalogPageData?.data?.differentCategories?.map(
                (category, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Top Courses in {category.name}
                    </h3>
                    <CourseSlider Courses={category.courses} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section-3 */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Frequently Bought</h3>
            
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, index) => (
                    <div
                      key={index}
                      className="p-4"
                    >
                      <CourseCard course={course} Height={"h-[400px]"} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;

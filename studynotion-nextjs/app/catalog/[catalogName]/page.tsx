"use client";
export const dynamic = "force-dynamic";
import { use, useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { apiConnector } from "@/services/apiConnector";
import { categories } from "@/services/apis";
import { getCatalogPageData } from "@/services/operations/PageAndComponentData";
import CourseSlider from "@/components/core/Catalog/CourseSlider";
import CourseCard from "@/components/core/Catalog/CourseCard";

export default function CatalogPage({
  params,
}: {
  params: Promise<{ catalogName: string }>;
}) {
  const { catalogName } = use(params);
  const [catalogPageData, setCatalogPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single loader covers ALL data fetching for this page:
  // categories list -> matched category -> catalog page data.
  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      setError(null);
      setCatalogPageData(null);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const matchedCategory = res?.data?.categories?.find(
          (ct: any) =>
            ct.name.split(" ").join("-").toLowerCase() === catalogName
        );
        if (!matchedCategory) {
          setError("Category not found.");
          return;
        }
        const data = await getCatalogPageData(matchedCategory._id);
        if (!data) {
          setError("Failed to load category page data.");
          return;
        }
        setCatalogPageData(data);
      } catch (err: any) {
        console.error("Error fetching category page data:", err);
        setError(err?.message || "Failed to load category page data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogData();
  }, [catalogName]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-richblack-500 border-t-yellow-50" />
            <p className="text-richblack-100">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-richblack-100">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
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
                  (category: any, index: number) => (
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
                    .map((course: any, index: number) => (
                      <div key={index} className="p-4">
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
    </>
  );
}

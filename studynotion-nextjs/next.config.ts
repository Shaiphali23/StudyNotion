import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  async rewrites() {
    return [
      // Backward-compat: legacy Express paths -> new simplified Next.js routes
      { source: "/api/reach/contact", destination: "/api/contact" },
      { source: "/api/v1/reach/contact", destination: "/api/contact" },
      { source: "/api/course/showAllCategories", destination: "/api/course/category" },
      { source: "/api/v1/course/showAllCategories", destination: "/api/course/category" },
      { source: "/api/course/createCategory", destination: "/api/course/category" },
      { source: "/api/v1/course/createCategory", destination: "/api/course/category" },
      { source: "/api/course/getCategoryPageDetails", destination: "/api/course/category/details" },
      { source: "/api/v1/course/getCategoryPageDetails", destination: "/api/course/category/details" },
      { source: "/api/course/createSection", destination: "/api/course/section" },
      { source: "/api/v1/course/createSection", destination: "/api/course/section" },
      { source: "/api/course/updateSection", destination: "/api/course/section" },
      { source: "/api/v1/course/updateSection", destination: "/api/course/section" },
      { source: "/api/course/deleteSection", destination: "/api/course/section" },
      { source: "/api/v1/course/deleteSection", destination: "/api/course/section" },
      { source: "/api/course/createSubSection", destination: "/api/course/subsection" },
      { source: "/api/v1/course/createSubSection", destination: "/api/course/subsection" },
      { source: "/api/course/updateSubSection", destination: "/api/course/subsection" },
      { source: "/api/v1/course/updateSubSection", destination: "/api/course/subsection" },
      { source: "/api/course/deleteSubSection", destination: "/api/course/subsection" },
      { source: "/api/v1/course/deleteSubSection", destination: "/api/course/subsection" },
      { source: "/api/course/createRatingAndReview", destination: "/api/course/rating" },
      { source: "/api/v1/course/createRatingAndReview", destination: "/api/course/rating" },
      { source: "/api/course/getAverageRating", destination: "/api/course/rating" },
      { source: "/api/v1/course/getAverageRating", destination: "/api/course/rating" },
      { source: "/api/course/getAverageRating/:path*", destination: "/api/course/rating" },
      { source: "/api/v1/course/getAverageRating/:path*", destination: "/api/course/rating" },
      { source: "/api/course/getAllRatings", destination: "/api/course/ratings" },
      { source: "/api/v1/course/getAllRatings", destination: "/api/course/ratings" },
      { source: "/api/course/updateCourseProgress", destination: "/api/course/progress" },
      { source: "/api/v1/course/updateCourseProgress", destination: "/api/course/progress" },
      { source: "/api/payment/sendPaymentSuccessEmail", destination: "/api/payment/successEmail" },
      { source: "/api/v1/payment/sendPaymentSuccessEmail", destination: "/api/payment/successEmail" },
      // Generic /api/v1 prefix -> /api for all exact-match routes
      // (auth, course CRUD, profile, payment capture/verify)
      { source: "/api/v1/:path*", destination: "/api/:path*" },
    ];
  },
};

export default nextConfig;

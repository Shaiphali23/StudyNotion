import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <p className="text-sm text-richblack-300 mb-8">
        {totalItems} {totalItems === 1 ? "course" : "courses"} in cart
      </p>

      {total > 0 ? (
        <div className="space-y-8">
          <RenderCartCourses />
          <div>
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <div>Your cart is empty</div>
      )}
    </div>
  );
}

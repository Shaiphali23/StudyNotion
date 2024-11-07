import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { useNavigate } from "react-router-dom";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch);
  };
  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold text-richblack-200">Total:</p>
      <p className="text-2xl font-bold text-yellow-200">Rs. {total}</p>

      {/* Buy Now Button */}
      <IconBtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses={"justify-center mt-5 px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"}
      />
    </div>
  );
};

export default RenderTotalAmount;

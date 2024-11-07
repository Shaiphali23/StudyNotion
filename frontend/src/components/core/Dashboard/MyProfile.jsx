import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="text-white max-w-3xl mx-auto">
      <h1 className=" text-xl lg:text-3xl font-semibold mb-6 text-center">My Profile</h1>

      {/* Section-1: Profile Picture and Name */}
      <div className="bg-richblack-800 border-[1px] border-richblack-700 p-6 lg:p-8 rounded-lg flex flex-col lg:flex-row justify-between items-center mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <img
            src={user?.image}
            alt={`Profile-${user.firstName}`}
            className="aspect-square w-20 h-20 rounded-full object-cover border-2 border-white"
          />
          <div className="text-center sm:text-left ml-5">
            <p className="text-xl font-semibold">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text={"Edit"}
          onClick={() => navigate("/dashboard/settings")}
          customClasses="bg-yellow-100 px-4 py-2 rounded-md text-richblack-900"
        />
      </div>

      {/* Section-2: About Me */}
      <div className="bg-richblack-800 border-[1px] border-richblack-700 p-6 lg:p-8 rounded-lg mb-8 flex justify-between">
        <div>
          <p className="text-lg font-semibold">About</p>
          <p className="text-sm mt-2">
            {user?.additionalDetails?.about ?? "Write Something about yourself"}
          </p>
        </div>

        <div>
          <IconBtn
            text={"Edit"}
            onClick={() => navigate("/dashboard/settings")}
            customClasses="bg-yellow-100 px-4 py-2 rounded-md text-richblack-900"
          />
        </div>
      </div>

      {/* Section-3: Personal Details */}
      <div className="bg-richblack-800 border-[1px] border-richblack-700 p-6 lg:p-8 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        <div>
          <p className="text-xl font-bold mb-6">Personal Details</p>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 gap-x-12">
            {/* First Name & Last Name */}
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">First Name</p>
              <p className="text-md">{user?.firstName}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">Last Name</p>
              <p className="text-md">{user?.lastName}</p>
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">Email</p>
              <p className="text-md">{user?.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">Phone Number</p>
              <p className="text-md">
                {user?.additionalDetails?.contactNumber ||
                  "Add your phone number"}
              </p>
            </div>

            {/* Gender & Date of Birth */}
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">Gender</p>
              <p className="text-md">
                {user?.additionalDetails?.gender || "Add your gender"}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-richblack-200 text-sm">Date of Birth</p>
              <p className="text-md">
                {user?.additionalDetails?.dateOfBirth ||
                  "Add your Date of Birth"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <IconBtn
          text={"Edit"}
          onClick={() => navigate("/dashboard/settings")}
          customClasses="bg-yellow-100 px-4 py-2 rounded-md text-richblack-900"
        />
      </div>
    </div>
  );
};

export default MyProfile;

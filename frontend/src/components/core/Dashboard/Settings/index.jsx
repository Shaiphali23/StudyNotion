import UpdatePassword from "./UpdatePassword";
import ChangeProfilePicture from "./ChangeProfilePicture";
import EditProfile from "./EditProfile";
import DeleteAccount from "./DeleteAccount";

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl lg:text-3xl font-semibold text-center mb-6 text-richblack-5">
        Edit Profile
      </h1>

      {/* change profile picture */}
      <ChangeProfilePicture />

      {/* edit profile */}
      <EditProfile />

      {/* update password */}
      <UpdatePassword />

      {/* delete account */}
      <DeleteAccount />
    </div>
  );
}

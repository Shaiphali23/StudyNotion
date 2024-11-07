import React, { forwardRef, useState } from "react";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = forwardRef(function Sidebar({ isOpen }, ref) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  if (profileLoading || authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        ref={ref}
        className={`fixed top-0 left-0 h-full bg-richblack-800 border-r border-richblack-800 py-10 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:min-w-[222px] lg:min-h-screen`}
        style={{ zIndex: 1000 }}
      >
        {/* Sidebar Links */}
        <div className="flex flex-col space-y-2">
          {sidebarLinks.map((link) => {
            if (link.type && user.accountType !== link.type) {
              return null;
            } else {
              return (
                <SidebarLink key={link.id} link={link} iconName={link.icon} />
              );
            }
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600"></div>

        {/* Settings and Logout */}
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "dashboard/settings" }}
            iconName="VscSettingsGear"
          />

          {/* Logout Button */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => {
                  dispatch(logout(navigate));
                  setConfirmationModal(null);
                },
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="mt-4 text-sm font-medium text-richblack-300 hover:text-yellow-400 transition duration-200"
          >
            <div className="flex items-center px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-yellow-50 transition-all duration-200">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
});

export default Sidebar;

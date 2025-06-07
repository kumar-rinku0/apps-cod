import { NavLink, Outlet } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { Toaster } from "sonner";
import { FaFingerprint, FaHome, FaUmbrellaBeach } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
      <div className="w-full h-16">
        {isAuthenticated && user?.company && (
          <div className="fixed bottom-0 left-0 right-0 z-20 h-16 bg-[#1a1a2e] shadow-lg">
            <div className="w-full flex gap-4 justify-evenly py-2">
              {user?.roleInfo?.role === "employee" && (
                <>
                  <NavLink
                    to={"/attendance"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? `text-green-500` : `text-white`
                      }`
                    }
                  >
                    <FaFingerprint size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Attendance
                    </span>
                  </NavLink>
                  <NavLink
                    to={"/leavereq"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? "text-green-500" : "text-white"
                      }`
                    }
                  >
                    <FaUmbrellaBeach size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Leave
                    </span>
                  </NavLink>
                </>
              )}
              {user?.roleInfo?.role === "manager" && (
                <>
                  <NavLink
                    to={"/attendance"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? `text-green-500` : `text-white`
                      }`
                    }
                  >
                    <FaFingerprint size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Attendance
                    </span>
                  </NavLink>
                  <NavLink
                    to={"/leaveapr"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? "text-green-500" : "text-white"
                      }`
                    }
                  >
                    <FaUmbrellaBeach size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Leave
                    </span>
                  </NavLink>
                  <NavLink
                    to={"/dashboard"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? `text-green-500` : `text-white`
                      }`
                    }
                  >
                    <FaHome size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Home
                    </span>
                  </NavLink>
                </>
              )}
              {user?.roleInfo?.role === "admin" && (
                <>
                  <NavLink
                    to={"/dashboard"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? `text-green-500` : `text-white`
                      }`
                    }
                  >
                    <FaHome size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Home
                    </span>
                  </NavLink>
                  <NavLink
                    to={"/leaveapr"}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${
                        isActive ? "text-green-500" : "text-white"
                      }`
                    }
                  >
                    <FaUmbrellaBeach size={24} />
                    <span className="mt-1 text-sm font-medium text-white">
                      Leave
                    </span>
                  </NavLink>
                </>
              )}
              <NavLink
                className={({ isActive }) =>
                  `flex flex-col items-center ${
                    isActive ? "text-green-500" : "text-white"
                  }`
                }
                to={"/settings"}
              >
                <FaGear size={24} />
                <span className="mt-1 text-sm font-medium text-white">
                  Settings
                </span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

import { useState, useEffect, useRef } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/sidebar.css";
import "react-pro-sidebar/dist/css/styles.css";

import {
  mdiHome,
  mdiAccount,
  mdiEmail,
  mdiChartBar,
  mdiMenu,
  mdiCalendarStar,
  mdiCalendarBlankOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import Logo from "../../resources/images/logo.png";
import "./ResponsiveSidebar.css";
import { click } from "@testing-library/user-event/dist/click";
import { Link } from "react-router-dom";
const MySidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const componentRef = useRef(null);
  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      // Click occurred outside the component
      // setIsComponentVisible(false);
      console.log("click event");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log("Clicked Element:", event.target);
      // console.log("Is Button:", event.target.tagName === "BUTTON");
      // console.log("Is Toggle Button:", event.target.id === "toggleButton");
      // console.log(event.target.closest(".toggle-button"));
      console.log(event.target);
      const isButton = event.target.tagName === "BUTTON";
      const isToggleButton =
        event.target.closest(".toggle-button") ||
        event.target.classList.contains("toggle-button");
      const proItemContent =
        event.target.classList.contains("pro-item-content");
      console.log(isToggleButton);
      if (!isButton && !isToggleButton && !proItemContent) {
        console.log("Outside button click");
        setSidebarCollapsed(false);
      } else if (isToggleButton) {
        setSidebarCollapsed(!isSidebarCollapsed);
      } else {
        console.log("Click inside button or toggle button");
      }
    };

    // Attach the event listener to the document
    document.body.addEventListener("click", handleClickOutside);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ProSidebar
      // onBackdropClick={() => setSidebarCollapsed((prev) => !prev)}
      toggled={isSidebarCollapsed}
      breakPoint="md"
      ref={componentRef}
      style={{
        zIndex: "9"
      }}
    >
      <SidebarHeader
        style={{
          backgroundColor: "#F97316",
          color: "white",
        }}
      >
        <div className="flex p-2 items-center bg-white round justify-center">
          <img src={Logo} alt="Logo" className="w-16 h-16  mr-2" />

        </div>
        {/* <h1 className="text-white">Logo</h1> */}
      </SidebarHeader>
      <Menu
        iconShape="square"
        style={{
          backgroundColor: '#F97316',
          color: "white",
        }}
      >
        <MenuItem icon={<Icon path={mdiHome} size={1} />}>
          {" "}
          <Link
            to="/admin"
            style={{
              color: "white",
            }}
          >
            Dashboard
          </Link>
        </MenuItem>
        <SubMenu title="User" icon={<Icon path={mdiAccount} size={1} />}>
          <MenuItem>
            <Link
              to="/admin/change-profile"
              style={{
                color: "white",
              }}
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem>Settings</MenuItem>
        </SubMenu>

        <SubMenu title="Items" icon={<Icon path={mdiCalendarStar} size={1} />}>
          <MenuItem>
            <Link
              to="/admin/create-event"
              style={{
                color: "white",
              }}
            >
              Create Event
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/event-list"
              style={{
                color: "white",
              }}
            >
              Event List
            </Link>
          </MenuItem>
          {/* Add more menu items as needed */}
        </SubMenu>
        <MenuItem icon={<Icon path={mdiCalendarBlankOutline} size={1} />}>
          <Link
            to="/admin/calendar"
            style={{
              color: "white",
            }}
          >
            Calendar
          </Link>
        </MenuItem>
        <SubMenu title="Payments" icon={<Icon path={mdiCalendarStar} size={1} />}>
          <MenuItem>
            <Link
              to="/admin/connect-account"
              style={{
                color: "white",
              }}
            >
              Connect Account
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/check-account-status"
              style={{
                color: "white",
              }}
            >
              Check Account Status
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/connect-bank-account"
              style={{
                color: "white",
              }}
            >
              Connect Bank Account
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/view-balance"
              style={{
                color: "white",
              }}
            >
              View Balance
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/all-payments"
              style={{
                color: "white",
              }}
            >
              All Payments
            </Link>
          </MenuItem>

          {/* Add more menu items as needed */}
        </SubMenu>
      </Menu>

      {/* Toggle button for mobile */}
      {/* <div className="toggle-button" onClick={handleToggleSidebar}>
        <Icon id="toggleButton" path={mdiMenu} size={1} />
      </div> */}
    </ProSidebar>
  );
};
export default MySidebar;

import { useState, useEffect, useRef } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/sidebar.css";
import "react-pro-sidebar/dist/css/styles.css";

import { mdiHome, mdiAccount, mdiEmail, mdiChartBar, mdiMenu } from "@mdi/js";
import Icon from "@mdi/react";

import "./ResponsiveSidebar.css";
import { click } from "@testing-library/user-event/dist/click";

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
    >
      <Menu iconShape="square">
        <MenuItem icon={<Icon path={mdiHome} size={1} />}>Dashboard</MenuItem>
        <SubMenu
          closeOnClick={false}
          title="User"
          icon={<Icon path={mdiAccount} size={1} />}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
        </SubMenu>
        <MenuItem icon={<Icon path={mdiEmail} size={1} />}>Messages</MenuItem>
        <SubMenu title="Charts" icon={<Icon path={mdiChartBar} size={1} />}>
          <MenuItem>Bar Chart</MenuItem>
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

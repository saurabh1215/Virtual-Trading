import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";

const SecondNavbar = ({ logout, openSettings }) => {
  const itemStyle = {
    margin: "6px 12px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ padding: "8px 0" }}>
      <ListItem button style={itemStyle} onClick={openSettings}>
        <ListItemIcon style={{ color: "#94a3b8", minWidth: "40px" }}>
          <SettingsTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" primaryTypographyProps={{ style: { color: "#cbd5e1" } }} />
      </ListItem>
      <ListItem button style={{ ...itemStyle, background: "rgba(239, 68, 68, 0.1)" }} onClick={logout}>
        <ListItemIcon style={{ color: "#f87171", minWidth: "40px" }}>
          <ExitToAppTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary="Log Out" primaryTypographyProps={{ style: { color: "#f87171", fontWeight: 600 } }} />
      </ListItem>
    </div>
  );
};

export default SecondNavbar;


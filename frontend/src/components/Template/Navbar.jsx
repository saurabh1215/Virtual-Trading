import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import AssessmentTwoToneIcon from "@material-ui/icons/AssessmentTwoTone";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const getItemStyle = (page) => ({
    margin: "6px 12px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    background: currentPage === page ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)" : "transparent",
    border: currentPage === page ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
  });

  return (
    <div style={{ padding: "8px 0" }}>
      <ListItem
        button
        style={getItemStyle("dashboard")}
        onClick={(e) => { e.preventDefault(); setCurrentPage("dashboard"); }}
      >
        <ListItemIcon style={{ color: currentPage === "dashboard" ? "#818cf8" : "#94a3b8", minWidth: "40px" }}>
          <DashboardTwoToneIcon />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          primaryTypographyProps={{ style: { fontWeight: currentPage === "dashboard" ? 600 : 400, color: currentPage === "dashboard" ? "#f8fafc" : "#cbd5e1" } }}
        />
      </ListItem>

      <ListItem
        button
        style={getItemStyle("search")}
        onClick={(e) => { e.preventDefault(); setCurrentPage("search"); }}
      >
        <ListItemIcon style={{ color: currentPage === "search" ? "#818cf8" : "#94a3b8", minWidth: "40px" }}>
          <SearchTwoToneIcon />
        </ListItemIcon>
        <ListItemText
          primary="Stock Search"
          primaryTypographyProps={{ style: { fontWeight: currentPage === "search" ? 600 : 400, color: currentPage === "search" ? "#f8fafc" : "#cbd5e1" } }}
        />
      </ListItem>

      <ListItem
        button
        style={getItemStyle("news")}
        onClick={(e) => { e.preventDefault(); setCurrentPage("news"); }}
      >
        <ListItemIcon style={{ color: currentPage === "news" ? "#818cf8" : "#94a3b8", minWidth: "40px" }}>
          <AssessmentTwoToneIcon />
        </ListItemIcon>
        <ListItemText
          primary="Market News"
          primaryTypographyProps={{ style: { fontWeight: currentPage === "news" ? 600 : 400, color: currentPage === "news" ? "#f8fafc" : "#cbd5e1" } }}
        />
      </ListItem>
    </div>
  );
};

export default Navbar;


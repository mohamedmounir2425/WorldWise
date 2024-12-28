import React from "react";
import { sidebar, footer } from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
export default function Sidebar() {
  return (
    <div className={sidebar}>
      <Logo />
      <AppNav />
      {/* <p>List of cities</p> */}
      <Outlet />

      <footer className={footer}>
        &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
      </footer>
    </div>
  );
}

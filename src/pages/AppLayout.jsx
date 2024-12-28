import React from "react";
import { app } from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";

export default function AppLayout() {
  return (
    <div className={app}>
      <Sidebar />
      <Map />
    </div>
  );
}

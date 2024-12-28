import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { nav, ctaLink } from "./PageNav.module.css";
export default function PageNav() {
  return (
    <nav className={`${nav}`}>
      <Logo />
      <ul>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/product">Product</NavLink>
        <NavLink to="/login" className={`${ctaLink}`}>
          Login
        </NavLink>
      </ul>
    </nav>
  );
}

import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{width: "13rem", height:"100vh"}}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg className="bi me-2" width="40" height="32">
          <use xlink:href="#bootstrap"></use>
        </svg>
        <span className="fs-4">Face Track</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
         <li className="nav-item">
          <NavLink href="#" to="/Home" className="nav-link" 
                           aria-current="page">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg>
            Home
          </NavLink>
          
        </li> 
        
        <li>
          {/* <a href="#" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#speedometer2"></use>
            </svg>
            Dashboard
          </a> */}
          <NavLink  to="/Dashboard" className="nav-link text-white ">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#speedometer2"></use>
            </svg>
            Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/Attendence" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg>
            Take Attendence
          </NavLink>
        </li>
        <li>
         
          <NavLink to="/Addstudent" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg>
            Addstudent
          </NavLink>
          
        </li>
        <li>
        <NavLink to="/Allstudent" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg>
            Student
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </a>
        <ul
          className="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser1"
        >
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

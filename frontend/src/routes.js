/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================+

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import GroupIcon from '@material-ui/icons/Group';
import MovieIcon from '@material-ui/icons/Movie';
import LockOpenIcon from '@material-ui/icons/LockOpen'
// Login
import Login from "views/Login/Login.js";
// Person
import Persons from "views/Persons/"
// Movies
import Movies from "views/Movies/"

const dashboardRoutes = [
  {
    path: "/login",
    name: "Login",
    rtlName: "لوحة القيادة",
    icon: LockOpenIcon,
    component: Login,
    layout: "/admin",
  },
  {
    path: "/persons",
    name: "Persons",
    rtlName: "لوحة القيادة",
    icon: GroupIcon,
    component: Persons,
    layout: "/admin",
  },
  {
    path: "/movie",
    name: "Movies",
    rtlName: "قائمة الجدول",
    icon: MovieIcon,
    component: Movies,
    layout: "/admin",
  }
];

export default dashboardRoutes;

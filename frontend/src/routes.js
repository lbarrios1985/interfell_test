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
import { LockOpen, AccountBalanceWallet, AccountBalance, PersonAdd } from '@material-ui/icons'
// Login
import Login from "views/Login/Login.js"
// Client
import Client from "views/Client/index.js"
// Wallet
import Wallet from "views/Wallet/index.js"
// Payment
import Payment from "views/Payment/index.js"

const isAuthenticated = localStorage.getItem('token') || null
let dashboardRoutes = []

if(isAuthenticated){
  dashboardRoutes = [
    {
      path: "/clients",
      name: "Client",
      rtlName: "لوحة القيادة",
      icon: PersonAdd,
      component: Client,
      layout: "/admin",
    },
    {
      path: "/wallet",
      name: "Wallet",
      rtlName: "لوحة القيادة",
      icon: AccountBalanceWallet,
      component: Wallet,
      layout: "/admin",
    },
    {
      path: "/payment",
      name: "Payment",
      rtlName: "لوحة القيادة",
      icon: AccountBalance,
      component: Payment,
      layout: "/admin",
    },
  ]
} else {
  dashboardRoutes = [
    {
      path: "/login",
      name: "Login",
      rtlName: "لوحة القيادة",
      icon: LockOpen,
      component: Login,
      layout: "/admin",
    },
  ]
}

export default dashboardRoutes;

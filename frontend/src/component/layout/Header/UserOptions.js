import React, { Fragment, useEffect, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userAction.js";
import { LOGOUT_RESET } from "../../../constants/userConstants";
import { CLEAR_CART } from "../../../constants/cartConstants";

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { logoutSuccess } = useSelector((state) => state.user);

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }

  function account() {
    navigate("/account");
  }

  function cart() {
    navigate("/cart");
  }

  function logoutUser() {
    dispatch(logout());
    alert.success("Logout successfully");
  }

  useEffect(() => {
    if (logoutSuccess) {
      localStorage.clear();
      sessionStorage.clear();
      dispatch({
        type: LOGOUT_RESET,
      });
      dispatch({
        type: CLEAR_CART,
      });
      navigate("/login");
    }
  }, [logoutSuccess, navigate, dispatch]);

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        open={open}
        direction="down"
        className="speedDial"
        style={{ zIndex: "11" }}
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((option) => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            tooltipOpen={window.innerWidth < 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;

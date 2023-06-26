import React, { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import Products from "./component/Product/Products";
import ProductDetails from "./component/Product/ProductDetails";
import Search from "./component/Product/Search";
import Login from "./component/User/LoginSingUp";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import CreateUpdateProduct from "./component/Admin/CreateUpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UserLists from "./component/Admin/UserLists";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const CustomRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.apiKey);
    } catch (error) {}
  };

  useEffect(() => {
    let isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
    if (isAuthenticated) {
      store.dispatch(loadUser());
      getStripeApiKey();
    }
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/about" element={<About />} />
        <Route
          exact
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/me/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route exact path="/cart" element={<Cart />} />
        <Route
          exact
          path="/shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/order/confirm"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/process/payment"
          element={
            stripeApiKey && (
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            )
          }
        ></Route>
        <Route
          exact
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProductList />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/product"
          element={
            <ProtectedRoute isAdmin={true}>
              <CreateUpdateProduct />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/product/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <CreateUpdateProduct />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <OrderList />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/order/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProcessOrder />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserLists />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateUser />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProductReviews />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
};

export default CustomRoutes;

import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newProductReducer,
  newReviewReducer,
  productDetailsReducer,
  productReviewsReducer,
  productsReducer,
} from "./reducers/productReducers";
import {
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
  usersReducer,
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducer";
import {
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  ordersReducer,
} from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  orders: ordersReducer,
  users: usersReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
});

const middleware = [thunk];

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

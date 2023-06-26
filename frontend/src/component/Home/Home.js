import React, { Fragment, useEffect } from "react";
import { BiMouse } from "react-icons/bi";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProducts } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader.js";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      alert.show(error);
      dispatch(clearErrors());
    }

    dispatch(getProducts());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Ecommerce" />

          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>Find amazing product below</h1>
            <a href="#container">
              <button>
                Scroll <BiMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Features Products</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => <Product product={product} />)}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;

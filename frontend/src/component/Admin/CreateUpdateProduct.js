import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  createProduct,
  getProductDetails,
  updateProduct,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import {
  NEW_PRODUCT_RESET,
  UPDATE_PRODUCT_RESET,
} from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const CreateUpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { id } = useParams();

  const { error: updateError, isUpdated } = useSelector(
    (state) => state.products
  );

  const { error, success } = useSelector((state) => state.newProduct);

  const { product } = useSelector((state) => state.productDetails);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Laptop",
    "Footwear",
    "Watches",
    "Clothes",
    "Sunglasses",
    "Camera",
    "SmartPhones",
  ];

  const productSubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    images?.length &&
      images.forEach((image) => {
        myForm.append("images", image);
      });
    dispatch(id ? updateProduct(id, myForm) : createProduct(myForm));
  };

  const productImagesChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
          setImagesPreview((old) => [...old, reader.result]);
        }
      };
    });
  };

  const setStateData = (product) => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      const images = [];
      product.images?.length &&
        product.images.map((image) => {
          images.push(image.url);
        });
      setImagesPreview(images);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setCategory("");
      setStock(0);
      setImages([]);
      setImagesPreview([]);
    }
  };

  useEffect(() => {
    if (id) {
      if (product && product._id !== id) {
        dispatch(getProductDetails(id));
      } else {
        setStateData(product);
      }
    } else {
      setStateData();
    }

    if (error) {
      alert.error(error);
      setLoading(false);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      setLoading(false);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Product Created Successfully.");
      navigate("/admin/dashboard");
      dispatch({
        type: NEW_PRODUCT_RESET,
      });
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    navigate,
    error,
    updateError,
    alert,
    success,
    isUpdated,
    id,
    product,
  ]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Create Product" />
          <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
              <form
                className="createProductForm"
                encType="multipart/form-data"
                onSubmit={productSubmitHandler}
              >
                <h1>{id ? "Update Product" : "Create Product"}</h1>

                <div>
                  <SpellcheckIcon />
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <AttachMoneyIcon />
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <DescriptionIcon />

                  <textarea
                    placeholder="Product Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    cols="30"
                    rows="1"
                  ></textarea>
                </div>

                <div>
                  <AccountTreeIcon />
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">Choose Category</option>
                    {categories.map((cate) => (
                      <option key={cate} value={cate}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <StorageIcon />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    required
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div id="createProductFormFile">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={productImagesChange}
                    multiple
                  />
                </div>

                <div id="createProductFormImage">
                  {imagesPreview.map((image, index) => (
                    <img key={index} src={image} alt="Product Preview" />
                  ))}
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {id ? "Update" : "Create"}
                </Button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default CreateUpdateProduct;

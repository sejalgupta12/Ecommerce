import React, { useEffect } from "react";
import "./App.css";
import WebFont from "webfontloader";
import CustomRoutes from "./CustomRoutes";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);
  return <CustomRoutes />;
}

export default App;

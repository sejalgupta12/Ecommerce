import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import Linkedin from "../../../images/linkdin.png";
const About = () => {
  const visitLinkedin = () => {
    window.location = "https://www.linkedin.com/in/sejal-gupta-8996a2157/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="./Profile.png"
              alt="Founder"
            />
            <Typography>SEJAL GUPTA</Typography>

            <p>MERN STACK DEVELOPER</p>
            <Button onClick={visitLinkedin} color="primary">
              <img src={Linkedin} alt="Linkedin" className="imgContainer" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

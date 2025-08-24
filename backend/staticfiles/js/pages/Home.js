import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import djangoLogoNegative from "../../assets/images/django-logo-negative.png";
import { RestService } from "../api";

const Home = () => {
  const [showBugComponent, setShowBugComponent] = useState(false);
  const [restCheck, setRestCheck] = useState();

  useEffect(() => {
    async function onFetchRestCheck() {
      const result = await RestService.restRestCheckRetrieve();
      setRestCheck(result);
    }
    onFetchRestCheck();
  }, []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h2", null, "Static assets"),
    React.createElement(
      "div",
      { id: "django-background" },
      "If you are seeing the green Django logo on a white background and this text color is #092e20, frontend static files serving is working:"
    ),
    React.createElement(
      "div",
      { id: "django-logo-wrapper" },
      React.createElement(
        "div",
        null,
        "Below this text, you should see an img tag with the white Django logo on a green background:"
      ),
      React.createElement("img", { alt: "Django Negative Logo", src: djangoLogoNegative })
    ),
    React.createElement("h2", null, "Rest API"),
    React.createElement("p", null, restCheck?.message),
    React.createElement(
      Button,
      { variant: "outline-dark", onClick: () => setShowBugComponent(true) },
      "Click to test if Sentry is capturing frontend errors! (Should only work in Production)"
    ),
    showBugComponent && showBugComponent.field.notexist
  );
};

export default Home;
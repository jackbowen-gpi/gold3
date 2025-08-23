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

  return (
    <div>
      <h2>Static assets</h2>
      <div id="django-background">
        If you are seeing the green Django logo on a white background and this
        text color is #092e20, frontend static files serving is working:
      </div>
      <div id="django-logo-wrapper">
        <div>
          Below this text, you should see an img tag with the white Django logo
          on a green background:
        </div>
        <img alt="Django Negative Logo" src={djangoLogoNegative} />
      </div>
      <h2>Rest API</h2>
      <p>{restCheck?.message}</p>
      <Button variant="outline-dark" onClick={() => setShowBugComponent(true)}>
        Click to test if Sentry is capturing frontend errors! (Should only work
        in Production)
      </Button>
      {/* NOTE: The next line intentionally contains an error for testing frontend errors in Sentry. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {showBugComponent && showBugComponent.field.notexist}
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const Home = () => {
  const [showBugComponent, setShowBugComponent] = useState(false);

    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Button,
        { variant: "outline-dark", onClick: () => setShowBugComponent(true) },
        "Click to test if Sentry is capturing frontend errors! (Should only work in Production)"
      ),
      showBugComponent && showBugComponent.field.notexist
    );
};

export default Home;
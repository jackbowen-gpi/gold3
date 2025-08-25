import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { RestService } from "../api";

const Home = () => {
  const [showBugComponent, setShowBugComponent] = useState(false);

  return (
    <div>
      <Button variant="outline-dark" onClick={() => setShowBugComponent(true)}>
        Click to test if Sentry is capturing frontend errors! (Should only work
        in Production)
      </Button>
      {/* NOTE: The next line intentionally contains an error for testing frontend errors in Sentry. */}
      {showBugComponent && showBugComponent.field.notexist}
    </div>
  );
};

export default Home;

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   () => JSON.parse(localStorage.getItem("isLoggedIn")) || false
  // );

  // useEffect(() => {
  //   localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  // }, [isLoggedIn]);

  return (
    <Router basename="/molina-lte">
      <Routes />
    </Router>
  );
};

export default App;

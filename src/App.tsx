import Routers from "./router";
import "./App.less";
import { HashRouter, Routes } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      {/* <Routes> */}
      <Routers></Routers>
      {/* </Routes> */}
    </HashRouter>
  );
}

export default App;

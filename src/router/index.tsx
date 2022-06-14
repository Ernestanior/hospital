import { FC, useState } from "react";
import { Routes, HashRouter, Route, Navigate } from "react-router-dom";
import Home from "pages/home";
import Login from "pages/login";
import { getCookie } from "storage";
const ProjectRouter: FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const token = getCookie("hos-admin");
  if (!token) {
    return <Login refresh={() => setRefresh(!refresh)} />;
  }
  // return (
  //   <Routes>
  //     <Route path="/home" element={<Home />}></Route>
  //     <Route path="*" element={<Navigate to="/home" />} />
  //   </Routes>
  // );
  return (
    <Routes>
      <Route path="/home" element={<Home />}></Route>
      {/* <Route path="/Seclist" element={<Sec />}></Route> */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default ProjectRouter;

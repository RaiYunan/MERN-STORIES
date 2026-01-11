import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import {Toaster} from "react-hot-toast"
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
      
        >
          <Route index element={<HomePage/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Route>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );
};

export default App;

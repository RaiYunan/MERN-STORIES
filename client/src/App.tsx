import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import { useAppSelector } from "./hooks/useAppSelector";
import type { RootState } from "./app/store";

const App = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {user && isAuthenticated ? (
            <Route path="/profile" element={<Profile />} />
          ) : (
            
            <Route index element={<HomePage />} />
          )}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;

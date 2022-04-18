import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import { useSelector } from "react-redux";
import { useState } from "react";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Success from "./pages/Success";
import OtpLogin from "./pages/OtpLogin";
import Otpverify from "./pages/OtpVerify";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import Orders from "./pages/Orders";
import AddressPage from "./pages/AddressPage";

function App() {
  // const user = useSelector((state) => state.user);
  const [userLogin, setUserLogin] = useState(false);
  const user = localStorage.getItem("user-token") || userLogin;
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate replace to="/" />
            ) : (
              <Login setUserLogin={setUserLogin} />
            )
          }
        ></Route>
        <Route
          path="/register"
          element={user ? <Navigate replace to="/" /> : <Register setUserLogin={setUserLogin} />}
        ></Route>
        <Route path="/product/:id" element={<Product />}></Route>
        <Route path="/products" element={<ProductList />}></Route>
        <Route path="/products/:category" element={<ProductList />}></Route>
        <Route
          path="/products/:category/product/:id"
          element={<Product />}
        ></Route>
        <Route
          path="/success"
          element={user ? <Success /> : <Navigate replace to="/login" />}
        ></Route>
        <Route
          path="/otplogin"
          element={user ? <Navigate replace to="/" /> : <OtpLogin />}
        ></Route>
        <Route
          path="/otpverify"
          element={user ? <Navigate replace to="/" /> : <Otpverify />}
        ></Route>
        <Route
          path="/checkout"
          element={user ? <CheckoutPage /> : <Navigate replace to="/login" />}
        ></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/address" element={<AddressPage />}></Route>
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate replace to="/login" />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;

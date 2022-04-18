import Announcement from "../components/Announcement";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
const Success = () => {
  return (
    <>
      <Navbar />
      <Announcement />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h5> Order has been created successfully. Your order is placed.</h5>

        <div>
          <Link to="/">
            {" "}
            <button
              className="btn  btn-lg  mt-5"
              style={{ backgroundColor: " teal", color: "white" }}
              type="button"
            >
              Go to Homepage
            </button>
          </Link>

          <Link to="/orders">
            {" "}
            <button
              className="btn  btn-lg  mt-5"
              style={{ backgroundColor: " teal", color: "white" }}
              type="button"
            >
              View orders
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Success;

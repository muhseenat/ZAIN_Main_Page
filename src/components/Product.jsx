import { VisibilityOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: block;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  &:hover ${Info} {
    opacity: 1;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
  height: 75%;
  z-index: 2;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;

  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Product = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCart = (proId) => {
    let userId = localStorage.getItem("u_id");
    if (!userId) {
      navigate("/login");
    }
    const data = { userId, proId };
    axios
      .post("/cart/addtocart", data)
      .then((resp) => {
        let quantity = 1;
        let size = item.size?.[0];
        dispatch(addProduct({ ...item, quantity, size }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Circle />
      <Image src={item.img1[0].url} />

      <Info>
        <div
          style={{
            display: "flex",
            marginTop: "100px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            justifyContent: "center",
            width: "80%",
          }}
        >
          <Icon>
            <ShoppingCartOutlined onClick={() => addToCart(item._id)} />
          </Icon>
          <Icon>
            <VisibilityOutlined
              onClick={(e) => navigate(`/product/${item._id}`)}
            />
          </Icon>
        </div>
        <div style={{ margin: "0 auto", width: "50%" }}>
          <p
            style={{
              color: "white",
              fontSize: "160%",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {item.name}
          </p>
        </div>
      </Info>
    </Container>
  );
};

export default Product;

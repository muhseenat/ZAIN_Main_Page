import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { removeProduct } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BackspaceOutlined } from "@mui/icons-material";
import axios from "../axios";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
  ${mobile({ padding: "5px" })}
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
  ${mobile({ flexDirection: "column", alignItems: "center" })}
`;

const Image = styled.img`
  width: 180px;
  margintop: 10px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const Quantity = styled.div``;
const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
//  const Empty=styled.h5`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   margin-top:50px`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  ${mobile({ alignItems: "flex-end", marginTop: "0" })}
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "1px 10px" })}
`;

const RemoveButton = styled.div`
  ${mobile({ margin: "0", alignItems: "flex-end" })}
`;
const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;
const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 60vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const [item, setItem] = useState([]);
  const [total, setTotal] = useState();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const id = localStorage.getItem("u_id");
  const user = localStorage.getItem("user-token");

  useEffect(() => {
    axios
      .get(`/cart/getcart/${id}`)
      .then((resp) => {
        setItem(resp.data?.resp);
        const cartId=resp.data?.resp?.[0]?._id
        const amount=resp.data?.total
        localStorage.setItem('cartId',cartId)
        setCount(resp.data?.resp?.length)
        setTotal(resp.data?.total)
        localStorage.setItem('amount',amount)
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const changeQuantity = (cartId, proId, count) => {
    const data = { cartId, proId, count };
    axios
      .post("/cart/changequantity", data)
      .then((resp) => {
        const cartProduct = item.find((i) => i.product._id == proId);
        if (count == 1) {
          cartProduct.quantity += 1;
          setTotal(total + cartProduct.product.price);
        } else {
          cartProduct.quantity -= 1;
          setTotal(total - cartProduct.product.price);
        }
        setItem([...item]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const removeCartProduct = (proId, cartId, subtract) => {
    const data = { proId, cartId };
    axios
      .post("/cart/deletecartproduct/", data)
      .then((resp) => {
        dispatch(removeProduct({ proId }));
        setItem(item.filter((i) => i.product._id !== proId));
        setTotal(total - subtract);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            <TopText>Shopping Bag({count})</TopText>
          </TopTexts>
          <Link to="/orders">
            <TopButton type="filled">ORDER HISTORY</TopButton>
          </Link>
        </Top>
        <Bottom>
          <Info>
            {item.map((item, index) => (
              <Product key={index}>
                <ProductDetail>
                  <Image src={item.product?.img1?.[0]?.url} />
                  <Details>
                    <ProductName>
                      <b>Product:</b>
                      {item.product?.name}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {item.product?._id}
                    </ProductId>

                    <ProductSize>
                      <b>Size:</b> {item.product?.size?.[0]}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <RemoveButton>
                    <BackspaceOutlined
                      style={{ marginBottom: "30px" }}
                      onClick={() =>
                        removeCartProduct(
                          item.product._id,
                          item._id,
                          item.product?.price * item.quantity
                        )
                      }
                    />
                  </RemoveButton>

                  <ProductAmountContainer>
                    <Add
                      onClick={() =>
                        changeQuantity(item._id, item.product._id, 1)
                      }
                    />
                    <ProductAmount>{item.quantity}</ProductAmount>
                    <Remove
                      style={{ display: `${item.quantity > 1 ? "" : "none"}` }}
                      onClick={() =>
                        changeQuantity(item._id, item.product._id, -1)
                      }
                    />
                  </ProductAmountContainer>
                  <ProductPrice>
                    ₹{item.product?.price * item.quantity}.0
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>₹{total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>₹0</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>₹0</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>₹{total}</SummaryItemPrice>
            </SummaryItem>
            <Link to="/checkout">
              <Button>CHECKOUT NOW</Button>
            </Link>
          </Summary>
        </Bottom>
      </Wrapper>
    </Container>
  );
};

export default Cart;

import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import { mobile } from "../responsive";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import LikeProducts from "../components/Like";
import { addProduct } from "../redux/cartRedux";

import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  margin-left: 50px;
  ${mobile({ padding: "10px", flexDirection: "column", marginLeft: "0px" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 20px;
  text_align: center;
  align-items: center;
  justify-content: center;
  margin: 80px;
  ${mobile({ padding: "10px", margin: 0 })}
`;

const Title = styled.h1`
  font-weight: 600;
  margin-top: 10px;
`;

const Desc = styled.p`
  margin: 20px 0px;
  font-weight: 600;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;
const OfferPrice = styled.span`
  font-weight: 50;
  font-size: 25px;
  margin-left: 20px;
  text-decoration: line-through;
`;
const ShippingInfo = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: black;
  line-height: 24px;
`;
const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const FilterSize = styled.div`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.div`
  font-weight: 700;
`;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;
const Sub = styled.p`
  marginright: 100px;
  font-weight: bold;
`;
const Likediv = styled.div`
  margin: 56px;
`;
const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #f8f4f4;
  }
`;

const Product = () => {
  const { id } = useParams();
  // const user = useSelector((state) => state.user.currentUser);
  const [product, setProduct] = useState({});
  const [productOffer, setProductOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainContainer = useRef(null);
  useEffect(() => {
    axios
      .get(`product/getproductbyid/${id}`)
      .then((resp) => {
        setProduct(resp.data.product);
        if (resp.data?.product?.discount != null) {
          setProductOffer(true);
          let offer =
            resp.data?.product?.price * resp.data?.product?.discount * 0.01;
          let discountAmount = Math.round(offer);
          const newPrice = resp.data?.product?.price - discountAmount;
          setOfferPrice(newPrice);
        }
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const addToCart = (proId) => {
    let userId = localStorage.getItem("u_id");
    if (!userId) {
      navigate("/login");
    }
    const data = { userId, proId };
    axios
      .post("/cart/addtocart", data)
      .then((resp) => {
        dispatch(addProduct({ ...product }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Container ref={mainContainer}>
      <Navbar />
      <Announcement />
      <Wrapper>
        <div style={{ width: 300, height: 250, marginLeft: "25px" }}>
          <Carousel>
            <Carousel.Item interval={1500}>
              <Image src={product?.img1?.[0].url} />
            </Carousel.Item>
            <Carousel.Item interval={1000}>
              <Image src={product?.img2?.[0].url} />
            </Carousel.Item>
            <Carousel.Item interval={1000}>
              <Image src={product?.img3?.[0].url} />
            </Carousel.Item>
            <Carousel.Item interval={1000}>
              <Image src={product?.img4?.[0].url} />
            </Carousel.Item>
          </Carousel>
        </div>

        <InfoContainer>
          <Title>{product.name}</Title>
          <Desc>{product.description}</Desc>
          <ShippingInfo>
            Orders are shippied out in 2-3 days unless specifically mentioned in
            the product title. Once shipped, orders take 4-6 working days for
            delivery. International orders may take longer. COD is available.
          </ShippingInfo>
          {productOffer ? (
            <span>
              {" "}
              <Price>₹ {offerPrice}.0</Price>
              <OfferPrice>₹ {product.price}.0</OfferPrice>
            </span>
          ) : (
            <Price>₹ {product.price}.0</Price>
          )}
          <h6>Tax included.</h6>
          <FilterContainer>
            <Filter>
              <FilterTitle>Size : </FilterTitle>
              <FilterSize>
                <FilterSizeOption>{product.size?.[0]}</FilterSizeOption>
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <Button onClick={() => addToCart(product._id)}>ADD TO CART</Button>
          </AddContainer>
        </InfoContainer>
      </Wrapper>
      <Likediv>
        <Sub>YOU MAY ALSO LIKE</Sub>
      </Likediv>
      <LikeProducts />
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;

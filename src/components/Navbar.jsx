import { Badge } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";
import axios from "../axios";
const Container = styled.div`
  height: 60px;
  position: sticky;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
  ${mobile({ marginLeft: "5px" })}
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  text-decoration: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState();
  const navigate = useNavigate();
  const id = localStorage.getItem("u_id");

  useEffect(() => {
    axios
      .get(`/cart/getcartcount/${id}`)
      .then((resp) => {
        setQuantity(resp.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSearch = () => {
    axios
      .get(`/product/getproduct/${search}`)
      .then((resp) => {
        if (resp.data?.id?._id) {
          navigate(`/product/${resp.data?.id?._id}`);
        } else {
          navigate("/products/Clothes");

        }
      })
      .catch((err) => {
        navigate("/products/Clothes");

      });
  };

  const count = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              style={{ color: "gray", fontSize: 16, cursor: "pointer" }}
              onClick={handleSearch}
            />
          </SearchContainer>
        </Left>
        <Center>
          <Logo>ZAIN.</Logo>
        </Center>
        <Right>
          {!id && (
            <NavLink
              to="/register"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem>REGISTER</MenuItem>
            </NavLink>
          )}

          {user ? (
            <MenuItem onClick={(e) => navigate("/profile")}>
              MY ACCOUNT
            </MenuItem>
          ) : (
            <NavLink
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem>SIGNIN</MenuItem>
            </NavLink>
          )}

          <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem>
              <Badge badgeContent={quantity} color="primary">
                {/* <Badge badgeContent={count} color="primary"> */}
                <ShoppingCartOutlined />
              </Badge>
            </MenuItem>
          </Link>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;

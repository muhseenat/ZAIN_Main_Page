import { useEffect, useState } from "react";
import styled from "styled-components";

import Product from "./Product";
import axios from "../axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const LikeProducts = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios
      .get(cat ? `product/getproduct?category=${cat}` : "product/getproduct")
      .then((resp) => {
        return setProducts(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [cat]);

 
  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) => {
          Object.entries(filters).every(([key, value]) => {
            item[key].includes(value);
          });
        })
      );
  }, [products, cat, filters]);
  

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else if (sort === "desc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item,index) => <Product item={item} key={index} />)
        : products
            .slice(0, 4)
            .map((item) => <Product item={item} key={item.id} />)}
    </Container>
  );
};

export default LikeProducts;

import {
  Facebook,
  Instagram,
  MailOutline,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../responsive";
import {Link } from 'react-router-dom'
const Container = styled.div`
  display: flex;
  ${mobile({ flexDirection: "column" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
  margin: 20px 0px;
`;

const SocialContainer = styled.div`
  display: flex;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
  ${mobile({ display: "none" })}
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
  ${mobile({ backgroundColor: "#fff8f8" })}
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Payment = styled.img`
  width: 50%;
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>ZAIN.</Logo>
        <Desc>
          ZAIN Modestwears is a homegrown modest fashion founded in 2022.
          Delivering modest versions on the latest fashion trends to our
          audience has always been our aim. Join our #ZMWFAM today!
        </Desc>
       
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
        
          <ListItem><Link to='/'style={{textDecoration:"none",color:"inherit"}}>Home</Link></ListItem>
         
          <ListItem><Link to='/cart'style={{textDecoration:"none",color:"inherit"}}>Cart</Link></ListItem>
          <ListItem><Link to='/products/Clothes'style={{textDecoration:"none",color:"inherit"}}>Women Fashion</Link></ListItem>
          <ListItem><Link to='/products/Accessories'style={{textDecoration:"none",color:"inherit"}}>Accessories</Link></ListItem>
          <ListItem><Link to='/products/Hijab'style={{textDecoration:"none",color:"inherit"}}>Style Hijab</Link></ListItem>
          <ListItem><Link to='/profile'style={{textDecoration:"none",color:"inherit"}}>My Account</Link></ListItem>
          <ListItem><Link to='/order-history'style={{textDecoration:"none",color:"inherit"}}>Order Tracking</Link></ListItem>
          
         
         
         
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <ContactItem>
          <Room style={{ marginRight: "10px" }} /> Kanhnangad,Kasaragod
        </ContactItem>
        <ContactItem>
          <Phone style={{ marginRight: "10px" }} /> +91 9847666271
        </ContactItem>
        <ContactItem>
          <MailOutline style={{ marginRight: "10px" }} /> zain@gmail.com
        </ContactItem>
        <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </Right>
    </Container>
  );
};

export default Footer;

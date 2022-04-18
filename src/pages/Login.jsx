import { useState, useEffect } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "../axios";
import { loginSuccess } from "../redux/userRedux";
import { Link, useNavigate } from "react-router-dom";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/1108602/pexels-photo-1108602.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  text_align: "center";
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;
const OtpButton = styled.button`
  width: 50%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  text_align: "center";
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;
const ButtonContainer = styled.div`
  justify-content: space-around;
`;
const Error = styled.span`
  color: red;
`;

const Login = ({ setUserLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user-token");
    if (user) {
      return false;
    }
  });

  const handleClick = (e) => {
    e.preventDefault();
    const loginData = { email, password };
    axios
      .post("auth/login", loginData)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user", res.data?.user.name);
        localStorage.setItem("u_id", res.data?.user._id);
        dispatch(loginSuccess(res.data));
        setUserLogin(true);
        navigate("/");
      })
      .catch((error) => {
        setLoginError(error.response?.data.errorMessage);
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form onSubmit={handleClick}>
          <Input
            placeholder="Enter email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder=" Enter the password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <Error>{loginError}</Error>}
          <ButtonContainer>
            <Button>LOGIN</Button>
            <Link to="/otplogin">
              {" "}
              <OtpButton> OTP LOGIN</OtpButton>
            </Link>
          </ButtonContainer>
          <p>Don't have an Account ?</p>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            SIGNUP
          </Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;

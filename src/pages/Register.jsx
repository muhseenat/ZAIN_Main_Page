import styled from "styled-components";
import { mobile } from "../responsive";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { loginSuccess } from "../redux/userRedux";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "../axios";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/2911204/pexels-photo-2911204.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
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
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;
const Error = styled.span`
  color: red;
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedIn = localStorage.getItem("user-token");

    if (loggedIn) {
      navigate("/");
      return false;
    }
  }, []);
  async function signup(e) {
    e.preventDefault();

    try {
      const signupData = { name, email, phone, password, passwordVerify };
      await axios.post("auth/register", signupData).then((res) => {
        const token = res.data.token;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user", res.data?.user.name);
        localStorage.setItem("u_id", res.data?.user._id);
        dispatch(loginSuccess(res.data));
        navigate("/");
      });
    } catch (error) {
      setSignupError(error.response?.data.errorMessage);
    }
  }

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={signup}>
          <Input
            placeholder="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />

          <Input
            placeholder="email"
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <PhoneInput
            country={"in"}
            style={{ marginTop: "20px" }}
            containerStyle={{ margin: "20px", maxWidth: "40%" }}
            onChange={setPhone}
          />

          <Input
            placeholder="password"
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            placeholder="confirm password"
            type="password"
            onChange={(e) => {
              setPasswordVerify(e.target.value);
            }}
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          {signupError && <Error>{signupError}</Error>}
          <Button>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;

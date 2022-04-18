import styled from "styled-components";
import {Link, useNavigate} from 'react-router-dom';
import React ,{useState}from 'react';
import axios from '../axios'
import {mobile} from "../responsive";
import { loginSuccess } from "../redux/userRedux";
import {useDispatch} from 'react-redux'
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
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;


const Error = styled.span`
color:red`

const Otpverify = () => {
 
  const navigate = useNavigate();
 const dispatch = useDispatch();
  const [otp,setOtp]=useState('');
  
  const [error,setError] =useState('')

  async function verifyOtp(e){
    e.preventDefault();
    const number = localStorage.getItem("phone")
    await axios.post('auth/otpverify',{otp,number}).then((resp)=>
    {

      console.log(resp);
      const token = resp.data?.token;
        console.log(token);
        localStorage.setItem("user-token",token);
        localStorage.setItem("u_id", resp.data?.user._id);
        dispatch(loginSuccess(resp.data));
        navigate('/')
      
      
    }).catch((error)=>{
      console.log(error);
      setError(error.response?.data.errorMessage)
    })
  }
  return (
    <Container>
      <Wrapper>
        <Title>Verification</Title>
        <Form onSubmit={verifyOtp}>
        <p style={{margin:"10px"}}>You will get a OTP via SMS</p>
          <Input placeholder="Enter your OTP" onChange={(e)=>{setOtp(e.target.value)}} type='tel'  maxlength='4' required />
         
          <Button>VERIFY</Button>
          {error && <Error>{error}</Error>}
          <p>Didn't receive OTP ?</p>
          <Link to='/otplogin' style={{textDecoration:'none',color:'inherit'}}>Resend again</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Otpverify;
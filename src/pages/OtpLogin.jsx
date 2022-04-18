import styled from "styled-components";
import React ,{useState}from 'react';
import {mobile} from "../responsive";
import {Link, useNavigate} from 'react-router-dom';
import axios from '../axios'
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

const OtpLogin = () => {
  const [number,setNumber] = useState('');
  const [error,setError] =useState('')
  const navigate = useNavigate();

  async function sendOtp(e){
    e.preventDefault()
    localStorage.setItem('phone',number)
    await axios.post('auth/otpsend',{number}).then((resp)=>{
      navigate('/otpverify')
    }).catch((error)=>{
  setError(error.response?.data.errorMessage)
      
    })
  }


  return (
    <Container>
      <Wrapper>
        <Title>Verification</Title>
        <Form onSubmit={sendOtp}>
        <p style={{margin:"10px"}}>We will send you OTP on your Phone number</p>

        <h5>Please Enter your Country code : 91</h5>
          <Input placeholder="Enter your number" type='tel' onChange={(e)=>{setNumber(e.target.value)}}   required  />
         
          <Button type="submit" >Send OTP</Button>
          {error && <Error>{error}</Error>}
          <Link to='/register' style={{textDecoration:'none',color:'inherit'}}>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default OtpLogin;
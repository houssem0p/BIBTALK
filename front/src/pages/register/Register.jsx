import React, { useRef } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate , Link } from 'react-router-dom';

export default function Register() {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault()
    if(passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match")
    } else {
      const user = {
        username : username.current.value,
        email : email.current.value,
        password : password.current.value
      }
      try {
        await axios.post("http://localhost:5000/users/register", user)
        navigate("/login")
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">BIBTALK</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SocialMedia.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input  
              placeholder="Username" 
              className="loginInput" 
              ref={username}
              required 
            />
            <input 
              placeholder="Email" 
              className="loginInput" 
              ref={email} 
              required 
              type="email" 
            />
            <input 
              placeholder="Password" 
              className="loginInput" 
              ref={password} 
              required 
              type="password"
              minLength="8"
            />
            <input 
              placeholder="Password Again" 
              className="loginInput" 
              ref={passwordAgain}
              required 
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="/login" className="loginRegisterButton">
              Already have an account?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

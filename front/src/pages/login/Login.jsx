import { useContext, useRef } from "react";
import "./login.css";
import {CircularProgress} from '@material-ui/core'
import {Link} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"

export default function Login() {


const loginCall = async (userCredentials,dispatch) => {
    dispatch({type:"LOGIN_START"})
    try {
        const res = await axios.post("http://localhost:5000/users/login",userCredentials)
        dispatch({type:"LOGIN_SUCCESS" , payload:res.data.user})
        localStorage.setItem("token", res.data.token);
    } catch (error) {
        dispatch({type:"LOGIN_FAILURE" , payload:error})
    }
}



  const email = useRef()
  const password = useRef()
  const  {/*user ,*/  isFetching/*, error*/, dispatch } = useContext(AuthContext)

  const handleClick = (e) => {
    e.preventDefault()
    loginCall({email:email.current.value,password:password.current.value} , dispatch)
  }
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">BIBTALK</h3>
          <span className="loginDesc">
            Read about Books and Connect with friends and the world around you on BIBTALK.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBoxq" onSubmit={handleClick}>
            <input placeholder="Email" type="email" className="loginInput" ref={email} required/>
            <input placeholder="Password" required type="password" minLength="6" className="loginInput" ref={password}/>
            <button className="loginButton" disabled={isFetching}>{ isFetching? <CircularProgress style={{color:"white"}} size="20px"/> : "Log In"}</button>
            <Link to="/register" className="loginRegisterButton">
              Create a new account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

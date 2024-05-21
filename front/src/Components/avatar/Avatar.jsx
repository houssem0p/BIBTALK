import React,{ useContext} from 'react'
import "./avatar.css"
import {AuthContext} from "../../context/AuthContext"

export default function Avatar() {

  const  {user} = useContext(AuthContext)
  const imgPath = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="avatar">
      <img src={user.profileImage
        ? imgPath + user.profileImage
        : imgPath + "uploads/default-avatar.jpg"} 
         alt="" className="avatarImg"/>
      <h2 className="avatarName">{user.username}</h2>
      <h4 className="inscriptionDate">{user.email}</h4>
      {user.CreatedAt && 
        <h4 className="inscriptionDate">Joined {user.CreatedAt}</h4>
      }
      
    </div>
  )
}

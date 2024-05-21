import "./profile.css"
import Navbar from "../../Components/navbar/Navbar"
import Avatar from "../../Components/avatar/Avatar"
import BookContainer from "../../Components/bookContainer/BookContainer.jsx";
import Footer from "../../Components/footer/Footer"
import React,{ useContext} from 'react'
import {AuthContext} from "../../context/AuthContext"

const Profile = () => {

    const  {user} = useContext(AuthContext)

return (
    <div>
        <Navbar/>
        <div className="topPage">
            <Avatar/>
        </div>
        <BookContainer title="Plane To Read" list={user.wishList}/>
        <BookContainer title="Currently Reading" list={user.haveBeenRead}/>
        <BookContainer title="Completed" list={user.alreadyRead}/>
        <Footer/>
    </div>
)


}


export default Profile
import React, { useEffect, useState , useContext } from 'react'
import "./bookInfo.css"
import {AuthContext} from "../../context/AuthContext"
import {FaStar} from "react-icons/fa"
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Add,Remove} from "@material-ui/icons"

const BookInfo = ({book}) => {

  const imgPath = process.env.REACT_APP_PUBLIC_FOLDER;
  const  {user , dispatch} = useContext(AuthContext)
  const token = localStorage.getItem('token');

  const [wishListed,setWishListed] = useState(user.wishList.includes(book._id))
  const [read, setRead] = useState(user.alreadyRead.includes(book._id));
  const [reading, setReading] = useState(user.haveBeenRead.includes(book._id));

  useEffect(() => {
    setWishListed(user.wishList.includes(book._id))
    setRead(user.alreadyRead.includes(book._id));
    setReading(user.haveBeenRead.includes(book._id));
  },[user,book])

  const wishListHandler = async () => {
    try {
      if (wishListed) {
        await axios.delete(`http://localhost:5000/users/wishlist/${book._id}`, {
          headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        dispatch({type:"UNWISHLIST", payload: book._id})
      } else if(!wishListed) {
        await axios.post(`http://localhost:5000/users/wishlist/${book._id}`,{user}, { 
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        dispatch({type:"WISHLIST", payload: book._id})
      }
      setWishListed(!wishListed)
    } catch (error) {
      console.log(error)
    }
  }

  const readHandler = async () => {
    try {
      if (read) {
        // Remove from already read
        await axios.delete(`http://localhost:5000/users/alreadyread/${book._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'UNREAD', payload: book._id });
      } else {
        // Add to already read
        await axios.post(
          `http://localhost:5000/users/alreadyread/${book._id}`,
          { user },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch({ type: 'READ', payload: book._id });
      }
      setRead(!read);
    } catch (error) {
      console.log(error);
    }
  };

  const readingHandler = async () => {
    try {
      if (reading) {
        // Remove from reading
        await axios.delete(`http://localhost:5000/users/reading/${book._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'UNREADING', payload: book._id });
      } else {
        // Add to reading
        await axios.post(
          `http://localhost:5000/users/reading/${book._id}`,
          { user },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch({ type: 'READING', payload: book._id });
      }
      setReading(!reading);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bookInfo'>
      <div className="bookInfoRight">
          <img src={book.cover
          ? imgPath + book.cover
          : imgPath + "uploads/default_book_cover.jpg"} 
          alt=""  className="bookInfoImg"/>
      </div>
      <div className="bookInfoleft">
        <h1 className="bookInfoName">{book.title}</h1>
        <p className="bookInfoDesc">{book?.description}</p>
        <div className="ratingStars">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={currentRating}>
              <FaStar
                className="star"
                size={19}
                color={currentRating <= book.averageRating ? "#F8B84E" : "#909090"}
              />
            </label>
          );
        })}
      </div>
        <h5 className="generalRating bookBasicInfo"><span className='bold'>General Rating : </span> {book.averageRating}</h5>
        <h5 className="bookInfoAuthor bookBasicInfo"><span className='bold'>Author : </span>{book?.author}</h5>
        <h5 className="bookInfoCategory bookBasicInfo"><span className='bold'>Category : </span>{book?.category}</h5>
        <h5 className="bookInfolanguage bookBasicInfo"><span className='bold'>Language : </span>{book?.language}</h5>
        <h5 className="bookInfoDate bookBasicInfo"><span className='bold'>Published : </span>{book?.publishedDate}</h5>
        <div className="myListButtons">
            <button className="haveReadIt btnInfo" onClick={readHandler}>I have read it {read ? <Remove/> :<Add/>}</button>
            <button className="readingIt btnInfo" onClick={readingHandler}>I am reading it {reading ? <Remove/> :<Add/>}</button>
            <button className="wishlist btnInfo" onClick={wishListHandler}>My WishList {wishListed ? <Remove/> :<Add/>}</button>
        </div>
        {user.isSuperUser && 
          <Link
            key={book._id}
            to={{
              pathname: `/updatebook/${book._id}`
            }}
            className="modifyBtn"
            style={{textDecoration:"none"}}
          >
            Book Settings
          </Link>
        }
      </div>
    </div>
  )
}

export default BookInfo

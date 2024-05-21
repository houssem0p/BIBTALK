import React from 'react'
import "./Book.css"
import {FaStar} from "react-icons/fa"



export default function Book({title,author,rating,cover, listPage}) {

  const imgPath = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <>
    <div className="square">
      <div className="bookComponents">
        <img src={cover
          ? imgPath + cover
          : imgPath + "uploads/default_book_cover.jpg"} 
          alt="" 
          className="bookImg"
        />
        <h2 className="bookName">{title}</h2> 
        <h3 className="bookAuthor">{author}</h3>
        <div className="ratingStars">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={currentRating}>
              <FaStar
                className="star"
                size={19}
                color={currentRating <= rating ? "#F8B84E" : "#909090"}
              />
            </label>
          );
        })}
      </div>
      </div>
    </div>
    </>
  )
}

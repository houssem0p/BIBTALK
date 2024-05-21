import React, { useState , useEffect} from 'react'
import {FaStar} from "react-icons/fa"
import axios from 'axios';
import './review.css'
const Review = ({user , comment , rating}) => {


  const [reviewUser , setReviewUser] = useState(null)
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${user}`, {
          headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setReviewUser(response.data);
      } catch (error) {
        console.error('Error fetching User details:', error);
      }
    };

    fetchUserDetails();
  }, [token,user]);
    
  return (
    <div className='review'>
      <div className="nameAndRating">
        <h5 className="reviewUser">{reviewUser?.username}</h5>
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
      <p className="reviewText">{comment}</p>
    </div>
  )
}

export default Review

import React ,{useState} from 'react'
import "./bookReview.css"
import {FaStar} from "react-icons/fa"
import axios from 'axios';
import Review from '../Review/Review'

const BookReview = ({book}) => {

  const [rating, setRating]=useState(null)
  const[hover, setHover] = useState(null)

  const [comment, setComment] = useState('');

  const handleRatingChange = (currentRating) => {
    setRating(currentRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:5000/users/${book._id}/rating-comment`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      // Handle error, show error message or log it
      console.error('Error submitting review:', error);
    }
  };

  const initialCommentsToShow = 1;
  const [commentsToShow, setCommentsToShow] = useState(initialCommentsToShow);

  const handleLoadMoreComments = () => {
    const additionalComments = 2;
    setCommentsToShow(commentsToShow + additionalComments);
  };

  return (
    <div className='reviews'>
      <h2 className="reviewTitle">Reviews</h2>
      <input type="text" 
        className="reviewSelf" 
        placeholder='Review the book...' 
        value={comment}
        onChange={handleCommentChange}
      />
      <div className="flexItem">
        <div className="ratingStars">
          {[...Array(5)].map((star,index)=>{
            const currentRating =index+1;
         return (
          <label key={currentRating}>
          <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => handleRatingChange(currentRating)}
                />
        
        <FaStar
                  className="star"
                  size={19}
                  color={currentRating <= (hover || rating) ? '#F8B84E' : '#909090'}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>

         )
          })}
         
        </div>
        <button className="submitBtn" onClick={handleSubmit}>Submit</button>
      </div>
      {book.reviews.map((review) => (
        review.comments.slice(0, commentsToShow).map((comment , index) => (
          <Review
            key={index} // Adjust key as needed
            comment={comment}
            user={review.user}
            rating={review.rating}
          />
        ))
      ))}
      {book.reviews.some((review) => review.comments.length > commentsToShow) && (
        <button className="moreReviews" onClick={handleLoadMoreComments}>Load More</button>
      )}
    </div>
  )
}

export default BookReview

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./bookPage.css"
import Navbar from "../../Components/navbar/Navbar"
import BookInfo from "../../Components/bookInfo/BookInfo"
import BookReview from "../../Components/bookReview/BookReview"
import BookContainer from "../../Components/bookContainer/BookContainer.jsx";
import Footer from "../../Components/footer/Footer"
import { useParams } from 'react-router-dom';


const BookPage = () => {

  const { bookId } = useParams();
  const token = localStorage.getItem('token');

  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${bookId}`, {
          headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const averageRatingResponse = await axios.get(`http://localhost:5000/users/${bookId}/average-rating`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const averageRating = Math.round(averageRatingResponse.data.averageRating);

        const bookWithRating = { ...response.data, averageRating: averageRating };

        setBook(bookWithRating);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [bookId,token]);



  return (
    <div>
      <Navbar/>
      {!book ? <p>Loading...</p> : 
      <BookInfo book={book}/>
      }
      {!book ? <p>Loading...</p> : 
        <BookReview key={book._id} book={book}/>
      }
      <BookContainer thisBook={bookId} title="Similar" category={book?.category}/>
      <Footer/>
    </div>
  )
}

export default BookPage

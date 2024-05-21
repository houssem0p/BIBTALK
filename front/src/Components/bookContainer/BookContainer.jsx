import React, { useState, useEffect } from 'react'
import "./bookContainer.css"
import Book from "../Book/Book.jsx"
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BookContainer({thisBook , title , category , orderType , pageCategory , list}) {

    const [books, setBooks] = useState([]);
    const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch books from the server when the component mounts
    let fetchBooks
    !list && ( fetchBooks = async () => {
      let response

      try {
        {!category && orderType && !list
            ? 
             response = await axios.get(`http://localhost:5000/books/${orderType}`
            , {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            }
            )
            : ( category && !list && !orderType ?
              
              response = await axios.get(`http://localhost:5000/books/filter/category/${category}`
              , {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
              }
              ) // Adjust the API endpoint as needed
              : 
                console.log("")
              )
        }
        response.data = response.data.filter((b) => b._id !== thisBook);
        const averageRatingsPromises = response.data.map(async (book) => {
            const averageRatingResponse = await axios.get(`http://localhost:5000/users/${book._id}/average-rating`, {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
              },
            });
            const averageRating = averageRatingResponse.data.averageRating;
              // Round the average rating to the nearest whole number
            const roundedRating = Math.round(averageRating);
            return {
              ...book,
              averageRating: roundedRating,
            };
        });
        let booksWithRatings = await Promise.all(averageRatingsPromises);
        if(orderType === "top-rated") {
          booksWithRatings = booksWithRatings.sort((a, b) => {
            // Sort in descending order based on averageRating
            return b.averageRating - a.averageRating;
          });
        }
        setBooks(booksWithRatings);
      } catch (error) {
        console.error(`Error fetching books:`, error);
      }
    });

    let bookRequests
    list && ( bookRequests = list.map(async (bookId) => {
      try {
        const qsd = await axios.get(`http://localhost:5000/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
    
        return qsd.data;
      } catch (error) {
        console.error(`Error fetching book with ID ${bookId}:`, error);
        return null; // Handle the error as needed
      }
    }))
    async function fetchListBooks() {
      try {
        const bookss = await Promise.all(bookRequests);
        const averageRatingsPromises = bookss.map(async (book) => {
          const averageRatingResponse = await axios.get(`http://localhost:5000/users/${book._id}/average-rating`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          });
          const averageRating = averageRatingResponse.data.averageRating;
            // Round the average rating to the nearest whole number
          const roundedRating = Math.round(averageRating);
          return {
            ...book,
            averageRating: roundedRating,
          };
      });
      const booksWithRatings = await Promise.all(averageRatingsPromises);
      setBooks(booksWithRatings);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    list && fetchListBooks();
    !list && fetchBooks();
  }, [token , orderType , category , list , thisBook]);   
  

  return (
    <div className='bookContainer'>

        <div className="categorie">
            {title && <h2 className="title">{title}</h2>}
            <div className="books">
            {books.map((book) => (
            <Link className='bookLink' key={book._id} to={`/books/${book._id}`}>
                <Book
                    title={book.title}
                    author={book.author}
                    rating={book.averageRating}
                    cover={book.cover}
                    listPage={list && true}
                />
            </Link>
            
            ))}
            </div>
            {!pageCategory && category && !list &&
              <div className="seeMoreBtn">
                <Link className="seeMore" to={`/category/${category}`}>See More</Link>
              </div>     
            }
        </div>

    </div>
  )
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../../Components/footer/Footer";
import Navbar from "../../Components/navbar/Navbar";
import axios from 'axios';
import Book from '../../Components/Book/Book'; 
import './adminDashboard.css';

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch pending requests when the component mounts
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/pending-requests',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingRequests(response.data.pendingRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, [token]); // Run the effect only once when the component mounts

  return (
    <div className='adminDashboard'>
      <Navbar />
      <h2 className='titleAdmin'>Pending Books</h2>
      <div className='bookContainer'>
        <div className="categorie">
          <div className="books">
            {pendingRequests.map((book) => (
                <Link
                    key={book._id}
                    to={{
                        pathname: `/updatebook/${book._id}`
                    }}
                >
                    <Book
                        title={book.title}
                        author={book.author}
                        cover={book.cover}
                    />
                </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;


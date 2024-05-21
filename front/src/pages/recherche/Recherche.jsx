import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../Components/footer/Footer';
import Navbar from '../../Components/navbar/Navbar.jsx';
import './recherche.css';
import { Link } from 'react-router-dom';
import Book from '../../Components/Book/Book.jsx';

const Recherche = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const keyword = location.pathname.split('/search/')[1];

    if (keyword) {
      // Fetch search results based on the keyword
        axios.get(`http://localhost:5000/books/search/${keyword}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then((response) => {
            setSearchResults(response.data);
          })
          .catch((error) => {
            console.error('Error fetching search results:', error);
          });
    }
  }, [token,location.pathname]);

  return (
    <div>
      <Navbar />
      <h2 className="title">Results of {location.pathname.split('/search/')[1]}</h2>
      <div className='bookContainer'>
        <div className="categorie">
            <div className="books">
              {searchResults.map((book) => (
              <Link className='bookLink' key={book._id} to={`/books/${book._id}`}>
                  <Book
                      title={book.title}
                      author={book.author}
                      rating={book.averageRating}
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

export default Recherche;

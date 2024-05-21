import React, { useState, useEffect, useContext } from 'react';
import './categorie.css';
import Navbar from '../../Components/navbar/Navbar';
import LiveChat from '../../Components/livechat/Livechat';
import BookContainer from '../../Components/bookContainer/BookContainer.jsx';
import Footer from '../../Components/footer/Footer';
import categories from '../../utility/categories.json';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext.js';


const Category = () => {
  const { category: categoryName } = useParams();
  const category = categories.find((c) => c.name === categoryName);

  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  // Inside Category component
useEffect(() => {
  if (!user || !category) {
    return; // Do nothing if user or category is not available yet
  }

  const newSocket = io('http://localhost:5000');

  newSocket.on('connect', () => {
    // Emit a 'login' event with the user ID after the socket is connected
    newSocket.emit('login', user._id);
    // Join the category room after logging in
    newSocket.emit('joinCategory', { userId: user._id, category: categoryName }, (response) => {
    });
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, [user, categoryName, category]);


  return (
    <div>
      <Navbar />
      {category ? (
        <>
          <div className="topCategoryPage">
            <div className="categoryInfo">
              <h1 className="categoryName">{category.name}</h1>
              <h3>{category.description}</h3>
            </div>
            <div className="chat">
              <h4 className="livechatTitle">Communicate and Discuss about this category !</h4>
              {socket && <LiveChat socket={socket} category={categoryName} user={user} />}
            </div>
          </div>
          <h1 className="booksTitle">Explore Books From This Category</h1>
          <BookContainer category={categoryName} pageCategory={true} />
        </>
      ) : (
        <h2 className="noCategoryFound">There is no such a Category with the Name of : {categoryName}</h2>
      )}
      <Footer />
    </div>
  );
};

export default Category;


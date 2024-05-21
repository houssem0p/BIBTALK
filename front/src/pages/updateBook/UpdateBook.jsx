import Footer from '../../Components/footer/Footer';
import Navbar from '../../Components/navbar/Navbar';
import React, { useState , useEffect } from 'react';
import { useParams , useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './updateBook.css';
import { Cancel, PermMedia } from '@material-ui/icons';

const UpdateBook = () => {
  const { bookId } = useParams();

  const token = localStorage.getItem("token");

  const imgPath = process.env.REACT_APP_PUBLIC_FOLDER;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    language: '',
    publishedDate: '',
    cover: null,
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/anybook/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const bookData = response.data;
        setFormData({
          title: bookData.title,
          author: bookData.author,
          description: bookData.description || '',
          category: bookData.category || '',
          language: bookData.language || '',
          publishedDate: bookData.publishedDate || '',
          cover: bookData.cover || null,
        });
      } catch (error) {
        console.error('Error fetching book details:', error);
        // Handle error, maybe show an error message or redirect
      }
    };

    fetchBookDetails();
  }, [bookId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'cover' ? files[0] : value,
    }));
  };

  const getCoverSource = () => {
    // Check if cover is a File object (URL.createObjectURL) or a direct file path
    if (formData.cover instanceof File) {
      return URL.createObjectURL(formData.cover);
    } else if (typeof formData.cover === 'string') {
      return imgPath + formData.cover; // Adjust the URL as needed
    }
    return null;
  };

  // Format the date to "yyyy-MM-dd"
  const formattedDate = formData.publishedDate ? new Date(formData.publishedDate).toISOString().split('T')[0] : '';

  
  const handleUpdate = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.put(`http://localhost:5000/books/update/${bookId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      // Handle error, maybe show an error message
    }
  };

  const handleApproval = async (action) => {
    try {
      await axios.put(`http://localhost:5000/users/approve-reject-request/${bookId}`, { action },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Show alert for approval/rejection
      alert(`Book ${action === 'approve' ? 'approved' : 'rejected'} successfully`);

      // Redirect to Admin Dashboard
      navigate('/adminDashboard');
    } catch (error) {
      console.error('Error updating book request:', error);
      // Handle error, maybe show an error message
    }
  };

  return (
    <div className='AddBook'>
      <Navbar />
      <div className="updateBookContainer">
        <h1 className="pageTitle">Update Book</h1>
        <form className="addBookForm" onSubmit={handleUpdate}>
        <label>
                    Title:
                    <input className='bookInput' type="text" name="title" value={formData.title} onChange={handleChange} required />
                </label>
                <label>
                    Author:
                    <input className='bookInput' type="text" name="author" value={formData.author} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <textarea style={{ height: '66.5px' }} className='bookInput' name="description" value={formData.description} onChange={handleChange}></textarea>
                </label>
                <label>
                    Category:
                    <select  name="category" value={formData.category} onChange={handleChange}>
                        <option value="Other">Other</option>
                        <option value="Arts & Music">Arts & Music</option>
                        <option value="Biography">Biography</option>
                        <option value="Business">Business</option>
                        <option value="Comics">Comics</option>
                        <option value="Computer & Tech">Computer & Tech</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Crime">Crime</option>
                        <option value="Drama">Drama</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Health">Health</option>
                        <option value="History">History</option>
                        <option value="Horror">Horror</option>
                        <option value="Kids">Kids</option>
                        <option value="Literature">Literature</option>
                        <option value="Medical">Medical</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Religion">Religion</option>
                        <option value="Romance">Romance</option>
                        <option value="Science Fiction & Fantasy">Science Fiction & Fantasy</option>
                        <option value="Science & Math">Science & Math</option>
                        <option value="Sports">Sports</option>
                        <option value="Travel">Travel</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Western">Western</option>
                    </select>
                </label>
                <label>
                    Cover Image: <PermMedia style={{cursor:'pointer'}}/>
                    <input style={{display:'none'}} className='fileInput' type="file" name="cover" onChange={handleChange} accept="image/*" />
                </label>
                {formData.cover && (
                    <div className="fileImgContainer">
                        <img className='fileImg' src={getCoverSource()} alt="" />
                        <Cancel style={{cursor:'pointer'}} className='fileImgCancel' onClick={()=>setFormData((prevData) => ({
                            ...prevData,
                            cover:null
                            }))}/>
                    </div>
                )}
                <label>
                    Language:
                    <input className='bookInput' type="text" name="language" value={formData.language} onChange={handleChange} />
                </label>
                <label>
                    Published Date:
                    <input type="date" name="publishedDate" value={formattedDate} onChange={handleChange} />
                </label>
          <button className="submitBtn" type="submit">
            Update Book
          </button>
        </form>
        <div className="approvalButtons">
          <button className="approveBtn submitBtn" onClick={() => handleApproval('approve')}>
            Approve
          </button>
          <button className="rejectBtn submitBtn" onClick={() => handleApproval('reject')}>
            Reject
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateBook;
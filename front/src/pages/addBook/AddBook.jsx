import React, { useState } from 'react';
import Footer from "../../Components/footer/Footer"
import Navbar from "../../Components/navbar/Navbar"
import axios from 'axios';
import { Cancel, PermMedia } from '@material-ui/icons';
import "./addBook.css"

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        language: '',
        publishedDate: '',
        cover: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'cover' ? files[0] : value,
        }));
    };

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        try {
            await axios.post('http://localhost:5000/users/submit-request', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            window.location.reload();

            setFormData({
                title: '',
                author: '',
                description: '',
                category: '',
                language: '',
                publishedDate: '',
                cover: null,
            });

            console.log("book added succefully")
        } catch (error) {
            console.error('Error submitting book:', error);
        }
    };

    return (
        <div className="AddBook">
            <Navbar/>
            <h1 className='pageTitle'>Add a Book</h1>
            <form className='addBookForm' onSubmit={handleSubmit}>
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
                        <img className='fileImg' src={URL.createObjectURL(formData.cover)} alt="" />
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
                    <input className='dateInput' type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} />
                </label>
                <button className="submitBtn" type="submit">Add Book</button>
            </form>
            <Footer/>
        </div>
    );
};

export default AddBook;

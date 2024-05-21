import Footer from '../../Components/footer/Footer';
import Navbar from '../../Components/navbar/Navbar';
import React from 'react';
import './profileSettings.css';

const ProfileSettings = () => {
  return (
    <div>
        <Navbar/>
        <h1 className="pageTitle">Profile Settings (this doesn't work yet)</h1>
        <form className='profileForm'>
            <label>
                Username:
                <input className='profileInput' type="text"/>
            </label>
            <label>
                Email:
                <input className='profileInput' type="email"/>
            </label>
            <label>
                Password:
                <input placeholder='Old Password' className='profileInput' type="password"/>
            </label>
            <label>
                <input placeholder='New Password' className='profileInput' type="password"/>
            </label>
            <label>
                <input placeholder='Confirm Old Password' className='profileInput' type="password"/>
            </label>
            <label>
                Profile Image
                <input placeholder='Confirm Old Password' className='' type="file"/>
            </label>
            <button className="profileSubmitBtn">
                Save
            </button>
        </form>
        <Footer/>
    </div>
  )
}

export default ProfileSettings

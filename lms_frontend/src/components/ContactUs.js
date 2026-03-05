import { useState } from "react";
import axios from "axios";
import "../ContactUs.css";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const baseUrl = 'http://127.0.0.1:8000/api/contact/';

function ContactUs() {
    const [contactData, setContactData] = useState({
        'full_name': '',
        'email': '',
        'query_txt': '',
    });

    const handleChange = (event) => {
        setContactData({
            ...contactData,
            [event.target.name]: event.target.value
        });
    }
    
    const submitForm = (event) => {
        event.preventDefault();
        const contactFormData = new FormData();
        contactFormData.append("full_name", contactData.full_name);
        contactFormData.append("email", contactData.email);
        contactFormData.append("query_txt", contactData.query_txt);

        axios
            .post(baseUrl, contactFormData)
            .then((response) => {
                setContactData({
                    full_name: '',
                    email: '',
                    query_txt: '',
                    status: 'success',
                });
            })
            .catch((error) => {
                console.error('Error', error);
                setContactData({
                    ...contactData,
                    status: 'error',
                });
            });
    };

    return (
    <div className="con-con-container">
        <div className="con-con-card">
            <h2 className="con-con-title">
                Contact Us <FaEnvelope className="con-con-icon" />
            </h2>

            {contactData.status === 'success' && (
                <p className="con-con-message ud-success">Thanks for contacting us!</p>
            )}
            {contactData.status === 'error' && (
                <p className="con-con-message ud-error">Something went wrong. Please try again.</p>
            )}

            <form className="con-con-form">
                <div className="con-con-form-group">
                    <label htmlFor="full_name" className="con-con-label">Full Name</label>
                    <input 
                        value={contactData.full_name} 
                        onChange={handleChange} 
                        name="full_name" 
                        type="text" 
                        className="con-con-input" 
                        placeholder="Enter your full name" 
                    />
                </div>    
                <div className="con-con-form-group">
                    <label htmlFor="email" className="con-con-label">Email</label>
                    <input 
                        value={contactData.email} 
                        onChange={handleChange} 
                        name="email" 
                        type="email" 
                        className="con-con-input" 
                        placeholder="Enter your email" 
                    />
                </div>
                <div className="con-con-form-group">
                    <label htmlFor="query_txt" className="con-con-label">Your Query</label>
                    <textarea 
                        value={contactData.query_txt} 
                        onChange={handleChange} 
                        name="query_txt" 
                        className="con-con-input con-con-textarea"
                        placeholder="Type your message here..."
                    ></textarea>
                </div>    
                <button 
                    onClick={submitForm} 
                    type="submit" 
                    className="con-con-submit-btn"
                >
                    Send Message
                </button>
            </form>
        </div>
        
        <div className="con-con-info-card">
            <h2 className="con-con-title">
                Our Information <FaMapMarkerAlt className="con-con-icon" />
            </h2>
            <ul className="con-con-info-list">
                <li className="con-con-info-item">
                    <FaMapMarkerAlt className="con-con-info-icon" />
                    <span className="con-con-info-text">Palakkad, Kerala</span>
                </li>
                <li className="con-con-info-item">
                    <FaPhone className="con-con-info-icon" />
                    <span className="con-con-info-text">1234567890</span>
                </li>
            </ul>
        </div>
    </div>
);
}

export default ContactUs;
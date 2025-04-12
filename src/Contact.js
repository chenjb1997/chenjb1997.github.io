import React from 'react';
import { FaGithub, FaEnvelope, FaBook, FaFilePdf } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            <h1 className="contact-heading">Contact</h1>
            <p className="contact-text">
                If you have any questions, would like to discuss my research, or are interested in collaboration opportunities, please don't hesitate to reach out. Below, you can find the best ways to contact me.
            </p>
            <div className="contact-icon-links">
                <a
                    href="mailto:chenjb1997@gmail.com"
                    className="contact-icon-link"
                >
                    <FaEnvelope className="contact-icon" /> Email
                </a>
                <a
                    href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ"
                    className="contact-icon-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaBook className="contact-icon" /> Google Scholar
                </a>
                <a
                    href="/CV.pdf"
                    className="contact-icon-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaFilePdf className="contact-icon" /> Download CV
                </a>
                <a
                    href="https://github.com/chenjb1997"
                    className="contact-icon-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub className="contact-icon" /> GitHub
                </a>
            </div>
        </div>
    );
};

export default Contact;

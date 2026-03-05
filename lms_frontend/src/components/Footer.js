import React, { useEffect, useState } from "react";
import "../Footer.css";
import { Link } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

export default function Footer() {
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/pages/`)
      .then((res) => {
        setPagesData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pages:", err);
        setError("Failed to load pages");
        setLoading(false);
      });
  }, []);

  return (
    <footer className="-footer__container" style={{ backgroundColor: "#ffffff" }}>
      <ul className="-footer__nav">
        <li className="-footer__nav-item">
          <Link to="/" className="-footer__nav-link">Home</Link>
        </li>
        <li className="-footer__nav-item">
          <Link to="/faq/" className="-footer__nav-link">FAQs</Link>
        </li>
        {pagesData.map((row) => (
          <li key={row.id} className="-footer__nav-item">
            <Link to={`/page/${row.id}${row.url}`} className="-footer__nav-link">
              {row.title}
            </Link>
          </li>
        ))}
        <li className="-footer__nav-item">
          <Link to="/contact-us" className="-footer__nav-link">Contact Us</Link>
        </li>
      </ul>
      <p className="-footer__copyright">© 2025 Learnova</p>
    </footer>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import "../FAQ.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function FAQ() {
  const [faqData, setfaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}/faq/`)
      .then((res) => {
        setfaqData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs");
        setLoading(false);
      });
  }, []);
  
return (
  <div className="faq-faq-container">
    <h3 className="faq-faq-header">Frequently Asked Questions</h3>
    
    {loading ? (
      <div className="faq-faq-loading">Loading FAQs...</div>
    ) : error ? (
      <div className="faq-faq-error">{error}</div>
    ) : (
      <div className="faq-faq-accordion" id="faqAccordion">
        {faqData.map((faq, index) => (
          <div className="faq-faq-item" key={faq.id}>
            <h2 className="faq-faq-header">
              <button 
                className={`faq-faq-button ${index === 0 ? '' : 'collapsed'}`}
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#faqCollapse${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`faqCollapse${index}`}
              >
                {faq.question}
              </button>
            </h2>
            <div 
              id={`faqCollapse${index}`} 
              className={`faq-faq-collapse collapse ${index === 0 ? 'show' : ''}`} 
              data-bs-parent="#faqAccordion"
            >
              <div className="faq-faq-body">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default FAQ;
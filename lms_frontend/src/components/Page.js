import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

function Page(){
    const [pagesData, setpagesData] = useState([]);
    let {page_id,page_slug} = useParams();
    useEffect(() => {
        axios.get(`${baseUrl}/pages/${page_id}/${page_slug}`)
            .then((res) => {
            setpagesData(res.data);
            })
            .catch((err) => {
            console.error("Error:", err);
            });
    }, [page_id]);
    return(
        <div className="faq-container">
            <h2 className="text-warning">{pagesData.title}</h2>
            <p className="text-white">{pagesData.content}</p>
        </div>
    )
}

export default Page;
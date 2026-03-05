import { useState, useEffect, useRef } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

function MessageList(props) {
  const [msgData, setMsgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const msgListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [props.teacher_id, props.student_id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/get-messages/${props.teacher_id}/${props.student_id}`
      );
      setMsgData(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
      setMsgData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msgListRef.current) {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }
  }, [msgData]);

  const msgListStyle = {
    height: '500px',
    overflowY: 'auto',
    background: '#e5ddd5',
    padding: '20px',
    borderRadius: '10px',
    fontFamily: 'sans-serif'
  };

  const sentMsgStyle = {
    backgroundColor: '#dcf8c6',
    padding: '10px 15px',
    borderRadius: '10px 10px 0 10px',
    maxWidth: '75%',
    display: 'inline-block',
    wordWrap: 'break-word',
    marginBottom: '5px'
  };

  const receivedMsgStyle = {
    backgroundColor: '#fff',
    padding: '10px 15px',
    borderRadius: '10px 10px 10px 0',
    maxWidth: '75%',
    display: 'inline-block',
    wordWrap: 'break-word',
    marginBottom: '5px'
  };

  const timestampStyle = {
    fontSize: '0.75rem',
    color: '#6c757d',
    display: 'block'
  };

  return (
    <div>
      <p>
        <button 
          className="ms-3 btn btn-sm btn-success" 
          onClick={fetchMessages} 
          title="Refresh"
          disabled={loading}
        >
          <i className="bi bi-bootstrap-reboot"></i>
          {loading ? ' Loading...' : ' Refresh'}
        </button>
      </p>
      
      <div style={msgListStyle} id="msgList" ref={msgListRef}>
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : msgData.length === 0 ? (
          <div className="text-muted">No messages found</div>
        ) : (
          msgData.map((row, index) => (
            <div className="row mb-3" key={index}>
              {row.msg_from !== 'student' ? (
                <div className="col-12 text-start text-dark">
                  <div style={receivedMsgStyle}>
                    {row.msg_text}
                  </div>
                  <small style={timestampStyle}>
                    {row.msg_time}
                  </small>
                </div>
              ) : (
                <div className="col-12 text-end text-dark">
                  <div style={sentMsgStyle}>
                    {row.msg_text}
                  </div>
                  <small style={timestampStyle}>
                    {row.msg_time}
                  </small>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessageList;
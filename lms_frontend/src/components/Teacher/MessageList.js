import { useState, useEffect } from "react";
import axios from "axios";
import "../../MessageList.css";
const baseUrl = "http://127.0.0.1:8000/api";

function MessageList(props) {
  const [msgData, setMsgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (msgData.length > 0) {
      const objDiv = document.getElementById('msgList');
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }
  }, [msgData]);

  const msgListStyle = {
    height: '500px',
    overflowY: 'scroll',
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
        className="msg-refresh-btn"
        onClick={fetchMessages}
        title="Refresh"
        disabled={loading}
      >
        <i className="bi bi-bootstrap-reboot"></i>
        {loading ? ' Loading...' : ' Refresh'}
      </button>
    </p>

    <div className="msg-list-container" id="msgList">
      {loading ? (
        <div className="msg-loading">Loading messages...</div>
      ) : error ? (
        <div className="msg-error">{error}</div>
      ) : msgData.length === 0 ? (
        <div className="msg-empty">No messages found</div>
      ) : (
        msgData.map((row, index) => (
          <div className="msg-item" key={index}>
            {row.msg_from !== 'teacher' ? (
              <div className="msg-received-wrapper">
                <div className="msg-bubble msg-received">
                  {row.msg_text}
                </div>
                <span className="msg-timestamp">{row.msg_time}</span>
              </div>
            ) : (
              <div className="msg-sent-wrapper">
                <div className="msg-bubble msg-sent">
                  {row.msg_text}
                </div>
                <span className="msg-timestamp">{row.msg_time}</span>
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
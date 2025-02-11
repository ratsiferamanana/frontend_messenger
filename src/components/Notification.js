import { io } from 'socket.io-client';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import React,{useState, useEffect} from 'react';
const socket = io("https://chat-backend-5iep.onrender.com");


function Notification() {
 //State
 const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState({});


//Comportement
useEffect(() => {
    socket.on("chat message", (msg) => {
      
      // Afficher la notification avec le dernier message reçu
      setToastMessage(msg);
      setShowToast(true);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => setShowToast(false), 10000);
    });
  
    return () => {
      socket.off("chat message");
    };
  }, []);
  

  return (
    <ToastContainer className="position-static" position="top-end">
      <Toast show={showToast} onClose={() =>setShowToast(false)} delay={10000} autohide
      bg='success'  className="d-inline-block m-1">
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">{toastMessage.user}</strong>
          <small className="text-muted">{new Date(toastMessage.created_at).toLocaleString()}</small>
        </Toast.Header>
        <Toast.Body className='text-white'>{toastMessage.text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Notification;
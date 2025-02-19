import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Container, Form, Button, ListGroup, Card, Modal } from "react-bootstrap";
import Notification from "./Notification";
import EmojiPicker from 'emoji-picker-react'; // Importez EmojiPicker
const socket = io("https://chat-backend-8r8l.onrender.com");

function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);// Gérer l'affichage du sélecteur d'émojis

  const playNotificationSound = () => {
    const audio = new Audio("/mixkit-correct-answer-tone-2870.wav");
    audio.muted = true;  // Active mute au début
    audio.play().then(() => {
        audio.muted = false;  // Désactive mute après le démarrage
    }).catch((error) => console.log("Erreur de lecture :", error));
};

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      playNotificationSound();
    });
    socket.on("chat history", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // Envoyer le pseudo au serveur
  const handleSetUsername = () => {
    if (username.trim()) {
      socket.emit("set username", username);
      setShowModal(false);
    }
  };

  // Envoyer un message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  // Ajouter un émoji dans le message
  const onEmojiClick = (emoji) => {
    setMessage(message + emoji.emoji);
    setShowEmojiPicker(false); // Fermer le sélecteur après avoir ajouté l'émoji
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg">
        <Card.Body>
          <Notification />
          <h2 className="text-center text-primary">💬 Chat en temps réel par Jimmy Ratsiferamanana</h2>
          <h2 className="text-center text-primary mt-5">
            <strong className="text-secondary">UTILISATEUR : </strong>{username}
          </h2>

          <ListGroup variant="flush" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <ListGroup.Item key={index}>
                <strong className="text-primary">{msg.user} :</strong> {msg.text}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={sendMessage} className="d-flex mt-3">
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écris un message..."
              className="me-2"
            />
            <Button
              variant="secondary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="me-2"
            >
              😀
            </Button>

            {showEmojiPicker && (
  <div
    style={{
      position: "fixed", // Fixe l'élément à la fenêtre
      top: "50%", // Centrer verticalement
      left: "50%", // Centrer horizontalement
      transform: "translate(-50%, -50%)", // Ajuster pour qu'il soit parfaitement centré
      zIndex: 9999, // Assurez-vous qu'il est au-dessus des autres éléments
    }}
  >
    <EmojiPicker onEmojiClick={onEmojiClick} />
  </div>
)}


            <Button variant="primary" type="submit">
            <i class="bi bi-send-fill"></i>
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal pour entrer un pseudo */}
      <Modal show={showModal} centered>
        <Modal.Body>
          <h5>Entrez votre pseudo :</h5>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre pseudo..."
          />
          <Button className="mt-3 w-100" variant="success" onClick={handleSetUsername}>
            Valider
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Message;

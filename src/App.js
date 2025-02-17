import React, { useState } from "react";
import Select from "react-select";
import "./App.css";

const DEFAULT_AVATAR = "https://via.placeholder.com/40";

const languageOptions = [
  { value: "en", label: "Inglés" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Francés" },
  { value: "de", label: "Alemán" }
];

const translateText = async (text, targetLang) => {
  const response = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=auto|${targetLang}`);
  const data = await response.json();
  return data.responseData.translatedText;
};

function ChatApp() {
  const [contacts, setContacts] = useState([
    { name: "María", avatar: DEFAULT_AVATAR },
    { name: "Carlos", avatar: DEFAULT_AVATAR },
    { name: "Ana", avatar: DEFAULT_AVATAR },
  ]);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [translatedInput, setTranslatedInput] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [newContact, setNewContact] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const sendMessage = () => {
    if (input.trim() !== "" && activeChat) {
      const newMsg = {
        original: input,
        traducido: translatedInput,
      };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat.name]: [...(prevMessages[activeChat.name] || []), newMsg],
      }));
      setInput("");
      setTranslatedInput("");
    }
  };

  const handleTranslate = async () => {
    const translation = await translateText(input, selectedLanguage);
    setTranslatedInput(translation);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Contactos</h2>
        <input
          type="text"
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          placeholder="Nuevo contacto..."
        />
        <button onClick={() => setContacts([...contacts, { name: newContact, avatar: DEFAULT_AVATAR }])}>Agregar</button>
        <ul>
          {contacts.map((contact, index) => (
            <li key={index} onClick={() => setActiveChat(contact)} style={{ cursor: "pointer" }}>
              {contact.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat">
        <div className="chat-header">
          {activeChat && <img src={activeChat.avatar} alt={activeChat.name} className="contact-avatar" />}
          {activeChat && <h3>{activeChat.name}</h3>}
        </div>
        {activeChat ? (
          <div className="chat-window-container">
            <div className="chat-window">
              {(messages[activeChat.name] || []).map((msg, index) => (
                <div key={index} className="message">
                  <p><strong>Original:</strong> {msg.original}</p>
                  {msg.traducido && <p><strong>Traducido:</strong> {msg.traducido}</p>}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <Select 
                options={languageOptions} 
                value={languageOptions.find(opt => opt.value === selectedLanguage)}
                onChange={(option) => setSelectedLanguage(option.value)}
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <button onClick={handleTranslate}>Traducir</button>
              <input
                type="text"
                value={translatedInput}
                onChange={(e) => setTranslatedInput(e.target.value)}
                placeholder="Traducción (editable)..."
              />
              <button onClick={sendMessage}>Enviar</button>
            </div>
          </div>
        ) : (
          <h3>Selecciona un contacto para chatear</h3>
        )}
      </div>
    </div>
  );
}

export default ChatApp;

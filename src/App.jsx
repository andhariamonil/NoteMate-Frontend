import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Inputs from './components/Inputs';
import Cards from './components/Cards';
import ChatBot from './components/ChatBot'; // ✅ Your custom ChatBot component

function App() {
  const [search, setSearch] = useState(null);
  const [isLogIn, setIsLogIn] = useState(false);
  const [cardRefresh, setCardRefresh] = useState(false);

  return (
    <div className="relative">
      <Navbar
        isLogIn={isLogIn}
        setIsLogIn={setIsLogIn}
        search={search}
        setSearch={setSearch}
        cardRefresh={cardRefresh}
        setCardRefresh={setCardRefresh}
      />

      {/* Main UI */}
      {/* <Inputs setCardRefresh={setCardRefresh} />
      <Cards
        search={search}
        setSearch={setSearch}
        cardRefresh={cardRefresh}
      /> */}

      {/* Floating Chatbot */}
      {/* <ChatBot /> */}
    </div>
  );
}

export default App;

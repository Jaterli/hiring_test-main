import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MemoryGameLayout from "./MemoryGameLayout";
import GameControls from "./GameControls";
import ConfirmationModal from "./ConfirmationModal";
import { Box } from "@mui/material";
import Card from "./Card";
import PropTypes from 'prop-types';


const MemoryGameBase = ({ 
  difficulty, 
  cardImages, 
  matchAudioFiles, 
  congratsAudio, 
  bgMusic,
  gridColumns,
  cardSize = 'medium'
}) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  
  const bgVolume = parseInt(localStorage.getItem("bgVolume"), 10) || 0;
  const sfxVolume = parseInt(localStorage.getItem("sfxVolume"), 10) || 0;
  const userID = localStorage.getItem("userID");


  MemoryGameBase.propTypes = {
    difficulty: PropTypes.string.isRequired,
    cardImages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    matchAudioFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    congratsAudio: PropTypes.string.isRequired,
    bgMusic: PropTypes.string.isRequired,
    gridColumns: PropTypes.number.isRequired,
    cardSize: PropTypes.oneOf(['small', 'medium', 'large']),
  };


  const saveGameData = async (gameData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/memory/save", gameData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Game data saved successfully", response.data);
    } catch (error) {
      console.error("Error saving game data:", error.response ? error.response.data : error.message);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleSaveNewGame = () => {
    saveGameData({
      userID,
      gameDate: new Date(),
      failed: failedAttempts,
      difficulty,
      completed: 0,
      timeTaken: timer,
    });
  };
  
  const handleNewGame = () => {
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);

    const mouseDisableDuration = 2000;
    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
    }, mouseDisableDuration);

    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
    }, 1500);
  };

  const handleBackButton = () => {
    setOpenModal(true);
  };

  const handleModalYes = () => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  const handleModalNo = () => {
    setOpenModal(false);
  };
  
  const handleCardClick = (card) => {
    if (!matchedCards.includes(card.id) && 
        flippedCards.length < 2 && 
        !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  useEffect(() => {
    if (!userID) {
      console.error("Error: userID is missing.");
      return;
    }
    
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current.play().catch((error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev) => [...prev, card1.id, card2.id]);
          if (audioIndex < matchAudioFiles.length) {
            const nextAudio = new Audio(matchAudioFiles[audioIndex]);
            nextAudio.volume = sfxVolume / 100;
            nextAudio.play();
            setAudioIndex(audioIndex + 1);
          }
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, audioIndex, sfxVolume]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const congrats = new Audio(congratsAudio);
      congrats.volume = sfxVolume / 100;
      congrats.play();

      setTimerActive(false);

      const saveData = async () => {
        try {
          await saveGameData({
            userID,
            gameDate: new Date(),
            failed: failedAttempts,
            difficulty,
            completed: 1,  
            timeTaken: timer,
          });
          localStorage.setItem("gameCompleted", "true");
          setTimeout(() => navigate(`/congt-${difficulty.toLowerCase()}`), 1000);
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer, difficulty]);

  return (
    <MemoryGameLayout mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      
      <GameControls 
        onNewGame={() => { handleSaveNewGame(); handleNewGame(); }}
        onBack={handleBackButton}
        failedAttempts={failedAttempts}
        timer={timer}
      />
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        maxWidth: (gridColumns === 2 ? '600px' : '900px'),
        margin: { xs: '20px 0', md: '40px 0 0 0' },
        padding: { xs: '0 10px', sm: '0 20px' }
      }}>
        {cards.map((card) => (
          <Box key={card.id} sx={{
            width: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Card
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={
                initialReveal ||
                flippedCards.some((c) => c.id === card.id) ||
                matchedCards.includes(card.id)
              }
              matched={matchedCards.includes(card.id)}
              size={cardSize}
            />
          </Box>
        ))}
      </Box>

      <ConfirmationModal 
        open={openModal}
        onClose={handleModalNo}
        onConfirm={() => { handleSaveNewGame(); handleModalYes(); }}
      />
    </MemoryGameLayout>
  );
};

export default MemoryGameBase;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import background from "../assets/images/mode1.gif";
import bgMusic from "../assets/audio/memory-bg.mp3";
import axios from "axios";

const defaultDifficulty = "Normal";

// Card Images
const cardImages = [
  { id: 1, image: "/images/meteor.png" },
  { id: 2, image: "/images/meteor.png" },
  { id: 3, image: "/images/moon.png" },
  { id: 4, image: "/images/moon.png" },
  { id: 5, image: "/images/comet.png" },
  { id: 6, image: "/images/comet.png" },
];

// Audio files for matching and final congratulation
const matchAudioFiles = [
  "/audio/wonderful.mp3",
  "/audio/NiceJob.mp3",
];

const congratsAudio = "/audio/congrats.mp3"; // Final congratulations audio

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
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

// Styled Components
const StyledGameContainer = styled(Box)(({ theme, mouseDisabled }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  pointerEvents: mouseDisabled ? "none" : "auto",
  overflow: "hidden",
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  [theme.breakpoints.down('sm')]: {
    fontSize: "12px",
    padding: "10px 20px",
  },
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: "1%",
  left: "1%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  zIndex: 1000,
  [theme.breakpoints.down('sm')]: {
    position: "relative",
    bottom: "auto",
    left: "auto",
    flexDirection: "row",
    justifyContent: "center",
    gap: "16px",
    marginTop: "10px",
    marginBottom: "16px",
    width: "100%",
  },
}));

const PixelBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: theme.spacing(1, 2),
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  whiteSpace: "nowrap",
  [theme.breakpoints.down('sm')]: {
    fontSize: "10px",
    padding: theme.spacing(0.75, 1.5),
  },
}));

const PixelTimerBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: theme.spacing(1, 2),
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  whiteSpace: "nowrap",
  [theme.breakpoints.down('sm')]: {
    fontSize: "10px",
    padding: theme.spacing(0.75, 1.5),
  },
}));

const CardContainer = styled(Box)(({ theme }) => ({
  perspective: "1000px",
  cursor: "pointer",
  width: "100%",
  height: "100%",
  maxWidth: "220px",
  maxHeight: "220px",
  [theme.breakpoints.down('md')]: {
    maxWidth: "180px",
    maxHeight: "180px",
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: "120px",
    maxHeight: "120px",
  },
}));

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "80%",
  height: "80%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "90%",
  height: "90%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#2c2c54',
  border: '2px solid #00d9ff',
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
  width: '85%',
  maxWidth: '400px',
};

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '24px',
  color: '#fff',
  letterSpacing: '1px',
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}));

const PixelButtonModal = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "12px",
    padding: "10px 20px",
  },
}));

// Card Component
const Card = ({ card, handleClick, flipped, matched }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform }}>
        <CardFront>
          <img 
            src={card.image} 
            alt="Card front" 
            style={{ 
              width: "100%", 
              height: "100%",
              objectFit: "contain" 
            }} 
          />
        </CardFront>
        <CardBack>
          <img 
            src="/images/Back2.png" 
            alt="Card back" 
            style={{ 
              width: "100%", 
              height: "100%",
              objectFit: "contain" 
            }} 
          />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

const MemoryMedium = () => {
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
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0);
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleSaveNewGame = () => {
    saveGameData({
      userID,
      gameDate: new Date(),
      failed: failedAttempts,
      difficulty: defaultDifficulty,
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
  
  useEffect(() => {
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
            difficulty: defaultDifficulty,
            completed: 1,  
            timeTaken: timer,
          });
          localStorage.setItem("gameCompleted", "true");
          setTimeout(() => navigate("/congt-normal"), 1000);
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer]);

  const userID = localStorage.getItem("userID");
  if (!userID) {
    console.error("Error: userID is missing.");
    return;
  }

  const handleCardClick = (card) => {
    if (!matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton onClick={handleBackButton} sx={{ alignSelf: "flex-start", margin: 2 }}>
        Back
      </PixelButton>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: { xs: 2, sm: 4, md: 6 },
        width: '100%',
        maxWidth: '800px',
        margin: { xs: '20px 0', md: '-80px 0 0 0' },
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
            />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, textAlign: "center", width: '100%' }}>
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }} sx={{ mt: 2 }}>
          New Game
        </PixelButton>
      </Box>

      <InfoContainer>
        <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
        <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      </InfoContainer>

      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal onClick={() => { handleSaveNewGame(); handleModalYes(); }} variant="contained" color="primary">
              Yes
            </PixelButtonModal>
            <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryMedium;
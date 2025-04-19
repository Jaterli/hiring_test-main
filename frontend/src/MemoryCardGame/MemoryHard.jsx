import MemoryGameBase from "./MemoryGameBase";
import bgMusic from "../assets/audio/memory-bg.mp3";
import { useTheme, useMediaQuery } from '@mui/material';

const cardImages = [
  { id: 1, image: "/images/earth.png" },
  { id: 2, image: "/images/earth.png" },
  { id: 3, image: "/images/jupiter.png" },
  { id: 4, image: "/images/jupiter.png" },
  { id: 5, image: "/images/mars.png" },
  { id: 6, image: "/images/mars.png" },
  { id: 7, image: "/images/mercury.png" },
  { id: 8, image: "/images/mercury.png" },
  { id: 9, image: "/images/neptune.png" },
  { id: 10, image: "/images/neptune.png" },
  { id: 11, image: "/images/saturn.png" },
  { id: 12, image: "/images/saturn.png" },
];

const matchAudioFiles = [
  "/audio/wonderful.mp3",
];

const congratsAudio = "/audio/congrats.mp3";

const MemoryHard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <MemoryGameBase
      difficulty="Hard"
      cardImages={cardImages}
      matchAudioFiles={matchAudioFiles}
      congratsAudio={congratsAudio}
      bgMusic={bgMusic}
      gridColumns={isLargeScreen ? 4 : 3} 
    />
  );
};

export default MemoryHard;
import MemoryGameBase from "./MemoryGameBase";
import bgMusic from "../assets/audio/memory-bg.mp3";
import { useTheme, useMediaQuery } from '@mui/material';

const cardImages = [
  { id: 1, image: "/images/meteor.png" },
  { id: 2, image: "/images/meteor.png" },
  { id: 3, image: "/images/moon.png" },
  { id: 4, image: "/images/moon.png" },
  { id: 5, image: "/images/comet.png" },
  { id: 6, image: "/images/comet.png" },
];

const matchAudioFiles = [
  "/audio/wonderful.mp3",
];

const congratsAudio = "/audio/congrats.mp3";

const MemoryMedium = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <MemoryGameBase
      difficulty="Medium"
      cardImages={cardImages}
      matchAudioFiles={matchAudioFiles}
      congratsAudio={congratsAudio}
      bgMusic={bgMusic}
      gridColumns={isLargeScreen ? 3 : 2} 
    />
  );
};

export default MemoryMedium;
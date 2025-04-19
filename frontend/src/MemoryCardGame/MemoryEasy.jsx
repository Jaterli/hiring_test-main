import MemoryGameBase from "./MemoryGameBase";
import bgMusic from "../assets/audio/memory-bg.mp3";

const cardImages = [
  { id: 1, image: "/images/meteor.png" },
  { id: 2, image: "/images/meteor.png" },
  { id: 3, image: "/images/comet.png" },
  { id: 4, image: "/images/comet.png" },
];

const matchAudioFiles = [
  "/audio/wonderful.mp3",
];

const congratsAudio = "/audio/congrats.mp3";

const MemoryEasy = () => {
  return (
    <MemoryGameBase
      difficulty="Easy"
      cardImages={cardImages}
      matchAudioFiles={matchAudioFiles}
      congratsAudio={congratsAudio}
      bgMusic={bgMusic}
      gridColumns={2}
    />
  );
};

export default MemoryEasy;
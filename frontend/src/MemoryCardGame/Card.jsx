import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import { Box, styled } from "@mui/material";

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

const CardFace = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardFront = styled(CardFace)({
  width: "80%",
  height: "80%",
  transform: "rotateY(180deg)",
});

const CardBack = styled(CardFace)({
  width: "90%",
  height: "90%",
  transform: "rotateY(0deg)",
});

const Card = ({ card, handleClick, flipped, matched, size = 'medium' }) => {
  const sizes = {
    small: { maxWidth: 100, maxHeight: 100 },
    medium: { maxWidth: 180, maxHeight: 180 },
    large: { maxWidth: 220, maxHeight: 220 }
  };

  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer 
      onClick={handleClick}
      sx={{
        maxWidth: sizes[size].maxWidth,
        maxHeight: sizes[size].maxHeight
      }}
    >
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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Card;
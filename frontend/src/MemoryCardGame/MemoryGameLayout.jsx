import PropTypes from "prop-types";
import { Box, styled } from "@mui/material";
import background from "../assets/images/mode1.gif";

// Styled component con filtrado de props personalizado
const StyledGameContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "mouseDisabled",
})(({ theme, mouseDisabled }) => ({
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

const MemoryGameLayout = ({ children, mouseDisabled }) => {
  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      {children}
    </StyledGameContainer>
  );
};

MemoryGameLayout.propTypes = {
  children: PropTypes.node.isRequired,
  mouseDisabled: PropTypes.bool.isRequired,
};

export default MemoryGameLayout;

import { Box, styled, useTheme } from "@mui/material";
import PropTypes from 'prop-types';

// Estilos base para los botones
const baseButtonStyles = (theme) => ({
  fontFamily: '"Press Start 2P", cursive',
  padding: '10px 20px',
  border: '2px solid',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s',
  fontSize: '14px',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    padding: '8px 16px',
  },
});

// Estilo específico para Back
const PixelButtonBack = styled(Box)(({ theme }) => ({
  ...baseButtonStyles(theme),
  backgroundColor: '#2c2c54',
  color: '#fff',
  borderColor: '#00d9ff',
  '&:hover': {
    backgroundColor: '#40407a',
    borderColor: '#00aaff',
  },
}));

// Estilo específico para New Game
const PixelButtonNewGame = styled(Box)(({ theme }) => ({
  ...baseButtonStyles(theme),
  backgroundColor: '#4CAF50',
  color: '#fff',
  borderColor: '#2E7D32',
  '&:hover': {
    backgroundColor: '#388E3C',
    borderColor: '#1B5E20',
  },
}));

const GameControls = ({ 
  onNewGame, 
  onBack, 
  failedAttempts, 
  timer,
  showNewGame = true
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Contenedor de botones superiores */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '98%',
        position: 'absolute',
        top: '1%',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'row',
          gap: 1,
          padding: 1,
        }
      }}>
        {/* Botón Back siempre a la izquierda */}
        <PixelButtonBack onClick={onBack}>
          Back
        </PixelButtonBack>

        {/* Botón New Game centrado en desktop, al lado de Back en móvil */}
        {showNewGame && (
          <Box sx={{
            position: ['static', 'absolute'], // static en móvil, absolute en desktop
            left: '50%',
            transform: ['none', 'translateX(-50%)'], // sin transform en móvil
            [theme.breakpoints.down('sm')]: {
              display: 'flex',
              justifyContent: 'center',
            }
          }}>
            <PixelButtonNewGame onClick={onNewGame}>
              New Game
            </PixelButtonNewGame>
          </Box>
        )}

        {/* Espaciador invisible para mantener el balance en desktop */}
        <Box sx={{ 
          visibility: ['hidden', 'hidden'], 
          [theme.breakpoints.down('sm')]: { display: 'none' } 
        }}>
          <PixelButtonBack as="div">
            Back
          </PixelButtonBack>
        </Box>
      </Box>

      {/* InfoContainer (sin cambios) */}
      <Box sx={{
        position: 'fixed',
        bottom: '1%',
        left: '1%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000,
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '10px',
          marginBottom: '16px',
          width: '100%',
        },
      }}>
        <Box sx={{
          backgroundColor: '#ff4d4f',
          color: '#fff',
          padding: theme.spacing(1, 2),
          border: '2px solid #00d9ff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '12px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
            padding: theme.spacing(0.75, 1.5),
          },
        }}>
          Learning Moments: {failedAttempts}
        </Box>
        <Box sx={{
          backgroundColor: '#2c2c54',
          color: '#fff',
          padding: theme.spacing(1, 2),
          border: '2px solid #00d9ff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '12px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
            padding: theme.spacing(0.75, 1.5),
          },
        }}>
          Timer: {timer}s
        </Box>
      </Box>
    </>
  );
};

GameControls.propTypes = {
  onNewGame: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  failedAttempts: PropTypes.number.isRequired,
  timer: PropTypes.number.isRequired,
  showNewGame: PropTypes.bool,
};

export default GameControls;
import { Modal, Box, Button, Typography, styled } from "@mui/material";
import PropTypes from 'prop-types';


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

const ConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Are you sure you want to go back to the play page?"
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <PixelTypography variant="h6">
          {title}
        </PixelTypography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
          <PixelButtonModal onClick={onConfirm} variant="contained" color="primary">
            Yes
          </PixelButtonModal>
          <PixelButtonModal onClick={onClose} variant="contained" color="secondary">
            No
          </PixelButtonModal>
        </Box>
      </Box>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

export default ConfirmationModal;
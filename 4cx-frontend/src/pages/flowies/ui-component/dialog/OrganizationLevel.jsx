import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { StyledButton } from "../button/StyledButton";

export default function OrganizationLevel({onCancel,open,Title,Description,Confirm,Cancel,handleConfirm}) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
        {Title}
      </DialogTitle>
      <DialogContent>
        <span>{Description}</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{onCancel(false)}}>{Cancel}</Button>
        <StyledButton variant="contained" onClick={handleConfirm}>{Confirm}</StyledButton>
      </DialogActions>
    </Dialog>
  );
}

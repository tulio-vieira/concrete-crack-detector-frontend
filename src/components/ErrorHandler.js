import React from 'react';
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';

export default function ErrorHandler({errorMessage, errorConfirmed}) {
  return (
    <Dialog
      open={errorMessage !== null}
      onClose={errorConfirmed}>
      <DialogContent>
        <DialogContentText>
          {errorMessage}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
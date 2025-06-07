import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

const DialogComp = ({ type, id, date, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const time = formJson.time;
            console.log(time);
            if (type === "in") {
              axios
                .post("/api/attendance/update/intime", {
                  ...formJson,
                  date,
                  punchInId: id,
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else if (type === "out") {
              axios
                .post("/api/attendance/update/outtime", {
                  ...formJson,
                  date,
                  punchOutId: id,
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            handleClose();
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", pb: 1 }}>
        Update Time
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <TextField
          autoFocus
          required
          margin="dense"
          id="time"
          name="time"
          type="time"
          fullWidth
          placeholder=""
          variant="standard"
          InputProps={{
            sx: {
              fontSize: "1rem",
              color: "text.primary",
              "&::after": {
                borderBottom: "2px solid #1976d2",
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#555",
            fontWeight: 500,
            borderRadius: 2,
            px: 3,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 2,
            px: 4,
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComp;

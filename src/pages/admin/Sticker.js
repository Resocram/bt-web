import MaterialTable from "material-table";
import { fetchBackend, log } from "../../utils";
import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
const slugify = require('slugify')
const useStyles = makeStyles({
  card: {
    borderRadius: "0px",
    minWidth: "200px",
    maxWidth: "200px",
  },
  cardImage: {
    borderRadius: "0px",
    objectFit: "scale-down",
    maxWidth: "200px",
    maxHeight: "200px",
  },
});


export default function Sticker() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [columns] = useState([
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },
    { title: "URL", field: "url" },
  ]);
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState({});
  const [name, setName] = useState("");
  const [image, setImage] = useState("")
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchBackend("/stickers", "GET")
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        log(err);
        if (err.status === 409) {
          alert("Failed. Sticker with that id already exists");
        } else alert(err.message + " Please contact a dev");
      });
  }, []);

  async function createSticker () {

    //UPLOAD TO S3 RETURN FILE NAME HERE


    const body = {
      id: slugify(name),
      name: name,
      url: image
    }

    fetchBackend('/stickers', 'POST', body)
      .then(response => {
        setData([...data].concat(body))
        handleClose()
      }
      )
      .catch(err => {
        log(err)
        if (err.status === 409) {
          alert('Failed. Sticker with that slug/id already exists')
        } else alert(err.message + ' Please contact a dev')
      })
  }

  return data ? (
    <div style={{ maxWidth: "95%" }}>
      <MaterialTable
        columns={columns}
        title="Stickers"
        actions={[
          {
            icon: "add",
            tooltip: "Add Sticker",
            isFreeAction: true,
            onClick: (event, rowData) => {
              handleClickOpen();
            },
          },
        ]}
        data={data}
        editable={{
          isEditable: (rowData) => true, // only name(a) rows would be editable
          isDeletable: (rowData) => true, // only name(b) rows would be deletable,
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                //Replace with PATCH call
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                //Replace with DELETE call
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add a new sticker</DialogTitle>
        <Box display="flex" flexDirection="row" flex-grow="0">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name for the sticker"
              fullWidth
              value = {name}
              onChange={e => {setName(e.target.value)}}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              multiple
              type="file"
              onChange={(e) => {setFile(e.target.files[0]);
                                setImage(URL.createObjectURL(e.target.files[0]))}}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </DialogContent>
          <Card className={classes.card} elevation={0}>
            <CardMedia
              className={classes.cardImage}
              src={image}
              component="img"
            />
            <CardContent>
              <Typography variant="caption">Max Size: 200px x 200px</Typography>
            </CardContent>
          </Card>
        </Box>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createSticker} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <div>
      <CircularProgress />
    </div>
  );
}

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
      },
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
}));

function FooterNav() {
    const history = useHistory();
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    return (
    <>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer">
                <MenuIcon />
            </IconButton>
            {/* <IconButton edge="start" color="inherit">
                <AddIcon />
            </IconButton> */}
            <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                <AddIcon onClick={handleClickOpen}/>
            </Fab>
            <div className={classes.grow} />
            <IconButton edge="end" color="inherit">
                <AccountCircleIcon fontSize="large"/>
            </IconButton>
            </Toolbar>
        </AppBar>

        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            {/* <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle> */}
            <List>
                <ListItem button onClick={()=>history.push("/favorites")}>
                    <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button onClick={()=> history.push("/newRecipe")}>
                    <ListItemText primary="Add Recipe" />
                </ListItem>
                <ListItem button onClick={ () => history.push("/searchApi")}>
                    <ListItemText primary="Search New" />
                </ListItem>
            </List>
        </Dialog>
    </>
  );
}

export default FooterNav;
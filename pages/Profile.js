import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
//import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
//import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
//import Switch from '@material-ui/core/Switch';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

//import Avatar from '@material-ui/core/Avatar';
//import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: { 
    flexGrow: 1,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
  },

  typography: {
    padding: theme.spacing(2),
  },

}));

export default function Profile() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    
    <div className="topcorner">
          
      <IconButton onClick={handleClick}>
        
        <AccountCircle variant="contained" color="primary"
         style={{height: '50px', width: '50px', borderRadius: '100'}} />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Card>
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center"}}>
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="profile"
                style={{ height: 75, width: 75, borderRadius: 100 }}
              />
            </div>
            <br />

            <Typography style={{ display: "flex", justifyContent: "center" }} 
            color="primary" variant="body2"
            onClick={handleClose}>
              Username
            </Typography>
            <Divider />
            <br />

            <Link href="/Profile">
              <MenuItem 
              onClick={handleClose}>
              <PersonOutlineIcon style={{height: '40px', width: '40px'}}
               />
              My Profile</MenuItem>
            </Link>

            <Link href="/ChangePassword">
              <MenuItem onClick={handleClose}>
              <VpnKeyIcon style={{height: '40px', width: '40px'}} />
              Change Password</MenuItem>
            </Link>

            <Link href="/">
              <MenuItem onClick={handleClose}>
              <ExitToAppIcon style={{height: '40px', width: '40px'}} />
              Logout</MenuItem>
            </Link>

          </CardContent>
        </Card>
      </Menu>
    </div>
  );

}

// <FormGroup>
      //   <FormControlLabel
      //     control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
      //     label={auth ? 'Logout' : 'Login'}
      //   />
      // </FormGroup>
      // <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          //   <MenuIcon />
          // </IconButton>
          // <Typography variant="h6" className={classes.title}>
          //   Photos
          // </Typography>

          // <div className={classes.root}>
    //   <AppBar position="static">
    //     <Toolbar>

    //       {auth && (
    //         <div>
    //           <IconButton
    //             aria-label="account of current user"
    //             aria-controls="menu-appbar"
    //             aria-haspopup="true"
    //             onClick={handleMenu}
    //             color="inherit"
    //           >
    //             <AccountCircle
    //             style={{height: '70px', width: '70px'}} />
    //           </IconButton>
    //           <Menu
    //             id="menu-appbar"
    //             anchorEl={anchorEl}
    //             anchorOrigin={{
    //               vertical: 'top',
    //               horizontal: 'right',
    //             }}
    //             keepMounted
    //             transformOrigin={{
    //               vertical: 'top',
    //               horizontal: 'right',
    //             }}
    //             open={open}
    //             onClose={handleClose}
    //           >
    //              <MenuItem
    //               onClick={handleClose}>
    //               <Avatar className={classes.orange}
    //               style={{height: '70px',
    //               width: '70px'}}>F</Avatar> 
            
    //                </MenuItem>
    //             <MenuItem onClick={handleClose}
    //             >My Account</MenuItem>
    //             <MenuItem onClick={handleClose}><VpnKeyIcon style={{height: '50px', width: '50px'}} />Change Password</MenuItem>
    //             <MenuItem onClick={handleClose}><ExitToAppIcon style={{height: '50px', width: '50px'}} />Logout</MenuItem>
    //           </Menu>
              
    //         </div>
    //       )}
    //     </Toolbar>
    //   </AppBar>
    // </div>

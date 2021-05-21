import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

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

  notification: {
    display: "flex", 
    margin: theme.spacing(8),
    size: '20px',
}

}));

export default function Notification() {
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
  
    // const handleChange = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };
  
    const preventDefault = 
    (event) => 
    event.preventDefault();

    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      
      <div className="topcorner">

       <IconButton aria-describedby={id} onClick={handleClick}
       aria-label="show 17 new notifications" color="inherit">
                 <Badge badgeContent={11} color="secondary">
                  <NotificationsIcon
                  variant="contained" color="primary"
            style={{height: '50px', width: '50px', borderRadius: '100'}} />
                 </Badge>
               </IconButton>
               <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
      <Typography className={classes.typography} 
       gutterBottom variant="h5" component="h2">
     Check Notifications
    </Typography>
        <Typography className={classes.typography}>The content of the Popover.</Typography>
        <Divider />
        <Typography className={classes.typography}>The content of the Popover.</Typography>
        <Divider />
        <Typography className={classes.typography}>The content of the Popover.</Typography>
        <Divider />
        <Typography className={classes.typography}>The content of the Popover.</Typography>
        <Divider />
        {/* <Button className={classes.button} variant="outlined" color="primary">
         Show More
          </Button> */}
          <Link href="#" className={classes.notification} onClick={preventDefault}>
        Show More
      </Link>
          <Divider />
      </Popover>
      </div>
    );
  
  }
  
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

function Profile() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <Avatar src="/broken-image.jpg" />
      
    </div>
  );
}

export default Profile;


//   <Avatar alt="Remy Sharp"
    //    src="/broken-image.jpg" className={classes.orange}>
    //     B
    //   </Avatar>
    //<AccountCircleIcon />
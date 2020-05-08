import React from 'react';
import {Link, Redirect} from "react-router-dom";
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menubar from "./common/menubar.jsx";
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { green } from '@material-ui/core/colors';

import {connect} from "react-redux";
import {logout, login} from "../auth/actions/loginActions.jsx";
import {menuLinks} from "./common/menuLinks.jsx";

const drawerWidth = 240;
const LARGE_SCREEN = 1280;
const useStyles = makeStyles((theme) => 
({
  root: 
  {
    display: "flex"
  },
  appBar: 
  {
    zIndex: theme.zIndex.drawer + 1,
  },

  drawer: 
  {
    [theme.breakpoints.up("md")]: {width: drawerWidth, flexShrink: 0}
  },
  
  menuButton: 
  {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('xl')]: 
	{
      display: 'none'
    },
  },
  title: 
  {
    display: 'none',
    [theme.breakpoints.up('sm')]: {display: 'block'}
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: 
  {
    width: drawerWidth
  },
  content: 
  {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  closeMenuButton: 
  {
    marginRight: "auto",
    marginLeft: 0
  },
  logo:
  {
	width: 67,
	height: 45
  }
}));
//logo.width=1000*50/667, height: 50

const NavRoot=(props)=>
{
	console.log("In NavRoot, ",props);
	
	let currentMenu = null;
	let pathname = props.location.pathname.toLowerCase();
	if (menuLinks.includes(pathname)) currentMenu=<NavRootMenuBar {...props} />;
    else switch(pathname)
    {
		case (pathname.match(/^\/about[\/]?/i) || {}).input: { currentMenu=<Redirect to='/about' />; break;}
		case (pathname.match(/^\/referrals[\/]?/i) || {}).input: { currentMenu=<Redirect to='/referrals' />; break;}
		case (pathname.match(/^\/accounting[\/]?/i) || {}).input: { currentMenu=<Redirect to='/accounting' />; break;}
		/*case (pathname.match(/^\/login[\/]?/i) || {}).input: { pathname = "/login"; break;}
		case (pathname.match(/^\/signup[\/]?/i) || {}).input: { pathname = "/signup"; break;}
		case (pathname.match(/^\/forgotPassword[\/]?/i) || {}).input: { pathname = "/forgotPassword"; break;}
		case (pathname.match(/^\/resetPassword[\/]?/i) || {}).input: { pathname = "/resetPassword"; break;} 
		default: { currentMenu=<NavRootMenuBar {...props} pathname="/"/>; break;} */	
		default: { currentMenu=<Redirect to='/' />; break;}
	}
	
	return currentMenu;
}


const NavRootMenuBar = (props) => 
{
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(props.currentWidth);
  const [permanentOpen, setPermanentOpen] = React.useState(true);
  const [isLargeScreen, setIsLargeScreen] = React.useState(props.currentWidth >= LARGE_SCREEN);

  //This will be called whenever any props value changed or UI events updated such as a GUI clicks
  React.useEffect(() => 
  { 
    	if (currentWidth != props.currentWidth)
		{
			setCurrentWidth(props.currentWidth);
			if (mobileOpen) setMobileOpen(false);
		}
		
		setIsLargeScreen(props.currentWidth >= LARGE_SCREEN);
  });
  function handleDrawerToggle() 
  {

	if (window.innerWidth >= LARGE_SCREEN) //over lg size
	{	
		if (mobileOpen) setMobileOpen(false);
		
		if (permanentOpen) 
		{
			setPermanentOpen(false); //close it when width >= LG AND menu button is pressed
			props.onChangeDrawerMenu(false);
		}
		else 
		{
			setPermanentOpen(true); //open it when width >= LG and menu button is pressed
			props.onChangeDrawerMenu(true);
		}
	}
	
    else 
	{
		setMobileOpen(!mobileOpen);
		setPermanentOpen(true);
	}
  }

  return (
	<div className={classes.root}>
	  <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>	
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="optom connect" onClick={handleDrawerToggle}>
            <img src={"/images/general/connect-png-2.png"} alt="logo" className={classes.logo} />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            OptomDr
          </Typography>
        </Toolbar>
     </AppBar>
    
          <Drawer
            variant={isLargeScreen ? "persistent": "temporary"}
            open={isLargeScreen ? permanentOpen : mobileOpen}
            onClose={mobileOpen ? handleDrawerToggle : null}
            classes={{ paper: classes.drawerPaper}}
            ModalProps={isLargeScreen ? {} : {keepMounted: true}} // Better open performance on mobile
          >
            {
				isLargeScreen? 
					<div className={classes.toolbar} /> :
					<React.Fragment>
						<div>
						 <img src={"/images/general/connect-png-2.png"} alt="logo" className={classes.logo} />
			             <IconButton onClick={handleDrawerToggle} className={classes.closeMenuButton}>
			             	<CloseIcon />
			             </IconButton>
					    </div>
					    <Divider />
					</React.Fragment>
			}
            <Menubar {...props} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
          </Drawer>
   

	</div>
  );
}

function mapStateToProps(state) 
{
  return {
		    auth: state.authReducer,
		    rootReducer: state.rootReducer
		 };
}

export default connect(mapStateToProps, {logout})(NavRoot);
//export default NavRoot;


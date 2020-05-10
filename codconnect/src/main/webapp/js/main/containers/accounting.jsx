import React from "react";
import PropTypes from "prop-types";
import {Link, Route, Switch} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const AccountingMRO = React.lazy( () => import("../components/accountingMRO.jsx") );
/*
 * flex-direction: row | row-reverse | column | column-reverse;
 * backgroundColor: 'white',
 */

const styles = (theme) =>
({
  	root:	
	{
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'row'
	},
	gridPanel: 
	{
		padding: 8,
		border: '0px solid red',
		borderRadius: '8px'
	},
	toolbar: theme.mixins.toolbar
});

class Accounting extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	componentWillMount()
	{
	}
	componentWillUnmount()
	{
	}
	componentDidMount()
	{

	}
	
	render()
	{
		console.log("INFO: Accounting.render() is called, this.props: ", this.props);
		let pathname = this.props.location.pathname.toLowerCase();
		
		switch(pathname)
		{
			case "/accounting":
			case "/accounting/bill":
			case "/accounting/nonohip": break;
			default: { pathname = "/accounting"; break;}
		}
		
		return(	
				<div >
                    <Switch>
						<Route exact path="/accounting"  ><h3>show avaliable links for accouting sections</h3></Route>
						<Route exact path="/accounting/ohip"  ><h3>provide what ohip section is providing</h3></Route>
						<Route path="/accounting/ohip/billing"  ><h3>provide ohip billing component</h3></Route>
						<Route path="/accounting/ohip/convert"  ><h3>provide ohip converting component</h3></Route>
						<Route path="/accounting/ohip/myrecord"  ><h3>provide ohip my record component</h3></Route>
						<Route exact path="/accounting/nonohip"  ><h3>provide what non-ohip section is doing</h3></Route>
						<Route path="/accounting/non-ohip/billing"  ><h3>provide non-ohip billing component</h3></Route>
						<Route path="/accounting/non-ohip/myrecord"  ><h3>provide non-ohip my record component</h3></Route>
					</Switch>
				</div>
			  );
	}
	renderOrg()
	{
		console.log("INFO: Accounting.render() is called, this.props: ", this.props);
		let pathname = this.props.location.pathname.toLowerCase();
		
		switch(pathname)
		{
			case "/accounting":
			case "/accounting/bill":
			case "/accounting/nonohip": break;
			default: { pathname = "/accounting"; break;}
		}
		
		return(	
				<div className={this.props.classes.gridPanel}>
					<StyledTabs value={pathname} vari="scrollable" scrollButtons="on">
			          <StyledTab label="OHIP Reconciliation > Billing" value="/accounting" component={Link} to="/accounting" />
					  <StyledTab label="OHIP Reconciliation > Billing" value="/accounting/bill" component={Link} to="/accounting/bill" />
					  <StyledTab label="NON-OHIP Reconciliation > Billing" value="/accounting/nonohip" component={Link} to="/accounting/nonohip" />
			        </StyledTabs>
                    <Switch>
						<Route exact path="/accounting"  ><h3>hello</h3></Route>
						<Route path="/accounting/bill"  ><h3>hello 2</h3></Route>
						<Route path="/accounting/nonohip"  ><h3>hello 3</h3></Route>
					</Switch>
				</div>
			  );
	}
}


/*
const mapStateToProps=(state)=>
(	//return omitted for simplication
	{
		playMusicPanesReducer: state.playMusicPanesReducer
	}
);



const mapDispatchToProps=(dispatch)=>
(
    {
    	playMusicPanesActions: bindActionCreators(playMusicPanesActions, dispatch)
    }
);
export default connect(mapStateToProps, mapDispatchToProps) (PlayMusicContainer);
*/
Accounting.propTypes =
{
	classes: PropTypes.object.isRequired
};

export default withStyles(styles) (Accounting);

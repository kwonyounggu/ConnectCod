import React from "react";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import InputMask from "react-input-mask";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import IconButton from '@material-ui/core/IconButton';
import {Alert, AlertTitle} from '@material-ui/lab';
import { trackPromise } from 'react-promise-tracker';


import FileClaimBillingSummary from './fileClaimBillingSummary.jsx';

const styles = (theme) =>
(
	{
		root: 
		{
		    '& .MuiTextField-root': 
			{
		      margin: theme.spacing(1),
		      width: '25ch'
		    }
		 },
		 select:
		 {
			minWidth: '120px',
			borderRadius: '0px'
		 },
		 selectInput: 
		 {
		    padding: "2px 5px"
		 }
	}
);
/*
const HtmlTooltip = withStyles((theme) => 
({
  tooltip: 
  {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: '100%',
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))(Tooltip);
*/
const EXPECTED_FILE_NAME = /(^[BEFPX]{1})+([ABCDEFGHIJKL]{1})+([0-9]{4,6})+(.\d{3})$/;
const currency = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'});
const numberOfServices = [1];
class FileClaimBilling extends React.Component
{
	constructor(props)
	{
		super(props);
		console.log("--- INFO constructor() of fileClaimBilling.jsx: ", props);
		this.state = 
		{			
			careProviderNumber: props.rootReducer.careProviderNumber,
			ohipClaimList: props.rootReducer.ohipClaimList,
			claimFile: props.rootReducer.claimFile,
			isFormValid: true
		}
		
		this.onChange = (e) =>
		{
			console.log("[INFO in onChange(e.target)]: ", e.target);

			e.persist(); //put this because ohipClaimItems initally empty or nulled
			let colcount = e.target.getAttribute('colcount');
			
			console.log("[INFO in onChange(e.target.name)]: ", e.target.name, "| e.target.value: ", e.target.value, '| colcount: ', colcount);
			
			this.setState
			(
				(prevState) =>
				{
					prevState.ohipClaimList[colcount][e.target.name] = e.target.value;
					if (e.target.name == "serviceCode1")
						prevState.ohipClaimList[colcount]["feeSubmitted1"] = e.target.options[e.target.selectedIndex].getAttribute("fee");
					else if (e.target.name == "serviceCode2")
						prevState.ohipClaimList[colcount]["feeSubmitted2"] = e.target.options[e.target.selectedIndex].getAttribute("fee");
					return {
								prevState
						   }
				}
			);
		}

		this.subtractClaim = () =>
		{
			this.state.ohipClaimList.pop();
			this.setState({ohipClaimList: this.state.ohipClaimList});
		}
		this.addClaim = () =>
		{
			this.setState({ohipClaimList: this.state.ohipClaimList.concat({})});
		}
		this.displayErrorBox = (isValid, id) =>
		{
			if (isValid) document.getElementById(id).style.border = '1px solid darkgrey';
			else document.getElementById(id).style.border = '3px solid red';
		}
		this.createClaimFile = () =>
		{
			if (this.props.rootReducer.claimFile && this.props.rootReducer.claimFile.isItValid) this.props.resetClaimFileData();
			
			let isValid = true;
			let isAllValid = true;
			
			
			if (/^\d{6}/.test(this.state.careProviderNumber) == false) isValid = false;
			this.displayErrorBox(isValid, "careProviderNumber");

			isAllValid = isValid ? isAllValid : false;
				
			let colCount = this.state.ohipClaimList.length;			
			for (let i=0; i<colCount; i++)
			{
				let colObj = this.state.ohipClaimList[i];  
				console.log(i+" : ", colObj);
				isValid = true;
				if (colObj.ohipNumber &&
				    (/^\d{4}\s?-\s?\d{3}\s?-\s?\d{3}\s?-\s?[A-Z]{2}/.test(colObj.ohipNumber) || 
					    /^\d{4}\s?-\s?\d{3}\s?-\s?\d{3}\s?-\s?[A-Z]{1}/.test(colObj.ohipNumber) ||
						/^\d{4}\s?-\s?\d{3}\s?-\s?\d{3}\s?-\s?/.test(colObj.ohipNumber)
					)
				   ) { console.log("[INFO: ] valid in ohipNumber");} //OK
				else isValid = false;

				this.displayErrorBox(isValid, "ohipNumber_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				isValid = true;
				console.log("PatientDOB["+i+"]: ", colObj.patientDob);
				if (colObj.patientDob && /^\d{4}-\d{2}-\d{2}/.test(colObj.patientDob))
				{ console.log("Store patient dob", i); }
				else isValid = false;
				
				this.displayErrorBox(isValid, "patientDob_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				isValid = true;
				console.log("AccountingNumber["+i+"]: ", colObj.accountingNumber);
				if (colObj.accountingNumber)
					if (colObj.accountingNumber.length && /^[A-Za-z0-9]{8}/.test(colObj.accountingNumber))
					{
						console.log("Store accounting number", i);
					}
					else isValid = false;
				else 
				{
					//store accounting number with empty string
					console.log("Store empty accounting number", i);
				}
				
				this.displayErrorBox(isValid, "accountingNumber_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				
				isValid = true;
				console.log("ServiceCode1_["+i+"]: ", colObj.serviceCode1);
				if (colObj.serviceCode1 && /^[A-Z0-9]{5}/.test(colObj.serviceCode1))
				{
					console.log("Store Service Code 1 ", i);
				}
				else isValid = false;
				
				this.displayErrorBox(isValid, "serviceCode1_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				isValid = true;
				console.log("numberOfServices1_["+i+"]: ", colObj.numberOfServices1);
				if (colObj.numberOfServices1 && /^\d{1}/.test(colObj.numberOfServices1))
				{
					console.log("Store numberOfServices1 ", i);
				}
				else isValid = false;
				
				this.displayErrorBox(isValid, "numberOfServices1_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				isValid = true;
				console.log("Service Date 1["+i+"]: ", colObj.serviceDate1);
				if (colObj.serviceDate1 && /^\d{4}-\d{2}-\d{2}/.test(colObj.serviceDate1))
				{
					console.log("Store service date 1_", i);
				}
				else isValid = false;
				
				this.displayErrorBox(isValid, "serviceDate1_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				isValid = true;
				console.log("Diagnostic code 1["+i+"]: ", colObj.diagnosticCode1);
				if (colObj.diagnosticCode1 && /^\d{3,4}/.test(colObj.diagnosticCode1))
				{
					console.log("Store Diagnostic code 1_", i);
				}
				else isValid = false;
				
				this.displayErrorBox(isValid, "diagnosticCode1_"+i);
				isAllValid = isValid ? isAllValid : false;
				
				if (colObj.serviceCode2 || colObj.numberOfServices2 || colObj.serviceDate2 || colObj.diagnosticCode2)
				{
					isValid = true;
					console.log("ServiceCode2_["+i+"]: ", colObj.serviceCode2);
					if (colObj.serviceCode2 && /^[A-Z0-9]{5}/.test(colObj.serviceCode2))
					{
						console.log("Store Service Code 2 ", i);
					}
					else isValid = false;
					
					this.displayErrorBox(isValid, "serviceCode2_"+i);
					isAllValid = isValid ? isAllValid : false;
					
					isValid = true;
					console.log("numberOfServices2_["+i+"]: ", colObj.numberOfServices2);
					if (colObj.numberOfServices2 && /^\d{1}/.test(colObj.numberOfServices2))
					{
						console.log("Store numberOfServices2_ ", i);
					}
					else isValid = false;
					
					this.displayErrorBox(isValid, "numberOfServices2_"+i);
					isAllValid = isValid ? isAllValid : false;
					
					isValid = true;
					console.log("Service Date 2["+i+"]: ", colObj.serviceDate2);
					if (colObj.serviceDate2 && /^\d{4}-\d{2}-\d{2}/.test(colObj.serviceDate2))
					{
						console.log("Store service date 2_", i);
					}
					else isValid = false;
					
					this.displayErrorBox(isValid, "serviceDate2_"+i);
					isAllValid = isValid ? isAllValid : false;
					
					isValid = true;
					console.log("Diagnostic code 2_["+i+"]: ", colObj.diagnosticCode2);
					if (colObj.diagnosticCode2 && /^\d{3,4}/.test(colObj.diagnosticCode2))
					{
						console.log("Store Diagnostic code 2_", i);
					}
					else isValid = false;
					
					this.displayErrorBox(isValid, "diagnosticCode2_"+i);
					isAllValid = isValid ? isAllValid : false;
				}
				else
				{
					this.displayErrorBox(true, "serviceCode2_"+i);
					this.displayErrorBox(true, "numberOfServices2_"+i);
					this.displayErrorBox(true, "serviceDate2_"+i);
					this.displayErrorBox(true, "diagnosticCode2_"+i);
				}
			} //end of for-loop
			
			if (isAllValid)
			{
				//call server for the claim file
				console.log("[INFO, No errors in all columns]: ", isAllValid);
				let dataToServer = {careProviderNumber: this.state.careProviderNumber, ohipClaimList: this.state.ohipClaimList};
				trackPromise(this.props.getClaimFile(dataToServer));
				localStorage.setItem("claimFileData", JSON.stringify(dataToServer));
			}
			this.setState({isFormValid: isAllValid});
		}
	}
	componentDidMount()
	{
	}
	componentDidUpdate(prevProps, prevState)
	{
		console.log("[INFO componentDidUpdate(...) of fileClaimBilling.jsx] nextProps.rootReducer: " , prevProps.rootReducer);
	}
	componentWillUnmount()
	{
		this.props.rootReducer.ohipClaimList = this.state.ohipClaimList;
		this.props.rootReducer.careProviderNumber = this.state.careProviderNumber;
	}

	onClickDownload = () =>
	{
		console.log("onClickDownload() is called");
		
		//make a file to download, see the example page, https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
		//finally call, this.props.resetClaimFileData()
		
		const element = document.createElement("a");
		let rawData = this.props.rootReducer.claimFile.claimFileData.map
					    (
							(item, key) =>
							{
								if (item.heb) return item.heb;
								else if (item.heh) return item.heh;
								else if (item.het) return item.het;
								else if (item.hee) return item.hee;
							}
					    ).join('\x0D');
		rawData += '\x0D\x1A';
		//https://stackoverflow.com/questions/7590838/how-to-find-eof-in-a-string-in-java
    	const file = new Blob([rawData], {type: 'text/plain'});
	    element.href = URL.createObjectURL(file);
	    element.download = this.props.rootReducer.claimFile.claimFileName;
	    document.body.appendChild(element); // Required for this to work in FireFox
	    element.click();
	}	
	/*** The following function can be used by {this.downloadTooptips} ***
	downloadTooltips = () =>
	{
		let claimFileData = JSON.parse(localStorage.getItem("claimFileData"));
		console.log("claimFileData from localStorage: ", claimFileData);
		let claimList = claimFileData.ohipClaimList.map
						(
							(item, key) =>
							(
								<ul key={key}>
									<li>OHIP Number: {item.ohipNumber}</li>
									<li>Patient Dob: {item.patientDob}</li>
									{item.accountingNumber && <li>Accounting Number: {item.accountingNumber}</li>}
									<li>Service Code #1: {item.serviceCode1}</li>
									<li>Number Of Services: {item.numberOfServices1}</li>
									<li>Service Date: {item.serviceDate1}</li>
									<li>Diagnostic Code: {item.diagnosticCode1}</li>
									{item.serviceCode2 && <li>Service Code #2: {item.serviceCode2}</li>}
									{item.numberOfServices2 && <li>Number Of Services: {item.numberOfServices2}</li>}
									{item.serviceDate2 && <li>Service Date: {item.serviceDate2}</li>}
									{item.diagnosticCode2 && <li>Diagnostic Code: {item.diagnosticCode2}</li>}
								</ul>
							)
						);
		let toolTips = 
				(<HtmlTooltip
			        title={
					          <React.Fragment>
					            <Typography color="inherit" align="center">Inside of claim file for provider: {claimFileData.careProviderNumber}</Typography>
								{claimList}
					          </React.Fragment>
			        	  }
			      >
					<Button color="inherit" size="small" variant="outlined" onClick={this.onClickDownload} endIcon={<Icon>cloud_download</Icon>}>Download</Button>
      			</HtmlTooltip>);		
		return toolTips;
	}
	*/
	render()
	{
		console.log("INFO:fileClaimBilling.jsx.render() is called, [this.props]: ", this.props);
		console.log("INFO:fileClaimBilling.jsx.render() is called, [this.state]: ", this.state);
		const {classes, rootReducer} = this.props;
		const showInputTable =  (this.props.rootReducer.claimFile && this.props.rootReducer.claimFile.isItValid) ? {display: 'none'} : {};
		return (
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="h6">
					          For Solo Health Care Provider
					    </Typography>
					</Grid>
					<Grid item xs={12}>
						&nbsp;
					</Grid>
					{
						this.props.rootReducer.claimFile && this.props.rootReducer.claimFile.isItValid &&
						<React.Fragment>
							<Grid item xs={12}>
								<Alert severity="success" 
									   action=
									   {
											<React.Fragment>
											    <Button color="inherit" size="small" onClick={this.props.resetClaimFileData} variant="outlined" endIcon={<Icon>cancel</Icon>}>
											      Another
											    </Button>&nbsp;
												<Button color="inherit" size="small" variant="outlined" onClick={this.onClickDownload} endIcon={<Icon>cloud_download</Icon>}>Download</Button>
											</React.Fragment>
									   }
								>
								  <AlertTitle>Success in creating a claim file to download!</AlertTitle>
								</Alert>
							</Grid>
							<Grid item xs={12}>
								&nbsp;
							</Grid>
							<Grid item xs={12}>
								<FileClaimBillingSummary />
							</Grid>
						</React.Fragment>
					}
					<Grid item xs={12} style={showInputTable}>
						{!this.state.isFormValid && <Alert severity="error" style={{paddingTop: 0, paddingBottom: 0}}>The form is not completely filled - check it out and try again!</Alert>}
						<Alert severity="info" style={{paddingTop: 0, paddingBottom: 0}}><span style={{color: 'red'}}>*</span>&nbsp;Required</Alert>
						<Alert severity="info" style={{paddingTop: 0, paddingBottom: 0}}>Each time, creating a claim submission file is limited upto ten patients.</Alert>
					</Grid>
					<Grid item xs={12} style={showInputTable}>
					
					<TableContainer>
					<Table size="small" aria-label="claimFileTable">
						<TableHead >
					      <TableRow >
							<TableCell style={{textAlign: 'left'}}>
								<span>
									<strong>Provider Number</strong>&nbsp;<span style={{color: 'red'}}>*</span>&nbsp;
									<InputMask
							            mask="999999"
										id="careProviderNumber"
										name="careProviderNumber"
							            value={this.state.careProviderNumber || ''}
							            onChange={(e)=>this.setState({careProviderNumber: e.target.value})}
										placeholder=" 123456"
										style={{width: '80px'}}
										title="Six digits required"
							          />
								</span>
							</TableCell>
							<TableCell colSpan={this.state.ohipClaimList.length} style={{textAlign: 'right'}}>
								<IconButton
							        color="primary"
								    onClick={this.addClaim}
									title="Add more claims upto ten patients for the file"
									disabled={this.state.ohipClaimList.length==10}
							      >
							        <AddBoxIcon fontSize="large"/>
							      </IconButton>
								  <IconButton
							        color="primary"
								    onClick={this.subtractClaim}
									title="Subtract the last claim"
									disabled={this.state.ohipClaimList.length==1}
							      >
							        <IndeterminateCheckBoxIcon fontSize="large"/>
							      </IconButton>&nbsp;
								  <Button
							        variant="outlined" color="primary"
									onClick={this.createClaimFile}
							        className={classes.button}
							        endIcon={<Icon>create</Icon>}
									title="Create a submission claim file"
							      >
							        Create Claim
							      </Button>
							</TableCell>
						  </TableRow>
						</TableHead>
					    <TableBody>
							<TableRow style={{backgroundColor: '#e6e6e6'}}>
								<TableCell>OHIP Card Number&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<InputMask
										            mask="9999 - 999 - 999 - aa"
													formatChars={{'9': '[0-9]', 'a': '[A-Z]', '*': '[A-Za-z0-9]'}}
										            value={this.state.ohipClaimList[index].ohipNumber || ''}
										            onChange={this.onChange}
													name="ohipNumber"
													id={"ohipNumber_"+index}
													colcount={index}
													placeholder=" 1234 - 123 - 123 - AB"
													title="10 digits number and version code from the OHIP card are required"
										          />
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell>Patient DOB&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<input type="date" id={"patientDob_"+index} name="patientDob" onChange={this.onChange} value={this.state.ohipClaimList[index].patientDob || ''} colcount={index}/>
											</TableCell>
											)
										}
									)
								}
							</TableRow>			
							<TableRow>
								<TableCell><span>Accounting Number</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<InputMask
										            mask="********"
													id={"accountingNumber_"+index}
													name="accountingNumber"
													value={this.state.ohipClaimList[index].accountingNumber || ''}
										            onChange={this.onChange}
													placeholder=" 12345678"
													colcount={index}
										          />
											</TableCell>)
										}
									)
								}
							</TableRow>
							<TableRow style={{backgroundColor: '#f0f0f0'}}>
								<TableCell>Service Code #1&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<Select id={"serviceCode1_"+index} 
														name="serviceCode1" 
														value={this.state.ohipClaimList[index].serviceCode1 || ''}
										            	onChange={this.onChange}

														native
														className={classes.select}
														variant="outlined"
														input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														inputProps = {{colcount: index}}
											  	>
													<option value='' fee='' disabled></option>
													{   
														rootReducer.billingCodes && rootReducer.billingCodes.serviceCodes.map
														(
															(element, index) =>
															(<option key={index} value={element.code} fee={currency.format(element.fee)} title={"Fee: " + currency.format(element.fee) + ", " + element.description}>{element.code}</option>)
														)
													}
													{
														!rootReducer.billingCodes && <option></option>
													}
												</Select>
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell>Number Of Services&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
													<Select id={"numberOfServices1_"+index}
															name="numberOfServices1" 
														   value={this.state.ohipClaimList[index].numberOfServices1 || ''}
										            	   onChange={this.onChange}
														   className={classes.select}
														   input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														   inputProps = {{colcount: index}}
														   variant="outlined"

											  			   native>
														<option value='' disabled></option>
														{
															numberOfServices.map
															(
																(element,  index) =>
																(
																	<option key={index} value={element}>{element}</option>
																)
															)
														}
													</Select>		
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell>Service Date&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<input type="date" id={"serviceDate1_"+index} name="serviceDate1" onChange={this.onChange} value={this.state.ohipClaimList[index].serviceDate1 || ''} colcount={index}/>
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell>Diagnostic Code&nbsp;<span style={{color: 'red'}}>*</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<Select id={"diagnosticCode1_"+index}
														name="diagnosticCode1" 
														   value={this.state.ohipClaimList[index].diagnosticCode1 || ''}
										            	   onChange={this.onChange}
														   className={classes.select}
														   input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														   inputProps = {{colcount: index}}
														   variant="outlined"
											  			   native>
													<option value='' disabled></option>
													{   
														rootReducer.billingCodes && rootReducer.billingCodes.diagnosticCodes.map
														(
															(element, index) =>
															(<option key={index} value={element.code} title={element.description}>{element.code}</option>)
														)
													}
													{
														!rootReducer.billingCodes && <option></option>
													}
												</Select>
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow style={{backgroundColor: '#f0f0f0'}}>
								<TableCell><span>Service Code #2</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<Select id={"serviceCode2_"+index}
														name="serviceCode2" 
														value={this.state.ohipClaimList[index].serviceCode2 || ''}
										            	onChange={this.onChange}
														native
														className={classes.select}
														input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														inputProps = {{colcount: index}}
														variant="outlined"
											  	>
													<option value='' fee=''></option>
													{   
														rootReducer.billingCodes && rootReducer.billingCodes.serviceCodes.map
														(
															(element, index) =>
															(<option key={index} value={element.code} fee={currency.format(element.fee)} title={"Fee: " + currency.format(element.fee) + ", " + element.description}>{element.code}</option>)
														)
													}
													{
														!rootReducer.billingCodes && <option></option>
													}
												</Select>
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell><span>Number Of Services</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
													<Select id={"numberOfServices2_"+index}
															name="numberOfServices2" 
														   value={this.state.ohipClaimList[index].numberOfServices2 || ''}
										            	   onChange={this.onChange}
														   className={classes.select}
														   input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														   inputProps = {{colcount: index}}
														   variant="outlined"
											  			   native>
														<option value=''></option>
														{
															numberOfServices.map
															(
																(element,  index) =>
																(
																	<option key={index} value={element}>{element}</option>
																)
															)
														}
													</Select>		
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell><span>Service Date</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<input type="date" id={"serviceDate2_"+index} name="serviceDate2" onChange={this.onChange} value={this.state.ohipClaimList[index].serviceDate2 || ''} colcount={index}/>
											</TableCell>
											)
										}
									)
								}
							</TableRow>
							<TableRow>
								<TableCell><span>Diagnostic Code</span></TableCell>
								{
									[...Array(this.state.ohipClaimList.length)].map
									(
										(cell, index) =>
										{
											return (<TableCell key={index}>
												<Select id={"diagnosticCode2_"+index}
														name="diagnosticCode2" 
														   value={this.state.ohipClaimList[index].diagnosticCode2 || ''}
										            	   onChange={this.onChange}
														   className={classes.select}
														   input={<OutlinedInput classes={{ input: classes.selectInput}} />}
														   inputProps = {{colcount: index}}
														   variant="outlined"
											  			   native>
													<option value=''></option>
													{   
														rootReducer.billingCodes && rootReducer.billingCodes.diagnosticCodes.map
														(
															(element, index) =>
															(<option key={index} value={element.code} title={element.description}>{element.code}</option>)
														)
													}
													{
														!rootReducer.billingCodes && <option></option>
													}
												</Select>
											</TableCell>
											)
										}
									)
								}
							</TableRow>		
					    </TableBody>
					  </Table>
					</TableContainer>
					
					</Grid>

				 </Grid>
				);
	}
}

export default withStyles(styles)(FileClaimBilling);

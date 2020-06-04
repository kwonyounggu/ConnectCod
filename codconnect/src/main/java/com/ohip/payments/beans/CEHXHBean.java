package com.ohip.payments.beans;

import java.io.Serializable;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Logger;

import org.json.JSONObject;

public class CEHXHBean implements Serializable
{

	/**
	 * Note that the INDEX should be subtracted by one
	 */
	private static final long serialVersionUID = 1L;
	private Logger log = Logger.getLogger(this.getClass().getName());
	
	private String transactionIdentifier = ""; 
	private char recordIdentifier = '0'; 
	private String healthNumber = "0000000000"; //from claim header
	private String versionCode = "00"; //from claim header
	private Date patientBirthdate = null; //from claim header
	private String accountingNumber = "00000000"; //from claim header
	private String paymentProgram = "000"; //from claim header
	private char payee = '0'; //from claim header
	private String referringProviderNumber = "000000"; //from claim header
	private String masterNumber = "0000"; //from claim header
	private Date patientAdmissionDate = null; //from claim header
	private String referringLabLicence = "0000"; //from claim header
	private String serviceLocationIndicator = "0000"; //from claim header
	private String reservedForMOH = ""; 
	private String errorCode1 = "000"; //Refer to errorcode list
	private String errorCode2 = "000"; //Refer to errorcode list
	private String errorCode3 = "000"; //Refer to errorcode list
	private String errorCode4 = "000"; //Refer to errorcode list
	private String errorCode5 = "000"; //Refer to errorcode list

	private SimpleDateFormat simpleDate = new SimpleDateFormat("yyyy/MM/dd");

	public CEHXHBean()
	{
		// TODO Auto-generated constructor stub
	}
	public CEHXHBean(String line) throws Exception
	{
		if (!parseRecord(line)) throw new Exception("HXH record is corrupted. -- Try again with a standard file!");
	}

	public String getTransactionIdentifier()
	{
		return transactionIdentifier;
	}
	public void setTransactionIdentifier(String transactionIdentifier)
	{
		this.transactionIdentifier = transactionIdentifier;
	}
	public char getRecordIdentifier()
	{
		return recordIdentifier;
	}
	public void setRecordIdentifier(char recordIdentifier)
	{
		this.recordIdentifier = recordIdentifier;
	}
	public String getHealthNumber()
	{
		return healthNumber;
	}
	public void setHealthNumber(String healthNumber)
	{
		this.healthNumber = healthNumber;
	}
	public String getVersionCode()
	{
		return versionCode;
	}
	public void setVersionCode(String versionCode)
	{
		this.versionCode = versionCode;
	}
	public Date getPatientBirthdate()
	{
		return patientBirthdate;
	}
	public void setPatientBirthdate(Date patientBirthdate)
	{
		this.patientBirthdate = patientBirthdate;
	}
	public String getAccountingNumber()
	{
		return accountingNumber;
	}
	public void setAccountingNumber(String accountingNumber)
	{
		this.accountingNumber = accountingNumber;
	}
	public String getPaymentProgram()
	{
		return paymentProgram;
	}
	public void setPaymentProgram(String paymentProgram)
	{
		this.paymentProgram = paymentProgram;
	}
	public char getPayee()
	{
		return payee;
	}
	public void setPayee(char payee)
	{
		this.payee = payee;
	}
	public String getReferringProviderNumber()
	{
		return referringProviderNumber;
	}
	public void setReferringProviderNumber(String referringProviderNumber)
	{
		this.referringProviderNumber = referringProviderNumber;
	}
	public String getMasterNumber()
	{
		return masterNumber;
	}
	public void setMasterNumber(String masterNumber)
	{
		this.masterNumber = masterNumber;
	}
	public Date getPatientAdmissionDate()
	{
		return patientAdmissionDate;
	}
	public void setPatientAdmissionDate(Date patientAdmissionDate)
	{
		this.patientAdmissionDate = patientAdmissionDate;
	}
	public String getReferringLabLicence()
	{
		return referringLabLicence;
	}
	public void setReferringLabLicence(String referringLabLicence)
	{
		this.referringLabLicence = referringLabLicence;
	}
	public String getServiceLocationIndicator()
	{
		return serviceLocationIndicator;
	}
	public void setServiceLocationIndicator(String serviceLocationIndicator)
	{
		this.serviceLocationIndicator = serviceLocationIndicator;
	}
	public String getErrorCode1()
	{
		return errorCode1;
	}
	public void setErrorCode1(String errorCode1)
	{
		this.errorCode1 = errorCode1;
	}
	public String getErrorCode2()
	{
		return errorCode2;
	}
	public void setErrorCode2(String errorCode2)
	{
		this.errorCode2 = errorCode2;
	}
	public String getErrorCode3()
	{
		return errorCode3;
	}
	public void setErrorCode3(String errorCode3)
	{
		this.errorCode3 = errorCode3;
	}
	public String getErrorCode4()
	{
		return errorCode4;
	}
	public void setErrorCode4(String errorCode4)
	{
		this.errorCode4 = errorCode4;
	}
	public String getErrorCode5()
	{
		return errorCode5;
	}
	public void setErrorCode5(String errorCode5)
	{
		this.errorCode5 = errorCode5;
	}
	public JSONObject getJson()
	{
		JSONObject json = new JSONObject();
		/*
		json.put("groupNumber", groupNumber);//Check this with fileInfo
		json.put("healthCareProvider", healthCareProvider);//Check this with fileInfo
		json.put("speciality", speciality);
		json.put("mohOfficeCode", Character.toString(mohOfficeCode));
		json.put("remittanceAdviceSequence", remittanceAdviceSequence); //Type 7 which is in tech spec.
		json.put("paymentDate", simpleDate.format(paymentDate));
		//json.put("payeeName", payeeName);
		json.put("lastName", payeeName.substring(0, 24).trim());
		json.put("title", payeeName.substring(25, 27).trim());
		json.put("initials", payeeName.substring(28).trim());
		json.put("totalAmountPayable", Character.compare(totalAmountPayableSign, '-')==0 ? (-totalAmountPayable) : totalAmountPayable);
		json.put("totalAmountPayableSign", Character.toString(totalAmountPayableSign).trim());
		json.put("chequeNumber", chequeNumber);
		//json.put("chequeNumber", (chequeNumber.equals("99999999") ? "Direct deposit" : (chequeNumber.trim().isEmpty() ? "Pay Patient" : chequeNumber)));
		json.put("reservedForMOH2", reservedForMOH2);
		*/
		return json;
	}
	public static String getInsertStmtTo_ohip_mro_hr1(JSONObject json, int ohip_mro_tx_history_id)
	{
		/*
		return "insert into ohip_mro_hr1 values(default, 'HR', '1', 'V03', '0', '" + json.getString("groupNumber") + "', " +
														"" + json.getInt("healthCareProvider") + ", " +
														"" + json.getInt("speciality") + ", " +
													   "'" + json.getString("mohOfficeCode") + "', " +
														"" + json.getInt("remittanceAdviceSequence") + ", " +
													   "'" + json.getString("paymentDate") + "', " +
													   "'" + json.getString("title") + "|" + json.getString("initials") + "|" + json.getString("lastName") + "', " +
													    "" + json.getFloat("totalAmountPayable") + ", " +
													   "'" + json.getString("totalAmountPayableSign") + "', " +
													   "'" + json.getString("chequeNumber") + "', " +
													   "'" + json.getString("reservedForMOH2") + "', " +
														   + ohip_mro_tx_history_id + ");";
		*/
		
		return null;												           
	}
	public void printRecord()
	{

	}

	@Override
	public String toString()
	{
		return "CEHXTBean [transactionIdentifier=" + transactionIdentifier + ", recordIdentifier=" + recordIdentifier
				+ ", healthNumber=" + healthNumber + ", versionCode=" + versionCode + ", patientBirthdate="
				+ (patientBirthdate!=null ? simpleDate.format(patientBirthdate) : null)+ ", accountingNumber=" + accountingNumber + ", paymentProgram=" + paymentProgram
				+ ", payee=" + payee + ", referringProviderNumber=" + referringProviderNumber + ", masterNumber="
				+ masterNumber + ", patientAdmissionDate=" + (patientAdmissionDate!=null ? simpleDate.format(patientAdmissionDate) : null) + ", referringLabLicence="
				+ referringLabLicence + ", serviceLocationIndicator=" + serviceLocationIndicator + ", errorCode1="
				+ errorCode1 + ", errorCode2=" + errorCode2 + ", errorCode3=" + errorCode3 + ", errorCode4="
				+ errorCode4 + ", errorCode5=" + errorCode5 + "]";
	}
	//Occurs Once in every file - always the first record
	public boolean parseRecord(String line) throws Exception
	{
		boolean valid = true;
		//System.err.println("line.indexOf(\"HR1V030\") = " + line.indexOf("HR1V030") + ", TOTAL LENGTH = " + line.length());//total len = 79
		
		if (line.length() != 79)
		{
			log.severe("ERROR: the HXH record of the file does not have 79 chars such that " + line);
			valid = false;
		}
		else if (!line.startsWith("HXH"))
		{
			log.severe("ERROR: this file does not contain HXH in the first record.");
			valid = false;
		}
		else
		{
			try
			{
				transactionIdentifier = "HX";
				recordIdentifier = 'H';
				healthNumber = line.substring(3, 3+10).trim();
				versionCode = line.substring(13, 13+2).trim();
				String temp = line.substring(15, 15+8).trim();
				if (temp.length() == 8)
					patientBirthdate = new SimpleDateFormat("yyyy/MM/dd").parse(line.substring(15, 15+4)+"/"+line.substring(19, 19+2)+"/"+line.substring(21, 21+2));
				accountingNumber = line.substring(23, 23+8).trim();
				paymentProgram = line.substring(31, 31+3).trim();
				payee = line.substring(34, 35).charAt(0);
				referringProviderNumber = line.substring(35, 35+6).trim();
				masterNumber = line.substring(41, 41+4).trim();
				temp = line.substring(45, 45+8).trim();
				if (temp.length() == 8)
					patientAdmissionDate = new SimpleDateFormat("yyyy/MM/dd").parse(line.substring(45, 45+4)+"/"+line.substring(49, 49+2)+"/"+line.substring(51, 51+2));
				referringLabLicence = line.substring(53, 53+4).trim();
				serviceLocationIndicator = line.substring(57, 57+4).trim();
				reservedForMOH = line.substring(61, 61+3).trim();
				errorCode1 = line.substring(64, 64+3).trim();
				errorCode2 = line.substring(67, 67+3).trim();
				errorCode3 = line.substring(70, 70+3).trim();
				errorCode4 = line.substring(73, 73+3).trim();
				errorCode5 = line.substring(76, 76+3).trim();
			}
			catch (NumberFormatException e)
			{
				log.severe("ERROR -> NumberFormatException: " + e.getMessage());
				valid = false;
			}
			catch (ParseException e)
			{
				log.severe("ERROR -> ParseException: " + e.getMessage());
				valid = false;
			}
			catch(Exception e)
			{
				log.severe("Caused by " + e.getCause() + ", " + e.getMessage());
				valid = false;
			}
		}
		return valid;
	}

}

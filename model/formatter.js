sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	// "./utils",
	"sap/ui/model/odata/type/Decimal",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/FileSizeFormat",
	"sap/ui/core/LocaleData"
], function(JSONModel, Device, Decimal, DateFormat, NumberFormat, FileSizeFormat, LocaleData) {
	"use strict";

	return {
		gethighlightValue: function(Value) {
			if (Value === "Low") {
				return "None";
			}
			if (Value === "Medium") {
				return "Information";
			}
			if (Value === "High") {
				return "Warning";
			}
			if (Value === "Very High") {
				return "Error";
			}
		},
		buttonVisible: function(Value) {

			if (Value === "X" || Value === undefined || Value === null) {
				return false;
			} else if (Value === "") {
				return true;
			}
		},
		changeTime: function(val) {
			if (val) {
				/*val = val.replace(/^PT/, '').replace(/S$/, '');
				val = val.replace('H', ':').replace('M', ':');

				var multipler = 60 * 60;
				var result = 0;
				val.split(':').forEach(function(token) {
					result += token * multipler;
					multipler = multipler / 60;
				});
				var timeinmiliseconds = result * 1000;

				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "KK:mm:ss a"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));*/
			}
			return null;
		},

		// family details	
		govtEmp: function(val) {
			if (val == "01") {
				return true;
			}
			if (val == "02") {
				return false;
			} else {
				return false;
			}

		},
		alive: function(val) {
			if (val == "X") {
				return false;
			}
			if (val == "N") {
				return true;
			} else {
				return false;

			}
		},
		// based on marital status- married since field editable / non editable
		maritalSince: function(val) {
			if (val == "1" || val == "2" || val == "3") {
				return true;
			} else {
				return false;

			}
		},
		DOBchange: function(val) {
			if (val != undefined && val != null && val != "" && val.toString() != "Invalid Date") {
				return new Date(val);
			} else {
				return null;
			}
		},
		DOBmaxdate: function()

		{
			return new Date();

		},
		DOBmindate: function()

		{
			var Todadate = new Date();
			var minDate = Todadate.getDate();
			var minMonth = Todadate.getMonth();
			var minYear = Todadate.getFullYear() - 100;
			var date = new Date(minYear, minMonth, minDate);
			return date;

		},
		// row colors hiegliting - based on Oepration property- for Family member Type
		familyMemOperation: function(val) {
			var color;
			if (val == "DISP") {
				color = "";
				return color;
			} else if (val == "INS") {
				color = "Green";
				return color;
			} else if (val == "MOD") {
				color = "Yellow";
				return color;
			} else if (val == "DEL") {
				color = "Red";
				return color;
			}
		},
		// group Transg=fer -start
		// when switch is on and edit mode only to positon will select
		editableTOposition: function(ValueofSwitch, ValueofEdit) {
			if (ValueofSwitch === false && ValueofEdit === false) {
				return false;
			} else if (ValueofSwitch === true && ValueofEdit === true) {
				return true;
			} else if (ValueofSwitch === true && ValueofEdit === false) {
				return false;
			} else if (ValueofSwitch === false && ValueofEdit === true) {
				return false;
			}
		},
		// group Transg=fer -end
		//dupitation fragmentcode -start
		SystemDateConversion: function(date) {
			if (date) {
				var d = this.addZero(date.getDate());
				var m = this.addZero(date.getMonth() + 1);
				var y = date.getFullYear();
				var FullDate = d + "." + m + "." + y;
				return FullDate;
			}
		},
		//dupitation fragmentcode -end
		// surrnderleave -start
		dateofReq: function(val) {
			if (val == "" || val == null) {
				var sFromatedDate = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.YYYY"
				}).format(new Date());
				// var todayDate = DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}).format(new Date());
				// var todayDate = tDate.getDate() + "." + tDate.getMonth() + "." + tDate.getFullYear();
				return sFromatedDate;
			} else {
				var sFromatedDate = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.YYYY"
				}).format(val);
				// var reqDate = val.getDate() + "." + val.getMonth() + "." + val.getFullYear();
				return sFromatedDate;
			}

		},
		noofSurDays: function(value) {
			if (parseInt(value) === 0) {
				return 0;
			}

			return value;
		},
		// condition add on cfms_ctm_npv(14-3_23) -start
		elCreditasDate: function(value) {
			if (parseInt(value) > 300) {
				return 300;
			}

			return value;
		},
		PreviousSurrenderDateEdit: function(value) {
			if (value === null || value === "") {
				return true;
			}
			return false;
		},
		// condition add on cfms_ctm_npv(14-3_23) -end
		// surrnderleave -end
		/*	employee profile fragment dailog -start*/
		dateFormatterEmpProfile: function(oValue) {
			if (oValue !== null) {
				var date = oValue;
				// console.log(String(date).slice(4, 15).replace(/ /g, "/"));
				var m = String(date).slice(4, 15).replace(/ /g, "/").slice(0, 3);
				var d = String(date).slice(4, 15).replace(/ /g, "/").slice(4, 6);
				var y = String(date).slice(4, 15).replace(/ /g, "/").slice(7, 15);

				switch (m) {
					case 'Jan':
						m = "01";
						break;
					case "Feb":
						m = "02";
						break;
					case "Mar":
						m = "03";
						break;
					case "Apr":
						m = "04";
						break;
					case "May":
						m = "05";
						break;
					case "Jun":
						m = "06";
						break;
					case 'Jul':
						m = "07";
						break;
					case "Aug":
						m = "08";
						break;
					case "Sep":
						m = "09";
						break;
					case "Oct":
						m = "10";
						break;
					case "Nov":
						m = "11";
						break;
					case "Dec":
						m = "12";
						break;
					default:
						break;
				}

				return d + "." + m + "." + y;
			}

		},
		dateofJoingEmpProfile: function(val) {
			return val;
		},
		/*	employee profile fragment dailog -end*/

		/*	supenstion fragment code cfms_ctm_npv -start*/
		suspenOrderDate: function(val) {
			if (val == "02" || val == "03") {
				return true;
			} else {
				return false;

			}
		},
		/*	supenstion fragment code -end*/

		//  data showing of sendback or return to macker or next leve dailog purpose aded -start
		StatusValid: function(State) {
			var Status = "";
			if (State === "M") {
				Status = "Maker";
			} else if (State === "C") {
				Status = "Checker";
			} else if (State === "A") {
				Status = "Approver";
			}
			return Status;
		},
		//  data showing of sendback or return to macker or next leve dailog purpose aded -end  
		oDateFormatter: function(sValue) {
			var sDate = sValue;
		},
		/*	for basic details fragment value state showing -start*/
		valuStaeFamilyFName: function(Value, Value2) {
			if (Value !== Value2) {
				return "Error";
			} else {
				return "None";
			}
		},

		/*	for basic details fragment value state showing -end*/

		/*functons for leave appliction -start*/

		enableEditFields: function(editFlag, fieldFlag) {
			if (editFlag === "Create" && fieldFlag === undefined) {
				return true;
			} else if (editFlag === "Edit") {
				return false;
			} else if (editFlag === "Display") {
				return false;
			}
			return true;
		},
		enableLeaveCatField: function(editFlag) {
			if (editFlag === "Create")
				return true;
			else
				return false;

		},
		enableLeaveTypeField: function(editFlag, depFieldVal) {
			if (editFlag === "Create") {
				if (depFieldVal != undefined)
					return true;
				else
					return false;
			} else
				return false;
		},
		enableStartDateField: function(editFlag, depFieldVal) {
			if (editFlag === "Create") {
				if (depFieldVal != undefined)
					return true;
				else
					return false;
			}
			if (editFlag === "Display") {
				return false;
			} else if (editFlag === "Edit") {
				return true;
			}
			return false;
		},
		enableEndDateField: function(editFlag, depFieldVal) {
			if (editFlag === "Create") {
				if (depFieldVal != undefined && depFieldVal === true)
					return true;
				else
					return false;
			}
			if (editFlag === "Display") {
				return false;
			} else if (editFlag === "Edit") {
				return true;
			}
			return false;
		},
		enableNotesField: function(editFlag, depFieldVal) {
			if (editFlag === "Create") {
				if (depFieldVal != undefined && depFieldVal === true)
					return true;
				else
					return false;
			}
			if (editFlag === "Display") {
				return false;
			} else if (editFlag === "Edit") {
				return true;
			}
			return false;
		},
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		formatTimeAccountValidity: function(sStartDate, sEndDate) {
			var sFormatLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),
				sDateRange = LocaleData.getInstance(sFormatLocale).getIntervalPattern("d - d"),
				oStartDate = DateFormat.getDateInstance().parse(sStartDate),
				oEndDate = DateFormat.getDateInstance().parse(sEndDate);

			// //check for LOW_DATE (01.01.1800) and HIGH_DATE (31.12.9999)
			// if ((oStartDate.getDate() === 1 && oStartDate.getMonth() === 0 && oStartDate.getFullYear() === 1800) &&
			//     (oEndDate.getDate() === 31 && oEndDate.getMonth() === 11 && oEndDate.getFullYear() === 9999)) {
			//     return "";
			// }    
			sDateRange = sDateRange.replace("{0}", sStartDate);
			sDateRange = sDateRange.replace("{1}", sEndDate);
			return sDateRange;
		},
		formatEntitlementStatus: function(sAmountLeft) {
			var fValue = parseFloat(sAmountLeft);
			if (fValue > 0) {
				return sap.ui.core.ValueState.Success;
			} else if (fValue < 0) {
				return sap.ui.core.ValueState.Error;
			} else {
				return sap.ui.core.ValueState.None;
			}
		},
		getListItemStatus: function(sStatus) {
			switch (sStatus) {
				case "POSTED":
				case "APPROVED":
					return sap.ui.core.ValueState.Success;
				case "SENT":
					return sap.ui.core.ValueState.Warning;
				case "REJECTED":
					return sap.ui.core.ValueState.Error;
				default: //fallback (should not happen)
					return sap.ui.core.ValueState.None;
			}
		},
		formatOverviewLeaveDates: function(sStartDate, sEndDate) {
			if (sStartDate === sEndDate) {
				return sStartDate;
			}
			var sFormatLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),
				sDateRange = LocaleData.getInstance(sFormatLocale).getIntervalPattern("d - d");
			sDateRange = sDateRange.replace("{0}", sStartDate);
			sDateRange = sDateRange.replace("{1}", sEndDate);
			return sDateRange;
		},
		formatUsedQuota: function(sQuota) {
			return sQuota === "0" ? null : sQuota;
		},

		formatTimeAccountTypeText: function(sText, oDate) {
			return jQuery.sap.formatMessage(sText, [oDate, oDate]);
		},

		formatQuotaAvailability: function(sAvailabilityAmount, bIsQuotaRelevant, sTimeUnit) {

			function availableDays(sAvailableDays) {
				if (!isNaN(parseFloat(sAvailableDays))) {
					var oNumberFormat = NumberFormat.getFloatInstance({
						minFractionDigits: 0,
						maxFractionDigits: 2
					});
					return oNumberFormat.format(sAvailableDays);
				}
				return sAvailableDays;
			}

			if (bIsQuotaRelevant === false) {
				return this.getResourceBundle().getText("noQuotaRelevance");
			}
			var fParsedNumber = parseFloat(sAvailabilityAmount);
			if (!isNaN(fParsedNumber)) {
				var sAmountFormatted = availableDays(sAvailabilityAmount);
				if (fParsedNumber === 1) {
					return this.getResourceBundle().getText("availableTxt", [sAmountFormatted, sTimeUnit]);
				} else {
					return this.getResourceBundle().getText("availableTxtPlural", [sAmountFormatted, sTimeUnit]);
				}
			}
			return sAvailabilityAmount;
		},
		formatNotesString: function(sColonSeparated) {
			//::NEW::00000011::::Herr Michael Kennedy::::Dude where is my car::::20161216::::041550::::HAW
			var oFieldMapping = [
				"EmployeeId",
				"EmployeeName",
				"Text",
				"Date",
				"Time",
				"Timezone"
			];
			var aResult = [];
			if (sColonSeparated) {
				aResult = sColonSeparated.split("::NEW::")
					.filter(function(sFields) {
						return sFields.length > 0;
					})
					.map(function(sFields) {
						var oFields = {};

						sFields.split("::::").forEach(function(sFieldValue, iFieldIdx) {
							var sFieldName = oFieldMapping[iFieldIdx];
							oFields[sFieldName] = sFieldValue;
						});

						return oFields;
					});
			}
			if (aResult.length > 0)
				return aResult[0].Text;
			else
				return "";
		},
		formatNoteText: function(sText) {
			if (sText != undefined)
				return jQuery.sap.encodeHTML(sText);
		},

		formatFeedTimeStamp: function(sDate, sLocalTime) {
			// for the notes the backend (for whatever reason?) already converts the time to the users local time
			if (sDate && sLocalTime) {
				var oDate = DateFormat.getDateInstance().parse(sDate),
					oTime = DateFormat.getTimeInstance().parse(sLocalTime),
					newDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), oTime.getHours(), oTime.getMinutes(), oTime.getSeconds());

				return DateFormat.getDateTimeInstance({
					style: "medium/short",
					relative: false
				}).format(newDate);
			}
			return null;
		},
		formatNotes: function(sNote) {
			return this.parseColonSeparatedString(sNote);
		},
		parseColonSeparatedString: function(sColonSeparated) {
			//::NEW::00000011::::Herr Michael Kennedy::::Dude where is my car::::20161216::::041550::::HAW
			var oFieldMapping = [
				"EmployeeId",
				"EmployeeName",
				"Text",
				"Date",
				"Time",
				"Timezone"
			];
			var aResult = [];
			if (sColonSeparated) {
				aResult = sColonSeparated.split("::NEW::")
					.filter(function(sFields) {
						return sFields.length > 0;
					})
					.map(function(sFields) {
						var oFields = {};

						sFields.split("::::").forEach(function(sFieldValue, iFieldIdx) {
							var sFieldName = oFieldMapping[iFieldIdx];
							oFields[sFieldName] = sFieldValue;
						});

						return oFields;
					});
			}
			return aResult;
		},
		getHolidayStatus: function(sStatus) {
				switch (sStatus) {
					case "Optional":
						return sap.ui.core.ValueState.Success;
					default:
						return sap.ui.core.ValueState.error;
				}
			}
			/*functons for leave appliction -End*/

	};
});
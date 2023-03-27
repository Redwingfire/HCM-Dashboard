var initialIndx = 0;
var that;
var formdata;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/hcm/dashZHCM_DASHBOARD/model/formatter",
	"sap/m/MessageBox"
], function(Controller, formatter, MessageBox) {
	"use strict";

	return Controller.extend("com.hcm.dashZHCM_DASHBOARD.controller.Masterpage", {

		formatter: formatter,

		onInit: function() {
			that = this;
			this.loadMenuData();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Masterpage").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function(oEvent) {
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;

			if (parmeters) {
				if (parmeters.appname !== undefined && parmeters.navigation !== undefined) {
					var empno = parmeters.empno[0],
						appname = parmeters.appname[0],
						navigation = parmeters.navigation[0];
					this.getOwnerComponent().getRouter().navTo("Details", {
						reqGuid: "INITIAL_GUID",
						empId: empno,
						appName: appname,
						navHCM: navigation
					}, true);
					return;
				}

			}

			var recivedModel = new sap.ui.model.json.JSONModel([{
				key: "7",
				text: "ALL",
				index: "1"
			}, {
				key: "1",
				text: "Today",
				index: "2"
			}, {
				key: "2",
				text: "Yesterday",
				index: "3"
			}, {
				key: "3",
				text: "Last 7 Days",
				index: "4"
			}, {
				key: "4",
				text: "Last 15 days",
				index: "5"

			}, {         
				key: "5",
				text: "Last 1 Month",
				index: "6"
			}, {
				key: "6",
				text: "Last 3 Months",
				index: "7"

			}]);
			this.getView().setModel(recivedModel, "recivedonModel");
			this.inboxread();
			//this.inboxpageFooterBtnDisplay();

		},
		inboxread: function() {
			var that = this;
			// ContactDetailsSet
			// BasicDetailSet
			var oEntitySet = "/HCMInboxSet";
			this.oBusy = new sap.m.BusyDialog();

			this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV", true);
			// this.oModel.setUseBatch(false);
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,

				success: function(oData) {
					that.oBusy.close();
					var reluts = oData.results[0];
					var HcmIbocArry = [];
					var nArray = oData.results;
					for (var i = 0; i < nArray.length; i++) {
						// nArray[i].Seqno = i + 1;
						// nArray[i].Seqno = (Number(nArray[i].Seqno)).toString();
						nArray[i].RequestedOn = that.changeDateToUTC(nArray[i].RequestedOn);
						HcmIbocArry.push(oData.results[i]);
					}

					var formdata = new sap.ui.model.json.JSONModel(nArray);
					that.getView().setModel(formdata, "inboxModel");
					that.getView().byId("idTableRec").setText("Total Records: " + oData.results.length);
					that.populteFilterData();

				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});
		},
		inboxpageFooterBtnDisplay: function() {
			var that = this;
			// ContactDetailsSet
			// BasicDetailSet
			var oEntitySet = "/LogonDetailsSet('')";
			this.oBusy = new sap.m.BusyDialog();

			this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV", true);
			this.oModel.setUseBatch(false);
			this.oBusy.open();
			// this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,

				success: function(oData) {
					that.oBusy.close();
					// var reluts = oData.results[0];
					formdata = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(formdata, "inboxpageFooterBtnDisplayModel");
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});
		},
		// inbox table filters
		populteFilterData: function() {
			var tableData = this.getView().getModel("inboxModel").getData();
			// var unique = [...new Set(tableData.map(item => item.ProcessType))]; // [ 'A', 'B']
			/*   ProcessType*/
			var key = "ProcessType";
			var unique = [...new Map(tableData.map(item => [item[key], item])).values()];
			unique.push({
				ActionType: "",
				ApplicationName: "",
				EmployeeId: "",
				EmployeeInfo: "",
				EmployeeName: "",
				PointInTime: "",
				Priority: "",
				ProcessSubType: "",
				ProcessTitle: "",
				ProcessType: "ALL",
				ReceivedOn: null,
				ReferenceNumber: "",
				RelationId: "",
				RequestFor: "",
				RequestGuid: "",
				RequestOwner: "",
				RequestedOn: null,
			});
			var processtypeModel = new sap.ui.model.json.JSONModel(unique);
			this.getView().setModel(processtypeModel, "processtypeModel");
			/*   processSubtypeModel*/
			var key = "ProcessSubType";
			var unique1 = [...new Map(tableData.map(item => [item[key], item])).values()];
			unique1.push({
				ActionType: "",
				ApplicationName: "",
				EmployeeId: "",
				EmployeeInfo: "",
				EmployeeName: "",
				PointInTime: "",
				Priority: "",
				ProcessSubType: "ALL",
				ProcessTitle: "",
				ProcessType: "",
				ReceivedOn: null,
				ReferenceNumber: "",
				RelationId: "",
				RequestFor: "",
				RequestGuid: "",
				RequestOwner: "",
				RequestedOn: null,
			});
			var processSubtypeModel = new sap.ui.model.json.JSONModel(unique1);
			this.getView().setModel(processSubtypeModel, "processSubtypeModel");

			/*   processSubtypeModel*/
			var key = "ReferenceNumber";
			var unique2 = [...new Map(tableData.map(item => [item[key], item])).values()];
			var ReferenceNumberModel = new sap.ui.model.json.JSONModel(unique2);
			this.getView().setModel(ReferenceNumberModel, "ReferenceNumberModel");

			/*   ReqReceivedOn*/
			var key = "ReqReceivedOn";
			var unique3 = [...new Map(tableData.map(item => [item[key], item])).values()];
			var ReqReceivedOnModel = new sap.ui.model.json.JSONModel(unique3);
			this.getView().setModel(ReqReceivedOnModel, "ReqReceivedOnModel");

			/*   Request Owner*/
			var key = "RequestOwner";
			var unique4 = [...new Map(tableData.map(item => [item[key], item])).values()];
			unique4.push({
				ActionType: "",
				ApplicationName: "",
				EmployeeId: "",
				EmployeeInfo: "",
				EmployeeName: "",
				PointInTime: "",
				Priority: "",
				ProcessSubType: "ALL",
				ProcessTitle: "",
				ProcessType: "",
				ReceivedOn: null,
				ReferenceNumber: "",
				RelationId: "",
				RequestFor: "",
				RequestGuid: "",
				RequestOwner: "ALL",
				RequestedOn: null,
			});
			var requestOwnerModel = new sap.ui.model.json.JSONModel(unique4);
			this.getView().setModel(requestOwnerModel, "requestOwnerModel");

			//read inbox mode
			// get data from model 
			// loop the model data unique records 

		},
		// inbox table reset data
		onReset: function() {
			this.inboxread();

			this.getView().byId("idReqReceivedOn").setSelectedKey("");
			this.getView().byId("idProcessType").setSelectedKey("");
			this.getView().byId("idProcessSubType").setSelectedKey("");
			this.getView().byId("idRequestOwner").setSelectedKey("");

			this.getView().byId("idProcessType").setSelectedKey("ALL");
			this.getView().byId("idProcessSubType").setSelectedKey("ALL");
			this.getView().byId("idReqReceivedOn").setSelectedKey("7");
			this.getView().byId("idRequestOwner").setSelectedKey("ALL");
			/*	this.getView().byId("idReferenceNumber").setSelectedKey("");
			this.getView().byId("idReqReceived").setSelectedKey("");
			
*/
		},

		onGo: function(oEvent) {
			// var sValue = oEvent.getSource().getSelectedItem().getKey();
			var sReqRecvon = this.getView().byId("idReqReceivedOn").getSelectedKey();
			var sProcessType = this.getView().byId("idProcessType").getSelectedKey();
			var sProceSubType = this.getView().byId("idProcessSubType").getSelectedKey();
			var sRequesOwner = this.getView().byId("idRequestOwner").getSelectedKey();
			/*	var sRefNumber = this.getView().byId("idReferenceNumber").getSelectedKey();
			var sReqReceived = this.getView().byId("idReqReceived").getSelectedKey();
*/
			var oBindingParams = this.getView().getModel("inboxModel");
			var aFilter = [];
			// var aFilter = new sap.ui.model.Filter([
			// 	//new sap.ui.model.Filter("ProcessType", "EQ", sReqRecvon),

			// 	new sap.ui.model.Filter("ProcessType", "EQ", sProcessType),
			// 	new sap.ui.model.Filter("ProcessSubType", "EQ", sProceSubType),
			// 	new sap.ui.model.Filter("ReferenceNumber", "EQ", sRefNumber),
			// 	new sap.ui.model.Filter("RequestedOn", "EQ", sReqReceived),
			// ], true);

			if (sReqRecvon !== "") {
				if (sReqRecvon === "7") {
					// All selected
					var date = "";
					// aFilter.push(new sap.ui.model.Filter("ReceivedOn", "EQ", date));
				} else if (sReqRecvon === "1") {
					var Todadate = new Date();
					var minDate = Todadate.getDate();
					var minMonth = Todadate.getMonth();
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);
					// var date =  this.changeDateToUTC( new Date(minYear, minMonth, minDate));
					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
					// aFilter.push(new sap.ui.model.Filter("ReceivedOn", "EQ", Todadate));
				} else if (sReqRecvon === "2") {
					//yester day
					var Todadate = new Date();
					var minDate = Todadate.getDate() - 1;
					var minMonth = Todadate.getMonth();
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);
					// var date = this.changeDateToUTC(new Date(minYear, minMonth, minDate));
					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
					// aFilter.push(new sap.ui.model.Filter("ReceivedOn", "EQ", date));
				} else if (sReqRecvon === "3") {
					//Last 7 Days
					// var date = new Date() - 7;
					var Todadate = new Date();
					var minDate = Todadate.getDate() - 7;
					var minMonth = Todadate.getMonth();
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);
					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
				} else if (sReqRecvon === "4") {
					//Last 15 days
					// var date = new Date() - 15;
					var Todadate = new Date();
					var minDate = Todadate.getDate() - 15;
					var minMonth = Todadate.getMonth();
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);
					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
				} else if (sReqRecvon === "5") {
					//Last 1 Month
					var Todadate = new Date();
					var minDate = Todadate.getDate();
					var minMonth = Todadate.getMonth() - 1;
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);

					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
				} else if (sReqRecvon === "6") {
					//Last 3 Months
					var Todadate = new Date();
					var minDate = Todadate.getDate();
					var minMonth = Todadate.getMonth() - 3;
					var minYear = Todadate.getFullYear();
					var date = new Date(minYear, minMonth, minDate);

					aFilter.push(new sap.ui.model.Filter("ReceivedOn", "GE", date));
				}

			}
			if (sProcessType !== "") {
				if (sProcessType === "ALL") {
					// aFilter.push(new sap.ui.model.Filter("ProcessType", "EQ", ""));
				} else {
					aFilter.push(new sap.ui.model.Filter("ProcessType", "EQ", sProcessType));
				}
			}

			if (sProceSubType !== "") {
				if (sProceSubType === "ALL") {
					// aFilter.push(new sap.ui.model.Filter("ProcessType", "EQ", ""));
				} else {
					aFilter.push(new sap.ui.model.Filter("ProcessSubType", "EQ", sProceSubType));
				}
			}
			if (sRequesOwner !== "") {
				//"RequestOwner"
				if (sRequesOwner === "ALL") {
					// aFilter.push(new sap.ui.model.Filter("ProcessType", "EQ", ""));
				} else {
					aFilter.push(new sap.ui.model.Filter("RequestOwner", "EQ", sRequesOwner));
				}
			}
			/*	if (sRefNumber !== "") {
					aFilter.push(new sap.ui.model.Filter("ReferenceNumber", "EQ", sRefNumber));
				}
				if (sReqReceived !== "") {
					aFilter.push(new sap.ui.model.Filter("RequestedOn", "EQ", sReqReceived));
				}*/

			this.getView().byId("idinboxTable").getBinding("items").filter(aFilter, "Application");

			// var f = f.trim();
			// var binding = list.getBinding('items');
			// if (f) {
			// 	var filter = new sap.ui.model.Filter("name",
			// 		sap.ui.model.FilterOperator.Contains, f)
			// 	binding.filter([filter]);
			// } else {
			// 	binding.filter([]);
			// }
			// this.getView().byId("idTableRec").setText("Total Records: " + oBindingParams.getLength());
			// .setText(oBindingParams.getLength());
			this.getView().byId("idTableRec").setText("Total Records: " + this.getView().byId("idinboxTable").getBinding("items").iLength);
		},
		// standered date to utc time conversion
		changeDateToUTC: function(oDate) { //for sending dates to backend
			if (oDate !== null) {
				var oTempDate = new Date(oDate.setHours("00", "00", "00", "00"));
				oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
				return oDate;
			} else {
				return oDate;
			}
		},
		// date Convertion
		dataformatConvertion: function(val) {
			//for mindate set purpose date converted -org creation valid from
			var year = val.slice(0, 4),
				month = val.slice(4, 6),
				day = val.slice(6, 8);
			// var fulldate = new Date(y, m - 1, Number(d) + 1);
			var mDate = new Date(year, month - 1, Number(day) + 1);
			return mDate;

		},
		onBeforeRebindTable: function(oEvent) {
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();
			/*	If Key is Empty the value should keep empty and user only select from dropdown -start*/
			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			/*	If Key is Empty the value should keep empty and user only select from dropdown -end*/
			// var oBindingParams = oEvent.getParameter("bindingParams");
			var oBindingParams = oEvent.getParameters();
			var AutorebindTable = false;
			if (initialIndx === 0) {
				that.oBindingParams = oBindingParams;
				that.oSmartTable = oEvent.getSource();
				initialIndx++;
			}
			if (!oBindingParams) {
				oBindingParams = that.oBindingParams;
				AutorebindTable = true;
			}
			oBindingParams.parameters = oBindingParams.parameters || {};

			// var oSmartFilterBar = this.byId(that.oSmartTable.getSmartFilterId());
			var oSmartFilterBar = this.byId(that.oSmartTable.getId());
			//oSmartFilterBar.getFilterItems();
			var oSmartFilterItems = that.getView().byId("idinboxTable").getItems();
			var sValue;
			if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				oSmartFilterItems.find(function(item) {
					if (item.getName() === "ReceivedOn") {
						sValue = that.getView().byId("idReceivedOn").getDateValue();
						if ((sValue) && (sValue !== "")) {
							oBindingParams.filters.push(new sap.ui.model.Filter("ReceivedOn", "Contains", sValue));
						}
					}
					if (item.getName() === "ProcessType") {
						sValue = that.getView().byId("idProcessType").getSelectedKey();
						if (sValue !== "") {
							oBindingParams.filters.push(new sap.ui.model.Filter("ProcessType", "Contains", sValue));
						}
					}
					if (item.getName() === "Priority") {
						sValue = that.getView().byId("idPriority").getSelectedKey();
						if (sValue !== "") {
							oBindingParams.filters.push(new sap.ui.model.Filter("Ś", "Contains", sValue));
						}
					}
					if (item.getName() === "RequestOwner") {
						sValue = that.getView().byId("idRequestOwner").getSelectedKey();
						if (sValue !== "") {
							oBindingParams.filters.push(new sap.ui.model.Filter("RequestOwner", "Contains", sValue));
						}
					}
				});
			}
			if (AutorebindTable) {
				that.oSmartTable.rebindTable(true);
			}
			this.onGo();
		},
		//navigation code 
		navTableItemPress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem").getBindingContext("inboxModel").getProperty();
			var relId = selectedItem.RelationId,
				reqGuid = selectedItem.RequestGuid,
				applicName = selectedItem.ApplicationName,
				empId = selectedItem.EmployeeId,
				ProcesTitle = selectedItem.ProcessTitle,
				EmpInfo = selectedItem.EmployeeInfo;
			var obj = {};
			if (applicName === "") {
				sap.m.MessageBox.error("No Forther Information is available in this Request..!!");
				return;
			}
			if (applicName === "ELCM_Y5_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				// single Transfer
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "Y5",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}
			if (applicName === "ELCM_Y9_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//repatriation
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "Y9",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}
				if (applicName === "ELCM_YC_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//Reversion 
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "YC",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}
			if (applicName === "ELCM_YQ_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//Reinstatement
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "YQ",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}

			if (applicName === "ELCM_YA_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//Promotion
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "YA",
					"appname": applicName,
					"navigation": "HCMDashboard"
				});
				return;
			}
			if (applicName === "ELCM_Y4_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//Transfer in
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "Y4",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}
			if (applicName === "ELCM_Y5_ALL_SINGLE" && selectedItem.ActionType == "SINGLE") {
				//var rguid ="000000000000000000000000000000000"  ELCM_Y4_ALL_SINGLE;
				//Transfer out
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {
					"SelectedDDO": "07030702001",
					"SelectedOffice": "NONE",
					"SelectedJob": "NONE",
					"Employee": empId,
					"Action": "PENDING",
					"ReqGuid": reqGuid,
					"RequestAction": "Y5",
					"appname": applicName,
					"navigation": "HCMDashboard"

				});
				return;
			}
			// this.getOwnerComponent().getRouter().navTo("ContactDetails", {reqGuid: reqGuid, EmpId: empId}, true);
			this.getOwnerComponent().getRouter().navTo("Details", {
				reqGuid: reqGuid,
				empId: empId,
				appName: applicName,
				procesTitle: ProcesTitle,
				empInf: EmpInfo
			}, true);
		},
		_navToParticularApp: function(semanticObject, action, params) {
			var hash = "";
			this.oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			hash = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: semanticObject,
					action: action
				},
				params: params
			})) || "";

			this.oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			});
		},
		onSearchInbox: function(oEvent) {
			var sValue = oEvent.getSource().getValue();
			// oEvent.getSource().getBinding("items").filter
			this.getView().byId("idinboxTable").getBinding("items").filter([new sap.ui.model.Filter([new sap.ui.model.Filter("ProcessType",
					sap
					.ui.model.FilterOperator
					.Contains, sValue), new sap.ui.model.Filter("ProcessSubType", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ProcessTitle", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("EmployeeInfo", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ReferenceNumber", sap.ui.model.FilterOperator.Contains, sValue),

				// new sap.ui.model.Filter("RequestedOn", sap.ui.model.FilterOperator.Contains, sValue),
				// new sap.ui.model.Filter("ReceivedOn", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("PointInTime", sap.ui.model.FilterOperator.Contains, sValue)

			], false)]);
		},
		//sustiute button Transfer
		onSubstitute: function(oEvent) {
			this._navToParticularApp("CFMS", "SUBSTITUE", {
				"processid": "",
				"empno": "",
				"appname": "",
				"navigation": "HCMDashboard"

			});
			return;

		}, //sustiute button Transfer
		onWorkFlow: function(oEvent) {
			this._navToParticularApp("ZHCMELCM", "OpenEndedWFC", {
				"processid": "",
				"empno": "",
				"appname": "",
				"navigation": "HCMDashboard"

			});
			return;

		}, //Manage Office Req button
		onManagOfficReq: function(oEvent) {
			this._navToParticularApp("CFMS", "ZHCM_REASGNAPPS", {
				"processid": "",
				"empno": "",
				"appname": "",
				"navigation": "HCMDashboard"

			});
			return;

		},
		// footer button purpose in master page -strat
		processMenuData: function(menuData) {
			var mainPageFooterBar = that.getView().byId("mainPageFooterBar");
			menuData.forEach(element => {
				console.log("Header: ", element);
				var menuButton = new sap.m.MenuButton({
					text: element.MenuHeaderName

					// ,icon: element.Icon
				});
				mainPageFooterBar.addContentRight(menuButton);
				if (element.DashboardNavigation.results.length > 0) {
					var itemMenu = new sap.m.Menu();
					element.DashboardNavigation.results.forEach(itemElement => {
						itemMenu.addItem(new sap.m.MenuItem({
							text: itemElement.MenuItemName,
							icon: itemElement.Icon,
							press: that.onMenuItemPress,
							customData: new sap.ui.core.CustomData({
								key: itemElement.MenuItem,
								value: itemElement.MenuItem
							})
						}));
						menuButton.setMenu(itemMenu);
					});
				}
			});
		},
		onMenuItemPress: function(oEvent) {
			var navigationTarget = oEvent.getSource().getCustomData()[0].getValue();
			var semObj = navigationTarget.split("-")[0];
			var action = navigationTarget.split("-")[1];

			that._navToParticularApp(semObj, action, {});
		},
		loadMenuData: function() {
			var that = this;
			this.oModel = this.getOwnerComponent().getModel();
			this.oModel.setUseBatch(false);
			this.oModel.read("/DashboardMenuSet", {
				async: false,
				urlParameters: {
					"$expand": "DashboardNavigation"
				},
				success: function(oData, oResponse) {
					//that.oBusy.close();
					// console.log(oData);
					that.processMenuData(oData.results);
				},
				error: function(error) {
					//that.oBusy.close();
					console.log(error)
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t, "Error");

				}
			});
		},
		// footer button purpose in master page -end

	});
});
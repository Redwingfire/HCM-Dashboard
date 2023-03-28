sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"com/hcm/dashZHCM_DASHBOARD/model/formatter"
], function(Controller, JSONModel, Fragment, MessageBox, formatter) {
	"use strict";

	return Controller.extend("com.hcm.dashZHCM_DASHBOARD.controller.Detailspage", {
		formatter: formatter,
		/**
		 * cfms_ctm_npv - new application
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.hcm.dashZHCM_DASHBOARD.view.Detailspage
		 */
		onInit: function() {
			this.oBusy = new sap.m.BusyDialog();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatched, this);

			this._formFragments = {};
			this.HeaderContent = sap.ui.xmlfragment(this.getView().getId(), "com.hcm.dashZHCM_DASHBOARD.view.fragments.Header");
		},
		_onObjectMatched: function(oEvent) {
			this.navigationPayload = "" // based on this Property to send paylod return to action history
			this.navigation = ""; // based on this property nav from ESS application - identifying 
			this.appName = ""; // for declaring , came from ESS applicaton - identifying 
			this.buttonHideInit(); // all Buttons are hide onInit
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.appname !== undefined && parmeters.navigation !== undefined) {
					if (parmeters.empno) {
						var empno = parmeters.empno[0];
					}
					if (parmeters.reqGuid) {
						this.reqGuid = parmeters.reqGuid[0]; // for added Pay change get entity call
					}
					if (parmeters.appname) {
						this.appName = parmeters.appname[0];
					}
					this.navigation = parmeters.navigation[0];
					if (parmeters.crospayld) {
						this.navigationPayload = parmeters.crospayld[0];
					}
					// this.ProcesTitle = parmeters.procesTitle[0];
					// this.EmpInfo = parmeters.empInf[0];
					// var inboxParmes =[];
					// inboxParmes.push(parmeters.empno[0],parmeters.navigation[0],parmeters.procesTitle[0],parmeters.empInf[0]);
				}
			}

			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			// fragement: "com.hcm.dashZHCM_DASHBOARD.view.fragments.Basicdetails"
			var editBtnText = this.getView().byId("idEditButton").getText();
			if (editBtnText == "Cancel") {
				this.getView().byId("idEditButton").setText("Edit");
				this.getView().byId("idEditButton").setIcon("sap-icon://edit");
				this.getView().byId("idEditButton").setType("Emphasized");
			}
			/*	footers button purpose added - busy dialog*/
			$.sap.BusyDialog = new sap.m.BusyDialog();
			// for this modle for Request details
			this.stausModel = new sap.ui.model.json.JSONModel();
			this.reqGuid = "";

			this.getView().setModel(oModel, "oViewModel");
			var data = oEvent.getParameter("arguments");
			this.navPrameters = data;
			var empno = data.empId;
			var reqGuid = data.reqGuid;
			var appName = data.appName;
			var inboxNav = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(inboxNav, "inboxNav");

			this.oModel = this.getOwnerComponent().getModel();
			//	this.empDetails(empno, reqGuid);

			if (appName == "ESS_Z301_SINGLE") {
				/*Basic Deatails*/
				var detailPagTitle = "Personal Details";
				var dateArray = ["dateofBirthNew", "marriedSinceNew", "DateofJoiningtNew", "DateofRetirementNew"];
				var fragement = "Basicdetails";
				this.basicDetails(empno, reqGuid);
			} else if (appName == "ESS_Z303_SINGLE") {
				/*Family & Nominees*/
				var fragement = "FamilyDetails";
				this.FamilyDetails(empno, reqGuid, "FamilyDetails");
				// this.NomineeDetails(empno, reqGuid);
				var dateArray = [];
			} else if (appName == "ESS_Z322_SINGLE") {
				/*contact Details*/
				this.contactDetails(empno, reqGuid);
				var fragement = "Contactdetails";

				var dateArray = [];
			} else if (appName == "ESS_Z334_SINGLE") {
				/*Bank pan details*/
				var fragement = "AccountDetails";
				this.AccountDetals(empno, reqGuid);
				var dateArray = [];
			} else if (appName == "ESS_Z316_SINGLE") {
				/*Adress details*/
				var fragement = "AddressDetails";
				this.AdressDetals(empno, reqGuid);
				var dateArray = [];
			} else if (appName == "ESS_Z302_SINGLE") {
				/*Leave application*/
				var fragement = "Leave";
				this.LeaveDetails(empno, reqGuid);
				var dateArray = [];
			} else if (appName == "ESS_Z333_SINGLE") {
				/*Leave Surrender leave*/
				var fragement = "SurrenderLeave";
				this.surLeaveDetails(empno, reqGuid);
				var dateArray = ["idPreviousSurrenderDate"];
				// var dateArray = [];
			} else if (appName == "ELCM_Y5_ALL_GROUP") {
				/*Group Transfer*/
				if (parmeters.navigation) {
					if (parmeters.navigation[0] == "ActionHistory") {
						reqGuid = parmeters.reqGuid[0];
						this.reqFromActionHis = reqGuid;
					}
				}
				var fragement = "GroupTransferDetails";
				this.groupTransferDetails(empno, reqGuid);
				var dateArray = [];
			} else if (appName == "ELCM_Y5_ALL_SINGLE") {
				/*Transfer single*/
				var fragement = "SurrenderLeave";
				// this.singleDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_YE_03_GROUP") {
				/*Annual Increment Grup*/
				var fragement = "AnnualIncrementDetails";
				this.AnnualIncrementDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_Y7_ALL_SINGLE") {
				/*DeputationOut  */
				var fragement = "DeputationDetails";
				this.DeputyDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_Y6_ALL_SINGLE") {
				/*DeputationIn*/
				var fragement = "DeputationDetails";
				this.DeputyInDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_Y8_ALL_SINGLE") {
				/*DeputyFrnsrvoutSet */
				if (parmeters.navigation) {
					if (parmeters.navigation[0] == "ActionHistory") {
						reqGuid = parmeters.reqGuid[0];
						//this.reqFromActionHis = reqGuid;
					}
				}
				var fragement = "DeputyFrnsrvoutDetails";
				this.DeputyFrnsrvDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_YI_ALL_SINGLE") {
				/*Suspention  */
				if (parmeters.navigation) {
					if (parmeters.navigation[0] == "ActionHistory") {
						reqGuid = parmeters.reqGuid[0];
						//this.reqFromActionHis = reqGuid;
					}
				}
				var fragement = "SuspensionDetails";
				this.SuspensionDetails(empno, reqGuid);
				var dateArray = ["idSuspenDateOfReceiptNote", "idSuspenEffectDate"];

			} else if (appName === "ELCM_YX_ALL_SINGLE") {
				/*OrgReassignment ELCM_Y7_ALL_SINGLE  */
				var fragement = "OrgReassignment";
				this.OrgReassignDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_YF_ALL_SINGLE") {
				/*OrgReassignment ELCM_YF_ALL_SINGLE  */
				var fragement = "SeparationDetails";
				this.SeparationDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_YE_ALL_SINGLE") {
				/*Pay changes ELCM_YE_ALL_SINGLE  */
				this.changesRevet == "Intial"; // this Flag is idenfing intial call or other
				var fragement = "PaychangeDetails";
				this.PaychangeDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ESS_Z633_SINGLE") {
				/*Loans Create and Withdrowad Deatils ESS_Z633_SINGLE  */
				var fragement = "Loans";
				this.LoansDetails(empno, reqGuid, "/GPFLoanDetailsSet");
				var dateArray = [];

			}
			// else if (appName === "ELCM_YN_ALL_SINGLE") {
			// 	var fragement = "FacorInchargeDetails";
			// 	var dateArray = [];

			// }
			else if (appName == "ELCM_Y1_ALL_SINGLE") {
				/*onboarding Deatails*/
				var detailPagTitle = "Personal Details";
				var dateArray = [];
				var fragement = "OnBoardingdetails";
				// this.OnBoardingdetails(empno, reqGuid);
			}
			else if (appName === "ELCM_Y3_ALL_SINGLE") {
				/*Probetion */
				var fragement = "ProbationDetails";
				this.ProbationDetails(empno, reqGuid);
				var dateArray = [];

			} else if (appName === "ELCM_YN_ALL_SINGLE") {
				/*Fac or Incharge   */
				var fragement = "FacorInchargeDetails";
				this.FacInOutDetails(empno, reqGuid);
				var dateArray = [];
			} else if (appName === "ELCM_Y2_ALL_GROUP") {
				/*regularatixation   */
				var fragement = "RegularazationDetails";
				this.RegularizationDetails(empno, reqGuid);
				var dateArray = [];
				// Regularization
			}

			// else if (appName === "ELCM_YQ_ALL_SINGLE") {
			// 	/*Reinstatement ELCM_YQ_ALL_SINGLE  */
			// 	var fragement = "ReinstatementDetails";
			// 	this.ReinstatementDetails(empno, reqGuid);
			// 	var dateArray = [];
			// } 
			else {
				//	var fragement = "";
				// no App names match

				this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
				sap.m.MessageBox.error("No Further data to Proceed...!!");
				return;
			}

			this._getFormFragment(fragement);
			this._showFormFragment(fragement);
			this.datepickerDisable(dateArray, this);
			/*	comdtion added for detal page title biding puprose - navegate from ESS -start*/
			if (parmeters.navigation) {
				if (appName == "ESS_Z301_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*Basic Deatails*/
					var detailPagTitle = "Personal Details";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0]);
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z303_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*family Deatails*/
					var detailPagTitle = "Family Members & Dependents Details";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z334_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*Bank Deatails*/
					var detailPagTitle = "Bank Details";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z322_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*contact Deatails*/
					var detailPagTitle = "Communication Details";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z316_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*adress Deatails*/
					var detailPagTitle = "Address Details";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z302_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*leave Deatails*/
					var detailPagTitle = "Leave Application";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z333_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*Surrender leave Deatails*/
					var detailPagTitle = "Annual Surrender Leave";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ESS_Z633_SINGLE" && parmeters.navigation[0] == "HCMDashboard") {
					/*Surrender leave Deatails*/
					var detailPagTitle = "Loan Request";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ELCM_Y5_ALL_GROUP" && parmeters.navigation[0] == "ActionHistory") {
					/*Group Deatails*/
					var detailPagTitle = "Group Transfer";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ELCM_YI_ALL_SINGLE" && parmeters.navigation[0] == "ActionHistory") {
					/*Suspention Deatails*/
					var detailPagTitle = "Suspension";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ELCM_Y3_ALL_SINGLE" && parmeters.navigation[0] == "ActionHistory") {
					/*Probation Deatails*/
					var detailPagTitle = "Probation";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ELCM_YE_ALL_SINGLE" && parmeters.navigation[0] == "ActionHistory") {
					/*Pay change Deatails*/
					var detailPagTitle = "Pay Change";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				} else if (appName == "ELCM_Y8_ALL_SINGLE" && parmeters.navigation[0] == "ActionHistory") {
					/*Deputation to foreign service Deatails*/
					var detailPagTitle = "Deputation to foreign service";
					inboxNav.setProperty("/procesTitle", detailPagTitle);
					var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
					inboxNav.setProperty("/empInf", decodedEmpinf);
				}

			}
			/*	comdtion added for detal page title biding puprose - navegate from ESS -end*/
		},

		datepickerDisable: function(dateArray, thisRef) {

			// var dateArray = ["idnewCadretDate"];
			if (dateArray !== "") {
				dateArray.forEach(date => {
					//	var oDatePicker = sap.ui.getCore().byId(date);
					var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
					if (date === "DateofRetirementNew") {
						this.getView().byId(date).setMinDate(new Date());
					} else if (date === "idPreviousSurrenderDate") {
						//surrender leave purpose added
						this.getView().byId(date).setMinDate(new Date("2020", "2", "1"));
					} else {
						this.getView().byId(date).setMaxDate(new Date());
					}
				});

			}
			//	sap.ui.getCore().byId("idnewCadretDate").setMaxDate(new Date());

			// (Field.getMetadata().getName() === "sap.m.DatePicker") {
			//                 Field.setValueState("None");
			//                 Field.addDelegate({
			//                     onAfterRendering: function () {
			//                         Field.$().find('INPUT').attr('disabled', true);
			//                     }}, Field);
			//             }(Field.getMetadata().getName() === "sap.m.DatePicker") {
			//                 Field.setValueState("None");
			//                 Field.addDelegate({
			//                     onAfterRendering: function () {
			//                         Field.$().find('INPUT').attr('disabled', true);
			//                     }}, Field);
			//             }
		},
		/*	Button Function to Hide in Intiallly*/
		buttonHideInit: function() {
			var buttonArry = [{
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}, {
					Hide: "X"
				}

			];
			this.buttonModel = new sap.ui.model.json.JSONModel(buttonArry);
			this.getView().setModel(this.buttonModel, "ButtonVisibleModel");
		},
		/*	Dynamic Fragment Code load */
		_getFormFragment: function(sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				// var Fragment = sap.ui.core.Fragment;
				pFormFragment = sap.ui.xmlfragment(this.getView().getId(), "com.hcm.dashZHCM_DASHBOARD.view.fragments." + sFragmentName, this);
				this.getView().addDependent(pFormFragment);
				// Fragment.load({
				// 	id: oView.getId(),
				// 	name: "com.hcm.dashZHCM_DASHBOARD.view.fragments." + sFragmentName
				// });
				this._formFragments[sFragmentName] = pFormFragment;
			}
			return pFormFragment;
		},
		_showFormFragment: function(sFragmentName) {
			// VBox id based - we are added items-
			var oPage = this.byId("idfragmentshow");
			// oPage.removeContent();
			oPage.removeAllItems();
			oPage.addItem(this._getFormFragment(sFragmentName));
			oPage.rerender();
			// oPage.addHeaderContent(this.HeaderContent);
			// this._getFormFragment(sFragmentName).then(function(oVBox) {
			// 	oPage.insertContent(oVBox);
			// });
		},

		/*	Nav Button code*/
		onNavBack: function() {
			if (this.navigation == "HCMDashboard") {
				// window.history.go(-1);
				this._navToParticularApp("zess_app", "display", {});
			} else if (this.navigation == "ActionHistory") {
				this._navToParticularApp("ZHR_TRANSFER_II", "display", {});
			} else {
				this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
			}
		},
		onBack: function() {
			if (this.navigation == "HCMDashboard") {
				// window.history.go(-1);
				// this._navToParticularApp("zess_app", "display", {});
				this._navToParticularApp("zess_app", "display", {
					//  "SelectedDDO": "07030702001",
					// "SelectedOffice": "NONE",
					// "SelectedJob": "NONE",
					// "Employee": empId,
					// "Action": "PENDING",
					//  "ReqGuid": reqGuid,
					// "RequestAction": "NONE",
					// "appname": applicName,
					// "navigation": "HCMDashboard"

				});
			} else if (this.navigation == "ActionHistory") {
				var payload = decodeURIComponent(this.navigationPayload);
				if (payload !== "") {
					this._navToParticularApp("ZHR_TRANSFER_II", "display", {
						//  "SelectedDDO": "07030702001",
						// "SelectedOffice": "NONE",
						// "SelectedJob": "NONE",
						// "Employee": empId,
						// "Action": "PENDING",
						//  "ReqGuid": reqGuid,
						// "RequestAction": "NONE",
						// "appname": applicName,
						"crospayld": payload

					});
				} else {
					if (this.getView().getModel("StausModel")) {
						var empId = this.getView().getModel("StausModel").getData().Pernr;
						var applicName = this.getView().getModel("StausModel").getData().ApplicationName;
					}
					this._navToParticularApp("ZHR_TRANSFER_II", "detail", {
						//  "SelectedDDO": "07030702001",
						// "SelectedOffice": "NONE",
						// "SelectedJob": "NONE",
						"Employee": empId,
						"Action": "SEARCH",
						"navigation": "ActionHistory",
						//  "ReqGuid": reqGuid,
						// "RequestAction": "NONE",
						"appname": applicName
					});
				}
				// return;
			} else {
				this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
			}

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
		/*  Edit Button clicks  */
		onEditDetails: function(oEvent) {
			var btntext = oEvent.getSource().getText();
			if (btntext == "Edit") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");

				oEvent.getSource().setText("Cancel");
				oEvent.getSource().setIcon("sap-icon://sys-cancel");
				oEvent.getSource().setType("Reject");
				for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SAVE") {
						this.getView().getModel("ButtonVisibleModel").getData()[i].Hide = "";
					}
				}
				this.buttonModel = new sap.ui.model.json.JSONModel(this.getView().getModel("ButtonVisibleModel").getData());
				this.getView().setModel(this.buttonModel, "ButtonVisibleModel");

			} else if (btntext == "Cancel") {
				var oModel = new JSONModel({
					EditVisibility: false,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
				oEvent.getSource().setText("Edit");
				oEvent.getSource().setIcon("sap-icon://edit");
				oEvent.getSource().setType("Emphasized");

				// save button hide / show
				for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SAVE") {
						this.getView().getModel("ButtonVisibleModel").getData()[i].Hide = "X";
					}
				}
				this.buttonModel = new sap.ui.model.json.JSONModel(this.getView().getModel("ButtonVisibleModel").getData());
				this.getView().setModel(this.buttonModel, "ButtonVisibleModel");
				// end - save button hide / show

				/*	if (this.getView().getModel("simple")) {
					this.getView().getModel("simple").setProperty("/MaritalstatusNew", "");
					this.getView().getModel("simple").setProperty("/FirstnameNew", "");
					this.getView().getModel("simple").setProperty("/LastnameNew", "");
					this.getView().getModel("simple").setProperty("/DateOfBirthNew", "");
					this.getView().getModel("simple").setProperty("/GenderNew", "");
					this.getView().getModel("simple").setProperty("/MaritalstatusNew", "");
					this.getView().getModel("simple").setProperty("/MarriedsinceNew", "");
				}
				if (this.getView().getModel("ContactModel")) {
					this.getView().getModel("ContactModel").setProperty("/PhoneNumberNew", "");
					this.getView().getModel("ContactModel").setProperty("/EmailAddressNew", "");
				}
				if (this.getView().getModel("AccountModel")) {
					this.getView().getModel("AccountModel").setProperty("/AadharNew", "");
					this.getView().getModel("AccountModel").setProperty("/PannumberNew", "");
					this.getView().getModel("AccountModel").setProperty("/BankaccNumberNew", "");
					this.getView().getModel("AccountModel").setProperty("/IfsccodeNew", "");
				}
*/
			}

		},
		// standered date to utc time conversion
		changeDateToUTC: function(oDate) { //for sending dates to backend
			var oTempDate = new Date(oDate.setHours("00", "00", "00", "00"));
			oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
			return oDate;
		},
		// standered date Converstion for backend 
		basicDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/BasicDetailSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var simpleModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(simpleModel, "simple");
					if (oData.results.length !== 0) {
						var dob = oData.results[0].DateOfBirthNew;
						var gender = oData.results[0].GenderNew;
						var y = dob.getFullYear();
						var m = dob.getMonth();
						var d = dob.getDate();
						if (gender === "1") {
							that.getView().byId("marriedSinceNew").setMinDate(new Date(y + 21, m - 1, d));
						} else if (gender === "2" || gender === "3") {
							that.getView().byId("marriedSinceNew").setMinDate(new Date(y + 18, m - 1, d));
						}
						/*	Disability fields editable - Start*/
						var sKey = oData.results[0].DisablityTypeNew;
						if (sKey == "02") {
							that.getView().byId("idDisabilityTypeBasic").setEditable(false);
							that.getView().byId("idDegreeofChallangBasic").setEditable(false);
						} else if (sKey == "01") {
							that.getView().byId("idDisabilityTypeBasic").setEditable(true);
							that.getView().byId("idDegreeofChallangBasic").setEditable(true);
						}
						/*	Disability fields editable - end*/
					}
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		FamilyDetails: function(empno, guid, sAction) {
			var that = this;
			this.saveEmp = empno;
			// var oEntitySet = "/ActionHeaderSet?$filter=RequestGuid eq'" + guid + "'";
			var oEntitySet = "/ActionHeaderSet";
			// var oEntitySet = "/ActionHeaderSet?$filter=RequestGuid eq'" + guid + "'&$expand=Nomines";
			//var oEntitySet = "/ActionHeaderSet(RequestGuid='" + guid + "')";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// async: false,
				filters: aFilters,
				urlParameters: {
					"$expand": "FamilyMembersSet,NominesSet"
				},
				success: function(oData, response) {
					that.oBusy.close();
					if (sAction === "Loans") {
						var simpleLoansModel = new sap.ui.model.json.JSONModel(oData.results[0].FamilyMembersSet.results);
						that.getView().setModel(simpleLoansModel, "FamilyLoansModel");
					} else {
						if (response.headers['sap-message']) {
							var responseHeader = response.headers['sap-message'];
							var successMessage = JSON.parse(responseHeader).message;
							sap.m.MessageBox.success(successMessage);
						}
						var simpleModel = new sap.ui.model.json.JSONModel(oData.results[0].FamilyMembersSet.results);
						that.getView().setModel(simpleModel, "FamilyModel");
						that.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results[0].FamilyMembersSet.results);
						that.getView().setModel(that.FamilyFormModel, "FamilyFormModel");
						that.getView().byId("idFamilyTableRec").setText("Total Records: " + oData.results[0].FamilyMembersSet.results.length);

						if (oData.results[0].NominesSet.results.length > 0) {
							var NomineTabArry = [];
							var nArray = oData.results[0].NominesSet.results;
							for (var i = 0; i < nArray.length; i++) {
								nArray[i].Seqno = i + 1;
								nArray[i].Seqno = (Number(nArray[i].Seqno)).toString();
								NomineTabArry.push(oData.results[i]);
							}
							that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
							that.getView().setModel(that.NomineeModel, "NomineeModel");
							that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
							that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
							that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);
						} else {
							that.NomineeModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
							that.getView().setModel(that.NomineeModel, "NomineeModel");
							that.NomineeFormModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
							that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
							that.getView().byId("idNomineeTableRec").setText("Total Records: " + oData.results[0].NominesSet.results.length);
						}
						// var NomineTabArry = [];
						// var nArray = oData.results[0].NominesSet.results;
						// for (var i = 0; i < nArray.length; i++) {
						// 	nArray[i].Seqno = i + 1;
						// 	NomineTabArry.push(oData.results[i]);
						// }
						// that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
						// that.getView().setModel(that.NomineeModel, "NomineeModel");
						// that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
						// that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
						// that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);

						that.getView().setModel(that.FamilyFormModel, "NomFamilyData");
						that.stausAssign(oData);
					}
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
					// that.oBusy.close();
				}
			});
		},
		NomineeDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/NomineeDetailsSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid)
				// ,
				// new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
				// 	.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					this.NomineeModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.NomineeModel, "NomineeModel");
					this.NomineeFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.NomineeFormModel, "NomineeFormModel");
					that.getView().byId("idNomineeTableRec").setText("Total Records: " + oData.results.length);
					// that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		contactDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/ContactDetailsSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)

			];

			this.oBusy.open();
			// this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "ContactModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});
		},
		AdressDetals: function(empno, guid) {
			var that = this;
			var oEntitySet = "/AddressInfoSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)

			];

			this.oBusy.open();
			// this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "AdressModel");
					/*	var jsModel1 = new sap.ui.model.json.JSONModel("./model/state.json");
						that.getView().setModel(jsModel1, "StateModel");*/
					var oModel = new JSONModel(jQuery.sap.getModulePath("com.hcm.dashZHCM_DASHBOARD", "/model/state.json"));
					oModel.attachRequestCompleted(null, function() {
							console.log(oModel.getData());
							that.getView().setModel(oModel, "StateModel");
						},
						this);
					if (oData.results.length !== 0) {
						oData.results[0].Country = "IN";
						oData.results[0].CountryNew = "IN";
						oData.results[0].Percountry = "IN";
						oData.results[0].PercountryNew = "IN";
						oData.results[0].Hcountry = "IN";
						oData.results[0].HcountryNew = "IN";
						var formdatachange = that.getView().getModel("AdressModel").getData();
						var formdatachanges = new sap.ui.model.json.JSONModel(formdatachange);
						that.getView().setModel(formdatachanges, "AdressModel");
					}
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
		},
		LeaveDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/LeaveDetailsSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				// new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
				// 	.EQ, empno)
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "LeaveModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});

		},
		surLeaveDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/SurrenderLeaveSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "SurLeaveModel");

					//oData.results.pop(0);
					// var Data = JSON.parse(JSON.stringify(oData.results));
					var Data = oData.results;
					if (Data.length > 1) {
						// var surnArry = Data.shift();
						var surTabArry = [];
						for (var i = 0; i < Data.length; i++) {
							if (i == 0) {} else {
								Data[i].seqNo = i;
								Data[i].seqNo = (Number(Data[i].seqNo)).toString();
								// surnArry[i].seqNo = (i + 1).toString();
								surTabArry.push(Data[i]);
							}
						}
						var SurLeaveTableModel = new sap.ui.model.json.JSONModel(surTabArry);
						that.getView().setModel(SurLeaveTableModel, "SurLeaveTableModel");
						that.getView().byId("idSurPreReqTableRec").setText("Total Records: " + surTabArry.length);
					} else {
						var surTabArry = [];
						// for (var i = 0; i < Data.length; i++) {
						// 	if (i == 0) {} else {
						// 		Data[i].seqNo = i;
						// 		Data[i].seqNo = (Number(Data[i].seqNo)).toString();
						// 		surTabArry.push(Data[i]);
						// 	}
						// }
						var SurLeaveTableModel = new sap.ui.model.json.JSONModel(surTabArry);
						that.getView().setModel(SurLeaveTableModel, "SurLeaveTableModel");
						that.getView().byId("idSurPreReqTableRec").setText("Total Records: " + surTabArry.length);
					}
					// else {
					//var surnArry = oData.results;
					// 	var surnArry = Data.shift();
					// 	surnArry.seqNo = "1";
					// 	var SurLeaveTableModel = new sap.ui.model.json.JSONModel(surnArry);
					// 	that.getView().setModel(SurLeaveTableModel, "SurLeaveTableModel");
					// 	that.getView().byId("idSurPreReqTableRec").setText("Total Records: 1");
					// }
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});

		},
		AnnualIncrementDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/AnnualIncrementSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					// var reluts = oData.results[0];
					that.formdata = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(that.formdata, "AnnualIncrementModel");
					// that.getView().byId("idSurPreReqTableRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});

		},
		SuspensionDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/SuspentionSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}

					that.formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(that.formdata, "SuspentionModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
		},
		SeparationDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/SeparationSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}

					that.formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(that.formdata, "SeparationModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
		},
		ReinstatementDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/ReinstatementSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];

			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}

					that.formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(that.formdata, "ReinstatementDetailsModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
		},
		groupTransferDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/TransferSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var surTabArry = [];
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].Sno = (i + 1).toString();
						surTabArry.push(oData.results[i]);
					}
					that.GroupTransferModel = new sap.ui.model.json.JSONModel(surTabArry);
					that.getView().setModel(that.GroupTransferModel, "GroupTransferModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + surTabArry.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		DeputyDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/DeputyOutSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					that.DeputyModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(that.DeputyModel, "DeputyModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		DeputyInDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/DeputyInSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					that.DeputyModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(that.DeputyModel, "DeputyModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		DeputyFrnsrvDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/DeputyFrnsrvoutSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var DeputyFrnsrvout = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(DeputyFrnsrvout, "DeputyFrnsrvoutModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		OrgReassignDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/OrgReassignSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					that.OrgReassign = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(that.OrgReassign, "OrgReassignModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		//Probation -start
		ProbationDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/ProbationSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.reqGuid !== undefined) {
					if (parmeters.reqGuid) {
						var req_Guid = parmeters.reqGuid[0];
					}
				} else {
					var req_Guid = guid;
				}
			}
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, req_Guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					that.ProbationData = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(that.ProbationData, "ProbationModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		FacInOutDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/FACINChargeSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.reqGuid !== undefined) {
					if (parmeters.reqGuid) {
						var req_Guid = parmeters.reqGuid[0];
					}
				} else {
					var req_Guid = guid;
				}
			}
			var aFilters = [

				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, req_Guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// this.oModel.read("" + oEntitySet + "(RequestGuid='" + guid + "')", {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					that.FacInOutdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					//that.DeputyModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(that.FacInOutdata, "FacInOutModel");
					/*this.FamilyFormModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(this.FamilyFormModel, "FamilyFormModel");*/
					// that.getView().byId("idTableGroupTransferRec").setText("Total Records: " + oData.results.length);

					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		RegularizationDetails: function(empno, guid) {
			var that = this;
			this.saveEmp = empno;
			if (guid !== undefined) {
				this.reqGuid = guid;
			}
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.reqGuid !== undefined) {
					if (parmeters.reqGuid) {
						var req_Guid = parmeters.reqGuid[0];
					}
				} else {
					if (this.reqGuid !== undefined) {
						var req_Guid = this.reqGuid;
					} else {
						var req_Guid = guid;
					}
				}
			}
			//	var oEntitySet = "/PayChangeSet?$filter=Pernr eq'" + empno + "'";
			var oEntitySet = "/ActionHeaderSet";
			// var oEntitySet = "/ActionHeaderSet?$filter=RequestGuid eq'" + guid + "'&$expand=Nomines";
			/*	for entity  pass like filters -start*/
			// this.reqGuid 
			// var oEntitySet = "/ActionHeaderSet(RequestGuid='" + req_Guid + "')";
			//  Pernr='" + empno + "', RequestGuid='" + DeletedRecordGUID + "',RequestGuid='" + req_Guid + "')"
			/*	for entity  pass like filters -end*/
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, req_Guid),
				new sap.ui.model.Filter("Batchnum", sap.ui.model.FilterOperator
					.EQ, ""),

				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// async: false,
				//filters: aFilters,
				urlParameters: {
					"$expand": "RegularizationSet"
				},
				/*	for entity  pass like navigation sets -start*/
				/*	urlParameters: {
						"$expand": "WageList"
					},*/
				/*	for entity pass like navigation sets -end*/
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var simpleModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(simpleModel, "PaychangeModel");
					var simpleModel = new sap.ui.model.json.JSONModel(oData.WageList.results);
					that.getView().setModel(simpleModel, "WageListModel");
					that.WageListFormModel = new sap.ui.model.json.JSONModel(oData.WageList.results);
					that.getView().setModel(that.WageListFormModel, "WageListFormModel");

					var BasicComponentTabArry = [];
					var RecurringTabArry = [];
					var AdditionalPaymentsTabArry = [];

					var nArray = oData.WageList.results;
					var b = 0;
					var r = 0;
					var a = 0;
					for (var i = 0; i < nArray.length; i++) {
						// nArray[i].Serialno = b + 1;
						// nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
						if (nArray[i].Infotype === "0008") {
							nArray[i].Serialno = b + 1;
							b = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							BasicComponentTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0014") {
							nArray[i].Serialno = r + 1;
							r = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							RecurringTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0015") {
							nArray[i].Serialno = a + 1;
							a = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							AdditionalPaymentsTabArry.push(nArray[i]);
						}
					}
					var simpleModel = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(simpleModel, "BasicComponentModel");
					that.BasicComponentData = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(that.BasicComponentData, "BasicComponentFormModel");
					that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + BasicComponentTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(simpleModel, "RecurringTabModel");
					that.RecurringTabFormData = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(that.RecurringTabFormData, "RecurringTabFormModel");
					that.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + RecurringTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(simpleModel, "AdditionalPaymentsTabModel");
					that.AdditionalPaymentsTabtData = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(that.AdditionalPaymentsTabtData, "AdditionalPaymentsTabFormModel");
					that.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + AdditionalPaymentsTabArry.length);
					// that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + oData.WageList.result.length);

					// if (oData.results[0].NominesSet.results.length > 0) {
					// 	var NomineTabArry = [];
					// 	var nArray = oData.results[0].NominesSet.results;
					// 	for (var i = 0; i < nArray.length; i++) {
					// 		nArray[i].Seqno = i + 1;
					// 		nArray[i].Seqno = (Number(nArray[i].Seqno)).toString();
					// 		NomineTabArry.push(oData.results[i]);
					// 	}
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);
					// } else {
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + oData.results[0].NominesSet.results.length);
					// }
					// var NomineTabArry = [];
					// var nArray = oData.results[0].NominesSet.results;
					// for (var i = 0; i < nArray.length; i++) {
					// 	nArray[i].Seqno = i + 1;
					// 	NomineTabArry.push(oData.results[i]);
					// }
					// that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeModel, "NomineeModel");
					// that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);

					// that.getView().setModel(that.FamilyFormModel, "NomFamilyData");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
					// that.oBusy.close();
				}
			});
		},
		/**
		 * Start of Change on Loan C/W Deatils Get Function
		 * Changes by: cfms_ctm_ual
		 * Changed on: 18.01.2023
		 **/
		LoansDetails: function(empno, reqGuid, oEntitySet) {
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, reqGuid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				filters: aFilters,
				// urlParameters: {
				// 	"$expand": "RequestDetails"
				// },
				success: function(oData, response) {
					this.oBusy.close();
					var LoansModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					this.getView().setModel(LoansModel, "LoansCWModel");
					var oLoanViewModel = new sap.ui.model.json.JSONModel({
						GPFVisible: false,
						FVisible: false
					});
					this.getView().setModel(oLoanViewModel, "oLoanViewModel");
					this.oConfigerUIonLoanType(oData.results[0]);
					var LoansCWDetailsModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(LoansCWDetailsModel, "LoansCWDetailsModel");
					this.stausAssign(oData);
					this.getEarningsandDeductionsData(empno, "EmployeeHeader,EarningList,DeductionList,LeaveList,EmployeeBasicDetails", reqGuid);
				}.bind(this),
				error: function(oError) {
					this.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}.bind(this)
			});
		},
		oConfigerUIonLoanType: function(oData) {
			var oLoanViewModel;
			if (oData.LoanTypeId !== "") {
				if (oData.LoanTypeId.startsWith("G")) {
					oLoanViewModel = new sap.ui.model.json.JSONModel({
						GPFVisible: true,
						FVisible: false
					});
				} else if (oData.LoanTypeId.startsWith("F") || oData.LoanTypeId.startsWith("A")) {
					oLoanViewModel = new sap.ui.model.json.JSONModel({
						GPFVisible: false,
						FVisible: true
					});
				} else {
					oLoanViewModel = new sap.ui.model.json.JSONModel({
						GPFVisible: false,
						FVisible: false
					});
				}
				this.getView().setModel(oLoanViewModel, "oLoanViewModel");
			}
		},
		oHandleLoansTypeChange: function(sLoanType) {
			var oLoanViewModel;
			if (sLoanType.startsWith("G")) {
				oLoanViewModel = new sap.ui.model.json.JSONModel({
					GPFVisible: true,
					FVisible: false
				});
			} else if (sLoanType.startsWith("F") || sLoanType.startsWith("A")) {
				oLoanViewModel = new sap.ui.model.json.JSONModel({
					GPFVisible: false,
					FVisible: true
				});
			} else {
				oLoanViewModel = new sap.ui.model.json.JSONModel({
					GPFVisible: false,
					FVisible: false
				});
			}
			this.getView().setModel(oLoanViewModel, "oLoanViewModel");
		},
		getEarningsandDeductionsData: function(oPernr, oExpandEntitys, reqGuid) {
			this.oBusy.open();
			var oModel = this.getOwnerComponent().getModel("GWHCMPAY");
			oModel.setUseBatch(false);
			var oEntitySet = "/EmployeeListSet(Pernr='" + oPernr + "')";
			oModel.read(oEntitySet, {
				urlParameters: {
					"$expand": oExpandEntitys
				},
				success: function(oData, response) {
					var EarningsandDeductionsLoansModel = new sap.ui.model.json.JSONModel(oData);
					this.getView().setModel(EarningsandDeductionsLoansModel, "oGlobalDataModel");
					this.FamilyDetails(oPernr, reqGuid, "Loans");
					this.oBusy.close();
				}.bind(this),
				error: function(oError) {
					this.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}.bind(this)
			});
		},
		/*End o0f Changes*/
		/*	Pay change Details*/
		onResetBasicCompoDetail: function(oEvent) {
			this.changesRevet == "Revert";
			sap.m.MessageBox.confirm("All the input changes will be reverted. Do you want to continue?", {
				actions: ["YES", "NO"],
				onClose: function(sAction) {
					if (sAction === "YES") {
						this.PaychangeDetails();
					}
				}.bind(this)
			});
		},

		PaychangeDetails: function(empno, guid) {
			var that = this;
			this.saveEmp = empno;
			if (guid !== undefined) {
				this.reqGuid = guid;
			}
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.reqGuid !== undefined) {
					if (parmeters.reqGuid) {
						var req_Guid = parmeters.reqGuid[0];
					}
				} else {
					if (this.reqGuid !== undefined) {
						var req_Guid = this.reqGuid;
					} else {
						var req_Guid = guid;
					}
				}
			}
			//	var oEntitySet = "/PayChangeSet?$filter=Pernr eq'" + empno + "'";
			//var oEntitySet = "/PayChangeSet";
			// var oEntitySet = "/ActionHeaderSet?$filter=RequestGuid eq'" + guid + "'&$expand=Nomines";
			/*	for entity  pass like filters -start*/
			// this.reqGuid 
			var oEntitySet = "/PayChangeSet(RequestGuid='" + req_Guid + "')";
			//  Pernr='" + empno + "', RequestGuid='" + DeletedRecordGUID + "',RequestGuid='" + DeletedRecordSeq + "')"
			/*	for entity  pass like filters -end*/
			// 			this.oBusy = new sap.m.BusyDialog();
			// var aFilters = [
			// 	new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
			// 		.EQ, guid),
			// 	new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
			// 		.EQ, empno)
			// ];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// async: false,
				//filters: aFilters,
				urlParameters: {
					"$expand": "WageList"
				},
				/*	for entity  pass like navigation sets -start*/
				/*	urlParameters: {
						"$expand": "WageList"
					},*/
				/*	for entity pass like navigation sets -end*/
				success: function(oData, response) {
					that.oBusy.close();
					if (that.changesRevet === "Revert") {
						// when click on reset button of Pay change
						sap.m.MessageBox.success("Changes are reverted successfully.");
					}

					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var simpleModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(simpleModel, "PaychangeModel");
					var simpleModel = new sap.ui.model.json.JSONModel(oData.WageList.results);
					that.getView().setModel(simpleModel, "WageListModel");
					that.WageListFormModel = new sap.ui.model.json.JSONModel(oData.WageList.results);
					that.getView().setModel(that.WageListFormModel, "WageListFormModel");

					var BasicComponentTabArry = [];
					var RecurringTabArry = [];
					var AdditionalPaymentsTabArry = [];

					var nArray = oData.WageList.results;
					var b = 0;
					var r = 0;
					var a = 0;
					for (var i = 0; i < nArray.length; i++) {
						// nArray[i].Serialno = b + 1;
						// nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
						if (nArray[i].Infotype === "0008") {
							nArray[i].Serialno = b + 1;
							b = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							BasicComponentTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0014") {
							nArray[i].Serialno = r + 1;
							r = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							RecurringTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0015") {
							nArray[i].Serialno = a + 1;
							a = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							AdditionalPaymentsTabArry.push(nArray[i]);
						}
					}
					var simpleModel = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(simpleModel, "BasicComponentModel");
					that.BasicComponentData = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(that.BasicComponentData, "BasicComponentFormModel");
					that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + BasicComponentTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(simpleModel, "RecurringTabModel");
					that.RecurringTabFormData = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(that.RecurringTabFormData, "RecurringTabFormModel");
					that.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + RecurringTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(simpleModel, "AdditionalPaymentsTabModel");
					that.AdditionalPaymentsTabtData = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(that.AdditionalPaymentsTabtData, "AdditionalPaymentsTabFormModel");
					that.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + AdditionalPaymentsTabArry.length);
					// that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + oData.WageList.result.length);

					// if (oData.results[0].NominesSet.results.length > 0) {
					// 	var NomineTabArry = [];
					// 	var nArray = oData.results[0].NominesSet.results;
					// 	for (var i = 0; i < nArray.length; i++) {
					// 		nArray[i].Seqno = i + 1;
					// 		nArray[i].Seqno = (Number(nArray[i].Seqno)).toString();
					// 		NomineTabArry.push(oData.results[i]);
					// 	}
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);
					// } else {
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + oData.results[0].NominesSet.results.length);
					// }
					// var NomineTabArry = [];
					// var nArray = oData.results[0].NominesSet.results;
					// for (var i = 0; i < nArray.length; i++) {
					// 	nArray[i].Seqno = i + 1;
					// 	NomineTabArry.push(oData.results[i]);
					// }
					// that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeModel, "NomineeModel");
					// that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);

					// that.getView().setModel(that.FamilyFormModel, "NomFamilyData");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
					// that.oBusy.close();
				}
			});
		},
		/*	 for PayScale Level changes on header fields-   Basic Amount - changed- for table data data update - cfms_ctm_npv(02_02_23)*/
		PaychangeDetailsUpdate: function(level) {
			var that = this;
			var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
			if (parmeters) {
				if (parmeters.reqGuid !== undefined) {
					if (parmeters.reqGuid) {
						var req_Guid = parmeters.reqGuid[0];
					}
				} else {
					var req_Guid = this.reqGuid;
				}
			}
			// this.saveEmp = empno;
			//	var oEntitySet = "/PayChangeSet?$filter=Pernr eq'" + empno + "'";
			var oEntitySet = "/PayChangeSet";
			// var oEntitySet = "/ActionHeaderSet?$filter=RequestGuid eq'" + guid + "'&$expand=Nomines";
			/*	for entity  pass like filters -start*/
			// var oEntitySet = "/PayChangeSet(Pernr='" + empno + "')";
			/*	for entity  pass like filters -end*/
			// 			this.oBusy = new sap.m.BusyDialog();
			var NewPayScalNewPayScalEffectivedate = this.getView().getModel("PaychangeModel").getData().NewEffectivedate;
			var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew;
			//var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew ;
			// var payscalArea = this.getView().getModel("PaychangeModel").getData().PayscaleArea;
			var payscalArea = this.getView().getModel("PaychangeModel").getData().PayscaleAreaNew;
			// var payscalGroup = this.getView().getModel("PaychangeModel").getData().PayscaleGroup;
			var payscalGroup = this.getView().getModel("PaychangeModel").getData().PayscaleGroupNew;
			// this.reqGuid = this.getOwnerComponent().oComponentData.startupParameters.reqGuid[0];
			var aFilters = [
				//  var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew ;
				new sap.ui.model.Filter("PayscaleType", sap.ui.model.FilterOperator.EQ, payscalType),
				new sap.ui.model.Filter("PayscaleArea", sap.ui.model.FilterOperator.EQ, payscalArea),
				new sap.ui.model.Filter("PayscaleGroup", sap.ui.model.FilterOperator.EQ, payscalGroup),
				new sap.ui.model.Filter("PayscaleLevel", sap.ui.model.FilterOperator
					.EQ, level),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, this.saveEmp),
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, req_Guid),
				new sap.ui.model.Filter("NewEffectivedate", sap.ui.model.FilterOperator
					.EQ, NewPayScalNewPayScalEffectivedate)

			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				// async: false,
				filters: aFilters,
				urlParameters: {
					"$expand": "WageList"
				},
				/*	for entity  pass like navigation sets -start*/
				/*	urlParameters: {
						"$expand": "WageList"
					},*/
				/*	for entity pass like navigation sets -end*/
				success: function(oData, response) {
					that.oBusy.close();
					sap.m.MessageBox.success("Pay components are refreshed according to the selected Payscale attributes.");
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					// var simpleModel = new sap.ui.model.json.JSONModel(oData);
					// that.getView().setModel(simpleModel, "PaychangeModel");
					var Paychang = that.getView().getModel("PaychangeModel");
					Paychang.setProperty("/BasicamountNew", oData.results[0].BasicamountNew);
					var simpleModel = new sap.ui.model.json.JSONModel(oData.results[0].WageList.results);
					that.getView().setModel(simpleModel, "WageListModel");
					that.WageListFormModel = new sap.ui.model.json.JSONModel(oData.results[0].WageList.results);
					that.getView().setModel(that.WageListFormModel, "WageListFormModel");

					var BasicComponentTabArry = [];
					var RecurringTabArry = [];
					var AdditionalPaymentsTabArry = [];

					var nArray = oData.results[0].WageList.results;
					var b = 0;
					var r = 0;
					var a = 0;
					for (var i = 0; i < nArray.length; i++) {
						// nArray[i].Serialno = b + 1;
						// nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
						if (nArray[i].Infotype === "0008") {
							nArray[i].Serialno = b + 1;
							b = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							BasicComponentTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0014") {
							nArray[i].Serialno = r + 1;
							r = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							RecurringTabArry.push(nArray[i]);
						} else if (nArray[i].Infotype === "0015") {
							nArray[i].Serialno = a + 1;
							a = nArray[i].Serialno;
							nArray[i].Serialno = (Number(nArray[i].Serialno)).toString();
							AdditionalPaymentsTabArry.push(nArray[i]);
						}
					}
					var simpleModel = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(simpleModel, "BasicComponentModel");
					that.BasicComponentData = new sap.ui.model.json.JSONModel(BasicComponentTabArry);
					that.getView().setModel(that.BasicComponentData, "BasicComponentFormModel");
					that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + BasicComponentTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(simpleModel, "RecurringTabModel");
					that.RecurringTabFormData = new sap.ui.model.json.JSONModel(RecurringTabArry);
					that.getView().setModel(that.RecurringTabFormData, "RecurringTabFormModel");
					that.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + RecurringTabArry.length);

					var simpleModel = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(simpleModel, "AdditionalPaymentsTabModel");
					that.AdditionalPaymentsTabtData = new sap.ui.model.json.JSONModel(AdditionalPaymentsTabArry);
					that.getView().setModel(that.AdditionalPaymentsTabtData, "AdditionalPaymentsTabFormModel");
					that.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + AdditionalPaymentsTabArry.length);
					// that.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + oData.WageList.result.length);

					// if (oData.results[0].NominesSet.results.length > 0) {
					// 	var NomineTabArry = [];
					// 	var nArray = oData.results[0].NominesSet.results;
					// 	for (var i = 0; i < nArray.length; i++) {
					// 		nArray[i].Seqno = i + 1;
					// 		nArray[i].Seqno = (Number(nArray[i].Seqno)).toString();
					// 		NomineTabArry.push(oData.results[i]);
					// 	}
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);
					// } else {
					// 	that.NomineeModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeModel, "NomineeModel");
					// 	that.NomineeFormModel = new sap.ui.model.json.JSONModel(oData.results[0].NominesSet.results);
					// 	that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// 	that.getView().byId("idNomineeTableRec").setText("Total Records: " + oData.results[0].NominesSet.results.length);
					// }
					// var NomineTabArry = [];
					// var nArray = oData.results[0].NominesSet.results;
					// for (var i = 0; i < nArray.length; i++) {
					// 	nArray[i].Seqno = i + 1;
					// 	NomineTabArry.push(oData.results[i]);
					// }
					// that.NomineeModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeModel, "NomineeModel");
					// that.NomineeFormModel = new sap.ui.model.json.JSONModel(NomineTabArry[0].NominesSet.results);
					// that.getView().setModel(that.NomineeFormModel, "NomineeFormModel");
					// that.getView().byId("idNomineeTableRec").setText("Total Records: " + NomineTabArry[0].NominesSet.results.length);

					// that.getView().setModel(that.FamilyFormModel, "NomFamilyData");
					// that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
					// that.oBusy.close();
				}
			});
		},
		/*	 for PayScale Level changes on header fields-   Basic Amount - changed- for table data data update - cfms_ctm_npv(02_02_23)*/
		empDetails: function(empno, guid) {
			var that = this;
			var oEntitySet = "/AllEmployeeListSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				// new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
				// 	.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];

			this.oModel.setUseBatch(false);
			// this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "emp");

				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
		},

		oHandleDisabilityNewLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		onValueChange: function(oEvent) {
			var textValue = oEvent.getParameters().value;

			var regex = /[` 0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` 0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}
		},
		onValueNameChange: function(oEvent) {
			// for name validation in basic details-fragement
			var textValue = oEvent.getParameters().value;

			var regex = /[`0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[`0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}
		},
		getAuthentication: function(oEvent) {

		},
		/* Called Button Entity to check button visibility*/
		buttonDetails: function(guid, appName) {
			var that = this;
			var oEntitySet = "/ButtonPropertySet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),

				new sap.ui.model.Filter("ApplicationName", sap.ui.model.FilterOperator
					.EQ, appName),
				new sap.ui.model.Filter("ButtonId", sap.ui.model.FilterOperator
					.EQ, "ALL")
				// new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
				// 	.EQ, empno)
			];

			// this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var reluts = oData.results[0];
					that.buttonModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(that.buttonModel, "ButtonVisibleModel");
					/*for Ess appliacitons button name - Submit -start cfms_ctm_npv(27_2_23)*/
					var applicationName = that.getView().getModel("StausModel").getData();
					if (applicationName.ApplicationName !== undefined) {
						if (applicationName.ApplicationName.includes("ESS")) {
							that.getView().byId("idSaveSubmit").setText("Submit");
						}
					}
					/*	for Ess appliacitons button name - Submit -end cfms_ctm_npv(27_2_23)*/
					/*if (appName == "ESS_Z303_SINGLE") {
						var empno = "";
						// that.NomineeDetails(empno, that.reqGuid);
					}*/
					/*for hiding the save button itially when user click on edit only show that logic work purpose- cfms_ctm_npv(29_10_22) -start*/
					for (var i = 0; i < that.getView().getModel("ButtonVisibleModel").getData().length; i++) {
						if (that.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SAVE") {
							that.getView().getModel("ButtonVisibleModel").getData()[i].Hide = "X";
						}
					}
					that.buttonModel = new sap.ui.model.json.JSONModel(that.getView().getModel("ButtonVisibleModel").getData());
					that.getView().setModel(that.buttonModel, "ButtonVisibleModel");
					/*for hiding the save button itially when user click on edit only show that logic work purpose- cfms_ctm_npv(29_10_22) -end*/
					if (appName == "ESS_Z316_SINGLE") {
						// only for Address details cancel button showing after save the data- that issue relosving purpose am added this code
						var editBtnText = that.getView().byId("idEditButton").getText();
						if (editBtnText == "Cancel") {
							that.getView().byId("idEditButton").setText("Edit");
							that.getView().byId("idEditButton").setIcon("sap-icon://edit");
							that.getView().byId("idEditButton").setType("Emphasized");
						}
					}
					if (appName == "ELCM_Y5_ALL_GROUP" || appName == "ELCM_YE_ALL_SINGLE") // ELCM_YE_ALL_SINGLE for Pay change actions
					{
						// only for Group Transfer cancel button showing after save the data- that issue relosving purpose am added this code- cfms_Ctm_npv(03_02_23)
						var editBtnText = that.getView().byId("idEditButton").getText();
						if (editBtnText == "Cancel") {
							that.getView().byId("idEditButton").setText("Edit");
							that.getView().byId("idEditButton").setIcon("sap-icon://edit");
							that.getView().byId("idEditButton").setType("Emphasized");
						}
					}
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});

		},

		/*		basic details fragment validlatons -start*/
		onChangeDobNewBasic: function(oEvent) {
			var dob = oEvent.getParameter("newValue");
			// var simpleModel = new sap.ui.model.json.JSONModel(oData.results[0]);
			var basicDetailsModel = this.getView().getModel("simple");
			var gender = basicDetailsModel.getData().GenderNew;
			var y = dob.slice(6, 10);
			var m = dob.slice(3, 5);
			var d = dob.slice(0, 2);
			if (gender === "1") {
				that.getView().byId("marriedSinceNew").setMinDate(new Date(y + 21, m - 1, d));
			} else if (gender === "2" || gender === "3") {
				that.getView().byId("marriedSinceNew").setMinDate(new Date(y + 18, m - 1, d));
			}

		},
		onchangeTitleNewCombo: function(oEvent) {
			// combobox in basic details commen function
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

			/*	for assing editable / not based on title select - cfms_ctm_npv-start*/
			var aGNDR = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			this.getView().getModel("simple").setProperty("/GenderNew", aGNDR);
			if (newval === "Ms" || newval === "Mrs" || newval === "Mr" || newval === "TGNDR") {
				this.getView().byId("idGenderNewBasicDetal").setEditable(false);
			} else {
				this.getView().byId("idGenderNewBasicDetal").setEditable(true);
			}
			/*	for assing editable / not based on title select - cfms_ctm_npv-end*/

		},
		onchangDisabiityCombo: function(oEvent) {
			// combobox in Disability Selection details yes / no function
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			/*	for assing editable / not based on title select - cfms_ctm_npv-start*/
			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			/*	for assing editable / not based on title select - cfms_ctm_npv-end*/
			/*	for assing editable / not based on title select -start*/
			// var aGNDR = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			// this.getView().getModel("simple").setProperty("/GenderNew", aGNDR);
			// if (newval === "Ms" || newval === "Mrs" || newval === "Mr" || newval === "TGNDR") {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(false);
			// } else {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(true);
			// }
			/*	for assing editable / not based on title select -end*/
			var sKey = oEvent.getSource().getSelectedItem().getKey();
			if (sKey == "02") {
				this.getView().byId("idDisabilityTypeBasic").setEditable(false);
				this.getView().byId("idDegreeofChallangBasic").setEditable(false);
				this.getView().byId("idDisabilityTypeBasic").setValue("");
				this.getView().byId("idDegreeofChallangBasic").setValue("0");
			} else if (sKey == "01") {
				this.getView().byId("idDisabilityTypeBasic").setEditable(true);
				this.getView().byId("idDegreeofChallangBasic").setEditable(true);
			}

		},
		onchangebasicCombo: function(oEvent) {
			// combobox in basic details commen function
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			/*	for assing editable / not based on title select -start*/
			// var aGNDR = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			// this.getView().getModel("simple").setProperty("/GenderNew", aGNDR);
			// if (newval === "Ms" || newval === "Mrs" || newval === "Mr" || newval === "TGNDR") {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(false);
			// } else {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(true);
			// }
			/*	for assing editable / not based on title select -end*/
			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
		},
		oHandleGPFLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` ~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` ~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		HandleRequestofDisability: function(oEvent) {
			var that = this;
			this.DisabilityInput = oEvent.getSource();
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestFor", sap.ui.model.FilterOperator.EQ, "D"));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/ValueHelpSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DisabilityDialogFragment) {
						that.DisabilityDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DisableTypeDialog",
							that);
						that.getView().addDependent(that.DisabilityDialogFragment);
					}
					that.DisabilityDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DisabilityDialogFragment.setModel(oModel, "DisabilityDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					if (error.responseText) {
						var message = JSON.parse(error.responseText).error.message.value;
						sap.m.MessageBox.error(message);
					}
				}
			});
		},
		ConfirmDisabilityDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDescriptionKey = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberNomineeDetail = oEvent.getParameter("selectedItem").getBindingContext("DisabilityDialogModel").getProperty();
			this.DisabilityInput.setValue(sValue);
			this.DisabilityInput.setTooltip(sDescriptionKey);
			this.DisabilityInput.setName(sDescriptionKey);
		},
		liveDisabilityDailogsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ValueDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ValueId", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseDisabilityDialog: function(oEvent) {
			this.DisabilityInput.setValue("");
		},
		/*	community f4 of basicDetails fragmet-start*/
		HandleRequestofMaritualStatus: function(oEvent) {
			var that = this;
			this.MaritualStatusInput = oEvent.getSource();
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestFor", sap.ui.model.FilterOperator.EQ, "MARTIALSTAT"));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/ValueHelpSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.MaritualStatusDialogFragment) {
						that.MaritualStatusDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.MaritualStatusDialog",
							that);
						that.getView().addDependent(that.MaritualStatusDialogFragment);
					}
					that.MaritualStatusDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.MaritualStatusDialogFragment.setModel(oModel, "MaritualStatusModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					if (error.responseText) {
						var message = JSON.parse(error.responseText).error.message.value;
						sap.m.MessageBox.error(message);
					}
				}
			});
		},
		ConfirmMaritualStatusDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDescriptionKey = oEvent.getParameter("selectedItem").getDescription();
			this.selecteCommunity = oEvent.getParameter("selectedItem").getBindingContext("MaritualStatusModel").getProperty();
			this.MaritualStatusInput.setValue(sValue);
			this.MaritualStatusInput.setTooltip(sDescriptionKey);
			this.MaritualStatusInput.setName(sDescriptionKey);
		},
		liveMaritualStatusDialogsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ValueDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ValueId", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseMaritualStatusDialog: function(oEvent) {
			this.MaritualStatusInput.setValue("");
		},

		/*	community f4 of basicDetails fragmet-end*/

		/*	community f4 of basicDetails fragmet-start*/
		HandleRequestofCommunity: function(oEvent) {
			var that = this;
			this.CommunityInput = oEvent.getSource();
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestFor", sap.ui.model.FilterOperator.EQ, "RELIGION"));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/ValueHelpSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.CommunityDialogFragment) {
						that.CommunityDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.CommunityTypeDialog",
							that);
						that.getView().addDependent(that.CommunityDialogFragment);
					}
					that.CommunityDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.CommunityDialogFragment.setModel(oModel, "CommunityDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					if (error.responseText) {
						var message = JSON.parse(error.responseText).error.message.value;
						sap.m.MessageBox.error(message);
					}
				}
			});
		},
		ConfirmCommunityDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDescriptionKey = oEvent.getParameter("selectedItem").getDescription();
			this.selecteCommunity = oEvent.getParameter("selectedItem").getBindingContext("CommunityDialogModel").getProperty();
			this.CommunityInput.setValue(sValue);
			this.CommunityInput.setTooltip(sDescriptionKey);
			this.CommunityInput.setName(sDescriptionKey);
		},
		liveCommunityDialogsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ValueDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ValueId", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseCommunityDialog: function(oEvent) {
			this.CommunityInput.setValue("");
		},

		/*	community f4 of basicDetails fragmet-end*/
		/*		basic details fragment validlatons -end*/

		// Group Transfer Details functions-  start
		//Cds view of  F4 -start
		onnewPositionValueHelp: function(oEvent) {
			// this.PathPosition = oEvent.getSource().getParent().getBindingContextPath();

			// this.CDSName = "ZC_VACANT_POSITION";
			// var CDSNameType = "ZC_VACANT_POSITIONType";
			// if (!this._smartValueHelpDialogPosition) {
			// 	this._smartValueHelpDialogPosition = sap.ui.xmlfragment(
			// 		"com.hcm.dashZHCM_DASHBOARD.view.fragments.SmartValueHelpDialog",
			// 		this);
			// 	this.getView().addDependent(this._smartValueHelpDialogPosition);
			// }
			// $.sap.BusyDialog.open();
			// var sSmartFilterBarId = this._smartValueHelpDialogPosition.getContent()[0].getIdForLabel();
			// var oSmartTable = this._smartValueHelpDialogPosition.getContent()[1];
			// oSmartTable.setSmartFilterId(sSmartFilterBarId);
			// this._smartValueHelpDialogPosition.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			// // this._smartValueHelpDialog.setDefaultBindingMode("OneWay");
			// this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/DialogTitle", "Select Vacant Position");
			// this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableEntitySet", this.CDSName);
			// this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/FilterBarEntitySet", this.CDSName);
			// this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableHeader",
			// 	"Select Vacant Position");
			// this._smartValueHelpDialogPosition.open();
			// $.sap.BusyDialog.close();
			this.empPosition = oEvent.getSource();
			if (!this._smartValuehelpDialogPosition) {
				this._smartValuehelpDialogPosition = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.EmployeePositionDialog",
					this);
				this.getView().addDependent(this._smartValuehelpDialogPosition);
			}
			this.getView().addDependent(this._smartValuehelpDialogPosition);

			var oList = sap.ui.getCore().byId("IdEmpPositionGrouTrans");
			// .getAggregation("_dialog").getContent()[1];
			var oBindingInfo = oList.getBindingInfo("items"); // or "rows"
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom = {};
			oList.bindItems(oBindingInfo);

			this._smartValuehelpDialogPosition.open();
		},

		handleSearchPosition: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			/*	var oFilter = [new sap.ui.model.Filter("Plans", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("plans_text", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("persa_text", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("persa", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("btrtl", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("btrtl_text", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("persg", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("persg_text", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("persk", sap.ui.model.FilterOperator.Contains, sValue),
					//ne filters added
					new sap.ui.model.Filter("employee_no", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("employee_name", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("fundcenter", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("fundcenter_text", sap.ui.model.FilterOperator.Contains, sValue)
				];
				var oBinding = oEvent.getParameter("itemsBinding");
				oBinding.filter(new sap.ui.model.Filter({
					filters: oFilter,
					and: false
				}), sap.ui.model.FilterType.Application);*/

			var oList = sap.ui.getCore().byId("IdEmpPositionGrouTrans");
			var oBindingInfo = oList.getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom.search = sValue;
			oList.bindItems(oBindingInfo);
		},
		handlePositionConfirm: function(oEvent) {
			var oSelectedObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
			this.empPosition.setValue(oSelectedObject.Plans + "(" + oSelectedObject.plans_text + ")");

			// 	var selectedPostion = oEvent.getSource().getState(); 
			var itempath = this.empPosition.getParent().getBindingContext("GroupTransferModel").getPath();
			//	oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getPath();
			// var selectedobj = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getObject();

			var GroupTransferModel = this.getView().getModel("GroupTransferModel");
			GroupTransferModel.setProperty(itempath + "/ToPositionId", oSelectedObject.Plans);
			GroupTransferModel.setProperty(itempath + "/ToPositionName", oSelectedObject.plans_text);
			GroupTransferModel.setProperty(itempath + "/ToOfficeId", oSelectedObject.orgeh);
			GroupTransferModel.setProperty(itempath + "/ToOfficeName", oSelectedObject.orgeh_text);
			GroupTransferModel.setProperty(itempath + "/ToDdoId", oSelectedObject.fundcenter);
			GroupTransferModel.setProperty(itempath + "/ToDdoName", oSelectedObject.fundcenter_text);
			this.getView().setModel(GroupTransferModel, "GroupTransferModel");
			this._smartValuehelpDialogPosition.close();

		},
		handleEmpPositionClose: function(oEvent) {
			this._smartValuehelpDialogPosition.close();
		},
		// search added for ToSelectNiewApproverfragment of - Proces flow pop up of new position F4 -start
		searchapprover: function(evt) {
			var sValue = evt.getParameters().value;
			evt.getSource().getBinding("items").filter([new sap.ui.model.Filter([new sap.ui.model.Filter("employee_no", sap.ui.model.FilterOperator
					.Contains, sValue), new sap.ui.model.Filter("fundcenter_text", sap.ui.model.FilterOperator.Contains, sValue), new sap.ui.model
				.Filter("department_id", sap.ui.model.FilterOperator.Contains, sValue), new sap.ui.model.Filter("employee_name", sap.ui.model
					.FilterOperator.Contains, sValue), new sap.ui.model.Filter("Plans", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("plans_text", sap.ui.model.FilterOperator.Contains, sValue), new sap.ui.model.Filter(
					"orgeh", sap.ui.model.FilterOperator.Contains, sValue), new sap.ui.model.Filter("orgeh_text", sap.ui.model.FilterOperator
					.Contains, sValue), new sap.ui.model.Filter("HOO_FLAG", sap.ui.model.FilterOperator
					.Contains, sValue), new sap.ui.model.Filter("city", sap.ui.model.FilterOperator
					.Contains, sValue), new sap.ui.model.Filter("fundcenter", sap.ui.model.FilterOperator
					.Contains, sValue)
			], false)]);
		},
		// approver Position selection purpose add - ApproverPositionDailog fragment- start - ProcessFlow of F4 CDS View
		onnewApprovPositionValueHelp: function(oEvent) {
			this.PathPosition = oEvent.getSource().getParent().getBindingContextPath();

			this.ApprovPosition = oEvent.getSource();
			if (!this._smartValuehelpDialogApprover) {
				this._smartValuehelpDialogApprover = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.ApproverPositionDialog",
					this);
				this.getView().addDependent(this._smartValuehelpDialogApprover);
			}
			this.getView().addDependent(this._smartValuehelpDialogApprover);
			var oList = sap.ui.getCore().byId("IdApprovPosTabDail");
			// .getAggregation("_dialog").getContent()[1];
			var oBindingInfo = oList.getBindingInfo("items"); // or "rows"
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom = {};
			oList.bindItems(oBindingInfo);
			this._smartValuehelpDialogApprover.open();
		},

		handleSearchApprovePosition: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			// var oFilter = [new sap.ui.model.Filter("Plans", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("plans_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("department_id", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("orgeh", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("orgeh_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("employee_no", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("employee_name", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("fundcenter", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("fundcenter_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("HOO_FLAG", sap.ui.model.FilterOperator.Contains, sValue)
			// ];
			// var oBinding = oEvent.getParameter("itemsBinding");
			// oBinding.filter(new sap.ui.model.Filter({
			// 	filters: oFilter,
			// 	and: false
			// }), sap.ui.model.FilterType.Application);

			// IdApprovPosTabDail
			var oList = sap.ui.getCore().byId("IdApprovPosTabDail");
			var oBindingInfo = oList.getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom.search = sValue;
			oList.bindItems(oBindingInfo);
		},
		handleApprvPositionConfirm: function(oEvent) {

			var oSelectedObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
			this.ApprovPosition.setValue(oSelectedObject.Plans + "(" + oSelectedObject.plans_text + ")");
			// for binding data of position slected - cfms_ctm_npv -start
			var path = this.PathPosition.split("/")[2]
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].OfficeName = oSelectedObject.orgeh_text;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].OfficeId = oSelectedObject.orgeh;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].PositionName = oSelectedObject.plans_text;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].PositionId = oSelectedObject.Plans;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].EmpName = oSelectedObject.employee_name;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].Pernr = oSelectedObject.employee_no;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].AddedOn = new Date();
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].AddedTime = null;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].UpdatedOn = null;
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].UpdatedTime = null;
			this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
			this.getOwnerComponent().getModel("ApproverPathModel").refresh();
			// for binding data of position slected - cfms_ctm_npv -end
			this._smartValuehelpDialogApprover.close();

		},
		handleApprvPositionClose: function(oEvent) {
			this._smartValuehelpDialogApprover.close();
		},
		// approver Position selection purpose add - ApproverPositionDailog fragment- end	

		// HandleRequestDesiginationApproverPath: function(oEvent) {
		// 	this.RowId = oEvent.getSource().getId().split("-")[2];
		// 	if (this.NewApproverDialog === undefined) {
		// 		this.NewApproverDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.ToSelectNewApprover", this);
		// 	}
		// 	this.getView().addDependent(this.NewApproverDialog);
		// 	$.sap.BusyDialog.open();
		// 	this.getOwnerComponent().getModel().read("/ZC_PROCESSOR_SEARCH", {
		// 		success: function(oData, oResponse) {
		// 			$.sap.BusyDialog.close();
		// 			this.CDSName = "ZC_PROCESSOR_SEARCH";
		// 			var jsonModel = new sap.ui.model.json.JSONModel(oData.results);

		// 			this.NewApproverDialog.setModel(jsonModel, "smartValueHelpDialogSettings");
		// 			this.NewApproverDialog.open();
		// 			this.NewApproverDialog.setTitle("Select Next Approver ( " + oData.results.length + " )");
		// 		}.bind(this),
		// 		error: function(error) {
		// 			$.sap.BusyDialog.close();
		// 			if (error.headers["sap-message"]) {
		// 				if (JSON.parse(error.headers["sap-message"]).severity === "success") {
		// 					sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
		// 				} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
		// 					sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
		// 					return false;
		// 				}
		// 			}
		// 		}
		// 	});
		// },
		// search added for ToSelectNiewApproverfragment of - Proces flow pop up of new position F4 -end
		onPressCancelCloseVHDDO: function(oEvent) {
			if (this.CDSName === "ZC_VACANT_POSITION") {
				this._smartValueHelpDialogPosition.close();
			} else if (this.CDSName === "ZC_PROCESSOR_SEARCH") {
				this._smartValueHelpDialogApprover.close();
			} else if (this.CDSName === "ZC_EmployeeValueHelp") {
				this._smartValueHelpDialogEmployeeGroup.close();
			} else if (oEvent.getSource().getParent().getTitle() === "IFSC Code") {
				this._smartValueHelpDialog.close();
			}

		},
		handleSmartValueHelpSelectionForDDO: function(oEvent) {
			if (oEvent.getSource().getSelectedIndex() !== -1) {
				var oSelectedObject = oEvent.getSource().getContextByIndex(oEvent.getSource().getSelectedIndex()).getObject();
				// this.getView().getModel("GroupTransferModel").getData();
				if (this.CDSName === "ZC_VACANT_POSITION") {
					// that.GroupTransferModel
					// this.getOwnerComponent().getModel("DetailTransferModel").getData() 
					var path = this.PathPosition.slice("/")[1];

					this.GroupTransferModel.getData()[path].ToPositionId = oSelectedObject.Plans;
					this.GroupTransferModel.getData()[path].ToJobId = oSelectedObject.job_Code;
					this.GroupTransferModel.getData()[path].ToOfficeName = oSelectedObject.orgeh_text;
					this.GroupTransferModel.getData()[path].ToOfficeId = oSelectedObject.orgeh;
					this.GroupTransferModel.getData()[path].ToDdoName = oSelectedObject.fundcenter_text;
					this.GroupTransferModel.getData()[path].ToDdoId = oSelectedObject.fundcenter;
					this.GroupTransferModel.getData()[path].ToPositionName = oSelectedObject.plans_text;
					var data = this.getView().getModel("GroupTransferModel").getData();
					this.GroupTransferModel.setData(data);

					// this.GroupTransferModel.getData().setProperty(this.PathPosition + "/ToPositionId", oSelectedObject.Plan);
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToJobId = oSelectedObject.job_Code;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToOfficeName = oSelectedObject.orgeh_text;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToOfficeId = oSelectedObject.orgeh;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToDdoName = oSelectedObject.fundcenter_text;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToDdoId = oSelectedObject.fundcenter;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToPositionName = oSelectedObject.plans_text;
					// this.getOwnerComponent().getModel("DetailTransferModel").getData().ToPositionId = oSelectedObject.Plans;
					// this.getOwnerComponent().getModel("DetailTransferModel").updateBindings();
					// this.getOwnerComponent().getModel("DetailTransferModel").refresh();
					this._smartValueHelpDialogPosition.close();
				} else if (this.CDSName === "ZC_PROCESSOR_SEARCH") {
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].OfficeName = oSelectedObject.orgeh_text;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].OfficeId = oSelectedObject.orgeh;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].PositionName = oSelectedObject.plans_text;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].PositionId = oSelectedObject.Plans;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].EmpName = oSelectedObject.employee_name;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].Pernr = oSelectedObject.employee_no;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].AddedOn = new Date();
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].AddedTime = null;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].UpdatedOn = null;
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].UpdatedTime = null;
					this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
					this.getOwnerComponent().getModel("ApproverPathModel").refresh();
					this._smartValueHelpDialogApprover.close();
				} else if (this.CDSName === "ZC_EmployeeValueHelp") {
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].OfficeName = oSelectedObject.orgeh_text;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].OfficeId = oSelectedObject.orgeh;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].PositionName = oSelectedObject.plans_text;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].PositionId = oSelectedObject.Plans;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].EmpName = oSelectedObject.employee_name;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].Pernr = oSelectedObject.employee_no;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].AddedOn = new Date();
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].AddedTime = null;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].UpdatedOn = null;
					// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.RowId].UpdatedTime = null;
					// this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
					// this.getOwnerComponent().getModel("ApproverPathModel").refresh();
					oSelectedObject.EmployeeName;
					oSelectedObject.EmployeeNumber;
					oSelectedObject.FundsCenterName;
					oSelectedObject.OrganizationUnit;
					oSelectedObject.OrganizationUnitText;
					oSelectedObject.PositionID;
					oSelectedObject.PositionText;
					var data = this.getView().getModel("GroupTransferModel").getData();
					// this.GroupTransferModel.getData();
					var empObj = {
						Sno: "",
						EmployeeName: oSelectedObject.EmployeeName,
						Pernr: oSelectedObject.EmployeeNumber,
						FromPositionName: oSelectedObject.PositionText,
						FromPositionId: oSelectedObject.PositionID,
						FromOfficeName: oSelectedObject.OrganizationUnitText,
						FromOfficeId: oSelectedObject.OrganizationUnit,
						FromDdoName: oSelectedObject.FundsCenterName,
						FromDdoId: "",
						WithPosition: true,
						ToPositionName: "",
						ToPositionId: "",
						ToOfficeName: "",
						ToDdoName: "",
						ToDdoId: "",
						TransStatus: "",
						Remarks: ""
					};
					data.push(empObj);
					// this.GroupTransferModel.setModel(data);
					var data = this.getView().getModel("GroupTransferModel").getData();
					this.GroupTransferModel = new sap.ui.model.json.JSONModel(data);
					this.getView().setModel(this.GroupTransferModel, "GroupTransferModel");
					// this.GroupTransferModel.setData(data);
					this.getView().byId("idTableGroupTransferRec").setText("Total Records: " + data.length);
					this._smartValueHelpDialogEmployeeGroup.close();
				}

			}
		},
		HandleCDSPositionRequest: function(oEvent) {
			this.CDSName = "ZC_VACANT_POSITION";
			var CDSNameType = "ZC_VACANT_POSITIONType";
			if (!this._smartValueHelpDialogPosition) {
				this._smartValueHelpDialogPosition = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.SmartValueHelpDialog",
					this);
				this.getView().addDependent(this._smartValueHelpDialogPosition);
			}
			$.sap.BusyDialog.open();
			var sSmartFilterBarId = this._smartValueHelpDialogPosition.getContent()[0].getIdForLabel();
			var oSmartTable = this._smartValueHelpDialogPosition.getContent()[1];
			oSmartTable.setSmartFilterId(sSmartFilterBarId);
			this._smartValueHelpDialogPosition.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			// this._smartValueHelpDialog.setDefaultBindingMode("OneWay");
			this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/DialogTitle", "Select Vacant Position");
			this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableEntitySet", this.CDSName);
			this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/FilterBarEntitySet", this.CDSName);
			this._smartValueHelpDialogPosition.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableHeader",
				"Select Vacant Position");
			this._smartValueHelpDialogPosition.open();
			$.sap.BusyDialog.close();
		},
		//Cds view of  F4 - end
		changewithPositon: function(oEvent) {
			var selectedPostion = oEvent.getSource().getState(); //  oEvent.getSource().getSelectedKey();
			var itempath = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getPath();
			var selectedobj = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getObject();

			var GroupTransferModel = this.getView().getModel("GroupTransferModel");
			GroupTransferModel.setProperty(itempath + "/WithPosition", selectedPostion);
			this.getView().setModel(GroupTransferModel, "GroupTransferModel");

		},
		employeeComments: function(oEvent) {
			var selectedobj = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getObject();
			var spath = oEvent.getSource().getParent().getBindingContextPath();

			if (!this._smartValueHelpDialogEmoComments) {
				this._smartValueHelpDialogEmoComments = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.GroupTransEmpComments",
					this);
				this.getView().addDependent(this._smartValueHelpDialogEmoComments);
			}
			this.SelectedObjComments = selectedobj;
			this._smartValueHelpDialogEmoComments.setTitle(selectedobj.EmployeeName + " " + "for Comments");
			sap.ui.getCore().byId("employRemarksId").setValue(selectedobj.Remarks);
			this._smartValueHelpDialogEmoComments.open();
		},

		empComentConfirm: function(oEvent) {
			this._smartValueHelpDialogEmoComments.close();
			var scomments = oEvent.getSource().getParent().getContent()[1].getValue();
			// var selectedobj = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getObject();
			this.SelectedObjComments.Remarks = scomments;
			/*	for backend call purpose adde - updated record to pass */
			this.SelectedObjComments.Operation = "MOD";
			this.CreateforGrpTransfer(this.SelectedObjComments);

		},
		OnPressCancel: function(oEvent) {
			// var selectedobj = oEvent.getSource().getParent().getBindingContext("GroupTransferModel").getObject();
			this._smartValueHelpDialogEmoComments.close();
			oEvent.getSource().getParent().getContent()[1].setValue("");

		},
		onDeleteGrouptransferEmpRow: function(oEvent) {
			var data = this.getView().getModel("GroupTransferModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
			} else {
				// var arry = [];
				// for (var i = 0; i < SelectedContes.length; i++) {

				// 	/*	for pusing records - start*/
				// 	if (SelectedContes[i].getProperty().__metadata) {
				// 		delete SelectedContes[i].getProperty().__metadata;
				// 	}
				// 	if (SelectedContes[i].getProperty().Requestdetails) {
				// 		delete SelectedContes[i].getProperty().Requestdetails;
				// 	}
				// 	arry.push(SelectedContes[i].getProperty());
				/*	for pusing records - end*/

				// var spath = SelectedContes[i].sPath.split("/")[1];
				// data.splice(parseInt(spath), 1);
				// 	SelectedContes[i].getObject().Operation = "DEL";

				// }
				// this.CreateforGrpTransfer(empObj);
				// this.getView().getModel("GroupTransferModel").setData(data);

				// var dModel = new sap.ui.model.odata.ODataModel(URL, true);
				var createPath = "/TransferSet";
				var oModel = this.getOwnerComponent().getModel();
				oModel.setUseBatch(true);
				oModel.setDeferredGroups(["editGroup"]);
				for (var i = 0; i < SelectedContes.length; i++) {
					// var ReqGuid = this.getOwnerComponent().getModel("DisplayPendingActionModel").getData().results[this.Selected[i].sPath.split(
					// 	"/")[
					// 	2]].RequestGuid;
					var obj = SelectedContes[i].getProperty();

					var sPath = "/TransferSet";
					obj.Operation = "DEL";
					// obj.RequestGuid = ReqGuid;
					oModel.create(sPath, obj, {
						groupId: "editGroup"
					});
				}

				$.sap.BusyDialog.open();

				// "/ButtonPropertySet(ButtonId='DELETE',RequestGuid='" + ReqGuid + "')", obj,
				var msg = "";
				oModel.submitChanges({
					// this.selectedArray,
					groupId: "editGroup",
					success: function(oData, oResponse) {
						$.sap.BusyDialog.close();
						this.groupTransferDetails(this.getView().getModel("StausModel").getData().Pernr, this.reqGuid);

					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								return false;
							}
						}
					}
				});

			}
			/*	this.simpleModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(this.simpleModel, "FamilyModel");*/

			// var data = aTable.getModel().getData().oInvoice;
			// var spath = oEvent.getSource().getBindingContext().sPath.split("/")[2];

			// for desable check box for selected items -strat
			// oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
			// 	var Operation = item.getBindingContext("GroupTransferModel").getProperty("Operation");
			// 	if (Operation === "DEL") {
			// 		var cb = item.$().find('.sapMCb');
			// 		var oCb = sap.ui.getCore().byId(cb.attr('id'));
			// 		oCb.setEnabled(false);
			// 	}
			// });
			// for desable check box for selected items -end
		},

		onAddEmployeeRow: function(oEvent) {

			if (!this._smartValueHelpDialogEmployeeGroup) {
				this._smartValueHelpDialogEmployeeGroup = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.EmployeeGroupTransferAddDialog",
					this);
				this.getView().addDependent(this._smartValueHelpDialogEmployeeGroup);
			}
			this._smartValueHelpDialogEmployeeGroup.open();

			/*this.CDSName = "ZC_EmployeeValueHelp";
			var CDSNameType = "ZC_EmployeeValueHelpType";
			if (!this._smartValueHelpDialogEmployeeGroup) {
				this._smartValueHelpDialogEmployeeGroup = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.SmartValueHelpDialog",
					this);
				this.getView().addDependent(this._smartValueHelpDialogEmployeeGroup);
			}
			$.sap.BusyDialog.open();
			var sSmartFilterBarId = this._smartValueHelpDialogEmployeeGroup.getContent()[0].getIdForLabel();
			var oSmartTable = this._smartValueHelpDialogEmployeeGroup.getContent()[1];
			oSmartTable.setSmartFilterId(sSmartFilterBarId);
			this._smartValueHelpDialogEmployeeGroup.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			// this._smartValueHelpDialog.setDefaultBindingMode("OneWay");
			this._smartValueHelpDialogEmployeeGroup.getModel("smartValueHelpDialogSettings").setProperty("/DialogTitle", "Select Employee");
			this._smartValueHelpDialogEmployeeGroup.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableEntitySet", this.CDSName);
			this._smartValueHelpDialogEmployeeGroup.getModel("smartValueHelpDialogSettings").setProperty("/FilterBarEntitySet", this.CDSName);
			this._smartValueHelpDialogEmployeeGroup.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableHeader",
				"Select Employee");
			this._smartValueHelpDialogEmployeeGroup.open();
			$.sap.BusyDialog.close();*/
		},

		handleSearchEmployee: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			/*	var oFilter = [new sap.ui.model.Filter("OrganizationUnit", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("OrganizationUnitText", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("EmployeeNumber", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("EmployeeName", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("PositionID", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("PositionText", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("FundsCenterName", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("FundsCenter", sap.ui.model.FilterOperator.Contains, sValue)
				];
				var oBinding = oEvent.getParameter("itemsBinding");
				oBinding.filter(new sap.ui.model.Filter({
					filters: oFilter,
					and: false
				}), sap.ui.model.FilterType.Application);*/

			//IdAddEmployeeTabDailog
			var oList = sap.ui.getCore().byId("IdAddEmployeeTabDailog");
			var oBindingInfo = oList.getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom.search = sValue;
			oList.bindItems(oBindingInfo);

		},
		handleEmployeeConfirm: function(oEvent) {
			var oSelectedObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
			//      oSelectedObject.EmployeeName;
			// oSelectedObject.EmployeeNumber;
			// oSelectedObject.FundsCenterName;
			// oSelectedObject.OrganizationUnit;
			// oSelectedObject.OrganizationUnitText;
			// oSelectedObject.PositionID;
			// oSelectedObject.PositionText;
			var data = this.getView().getModel("GroupTransferModel").getData();
			// this.GroupTransferModel.getData();
			var empObj = {
				Sno: "",
				EmployeeName: oSelectedObject.EmployeeName,
				Pernr: oSelectedObject.EmployeeNumber,
				FromPositionName: oSelectedObject.PositionText,
				FromPositionId: oSelectedObject.PositionID,
				FromOfficeName: oSelectedObject.OrganizationUnitText,
				FromOfficeId: oSelectedObject.OrganizationUnit,
				FromDdoName: oSelectedObject.FundsCenterName,
				FromDdoId: "",
				WithPosition: true,
				ToPositionName: "",
				ToPositionId: "",
				ToOfficeName: "",
				ToDdoName: "",
				ToDdoId: "",
				TransStatus: "",
				Remarks: "",
				Operation: "INS",
				RequestGuid: this.reqGuid,
				ReferenceNumber: this.getView().getModel("StausModel").getData().ReferenceNumber
			};
			// data.push(empObj);
			// var data = this.getView().getModel("GroupTransferModel").getData();
			// this.GroupTransferModel = new sap.ui.model.json.JSONModel(data);
			// this.getView().setModel(this.GroupTransferModel, "GroupTransferModel");
			// this.getView().byId("idTableGroupTransferRec").setText("Total Records: " + data.length);
			this.CreateforGrpTransfer(empObj);
			this._smartValueHelpDialogEmployeeGroup.close();

		},
		handleEmployeeClose: function(oEvent) {
			this._smartValueHelpDialogEmployeeGroup.close();
		},
		CreateforGrpTransfer: function(payload) {
			var ReqRootPayload = payload; // this.getOwnerComponent().getModel("GroupTransferModel").getData();

			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().create("/TransferSet", ReqRootPayload, {
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					this.groupTransferDetails(this.getView().getModel("StausModel").getData().Pernr, this.reqGuid);
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		// Group Transfer Details functions- end

		/*	Annual Increament Details functions- srart*/
		annualComments: function(oEvent) {
			var selectedobj = oEvent.getSource().getParent().getBindingContext("AnnualIncrementModel").getObject();
			var spath = oEvent.getSource().getParent().getBindingContext("AnnualIncrementModel").sPath;
			// oEvent.getSource().getParent().getBindingContextPath();

			if (!this._smartValueHelpDialogAnnualComments) {
				this._smartValueHelpDialogAnnualComments = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.AnnualIncreamentComments",
					this);
				this.getView().addDependent(this._smartValueHelpDialogAnnualComments);
			}
			this.SelectedAnnualComments = selectedobj;
			this._smartValueHelpDialogAnnualComments.setTitle(selectedobj.EmployeeName + " " + "for Comments");
			sap.ui.getCore().byId("annualRemarksId").setValue(selectedobj.Remarks);
			this._smartValueHelpDialogAnnualComments.open();
		},
		annualComentConfirm: function(oEvent) {
			this._smartValueHelpDialogAnnualComments.close();
			var scomments = oEvent.getSource().getParent().getContent()[1].getValue();
			// var selectedobj = oEvent.getSource().getParent().getBindingContext("AnnualIncrementModel").getObject();
			this.SelectedAnnualComments.Remarks = scomments;

		},
		OnannualCancel: function(oEvent) {
			// var selectedobj = oEvent.getSource().getParent().getBindingContext("AnnualIncrementModel").getObject();
			this._smartValueHelpDialogAnnualComments.close();
			oEvent.getSource().getParent().getContent()[1].setValue("");

		},

		/*	Annual Increament Details functions- srart*/

		/*Leave application fragment read call for tabs- cfms_Ctm_npv -start*/
		onSelIcTabLeaveApp: function(oEvent) {
			var selectTab = oEvent.getSource().getSelectedKey();
			if (selectTab === "ReqOverView") {
				this.leaveRequestOverview();

			} else if (selectTab === "LeaveBalance") {
				this.leaveTimeAccount();
			}
		},
		leaveRequestOverview: function() {
			this.oModelLeave = this.getOwnerComponent().getModel("leavereq");

			var that = this;
			// ContactDetailsSet
			// BasicDetailSet
			var oEntitySet = "/LeaveRequestSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				// new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
				// 	.EQ, guid),
				new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator
					.EQ, this.getView().getModel("StausModel").getData().Pernr)
			];

			// this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV", true);
			// this.oModel.setUseBatch(false);
			this.oBusy.open();
			this.oModelLeave.setUseBatch(false);
			this.oModelLeave.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData) {
					that.oBusy.close();

					var formdata = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(formdata, "leaveRequestOverviewModel");
					// that.getView().byId("idTableRec").setText("Total Records: " + oData.results.length);

				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});

		},
		leaveTimeAccount: function() {
			this.oModelLeave = this.getOwnerComponent().getModel("leavereq");

			var that = this;
			// ContactDetailsSet
			// BasicDetailSet
			var oEntitySet = "/TimeAccountSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				// new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
				// 	.EQ, guid),
				new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator
					.EQ, this.getView().getModel("StausModel").getData().Pernr)
			];
			// this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV", true);
			// this.oModel.setUseBatch(false);
			this.oBusy.open();
			this.oModelLeave.setUseBatch(false);
			this.oModelLeave.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData) {
					that.oBusy.close();
					var formdata = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(formdata, "leaveTimeAccountwModel");
					// that.getView().byId("idTableRec").setText("Total Records: " + oData.results.length);

				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});

		},
		/*Leave application fragment read call for tabs- cfms_Ctm_npv -end*/
		/*on behalf of button call - cfms_Ctm_npv -start*/
		onONBEHALF: function(oEvent) {
			var editBtnText = this.getView().byId("idonONBEHALF").getText();

			if (editBtnText == "Cancel on Behalf of") {
				// var onbehalf = this.getView().getModel("OnbehalfModel").getData();
				// var message = "You are trying to cancel this application on behalf of" + onbehalf.LogonPernr;
				// sap.m.MessageBox.confirm(message, {
				// 	actions: ["YES", "NO"],
				// 	onClose: function(sAction) {
				// 		if (sAction === "YES") {

				this.getView().byId("idonONBEHALF").setText("Request on Behalf of");
				this.getView().byId("idonONBEHALF").setIcon("sap-icon://accept");
				this.getView().byId("idonONBEHALF").setType("Accept");
				// 	oEvent.getSource().setIcon("sap-icon:sys-cancel");
				// oEvent.getSource().setType("Reject");
				var onbehalf = this.getView().getModel("OnbehalfModel").getData();
				var guid = "INITIAL_GUID";
				// this.SuspensionDetails(onbehalf.LogonPernr, guid);
				if (onbehalf.ApplicationName === "ELCM_YI_ALL_SINGLE") {
					this.SuspensionDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName === "ESS_Z301_SINGLE") {
					this.basicDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z303_SINGLE") {
					var result = onbehalf.FamilyMembersSet.results[0].Requestdetails;
					this.FamilyDetails(onbehalf.LogonPernr, guid, "FamilyDetails");
				} else if (onbehalf.ApplicationName == "ESS_Z322_SINGLE") {
					this.contactDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z316_SINGLE") {
					this.AdressDetals(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z334_SINGLE") {
					this.AccountDetals(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z302_SINGLE") {
					this.LeaveDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z333_SINGLE") {
					this.surLeaveDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_Y5_ALL_GROUP") {
					var pernr = ""; // for group Transfer
					var RequestGuid = onbehalf.RequestGuid;
					this.groupTransferDetails(pernr, RequestGuid);
				} else if (onbehalf.ApplicationName == "ELCM_YE_03_GROUP") {
					//annual increment
					this.AnnualIncrementDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_YI_ALL_SINGLE") {
					//Suspenstion
					this.SuspensionDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_Y7_ALL_SINGLE") {
					//Deputation out
					this.DeputyDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_Y6_ALL_SINGLE") {
					//Deputation in
					this.DeputyInDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_YX_ALL_SINGLE") {
					//OrgReassignment
					this.OrgReassignDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_YE_ALL_SINGLE") {
					// Pay change details
					this.PaychangeDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_Y3_ALL_SINGLE") {
					// Probation details
					this.ProbationDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ELCM_YN_ALL_SINGLE") {
					// Probation details
					this.FacInOutDetails(onbehalf.LogonPernr, guid);
				} else if (onbehalf.ApplicationName == "ESS_Z633_SINGLE") {
					this.LoansDetails(onbehalf.LogonPernr, guid, "/GPFLoanDetailsSet");
				}
				/*	for heading of title changeing -start*/
				var inboxNav = this.getView().getModel("inboxNav");
				var parmeters = this.getOwnerComponent().oComponentData.startupParameters;
				var decodedEmpinf = decodeURIComponent(parmeters.empInf[0] + "(" + parmeters.empno[0] + ")");
				// var decodedEmpinf = "On Behalf of" + "(" + oData.OnbehalfPernr + ")";
				inboxNav.setProperty("/empInf", decodedEmpinf);
				/*	for heading of title changeing -end*/
				sap.m.MessageBox.show("this application on behalf mode is cancled.");
				return;

				// 		}
				// 	}.bind(this)
				// });

			}
			var Filters = [];
			if (this.DisplayDDO !== "") {
				Filters.push(new sap.ui.model.Filter("FundsCenter", sap.ui.model.FilterOperator.EQ, this.DisplayDDO));
			}

			if (this.DisplayOffice) {
				for (var k = 0; k < this.DisplayOffice.length; k++) {
					Filters.push(new sap.ui.model.Filter("OrganizationUnit", sap.ui.model.FilterOperator.EQ, this.DisplayOffice[k].getProperty("text")));
				}
			}

			if (this.DisplayJob) {
				for (var k = 0; k < this.DisplayJob.length; k++) {
					Filters.push(new sap.ui.model.Filter("JobID", sap.ui.model.FilterOperator.EQ, this.DisplayJob[k].getProperty("text")));
				}
			}
			if (!this.DisplayEmployeeFragment) {
				this.DisplayEmployeeFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DisplayEmployeeDialog", this);
				this.getView().addDependent(this.DisplayEmployeeFragment);
			}
			// this.DisplayEmployeeFragment.getBinding("items").filter(Filters);
			this.DisplayEmployeeFragment.open();

		},
		ConfirmDisplayDialog: function(oEvent) {
			var SelectedItems = oEvent.getParameter("selectedItems");
			var Title = oEvent.getSource().getTitle();
			var Office = this.getView().byId("idDisplayOfficeHelp");
			// if (Title.includes("Office")) {
			// 	Office.removeAllTokens();
			// }
			// var Job = this.getView().byId("idDisplayJob");
			// if (Title.includes("Job")) {
			// 	Job.removeAllTokens();
			// }
			// var Emp = this.getView().byId("idDisplayEmpHelp");
			// if (Title.includes("Employee")) {
			// 	Emp.removeAllTokens();
			// }
			SelectedItems.find(function(item) {
				this.selectedEmp = item.getBindingContext().getProperty("EmployeeNumber")
					// if (Title.includes("DDO")) {
					// 	this.DDOInput.setValue(item.getBindingContext().getProperty("FundsCenter") + " (" + item.getBindingContext().getProperty(
					// 		"FundsCenterName") + ")");
					// 	this.DDOInput.setTooltip(item.getBindingContext().getProperty("FundsCenter") + " (" + item.getBindingContext().getProperty(
					// 		"FundsCenterName") + ")");
					// 	this.DisplayDDO = item.getBindingContext().getProperty("FundsCenter");
					// }
					// if (Title.includes("Office")) {
					// 	Office.addToken(new sap.m.Token({
					// 		text: item.getBindingContext().getProperty("OrganizationUnit")
					// 	}));
					// 	this.DisplayOffice = Office.getTokens();
					// }
					// if (Title.includes("Job")) {
					// 	Job.addToken(new sap.m.Token({
					// 		text: item.getBindingContext().getProperty("JobID")
					// 	}));
					// 	this.DisplayJob = Job.getTokens();
					// }
					// if (Title.includes("Employee")) {
					// 	Emp.addToken(new sap.m.Token({
					// 		text: item.getBindingContext().getProperty("EmployeeNumber")
					// 	}));
					// 	this.DisplayEmployee = Emp.getTokens();
					// }
			}.bind(this));
			var appName = this.getView().getModel("StausModel").getData().ApplicationName;
			this.onBehalfReadEmp(this.selectedEmp, appName);
			// this.off_man = this.getView().getModel("DDODisplayModel").oData.results[oEvent.getSource()._aSelectedItems[0].oBindingContexts.DDODisplayModel
			// 	.sPath.split("/")[2]].OfficeMandatory;
			// if (this.off_man === true) {
			// 	this.getView().byId("lbl_office").setRequired(true);
			// } else {
			// 	this.getView().byId("lbl_office").setRequired(false);
			// }
			// if (this.DDOF4) {
			// 	this.off_man = this.getView().getModel("DDODisplayModel").oData.results[oEvent.getSource()._aSelectedItems[0].oBindingContexts.DDODisplayModel
			// 		.sPath.split("/")[2]].OfficeMandatory;
			// 	if (this.off_man === true) {
			// 		this.getView().byId("lbl_office").setRequired(true);
			// 	} else {
			// 		this.getView().byId("lbl_office").setRequired(false);
			// 	}
			// 	this.DisplayDDO = SelectedItem.getTitle();
			// 	this.getView().byId("idDisplayDDohelp").setValue(SelectedItem.getDescription() + "(" + SelectedItem.getTitle() + ")");
			// 	this.getView().byId("idDisplayDDohelp").setTooltip(SelectedItem.getDescription() + "(" + SelectedItem.getTitle() + ")");
			// } else if (this.OfficeF4) {
			// 	// this.DisplayOffice = SelectedItem.getTitle();
			// 	// this.getView().byId("idDisplayOfficeHelp").setValue(SelectedItem.getDescription() + "(" + SelectedItem.getTitle() + ")");
			// 	var sPath = oEvent.getParameter("selectedContexts");
			// 	var sop = this.getView().byId("idDisplayOfficeHelp");
			// 	this.getView().byId("idDisplayOfficeHelp").mAggregations.tokenizer.mAggregations.tokens = "";
			// 	sPath.map(function(oContext) {
			// 		sop.addToken(new sap.m.Token({
			// 			text: oContext.getObject().OrganizationUnit
			// 		}));
			// 	});
			// 	this.DisplayOffice = sop.getTokens();
			// } else if (this.JobF4) {
			// 	// this.DisplayJob = SelectedItem.getTitle();
			// 	// this.getView().byId("idDisplayJob").setValue(SelectedItem.getDescription() + "(" + SelectedItem.getTitle() + ")");
			// 	var sPath = oEvent.getParameter("selectedContexts");
			// 	var sop = this.getView().byId("idDisplayJob");
			// 	this.getView().byId("idDisplayJob").mAggregations.tokenizer.mAggregations.tokens = "";
			// 	sPath.map(function(oContext) {
			// 		sop.addToken(new sap.m.Token({
			// 			text: oContext.getObject().JobID
			// 		}));
			// 	});
			// 	this.DisplayJob = sop.getTokens();
			// } else if (this.EmployeeF4) {
			// 	var sPath = oEvent.getParameter("selectedContexts");
			// 	var sop = this.getView().byId("idDisplayEmpHelp");
			// 	this.getView().byId("idDisplayEmpHelp").mAggregations.tokenizer.mAggregations.tokens = "";
			// 	sPath.map(function(oContext) {
			// 		sop.addToken(new sap.m.Token({
			// 			text: oContext.getObject().EmployeeNumber
			// 		}));
			// 	});
			// 	this.DisplayEmployee = sop.getTokens();
			// }
		},
		onLiveChangeSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var Title = oEvent.getSource().getTitle();
			var oBindingInfo = oEvent.getSource().getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			if (sValue === "" && Title.includes("DDO")) {
				var sorter = new sap.ui.model.Sorter("Seqnr", false);
				// this.DisplayDDOFragment.getBinding("items").sort(sorter);
				oBindingInfo.binding.sort(sorter);
			}
			oBindingInfo.parameters.custom.search = sValue;
			oEvent.getSource().bindItems(oBindingInfo);
		},
		onBehalfReadEmp: function(empno, appName) {
			var that = this;
			var logOnPerner = this.getView().getModel("StausModel").getData().Pernr;
			var oEntitySet = "/OnbehalfServiceSet(LogonPernr='" + logOnPerner + "',ApplicationName='" + appName + "',OnbehalfPernr='" + empno +
				"')";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [

				new sap.ui.model.Filter("ApplicationName", sap.ui.model.FilterOperator
					.EQ, appName),
				new sap.ui.model.Filter("LogonPernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				// filters: aFilters,
				success: function(oData, response) {
					that.oBusy.close();
					if (response.headers['sap-message']) {
						var responseHeader = response.headers['sap-message'];
						var successMessage = JSON.parse(responseHeader).message;
						sap.m.MessageBox.success(successMessage);
					}
					var Onbehalf = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(Onbehalf, "OnbehalfModel");
					that.OnbehalfPernr = oData.OnbehalfPernr;
					if (oData.MessageType === "S") {
						sap.m.MessageBox.confirm(oData.Message, {
							actions: ["YES", "NO"],
							onClose: function(sAction) {
								if (sAction === "YES") {
									var guid = "INITIAL_GUID";
									if (oData.ApplicationName === "ELCM_YI_ALL_SINGLE") {
										that.SuspensionDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName === "ESS_Z301_SINGLE") {
										that.basicDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ESS_Z303_SINGLE") {
										var result = oData.FamilyMembersSet.results[0].Requestdetails;
										that.FamilyDetails(oData.OnbehalfPernr, guid, "FamilyDetails");
									} else if (oData.ApplicationName == "ESS_Z322_SINGLE") {
										that.contactDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ESS_Z316_SINGLE") {
										that.AdressDetals(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ESS_Z334_SINGLE") {
										that.AccountDetals(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ESS_Z302_SINGLE") {
										that.LeaveDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ESS_Z333_SINGLE") {
										that.surLeaveDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_Y5_ALL_GROUP") {
										var pernr = ""; // for group Transfer
										var RequestGuid = oData.RequestGuid;
										that.groupTransferDetails(pernr, RequestGuid);
									} else if (oData.ApplicationName == "ELCM_YE_03_GROUP") {
										//annual increment
										that.AnnualIncrementDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_YI_ALL_SINGLE") {
										//Suspenstion
										that.SuspensionDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_Y7_ALL_SINGLE") {
										//Deputation out
										that.DeputyDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_Y6_ALL_SINGLE") {
										//Deputation in
										that.DeputyInDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_YX_ALL_SINGLE") {
										//OrgReassignment
										that.OrgReassignDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_YE_ALL_SINGLE") {
										// Pay change details
										that.PaychangeDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_Y3_ALL_SINGLE") {
										// Probation details
										that.ProbationDetails(oData.OnbehalfPernr, guid);
									} else if (oData.ApplicationName == "ELCM_YN_ALL_SINGLE") {
										// Probation details
										that.FacInOutDetails(oData.OnbehalfPernr, guid);
									}
									/**
									 * Start of Integratation Loan app Submittion process
									 * By: cfms_ctm_ual
									 * on:24.01.2023
									 **/
									else if (oData.ApplicationName == "ESS_Z633_SINGLE") {
										that.LoansDetails(oData.OnbehalfPernr, guid, "/GPFLoanDetailsSet");
									}
									/*	 for button text changing -start*/
									that.getView().byId("idonONBEHALF").setText("Cancel on Behalf of");
									that.getView().byId("idonONBEHALF").setIcon("sap-icon://sys-cancel");
									that.getView().byId("idonONBEHALF").setType("Reject");
									/*	 for button text changing -end*/
									/*	for heading of title changeing -start*/
									var inboxNav = that.getView().getModel("inboxNav");
									var decodedEmpinf = "On Behalf of" + "(" + oData.OnbehalfPernr + ")";
									inboxNav.setProperty("/empInf", decodedEmpinf);
									/*	for heading of title changeing -end*/

								}

							}.bind(this)
						});
					}

					//that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		/*on, behalf of button call - cfms_Ctm_npv -start*/
		/*Save Button  */
		onSavePress: function() {
			/*	if (this.navPrameters.appName == "ELCM_YI_ALL_SINGLE") {
					
					this.saveSuspention();
					return;
					
				} else {*/
			var that = this;
			// 			this.oBusy = new sap.m.BusyDialog();
			var savePayload = {};
			var oEntitySet = "";
			if (this.navPrameters.appName == "ESS_Z301_SINGLE") {
				savePayload = this.saveBasicDetails();
				if (savePayload.Remarks === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields..!!");
					return;
				}
				oEntitySet = "/BasicDetailSet";
			} else if (this.navPrameters.appName == "ESS_Z303_SINGLE") {
				if (this.getView().getModel("FamilyModel").getData().length > 0) {
					if (this.getView().getModel("FamilyModel").getData()[0].Remarks === "") {
						sap.m.MessageBox.error("Please Fill Mandatory Field(Remarks).!!");
						return;
					}
				} else {
					sap.m.MessageBox.error("Please ADD atleast one Family member.!!");
					return;
				}

				var nomData = this.getView().getModel("NomineeModel").getData();
				const key = 'NominetypeNew';
				const arrayUniqueByKey = [...new Map(nomData.map(item => [item[key], item])).values()];

				for (var j = 0; j < arrayUniqueByKey.length; j++) {
					var cal = 0;
					for (var i = 0; i < nomData.length; i++) {
						if (nomData[i].NominetypeNew === arrayUniqueByKey[j].NominetypeNew) {
							var a = nomData[i].NomineShare;
							cal = cal + Number(a);
						}
					}
					if (parseInt(cal) < 100 || parseInt(cal) > 100) {
						sap.m.MessageBox.error("for " + arrayUniqueByKey[j].NomineDescNew + " Please allocate Nominee share 100% Amount..!!");
						return;
					}
				}

				//	var filteredNomineeData = nomData.filter(x => x.Nominetype === chnagObj.Nominetype);
				if (parseInt(cal) < 100 || parseInt(cal) > 100) {
					sap.m.MessageBox.error("Please allocate Nominee share 100% Amount..!!");
					return;
				}
				savePayload = this.saveFamilyDetails();
				oEntitySet = "/ActionHeaderSet";
			} else if (this.navPrameters.appName == "ESS_Z322_SINGLE") {
				savePayload = this.saveContactDetails();
				oEntitySet = "/ContactDetailsSet";
			} else if (this.navPrameters.appName == "ESS_Z316_SINGLE") {
				savePayload = this.saveAddress();
				oEntitySet = "/AddressInfoSet";
				if (savePayload.ReasonForChange === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields(ReasonForChange)..!!");
					return;
				}

			} else if (this.navPrameters.appName == "ESS_Z334_SINGLE") {
				//Bank Detals

				savePayload = this.saveAccountDetails();
				oEntitySet = "/AccountDetailsSet";
				if (savePayload.Remarks === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields..!!");
					return;
				}
			} else if (this.navPrameters.appName == "ESS_Z302_SINGLE") {
				savePayload = this.saveLeaveDeatils();
				oEntitySet = "/LeaveDetailsSet";
			} else if (this.navPrameters.appName == "ESS_Z333_SINGLE") {
				savePayload = this.saveSurLeaveDetails();
				oEntitySet = "/SurrenderLeaveSet";
				if (parseInt(savePayload.SurrenderDays) === 0 || savePayload.SurrenderDays === "") {
					sap.m.MessageBox.error("Please fill No of Days willing to Surrender greater than Zero.");
					return;
				}
				if (savePayload.ReasonForChange === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields..!!");
					return;
				}

			} else if (this.navPrameters.appName == "ELCM_Y5_ALL_GROUP") {
				savePayload = this.saveGroupTransferDetails();
				oEntitySet = "/ActionHeaderSet";
			} else if (this.navPrameters.appName == "ELCM_YE_03_GROUP") {
				//annual icreament
				savePayload = this.saveAnnualIncreDetails();
				oEntitySet = "/ActionHeaderSet";
			} else if (this.navPrameters.appName == "ELCM_YI_ALL_SINGLE") {
				//Suspention
				savePayload = this.saveSuspentionPayload();
				if (savePayload.Remarks === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields..!!");
					return;
				}
				oEntitySet = "/SuspentionSet";
			} else if (this.navPrameters.appName == "ELCM_Y7_ALL_SINGLE") {
				//Deputation out
				savePayload = this.savedeputationPayload();
				oEntitySet = "/DeputyOutSet";
			} else if (this.navPrameters.appName == "ELCM_Y6_ALL_SINGLE") {
				//Deputation in
				savePayload = this.savedeputationPayload();
				oEntitySet = "/DeputyInSet";
			} else if (this.navPrameters.appName == "ELCM_Y8_ALL_SINGLE") {
				//DeputyFrnsrv
				savePayload = this.saveDeputyFrnsrvPayload();
				oEntitySet = "/DeputyFrnsrvoutSet";
			} else if (this.navPrameters.appName == "ELCM_YX_ALL_SINGLE") {
				//OrgReassignment
				savePayload = this.saveOrgReassignmentPayload();
				oEntitySet = "/OrgReassignSet";
			} else if (this.navPrameters.appName == "ELCM_YF_ALL_SINGLE") {
				//SeparationDetails
				savePayload = this.saveSeparationDetailsPayload();
				oEntitySet = "/SeparationSet";
			} else if (this.navPrameters.appName == "ELCM_YE_ALL_SINGLE") {
				//Paychange details
				savePayload = this.savePaychangeDetailsPayload();
				if (savePayload.Comments === "") {
					sap.m.MessageBox.error("Please Fill Mandatory Fields..!!");
					return;
				}
				// oEntitySet = "/PayChangeSet(Pernr='" + this.saveEmp + "')";
				oEntitySet = "/PayChangeSet";
			} else if (this.navPrameters.appName == "ELCM_Y3_ALL_SINGLE") {
				//SeparationDetails
				savePayload = this.saveProbationDetailsPayload();

				oEntitySet = "/ProbationSet";
				if (savePayload.Remarks === "") {
					sap.m.MessageBox.error("Please Fill Remarks for Probation ..!!");
					return;
				}
			} else if (this.navPrameters.appName == "ELCM_YN_ALL_SINGLE") {
				//SeparationDetails
				savePayload = this.saveFacInOutDetailsPayload();
				oEntitySet = "/FACINChargeSet";
				if (savePayload.Remarks === "") {
					sap.m.MessageBox.error("Please Fill Remarks for Probation ..!!");
					return;
				}
			}
			/**
			 * Start of Integratation Loan app Submittion process
			 * By: cfms_ctm_ual
			 * on:24.01.2023
			 **/
			else if (this.navPrameters.appName == "ESS_Z633_SINGLE") {
				var isValid = this.oValidateLoansForm();
				if (isValid) {
					savePayload = this.saveLoaneDetailsPayload();
					oEntitySet = "/GPFLoanDetailsSet";
				} else {
					return;
				}
			}
			/*End of Process*/

			this.oBusy.open();
			if (savePayload.__metadata) {
				delete savePayload.__metadata;
			}
			if (savePayload.Requestdetails) {
				delete savePayload.Requestdetails;
			}
			// this.oModel.setUseBatch(false);
			this.oModel.create(oEntitySet, savePayload, {
				async: false,
				success: function(oData, oResponse) {
					that.oBusy.close();
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
							$.sap.BusyDialog.close();
							return false;
						}
					}

					// sap.m.MessageToast.show("Saved Successfully");

					var result = oData.Requestdetails;
					if (that.navPrameters.appName == "ESS_Z301_SINGLE") {
						that.basicDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z303_SINGLE") {
						var result = oData.FamilyMembersSet.results[0].Requestdetails;
						that.FamilyDetails(result.Pernr, result.RequestGuid, "FamilyDetails");
					} else if (that.navPrameters.appName == "ESS_Z322_SINGLE") {
						that.contactDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z316_SINGLE") {
						that.AdressDetals(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z334_SINGLE") {
						that.AccountDetals(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z302_SINGLE") {
						that.LeaveDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z333_SINGLE") {
						that.surLeaveDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_Y5_ALL_GROUP") {
						var pernr = ""; // for group Transfer
						var RequestGuid = oData.RequestGuid;
						that.groupTransferDetails(pernr, RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_YE_03_GROUP") {
						//annual increment
						that.AnnualIncrementDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_YI_ALL_SINGLE") {
						//Suspenstion
						that.SuspensionDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_Y7_ALL_SINGLE") {
						//Deputation out
						that.DeputyDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_Y6_ALL_SINGLE") {
						//Deputation in
						that.DeputyInDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_Y8_ALL_SINGLE") {
						//DeputyFrnsrvout
						that.DeputyFrnsrvDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_YX_ALL_SINGLE") {
						//OrgReassignment
						that.OrgReassignDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_YE_ALL_SINGLE") {
						// Pay change details
						that.PaychangeDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_Y3_ALL_SINGLE") {
						// Probation details
						that.ProbationDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ELCM_YN_ALL_SINGLE") {
						// Probation details
						that.FacInOutDetails(result.Pernr, result.RequestGuid);
					}
					/**
					 * Start of Integratation Loan app Submittion process
					 * By: cfms_ctm_ual
					 * on:24.01.2023
					 **/
					else if (that.navPrameters.appName == "ESS_Z633_SINGLE") {
						that.LoansDetails(result.Pernr, result.RequestGuid, "/GPFLoanDetailsSet");
					}
					/*End of Process*/
				},
				error: function(oError) {
					that.oBusy.close();

					if (oError.headers["sap-message"]) {
						if (JSON.parse(oError.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success("" + JSON.parse(oError.headers["sap-message"]).message + "");
						} else if (JSON.parse(oError.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error("" + JSON.parse(oError.headers["sap-message"]).message + "");
							$.sap.BusyDialog.close();
							return false;
						}
					}
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);

				}
			});
			//} // if condition close
		},
		saveBasicDetails: function() {
			var payload = this.getView().getModel("simple").getData();
			return payload;
		},
		saveFamilyDetails: function() {
			var payload = {
				"Pernr": this.saveEmp,
				"RequestGuid": "",
				"FamilyMembersSet": this.getView().getModel("FamilyModel").getData(),
				"NominesSet": this.getView().getModel("NomineeModel").getData()
			};
			// var payload = this.getView().getModel("FamilyModel").getData();
			return payload;
		},
		savePaychangeDetailsPayload: function() {
			var payload = this.getView().getModel("PaychangeModel").getData();
			payload.WageList.results = [];
			var basiccomp = this.getView().getModel("BasicComponentFormModel").getData();
			var Recurring = this.getView().getModel("RecurringTabFormModel").getData();
			var AddtionPaym = this.getView().getModel("AdditionalPaymentsTabFormModel").getData();

			for (var i = 0; i < basiccomp.length; i++) {
				basiccomp[i];
				payload.WageList.results.push(basiccomp[i]);
			}
			for (var i = 0; i < Recurring.length; i++) {
				Recurring[i];
				payload.WageList.results.push(Recurring[i]);
			}
			for (var i = 0; i < AddtionPaym.length; i++) {
				AddtionPaym[i];
				payload.WageList.results.push(AddtionPaym[i]);
			}
			// var payload = {
			// 	"Pernr": this.saveEmp,
			// 	"RequestGuid": "",
			// 	"FamilyMembersSet": this.getView().getModel("FamilyModel").getData(),
			// 	"NominesSet": this.getView().getModel("NomineeModel").getData()
			// };

			return payload;
		},
		saveContactDetails: function() {
			var payload = this.getView().getModel("ContactModel").getData();
			return payload;
		},
		saveAddress: function() {
			var payload = this.getView().getModel("AdressModel").getData();
			return payload;
		},
		saveAccountDetails: function() {
			var payload = this.getView().getModel("AccountModel").getData();
			return payload;
		},
		saveLeaveDeatils: function() {
			var payload = this.getView().getModel("LeaveModel").getData();
			return payload;
		},
		saveSurLeaveDetails: function() {
			var payload = this.getView().getModel("SurLeaveModel").getData();
			return payload;
		},
		saveGroupTransferDetails: function() {
			var payload = {
				// "FLAG": "",
				"RequestGuid": this.getView().getModel("StausModel").getData().RequestGuid,
				"TransferSet": this.getView().getModel("GroupTransferModel").getData()
			};
			// var payload = this.getView().getModel("FamilyModel").getData();
			return payload;
		},
		saveAnnualIncreDetails: function() {
			var payload = {
				// "FLAG": "",
				"ActionId": this.getView().getModel("AnnualIncrementModel").getData()[0].ActionId,
				"ActionReasonId": this.getView().getModel("AnnualIncrementModel").getData()[0].ActionReasonId,
				"RequestGuid": this.getView().getModel("AnnualIncrementModel").getData()[0].RequestGuid,
				"AnnualIncrementSet": this.getView().getModel("AnnualIncrementModel").getData()
			};
			// var payload = this.getView().getModel("AnnualIncrementModel").getData();
			return payload;
		},
		saveSuspentionPayload: function() {
			var payload = this.getView().getModel("SuspentionModel").getData();
			return payload;
		},
		saveSeparationDetailsPayload: function() {
			var payload = this.getView().getModel("SeparationModel").getData();
			return payload;
		},
		saveProbationDetailsPayload: function() {
			var payload = this.getView().getModel("ProbationModel").getData();
			return payload;
		},
		saveFacInOutDetailsPayload: function() {
			var payload = this.getView().getModel("FacInOutModel").getData();
			return payload;
		},
		savedeputationPayload: function() {
			var payload = this.getView().getModel("DeputyModel").getData();
			return payload;
		},
		saveDeputyFrnsrvPayload: function() {
			var payload = this.getView().getModel("DeputyFrnsrvoutModel").getData();
			return payload;
		},

		saveOrgReassignmentPayload: function() {
			var payload = this.getView().getModel("DeputyModel").getData();
			return payload;
		},
		saveSuspention: function() {
			var that = this;
			var savePayload = this.saveSuspentionPayload();
			if (savePayload.__metadata) {
				delete savePayload.__metadata;
			}
			if (savePayload.Requestdetails) {
				delete savePayload.Requestdetails;
			}
			// this.navPrameters.reqGuid;
			var oEntitySet = "/SuspentionSet";
			// var	oEntitySet = "/SUSPENTIONSET_UPDATE_ENTITYSet"; 
			this.oModel.setUseBatch(true);
			this.oModel.update("" + oEntitySet + "(RequestGuid='" + this.reqGuid + "')", savePayload, {
				//async: false,
				success: function(oData, oResponse) {
					that.oBusy.close();
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
							$.sap.BusyDialog.close();
							return false;
						}
					}

					// sap.m.MessageToast.show("Saved Successfully");

					var result = oData.Requestdetails;
					if (that.navPrameters.appName == "ESS_Z301_SINGLE") {
						that.basicDetails(result.Pernr, result.RequestGuid);
					} else if (this.navPrameters.appName == "ESS_Z303_SINGLE") {
						that.FamilyDetails(result.Pernr, result.RequestGuid, "FamilyDetails");
					} else if (that.navPrameters.appName == "ESS_Z322_SINGLE") {
						that.contactDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z316_SINGLE") {
						that.AdressDetals(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z334_SINGLE") {
						that.AccountDetals(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z302_SINGLE") {
						that.LeaveDetails(result.Pernr, result.RequestGuid);
					} else if (that.navPrameters.appName == "ESS_Z333_SINGLE") {
						that.surLeaveDetails(result.Pernr, result.RequestGuid);
					} else if (this.navPrameters.appName == "ELCM_Y5_ALL_GROUP") {
						that.groupTransferDetails(result.Pernr, result.RequestGuid);
					} else if (this.navPrameters.appName == "ELCM_YE_03_GROUP") {
						//annual increment
						that.AnnualIncrementDetails(result.Pernr, result.RequestGuid);
					} else if (this.navPrameters.appName == "ELCM_YI_ALL_SINGLE") {
						//Suspenstion
						that.SuspensionDetails(result.Pernr, result.RequestGuid);
					}

				},
				error: function(oError) {
					that.oBusy.close();
					// var t = JSON.parse(oError.responseText).error.message.value;
					// sap.m.MessageBox.error(t, "Error");
					if (oError.headers["sap-message"]) {
						if (JSON.parse(oError.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success("" + JSON.parse(oError.headers["sap-message"]).message + "");
						} else if (JSON.parse(oError.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error("" + JSON.parse(oError.headers["sap-message"]).message + "");
							$.sap.BusyDialog.close();
							return false;
						}
					}

				}
			});
		},

		/* Surrnder frgament - table item press - start*/
		handlSurDays: function(oEvent) {
			var sValue = oEvent.getSource().getValue();
			var sPrevSurDaysDate = parseInt(this.getView().getModel("SurLeaveModel").getData().ElCreditAsonDate);
			if (sValue > sPrevSurDaysDate) {
				sap.m.MessageBox.error("Please enter valid data..!!");
				oEvent.getSource().setValue("");
			}
			var surrnder = this.getView().getModel("SurLeaveModel");
			//itmePath + 
			surrnder.setProperty("/SurrenderDays", sValue);
		},
		onchangeSurder: function(oEvent) {
			// combobox in nominee relation
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
		},

		/* Surrnder frgament - table item press - end*/
		/* family add member frgament - table item press - start*/
		OnPressAddAction: function(oEvent) {
			var Obj = {
				Pernr: this.getOwnerComponent().getModel("DetailEmployeeHeaderModel").getData().Pernr,
				RequestGuid: "",
				ActionId: sap.ui.getCore().byId("DetailActionId").getValue().split("(")[1].slice(0, 2),
				ActionReasonId: sap.ui.getCore().byId("DetailActionReasonId").getValue().split("(")[1].slice(0, 2),
				EffectiveDate: this._dataConversion(sap.ui.getCore().byId("EffectedOnId").getValue())
			};
		},
		OnPressCancelAction: function() {
			this.AddMemberFragment.close();

			$.sap.BusyDialog.close();
			sap.ui.getCore().byId("DetailActionId").setValue("");
			// sap.ui.getCore().byId("DetailActionReasonId").setValue("");
			// sap.ui.getCore().byId("EffectedOnId").setValue("");
		},

		HandleRequestofAction: function(oEvent) {
			var that = this;
			this.AddMemberInput = oEvent.getSource();
			var Filters = [];
			// Filters.push(new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, ""));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/ValueHelpSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailActionDialogFragment) {
						that.DetailActionDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailActionDialog",
							that);
						that.getView().addDependent(that.DetailActionDialogFragment);
					}
					that.DetailActionDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailActionDialogFragment.setModel(oModel, "FamilyAddMembDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		ConfirmDetailDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			this.selectFamilyMemberDetails = oEvent.getParameter("selectedItem").getBindingContext("FamilyAddMembDialogModel").getProperty();
			this.AddMemberInput.setValue(sValue);
		},
		livechangesearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ValueDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ValueId", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		/* family add member frgament - table item press - end*/
		/*family details frgament - table item press - start*/
		oHandleAadharLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` A-Za-z~!@#$^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		changeMaritalStatus: function(oEvent) {
			var selValue = oEvent.getSource().getSelectedKey();
			if (selValue == 0) {
				sap.ui.getCore().byId("IdMarriedSinceNew").setValue("");
			}
			// combobox in family commen function -start
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// combobox in family commen function -end
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/MaritalStatusNew", selValue);
			// familyForm.setProperty(itmePath + "/GenderDesc", oEvent.getSource().getValue());
		},
		dateofMarriedSince: function(oEvent) {
			var selValue = oEvent.getSource().getSelectedKey();
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/MarriedSinceNew", selValue);
			// familyForm.setProperty(itmePath + "/GenderDesc", oEvent.getSource().getValue());
		},
		genderFamilyChange: function(oEvent) {
			// combobox in family commen function -start
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// combobox in family commen function -end
			var selValue = oEvent.getSource().getSelectedKey();
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/GenderNew", selValue);
			familyForm.setProperty(itmePath + "/GenderDescNew", oEvent.getSource().getValue());
		},
		dateofBirthFamily: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/DateOfBirthNew", new Date(selValue));

		},
		dateofDeathFamily: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/DateOfDeathNew", new Date(selValue));

		},
		aliveFamilyCahnge: function(oEvent) {
			// combobox in family commen function -start
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// combobox in family commen function -end
			var selValue = oEvent.getSource().getValue();
			var selKey = oEvent.getSource().getSelectedKey();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/AliveNew", selKey);
			if (selKey == "X") {
				familyForm.setProperty(itmePath + "/DateOfDeathNew", null);
			}

		},
		DisablityCahnge: function(oEvent) {
			// combobox in family commen function -start
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// combobox in family commen function -end
			var selValue = oEvent.getSource().getValue();
			var selKey = oEvent.getSource().getSelectedKey();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setProperty(itmePath + "/DisablityNew", selKey);

		},
		onfamGovEmpchange: function(oEvent) {
			// combobox in family commen function -start
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// combobox in family commen function -end
		},

		familyTablItempress: function(oEvent) {
			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			if (EditBurronStatus == "X") {
				var itemPath = oEvent.getParameter("listItem").getBindingContext("FamilyModel").sPath;
				if (this.oFamilyDialogdetailsDisplay === undefined || this.oFamilyDialogdetailsDisplay === null) {
					this.oFamilyDialogdetailsDisplay = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.FamilyDialogdetailsDisplay",
						this);
					this.getView().addDependent(this.oFamilyDialogdetailsDisplay);
				}
				this.oFamilyDialogdetailsDisplay.bindElement({
					path: itemPath,
					model: "FamilyFormModel"
				});
				this.oFamilyDialogdetailsDisplay.open();
			}
			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
			// old data before cancle write for code of Cancel -start
			var oFamilyData = this.getView().getModel("FamilyFormModel").getData();
			this.oldFamilyData = JSON.parse(JSON.stringify(oFamilyData));
			// end - old data before cancle write for code of Cancel
			var ofobj = oEvent.getParameter("listItem").getBindingContext("FamilyModel").getObject();
			this.familyObj = JSON.parse(JSON.stringify(ofobj));
			if (this.familyObj.__metadata) {
				delete this.familyObj.__metadata;
			}
			if (this.familyObj.Requestdetails) {
				delete this.familyObj.Requestdetails;
			}
			var itemPath = oEvent.getParameter("listItem").getBindingContext("FamilyModel").sPath;
			if (this.oFamilyDialog === undefined || this.oFamilyDialog === null) {
				this.oFamilyDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.FamilyDialogdetails", this);
				this.getView().addDependent(this.oFamilyDialog);
			}
			this.oFamilyDialog.bindElement({
				path: itemPath,
				model: "FamilyFormModel"
			});
			/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
			this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
			if (ofobj.Operation === "DEL") {
				this.oFamilyDialog.getButtons()[0].setText("Close");
			} else {
				this.oFamilyDialog.getButtons()[0].setText("Ok");
			}
			this.oFamilyDialog.open();
			/*	date picker only select (no need enter date) - in fragment - -start*/
			var dateArray = ["idDateofBirthNewFamilyDailog", "IdMarriedSinceNew"];
			dateArray.forEach(date => {
				var oDatePicker = sap.ui.getCore().byId(date);
				// var oDatePicker = this.getView().byId(date);
				oDatePicker.addEventDelegate({
					onAfterRendering: function() {
						var oDateInner = this.$().find('.sapMInputBaseInner');
						var oID = oDateInner[0].id;
						$('#' + oID).attr("disabled", "disabled");
					}
				}, oDatePicker);
			});
			// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
			// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
			/*		date picker only select (no need enter date) - in fragment --End*/
			/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			var showValueHelp = function(event) {

				if (event.keyCode === 27) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				} else {
					return true;
				}

			};
			sap.ui.getCore().byId("idFamilyDailogDetailsPopup").attachBrowserEvent("keydown", showValueHelp);
			/*		fragment dont close when ESC KEY PRESS - END*/

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

		},
		OnPressCancelFamilyDailogDisplay: function(oEvent) {
			this.oFamilyDialogdetailsDisplay.close();
		},
		onOkFamilyDailog: function(oEvent) {
			if (oEvent.getSource().getText() === "Close") {
				// oEvent.getSource().setText("Ok");
				this.oFamilyDialog.close();
				return;
			}
			var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			var chnagObj = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").getObject();

			if (chnagObj.FirstNameNew === "" || chnagObj.LastNameNew == "" || chnagObj.GenderNew === "" || chnagObj.DateOfBirthNew === "" ||
				chnagObj.DateOfBirthNew == null ||
				chnagObj.AadharnumberNew === "" || chnagObj.DisablityNew === "" || chnagObj.AliveNew === "" || chnagObj.GovtEmployeNew === "") {
				sap.m.MessageBox.error("Please fill All Mandatory Fields..!!");
				return;
			}
			if (chnagObj.AliveNew === "N" && (chnagObj.DateOfDeathNew == "" || chnagObj.DateOfDeathNew == null)) {
				sap.m.MessageBox.error("Please fill All Mandatory (Date of Death)Fields..!!");
				return;
			}
			if (chnagObj.GovtEmployeNew === "01" && chnagObj.ServiceTypeNew == "" && chnagObj.EmployeecodeNew == "") {
				sap.m.MessageBox.error("Please fill All Mandatory (Govt Emp Details Related)Fields..!!");
				return;
			}

			if (chnagObj.__metadata) {
				delete chnagObj.__metadata;
			}
			// if (chnagObj.Requestdetails) {
			// 	delete chnagObj.Requestdetails;
			// }
			if (oEvent.getSource().getParent().getBindingContext("FamilyFormModel").getObject().Operation !== "INS") {
				if (JSON.stringify(chnagObj) !== JSON.stringify(this.familyObj)) {
					oEvent.getSource().getParent().getBindingContext("FamilyFormModel").getObject().Operation = "MOD";
				}
			}
			var data = this.getView().getModel("FamilyFormModel").getData();

			// this.getView().setModel(this.getView().getModel("FamilyModel"), "FamilyModel");
			var family = this.getView().getModel("FamilyModel");
			// if (chnagObj.Operation == "INS") {
			family.setProperty(itmePath + "/FirstName", chnagObj.FirstNameNew);
			family.setProperty(itmePath + '/LastName', chnagObj.LastNameNew);
			family.setProperty(itmePath + '/Fullname', chnagObj.LastNameNew + chnagObj.FirstNameNew);
			family.setProperty(itmePath + '/Gender', chnagObj.GenderNew);
			family.setProperty(itmePath + '/Gender', chnagObj.GenderNew);
			family.setProperty(itmePath + '/GenderDesc', chnagObj.GenderDescNew);
			family.setProperty(itmePath + '/DateOfBirth', chnagObj.DateOfBirthNew);
			// this._dataConversion(chnagObj.DateOfBirthNew)
			family.setProperty(itmePath + '/Aadharnumber', chnagObj.AadharnumberNew);
			family.setProperty(itmePath + '/PhoneNumber', chnagObj.PhoneNumberNew);
			family.setProperty(itmePath + '/MaritalStatus', chnagObj.MaritalStatusNew);
			family.setProperty(itmePath + '/MarriedSince', chnagObj.MarriedSinceNew);
			family.setProperty(itmePath + '/Disablity', chnagObj.DisablityNew);
			family.setProperty(itmePath + '/Alive', chnagObj.AliveNew);
			family.setProperty(itmePath + '/DateOfDeath', chnagObj.DateOfDeathNew);
			family.setProperty(itmePath + '/GovtEmploye', chnagObj.GovtEmployeNew);
			family.setProperty(itmePath + '/ServiceType', chnagObj.ServiceTypeNew);
			family.setProperty(itmePath + '/Employeecode', chnagObj.EmployeecodeNew);
			// }
			family.setData(data);
			data = this.dataMaking(data); //date of birth type object convetion
			this.FamilyFormModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.FamilyFormModel, "FamilyFormModel");

			// this.getView().setModel(this.simpleModel, "FamilyModel");
			this.oFamilyDialog.close();
			/*		calling this functon nominee dialog relation or nomineename showing purpose */
			this.NomineeRelation();

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end
		},
		_dataConversion: function(date) {
			date = date.split("T")[0].split("-")
			var d = Number(date[2]);
			var m = Number(date[1]);
			var y = Number(date[0]);
			var fulldate = new Date(y, m - 1, d);
			return fulldate;
		},
		NomineeRelation: function() {
			/*	nominee dailog - showing data in combo box*/
			var oFamilyData = this.getView().getModel("FamilyModel").getData();
			oFamilyData.find(function(record) {
				if (record.__metadata) {
					delete record.__metadata;
				}
			})
			this.NomFamilyData = JSON.parse(JSON.stringify(oFamilyData));
			// Checking for Duplicate Entry of HOA Codes
			var uniqSetData = new Set(this.NomFamilyData);
			// TO CONVERT SET  TO  ARRAY 
			var adjNomFamData = Array.from(uniqSetData);
			var oNomineeModel = new sap.ui.model.json.JSONModel(adjNomFamData);
			this.getView().setModel(oNomineeModel, "NomFamilyData");

		},
		OnPressCancelFamilyDailog: function(oEvent) {
			if (sap.ui.getCore().byId("DetailActionId")) {
				sap.ui.getCore().byId("DetailActionId").setValue("");
			}
			this.oFamilyDialog.close();
			/*date value checking of string /not -start*/
			this.oldFamilyData = this.dataMaking(this.oldFamilyData);
			this.FamilyFormModel = new sap.ui.model.json.JSONModel(this.oldFamilyData);
			this.getView().setModel(this.FamilyFormModel, "FamilyFormModel");
			this.FamilyModel = new sap.ui.model.json.JSONModel(this.oldFamilyData);
			this.getView().setModel(this.FamilyModel, "FamilyModel");

			var ofamily = this.getView().getModel("FamilyModel").getData();
			this.getView().byId("idFamilyTableRec").setText("Total Records: " + ofamily.length);

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

			/*this.oldFamilyData  -- for old data before cancel*/
			// var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			// var family = this.getView().getModel("FamilyModel");
			// var data = this.getView().getModel("FamilyFormModel").getData();
			// if (this.familyObj.Operation == "INS") {
			// this.familyObj = JSON.stringify(this.familyObj);

			// family.setProperty(itmePath + "/FirstNameNew", this.familyObj.FirstNameNew);
			// family.setProperty(itmePath + '/LastNameNew', this.familyObj.LastNameNew);
			// family.setProperty(itmePath + '/GenderNew', this.familyObj.GenderNew);
			// family.setProperty(itmePath + '/DateOfBirthNew', this.familyObj.DateOfBirthNew);
			// family.setProperty(itmePath + '/AadharnumberNew', this.familyObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumberNew', this.familyObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatusNew', this.familyObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSinceNew', this.familyObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/DisablityNew', this.familyObj.DisablityNew);
			// family.setProperty(itmePath + '/AliveNew', this.familyObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeathNew', this.familyObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmployeNew', this.familyObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceTypeNew', this.familyObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/EmployeecodeNew', this.familyObj.EmployeecodeNew);
			// family.setProperty(itmePath + '/Operation', this.familyObj.Operation);
			// }
			// family.setData(data);

		},
		onAddfamilyRow: function() {
			if (!this.AddMemberFragment) {
				this.AddMemberFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.FamilyMemberAdd",
					this);
				this.getView().addDependent(this.AddMemberFragment);
			}
			this.AddMemberFragment.open();
		},
		MemberNewAddConfirm: function(oEvent) {
			var selMember = sap.ui.getCore().byId("DetailActionId").getValue();
			if (selMember == "") {
				sap.m.MessageBox.error("Please select Value to Add Member..!!");
				return;
			}
			this.AddMemberFragment.close();
			// old data before cancle write for code of Cancel -start
			// var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
			var oFamilyData = this.getView().getModel("FamilyFormModel").getData();
			this.oldFamilyData = JSON.parse(JSON.stringify(oFamilyData));
			// end - old data before cancle write for code of Cancel
			var data = this.getView().getModel("FamilyModel").getData();
			var lastRecord = this.getView().getModel("FamilyModel").getData()[data.length - 1];
			// if condition for last record is empty or not empty for checking each propery- 
			// lastRecord.Operation !== "INS" && 
			// if (lastRecord.Aadharnumber !== "" || lastRecord.AadharnumberNew !== "" ||
			// 	lastRecord.DateOfBirth !== "" || lastRecord.DateOfBirthNew !== "" || lastRecord.DateOfDeath !== "" || lastRecord.Disablity !== "" ||
			// 	lastRecord.DisablityNew !== "" ||
			// 	lastRecord.Employeecode !== "" || lastRecord.EmployeecodeNew !== "" || lastRecord.FirstName !== "" || lastRecord.FirstNameNew !==
			// 	"" || lastRecord.Gender !== "" ||
			// 	lastRecord.GenderNew !== "" || lastRecord.GovtEmploye !== "" || lastRecord.GovtEmployeNew !== "" || lastRecord.LastName !== "" ||
			// 	lastRecord.LastNameNew !== "" || lastRecord.MaritalStatus !== "" || lastRecord.MaritalStatusNew !== "" || lastRecord.MarriedSince !==
			// 	"" || lastRecord.MarriedSinceNew !== "" || lastRecord.MemberType !== "" || lastRecord.Pernr !== "" || lastRecord.PhoneNumber !==
			// 	"" || lastRecord.PhoneNumberNew !== "" || lastRecord.RequestGuid !== "" || lastRecord.ServiceType !== "" || lastRecord.ServiceTypeNew !==
			// 	"") {
			var famObj = {
				Aadharnumber: "",
				AadharnumberNew: "",
				Alive: "X",
				AliveNew: "X",
				DateOfBirth: null,
				DateOfBirthNew: null,
				DateOfDeath: null,
				DateOfDeathNew: null,
				Disablity: "",
				DisablityNew: "",
				Employeecode: "",
				EmployeecodeNew: "",
				FirstName: "",
				FirstNameNew: "",
				Gender: "",
				GenderNew: "",
				GovtEmploye: "",
				GovtEmployeNew: "",
				LastName: "",
				LastNameNew: "",
				MaritalStatus: "",
				MaritalStatusNew: "",
				MarriedSince: null,
				MarriedSinceNew: null,
				MemberType: this.selectFamilyMemberDetails.ValueId,
				MembertypeDesc: this.selectFamilyMemberDetails.ValueDesc,
				Pernr: "",
				PhoneNumber: "",
				PhoneNumberNew: "",
				RequestGuid: "",
				ServiceType: "",
				ServiceTypeNew: "",
				Operation: "INS",
				Remarks: "",
				Seqnr: "",

				Requestdetails: {
					ActionId: "",
					ActionName: "",
					ActionReasonId: "",
					ActionReasonName: "",
					ActionType: "",
					ApplicationName: "",
					CreatedBy: "",
					CreatedByName: "",
					CreatedOn: null,
					EffectiveDate: null,
					EmailAddress: "",
					EmployeeName: "",
					EmployeeStatus: "",
					FundcenterId: "",
					FundcenterName: "",
					JobId: "",
					MobileNumber: "",
					NoOfEmployees: 0,
					OfficeId: "",
					OfficeName: "",
					OverallStatus: "",
					PayrollStatus: "",
					Pernr: "",
					PositionId: "",
					PositionName: "",
					PrevReferenceNumber: "",
					ReferenceNumber: "",
					RelationId: "",
					ReqStatus: "",
					RequestGuid: "",
					TransStatus: "",
					UpdatedBy: "",
					UpdatedByName: "",
					UpdatedOn: null,
					UpdatedTime: {
						ms: 0,
						__edmType: 'Edm.Time'
					}
					// ServiceType: "",
					//ServiceTypeNew: ""
				}
			};
			data.push(famObj);
			this.familyObj = JSON.parse(JSON.stringify(famObj));
			/*date value checking of string /not -start*/
			var data = this.dataMaking(data);
			var simpleModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(simpleModel, "FamilyModel");
			this.familyTablAddItempress(data.length - 1);

			var familyForm = this.getView().getModel("FamilyFormModel");
			familyForm.setData(data);
			/* table count  update - puropse write  - start*/
			var family = this.getView().getModel("FamilyModel").getData();
			this.getView().byId("idFamilyTableRec").setText("Total Records: " + family.length);
			/* table count  update - puropse write  - end*/
			// }
		},
		/*	date converting string to  Object([val]) function - start*/
		dataMaking: function(sData) {

			for (var i = 0; i < sData.length; i++) {
				if (typeof sData[i].DateOfBirth === 'string') {
					sData[i].DateOfBirth = new Date(sData[i].DateOfBirth);
				}
				if (typeof sData[i].DateOfBirthNew === 'string') {
					sData[i].DateOfBirthNew = new Date(sData[i].DateOfBirthNew);
				}
				if (typeof sData[i].DateOfDeath === 'string') {
					sData[i].DateOfDeath = new Date(sData[i].DateOfDeath);
				}
				if (typeof sData[i].DateOfDeathNew === 'string') {
					sData[i].DateOfDeathNew = new Date(sData[i].DateOfDeathNew);
				}
				if (typeof sData[i].MarriedSince === 'string') {
					sData[i].MarriedSince = new Date(sData[i].MarriedSince);
				}
				if (typeof sData[i].MarriedSinceNew === 'string') {
					sData[i].MarriedSinceNew = new Date(sData[i].MarriedSinceNew);
				}

				if (typeof sData[i].CurrBegda === 'string') {
					sData[i].CurrBegda = new Date(sData[i].CurrBegda);
				}
				if (typeof sData[i].NewBegda === 'string') {
					sData[i].NewBegda = new Date(sData[i].NewBegda);
				}

				if (typeof sData[i].CurrEndda === 'string') {
					sData[i].CurrEndda = new Date(sData[i].CurrEndda);
				}
				if (typeof sData[i].NewEndda === 'string') {
					sData[i].NewEndda = new Date(sData[i].NewEndda);
				}

			}
			return sData;
		},
		/*	date converting string to  Object([val]) function - end*/
		familyTablAddItempress: function(Path) {
			if (sap.ui.getCore().byId("DetailActionId")) {
				sap.ui.getCore().byId("DetailActionId").setValue("");
			}
			var itemPath = "/" + Path;
			if (this.oFamilyDialog === undefined || this.oFamilyDialog === null) {
				this.oFamilyDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.FamilyDialogdetails", this);
				this.getView().addDependent(this.oFamilyDialog);
			}
			// oFamilyDialog
			this.oFamilyDialog.bindElement({
				path: itemPath,
				model: "FamilyFormModel"
			});
			this.oFamilyDialog.open();
			//field show / hide in form adde new records purpose
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},
		onDeletefamilyRow: function(oEvent) {
			var data = this.getView().getModel("FamilyModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
			} else {

				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation == "INS") {
						var spath = SelectedContes[i].sPath.split("/")[1];
						data.splice(parseInt(spath), 1);

					} else {
						SelectedContes[i].getObject().Operation = "DEL";
					}
				}
				// aTable.getModel().setData(data);
				// 	aTable.getModel().refresh();
				this.getView().getModel("FamilyModel").setData(data);
				/*	this.simpleModel = new sap.ui.model.json.JSONModel(data);
					this.getView().setModel(this.simpleModel, "FamilyModel");*/

				// var data = aTable.getModel().getData().oInvoice;

				// var spath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
				/*		calling this functon nominee dialog relation or nomineename showing purpose */
				this.NomineeRelation();

			}
			oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
				var Operation = item.getBindingContext("FamilyModel").getProperty("Operation");
				if (Operation === "DEL") {
					var cb = item.$().find('.sapMCb');
					var oCb = sap.ui.getCore().byId(cb.attr('id'));
					oCb.setEnabled(false);
				}
			});
			/* table count  update - puropse write  - start*/
			var family = this.getView().getModel("FamilyModel").getData();
			this.getView().byId("idFamilyTableRec").setText("Total Records: " + family.length);
			/* table count  update - puropse write  - end*/

			/*var data = this.getView().getModel("FamilyModel").getData();
			var itemPath = oEvent.getParameter("listItem").getBindingContext("FamilyModel").sPath;*/
			// var item = oEvent.getParameter("listItem").getBindingContext("FamilyModel").getObject();
			// oEvent.getSource().getParent().getParent().getParent().getParent()

		},
		/*family details frgament - table item press - end*/

		/*NOminee Details fragment- start*/
		onAddNomineeRow: function() {
			if (!this.AddNomineeFragment) {
				this.AddNomineeFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.NomineeAdd",
					this);
				this.getView().addDependent(this.AddNomineeFragment);
			}
			this.AddNomineeFragment.open();
		},
		OnPressCancelNominee: function() {
			this.AddNomineeFragment.close();

			$.sap.BusyDialog.close();
			this.NomineeInput.setValue("");
			sap.ui.getCore().byId("NomineeActionId").setValue("");
			// sap.ui.getCore().byId("DetailActionReasonId").setValue("");
			// sap.ui.getCore().byId("EffectedOnId").setValue("");
		},
		NomineeNewAddConfirm: function(oEvent) {
			// old data before cancle write for code of Cancel -start
			var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
			this.oldNomineeData = JSON.parse(JSON.stringify(oNomineeData));
			// end - old data before cancle write for code of Cancel
			var selMember = sap.ui.getCore().byId("NomineeActionId").getValue();
			if (selMember == "") {
				sap.m.MessageBox.error("Please select Value to Add Nominee..!!");
				return;
			}
			this.AddNomineeFragment.close();
			var data = this.getView().getModel("NomineeModel").getData();
			var lastRecord = this.getView().getModel("NomineeModel").getData()[data.length - 1];
			// if condition for last record is empty or not empty for checking each propery- 

			// if (lastRecord.Aadharnumber !== "" || lastRecord.AadharnumberNew !== "" ||
			// 	lastRecord.DateOfBirth !== "" || lastRecord.DateOfBirthNew !== "" || lastRecord.DateOfDeath !== "" || lastRecord.Disablity !== "" ||
			// 	lastRecord.DisablityNew !== "" ||
			// 	lastRecord.Employeecode !== "" || lastRecord.EmployeecodeNew !== "" || lastRecord.FirstName !== "" || lastRecord.FirstNameNew !==
			// 	"" || lastRecord.Gender !== "" ||
			// 	lastRecord.GenderNew !== "" || lastRecord.GovtEmploye !== "" || lastRecord.GovtEmployeNew !== "" || lastRecord.LastName !== "" ||
			// 	lastRecord.LastNameNew !== "" || lastRecord.MaritalStatus !== "" || lastRecord.MaritalStatusNew !== "" || lastRecord.MarriedSince !==
			// 	"" || lastRecord.MarriedSinceNew !== "" || lastRecord.MemberType !== "" || lastRecord.Pernr !== "" || lastRecord.PhoneNumber !==
			// 	"" || lastRecord.PhoneNumberNew !== "" || lastRecord.RequestGuid !== "" || lastRecord.ServiceType !== "" || lastRecord.ServiceTypeNew !==
			// 	"") {
			// this.selecteMemberDetail
			var NomObj = {
				Seqno: "",
				Nominename: "",
				NominenameNew: "",
				Relation: "",
				RelationNew: "",
				Relationdesc: "",
				DateOfBirth: null,
				DateOfBirthNew: null,
				NomineShare: "",
				NomineShareNew: "",
				Address: "",
				AddressNew: "",
				// Employeecode: "",
				// EmployeecodeNew: "",
				GuardianAddress: "",
				GuardianAddressNew: "",
				AlternateNomine: "",
				AlternateNomineNew: "",
				// AlternateNominefullname: "",
				// AlternateNominefullnameNew: "",
				AlterNomineAddres: "",
				AlterNomineAddresNew: "",
				Operation: "INS",
				Nominetype: this.selecteMemberNomineeDetail.ValueId,
				NominetypeNew: this.selecteMemberNomineeDetail.ValueId,
				NomineDesc: this.selecteMemberNomineeDetail.ValueDesc,
				NomineDescNew: this.selecteMemberNomineeDetail.ValueDesc
					// MaritalStatus: "",
					// MaritalStatusNew: "",
					// MarriedSince: "",
					// MarriedSinceNew: "",
					// MemberType: this.selecteMemberDetails.ValueId,
					// MembertypeDesc: this.selecteMemberDetails.ValueDesc,
					// Pernr: "",
					// PhoneNumber: "",
					// PhoneNumberNew: "",
					// RequestGuid: "",
					// ServiceType: "",
					// ServiceTypeNew: "",

			};
			data.push(NomObj);
			this.NomineeObj = JSON.parse(JSON.stringify(NomObj));
			/*date value checking of string /not -start*/
			var data = this.dataMaking(data);
			var simpleModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(simpleModel, "NomineeModel");
			this.NomineeTablAddItempress(data.length - 1);

			var nomineeForm = this.getView().getModel("NomineeFormModel");
			nomineeForm.setData(data);
			/* table count  update - puropse write  - start*/
			var nominee = this.getView().getModel("NomineeModel").getData();
			this.getView().byId("idNomineeTableRec").setText("Total Records: " + nominee.length);
			/* table count  update - puropse write  - end*/
			// }
		},
		onOkNomineeDailog: function(oEvent) {
			// var nomineeDes = this.NomineeInput.getValue();
			if (oEvent.getSource().getText() === "Close") {
				// oEvent.getSource().setText("Ok");
				this.oFamilyDialog.close();
				return;
			}

			var itmePath = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").sPath;
			var path = itmePath.slice("/")[1];
			var chnagObj = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").getObject();
			/*nominee dailog mandotaory fields checking -start*/
			if (chnagObj.NominenameNew === "" || chnagObj.RelationNew === "" || chnagObj.DateOfBirthNew === "" || chnagObj.DateOfBirthNew ==
				null || chnagObj.NomineShareNew ===
				"" || chnagObj.AddressNew === "") {
				sap.m.MessageBox.error("Please enter all Mandatory Nominee Data..!!");
				return;
			}
			/*nominee dailog mandotaory fields checking -end*/
			if (chnagObj.__metadata) {
				delete chnagObj.__metadata;
			}
			if (chnagObj.Requestdetails) {
				delete chnagObj.Requestdetails;
			}
			if (oEvent.getSource().getParent().getBindingContext("NomineeFormModel").getObject().Operation !== "INS") {
				if (JSON.stringify(chnagObj) !== JSON.stringify(this.NomineeObj)) {
					oEvent.getSource().getParent().getBindingContext("NomineeFormModel").getObject().Operation = "MOD";
				}
			}
			var data = this.getView().getModel("NomineeFormModel").getData();

			// this.getView().setModel(this.getView().getModel("NomineeModel"), "NomineeModel");
			var Nominee = this.getView().getModel("NomineeModel");
			if (chnagObj.Operation == "INS" && chnagObj.Seqno === "") {

				Nominee.setProperty(itmePath + "/Seqno", (Number(data.length)).toString());
			}
			Nominee.setProperty(itmePath + "/Nominename", chnagObj.NominenameNew);
			Nominee.setProperty(itmePath + '/Relation', chnagObj.RelationNew);
			Nominee.setProperty(itmePath + '/Relationdesc', chnagObj.RelationdescNew);

			Nominee.setProperty(itmePath + '/DateOfBirth', chnagObj.DateOfBirthNew);
			Nominee.setProperty(itmePath + '/NomineShare', chnagObj.NomineShareNew);
			Nominee.setProperty(itmePath + '/Address', chnagObj.AddressNew);
			Nominee.setProperty(itmePath + '/GuardianAddress', chnagObj.GuardianAddressNew);
			Nominee.setProperty(itmePath + '/AlternateNomine', chnagObj.AlternateNomineNew);
			Nominee.setProperty(itmePath + '/AlternateNomineFulname', chnagObj.AlternateNomineFulnameNew);
			Nominee.setProperty(itmePath + '/AlterNomineAddres', chnagObj.AlterNomineAddresNew);

			/*date value checking of string /not -start*/
			data = this.dataMaking(data);
			this.oldNomineeData = this.dataMaking(this.oldNomineeData);
			var nomDailObj = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").getObject();
			var nomModelData = this.getView().getModel("NomineeModel").getData();

			/*nominee share not increase 100% -start*/
			var filteredNomineeData = nomModelData.filter(x => x.Nominetype === chnagObj.Nominetype);
			// && x.sqft >= 1
			// var nomData = this.getView().getModel("NomineeModel").getData();
			var cal = 0;
			for (var i = 0; i < filteredNomineeData.length; i++) {
				var a = filteredNomineeData[i].NomineShare;
				cal = cal + Number(a);
			}
			if (parseInt(cal) > 100) {
				sap.m.MessageBox.error("Please allocate Nominee share 100% Amount(Benfit Type)..!!");
				return;
			}
			/*nominee share not increase 100% -end*/
			if (this.editNomnee !== "Edit") {
				for (var i = 0; i < this.oldNomineeData.length; i++) {
					// checking the nominee benift type & Nominee name of family member should not be same nomDailObj.Nominetype 
					if (this.oldNomineeData[i].Nominetype === this.selecteMemberNomineeDetail.ValueId && this.oldNomineeData[i].NominenameNew ===
						this
						.oselcObjName.Fullname) {
						sap.m.MessageBox.warning(" This family Member already Selected for this Nominee Benfit type..!!");
						return;
					}
				}
			}

			/*	checking of dupilicates records already existed in the noninee table same name & Benfit type -end*/

			Nominee.setData(data);
			this.NomineeFormModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.NomineeFormModel, "NomineeFormModel");

			this.getView().setModel(this.NomineeFormModel, "NomineeModel");
			this.oNomineeDialog.close();
			// for nominee type doing empty- NomineeAdd fragment
			sap.ui.getCore().byId("NomineeActionId").setValue("");

			//field add or delete buttons enabled on family /Nominee purpose -start
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: true
			});
			this.getView().setModel(oModel, "oViewModel");
			//end
		},
		OnPressCancelNomineeDailog: function(oEvent) {
			// for nominee type doing empty- NomineeAdd fragment
			if (sap.ui.getCore().byId("NomineeActionId")) {
				sap.ui.getCore().byId("NomineeActionId").setValue("");
			}
			this.oNomineeDialog.close();
			/*date value checking of string /not -start*/
			this.oldNomineeData = this.dataMaking(this.oldNomineeData);
			this.NomineeFormModel = new sap.ui.model.json.JSONModel(this.oldNomineeData);
			this.getView().setModel(this.NomineeFormModel, "NomineeFormModel");
			this.NomineeModel = new sap.ui.model.json.JSONModel(this.oldNomineeData);
			this.getView().setModel(this.NomineeModel, "NomineeModel");
			//this.oNomineeDialog.close();
			var nominee = this.getView().getModel("NomineeModel").getData();
			this.getView().byId("idNomineeTableRec").setText("Total Records: " + nominee.length);
			//field add or delte buttons enabled on family /Nominee purpose -start
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: true
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},

		NomineeTablAddItempress: function(Path) {
			this.editNomnee = ""; // new nominee created as kept empty
			var itemPath = "/" + Path;
			// if (this.oNomineeDialog === undefined || this.oNomineeDialog === null)
			if (!this.oNomineeDialog) {
				this.oNomineeDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.NomineeDialogdetails", this);
				this.getView().addDependent(this.oNomineeDialog);
			}
			this.oNomineeDialog.bindElement({
				path: itemPath,
				model: "NomineeFormModel"
			});
			this.oNomineeDialog.open();
			/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			var showValueHelp = function(event) {

				if (event.keyCode === 27) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				} else {
					return true;
				}

			};
			sap.ui.getCore().byId("idNomineeDialogPopup").attachBrowserEvent("keydown", showValueHelp);
			/*		fragment dont close when ESC KEY PRESS - END*/
			//field show / hide in form adde new records purpose
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},
		dateofBirthNominee: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").sPath;
			var nomineeForm = this.getView().getModel("NomineeFormModel");
			nomineeForm.setProperty(itmePath + "/DateOfBirthNew", new Date(selValue));

		},
		NomineeTablItempress: function(oEvent) {
			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			if (EditBurronStatus == "X") {

				var itemPath = oEvent.getParameter("listItem").getBindingContext("NomineeModel").sPath;
				if (this.oNomineeDialogdetailsDisplay === undefined || this.oNomineeDialogdetailsDisplay === null) {
					this.oNomineeDialogdetailsDisplay = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.NomineeDialogdetailsDisplay",
						this);
					this.getView().addDependent(this.oNomineeDialogdetailsDisplay);
				}
				this.oNomineeDialogdetailsDisplay.bindElement({
					path: itemPath,
					model: "NomineeFormModel"
				});
				thisoNomineeDialogdetailsDisplay.open();
			}
			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			this.editNomnee = "Edit"; // existing nominee Edutubg as kept empty
			// old data before cancle write for code of Cancel -start
			var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
			this.oldNomineeData = JSON.parse(JSON.stringify(oNomineeData));
			// end - old data before cancle write for code of Cancel
			var ofobj = oEvent.getParameter("listItem").getBindingContext("NomineeModel").getObject();
			this.familyObj = JSON.parse(JSON.stringify(ofobj));
			if (this.familyObj.__metadata) {
				delete this.familyObj.__metadata;
			}
			if (this.familyObj.Requestdetails) {
				delete this.familyObj.Requestdetails;
			}
			var itemPath = oEvent.getParameter("listItem").getBindingContext("NomineeModel").sPath;
			if (this.oNomineeDialog === undefined || this.oNomineeDialog === null) {
				this.oNomineeDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.NomineeDialogdetails", this);
				this.getView().addDependent(this.oNomineeDialog);
			}
			this.oNomineeDialog.bindElement({
				path: itemPath,
				model: "NomineeFormModel"
			});
			/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
			this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
			if (ofobj.Operation === "DEL") {
				this.oNomineeDialog.getButtons()[0].setText("Close");
			} else {
				this.oNomineeDialog.getButtons()[0].setText("Ok");
			}
			this.oNomineeDialog.open();
			/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			var showValueHelp = function(event) {

				if (event.keyCode === 27) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				} else {
					return true;
				}

			};
			sap.ui.getCore().byId("idNomineeDialogPopup").attachBrowserEvent("keydown", showValueHelp);
			/*		fragment dont close when ESC KEY PRESS - END*/
			/*	date picker only select (no need enter date) - in fragment -cfms_ctm_npv(26_12_22)-start*/
			/*	var dateArray = ["idNomineDateBirthNew"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				sap.ui.getCore().byId("idNomineDateBirthNew").setMaxDate(new Date());*/
			/*	date picker only select (no need enter date) - in fragment -cfms_ctm_npv(26_12_22)-end*/
			/*	field Add or Delete show / hide in form adde new records purpose- cfms_ctm_npv - curent fields */
			var oModel = new JSONModel({
				EditVisibility: true,
				Editable: true
			});
			this.getView().setModel(oModel, "oViewModel");
			/*	field show / hide in form adde new records purpose - curent fields -end */

		},
		OnPressCancelNomineeDailogDisplay: function() {
			thisoNomineeDialogdetailsDisplay.close();
		},
		onDeleteNomineeRow: function(oEvent) {
			var data = this.getView().getModel("NomineeModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
			} else {

				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation == "INS") {
						var spath = SelectedContes[i].sPath.split("/")[1];
						data.splice(parseInt(spath), 1);
					} else {
						SelectedContes[i].getObject().Operation = "DEL";
					}
				}

				this.getView().getModel("NomineeModel").setData(data);

			}
			oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
				var Operation = item.getBindingContext("NomineeModel").getProperty("Operation");
				if (Operation === "DEL") {
					var cb = item.$().find('.sapMCb');
					var oCb = sap.ui.getCore().byId(cb.attr('id'));
					oCb.setEnabled(false);
				}
			});
			var nominee = this.getView().getModel("NomineeModel").getData();
			this.getView().byId("idNomineeTableRec").setText("Total Records: " + nominee.length);

		},
		oHandleShareNomineeLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` A-Za-z~!@#$^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		oHandleShareNomineeChange: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			if (textValue > 100) {
				sap.m.MessageBox.error("Please enter Valid Share (%)");
			}

		},
		HandleRequestofNominee: function(oEvent) {
			var that = this;
			this.NomineeInput = oEvent.getSource();
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestFor", sap.ui.model.FilterOperator.EQ, "N"));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/ValueHelpSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.NomineeDialogFragment) {
						that.NomineeDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.NomineeActionDialog",
							that);
						that.getView().addDependent(that.NomineeDialogFragment);
					}
					that.NomineeDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.NomineeDialogFragment.setModel(oModel, "NomineeDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		ConfirmNomineeDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			this.selecteMemberNomineeDetail = oEvent.getParameter("selectedItem").getBindingContext("NomineeDialogModel").getProperty();
			this.NomineeInput.setValue(sValue);
		},
		liveNomineeDailogsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ValueDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ValueId", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseNomineeDialog: function(oEvent) {
			this.NomineeInput.setValue("");
		},
		onNomRelationchnage: function(oEvent) {
			// combobox in nominee relation
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			// var selValue = oEvent.getSource().getSelectedKey();
			// var selText = oEvent.getSource().getSelectedText();
			// var itmePath = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").sPath;
			// var Nominee = this.getView().getModel("NomineeFormModel");
			// Nominee.setProperty(itmePath + '/RelationdescNew', selText);
		},
		onNomNamechnage: function(oEvent) {
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");

				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
			var oselcObj = key.getBindingContext("NomFamilyData").getProperty();
			this.oselcObjName = oselcObj; // this for validationg in ok click selected benfit type & family member checking pupose
			var data = this.getView().getModel("NomineeModel").getData();
			var Nominee = this.getView().getModel("NomineeFormModel");
			// var itmePath = data.length - 1;
			var itmePath = oEvent.getSource().getParent().getBindingContext("NomineeFormModel").sPath;
			Nominee.setProperty(itmePath + '/RelationNew', oselcObj.MemberType);
			Nominee.setProperty(itmePath + '/RelationdescNew', oselcObj.MembertypeDesc);
			Nominee.setProperty(itmePath + '/DateOfBirthNew', new Date(oselcObj.DateOfBirthNew));

		},

		/*NOminee Details fragment- cfms_Ctm_npv_ end*/
		/*Probation Details fragment- cfms_Ctm_npv_ Start*/
		oNumerofdaysserviceoncurrpostLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		/*Probation Details fragment- cfms_Ctm_npv_ end*/
		/*Paychange Details  fragment- cfms_Ctm_npv_ start*/
		/*	header details code start */
		/*	PayscaleType -f4 -strat*/
		handleReqPayscaleType: function(oEvent) {
			var that = this;
			this.PayScaleTypeInput = oEvent.getSource();
			var Filters = [];
			var flag = "D";
			Filters.push(new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.EQ, flag));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VhpayscaleSet", {
				// filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailPayScaleTypeFragment) {
						that.DetailPayScaleTypeFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.PayScaleTypetDialog",
							that);
						that.getView().addDependent(that.DetailPayScaleTypeFragment);
					}
					that.DetailPayScaleTypeFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailPayScaleTypeFragment.setModel(oModel, "PayScaleTypetDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					var t = JSON.parse(error.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		ConfirmPayscaleDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberPayScaleType = oEvent.getParameter("selectedItem").getBindingContext("PayScaleTypetDialogModel").getProperty();
			this.PayScaleTypeInput.setValue(sDiscripthion);
			this.PayScaleTypeInput.setTooltip(sValue);
			this.PayScaleTypeInput.setName(sValue);
		},
		livePayscaleTypetsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("Payscaletype", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Payscaletypedesc", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		ClosePayScaleTypeDialog: function(oEvent) {
			this.PayScaleTypeInput.setValue("");
			this.PayScaleTypeInput.setTooltip("");
			this.PayScaleTypeInput.setName("");
		},
		/*	PayscaleType -f4 -end*/
		/*	PayscaleArea -f4 -strat*/
		handleReqPayscaleArea: function(oEvent) {
			var that = this;
			this.PayScaleAreaInput = oEvent.getSource();
			var Filters = [];
			// var flag = this.getView().byId("idPayScaleTypeNew").getTooltip();
			var flag = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew;
			//PayscaleTypedescNew
			if (flag == "") {
				sap.m.MessageBox.error("Please select Pay Scale Type Firtst..!!");
				return;
			}
			Filters.push(new sap.ui.model.Filter("Payscaletype", sap.ui.model.FilterOperator.EQ, flag));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VhpayscaleSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailPayScaleAreaFragment) {
						that.DetailPayScaleAreaFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.PayScaleAreaDialog",
							that);
						that.getView().addDependent(that.DetailPayScaleAreaFragment);
					}
					that.DetailPayScaleAreaFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailPayScaleAreaFragment.setModel(oModel, "PayScaleAreaDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					var t = JSON.parse(error.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		ConfirmPayscaleAreaDialog: function(oEvent) {
			if (this.getView().getModel("PaychangeModel").getData().PayscaleAreaNew !== "") {
				var BasicCompForm = this.getView().getModel("PaychangeModel");
				var value = "";
				BasicCompForm.setProperty("/PayscaleGroupNew", value);
				BasicCompForm.setProperty("/PayscaleLevelNew", value);

			}
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberPayScaleArea = oEvent.getParameter("selectedItem").getBindingContext("PayScaleAreaDialogModel").getProperty();
			this.PayScaleAreaInput.setValue(sDiscripthion);
			this.PayScaleAreaInput.setTooltip(sValue);
			this.PayScaleAreaInput.setName(sValue);
		},
		livePayscaleAreasearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("Payscalearea", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Payscaleareadesc", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		ClosePayScaleAreaDialog: function(oEvent) {
			this.PayScaleAreaInput.setValue("");
			this.PayScaleAreaInput.setTooltip("");
			this.PayScaleAreaInput.setName("");
		},
		/*	PayscaleArea -f4 -end*/
		/*	PayscaleGroup -f4 -strat*/
		handleReqPayscaleGroup: function(oEvent) {
			var that = this;
			this.PayscaleGroupInput = oEvent.getSource();
			var Filters = [];
			var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew;
			// this.getView().byId("idPayScaleTypeNew").getTooltip();
			var flag = this.getView().byId("idPayScaleAreaNew").getTooltip();
			if (flag == "") {
				sap.m.MessageBox.error("Please select Pay Scale Area..!!");
				return;
			}
			Filters.push(new sap.ui.model.Filter("Payscaletype", sap.ui.model.FilterOperator.EQ, payscalType),
				new sap.ui.model.Filter("Payscalearea", sap.ui.model.FilterOperator.EQ, flag)
			);
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VhpayscaleSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailPayScaleGroupFragment) {
						that.DetailPayScaleGroupFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.PayscaleGroupDialog",
							that);
						that.getView().addDependent(that.DetailPayScaleGroupFragment);
					}
					that.DetailPayScaleGroupFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailPayScaleGroupFragment.setModel(oModel, "PayscaleGroupDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					var t = JSON.parse(error.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		ConfirmPayscaleGroupDialog: function(oEvent) {
			if (this.getView().getModel("PaychangeModel").getData().PayscaleGroupNew !== "") {
				var BasicCompForm = this.getView().getModel("PaychangeModel");
				var value = "";
				// BasicCompForm.setProperty("/PayscaleGroupNew", value);
				BasicCompForm.setProperty("/PayscaleLevelNew", value);
			}
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberPayScaleGroup = oEvent.getParameter("selectedItem").getBindingContext("PayscaleGroupDialogModel").getProperty();
			this.PayscaleGroupInput.setValue(sDiscripthion);
			this.PayscaleGroupInput.setTooltip(sValue);
			this.PayscaleGroupInput.setName(sValue);
		},
		livePayscaleGroupearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				// new sap.ui.model.Filter("Payscalegroup", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Payscalegroup", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		ClosePayscaleGroupDialog: function(oEvent) {
			this.PayscaleGroupInput.setValue("");
			this.PayscaleGroupInput.setTooltip("");
			this.PayscaleGroupInput.setName("");
		},
		/*	PayscaleGroup -f4 -end*/
		/*	PayscaleLevel -f4 -strat*/
		handleReqPayscaleLevel: function(oEvent) {
			var that = this;
			this.PayscaleLevelInput = oEvent.getSource();
			var Filters = [];
			var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew;
			// this.getView().byId("idPayScaleTypeNew").getTooltip();
			var payscalArea = this.getView().byId("idPayScaleAreaNew").getTooltip();
			var payscalGroup = this.getView().byId("idPayScaleGroupNew").getTooltip();
			if (payscalGroup == "") {
				sap.m.MessageBox.error("Please select Pay Scale Group..!!");
				return;
			}
			Filters.push(new sap.ui.model.Filter("Payscaletype", sap.ui.model.FilterOperator.EQ, payscalType),
				new sap.ui.model.Filter("Payscalearea", sap.ui.model.FilterOperator.EQ, payscalArea),
				new sap.ui.model.Filter("Payscalegroup", sap.ui.model.FilterOperator.EQ, payscalGroup),
			);
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VhpayscaleSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailPayScaleLevelFragment) {
						that.DetailPayScaleLevelFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.PayscaleLevelDialog",
							that);
						that.getView().addDependent(that.DetailPayScaleLevelFragment);
					}
					that.DetailPayScaleLevelFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailPayScaleLevelFragment.setModel(oModel, "PayscaleLevelDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
					var t = JSON.parse(error.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}
			});
		},
		ConfirmPayscaleLevelDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberPayScaleLevel = oEvent.getParameter("selectedItem").getBindingContext("PayscaleLevelDialogModel").getProperty();
			this.PayscaleLevelInput.setValue(sDiscripthion);
			this.PayscaleLevelInput.setTooltip(sValue);
			this.PayscaleLevelInput.setName(sValue);
			this.PaychangeDetailsUpdate(sValue);
		},
		livePayscalelevelearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				// new sap.ui.model.Filter("Payscalelevel", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Payscalelevel", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		ClosePayscaleLevelDialog: function(oEvent) {
			this.PayscaleLevelInput.setValue("");
			this.PayscaleLevelInput.setTooltip("");
			this.PayscaleLevelInput.setName("");
		},
		/*	PayscaleLevel -f4 -end*/
		/*	header details code -end */
		/*	Recurring Payments table -start*/
		RecuringPaymentTablItempress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").getProperty();

			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			/*	for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
						var EditBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
					}
				}*/
			// if (EditBurronStatus == "X" || (EditBurronStatus == "" && this.getView().byId("idEditButton").getText() === "Edit")) {

			var itemPath = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").sPath;

			if (this.oRecurringPaymentsDisplayDetails === undefined || this.oRecurringPaymentsDisplayDetails === null) {
				this.oRecurringPaymentsDisplayDetails = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecurringPaymentsDisplayDetails",
					this);
				this.getView().addDependent(this.oRecurringPaymentsDisplayDetails);
			}
			this.oRecurringPaymentsDisplayDetails.bindElement({
				path: itemPath,
				model: "RecurringTabFormModel"
			});
			this.oRecurringPaymentsDisplayDetails.open();

			// } else {
			// 	/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
			// 	// old data before cancle write for code of Cancel -start
			// 	var oRecurpayData = this.getView().getModel("RecurringTabModel").getData();
			// 	this.oldRecuringPaymentData = JSON.parse(JSON.stringify(oRecurpayData));
			// 	// end - old data before cancle write for code of Cancel
			// 	var ofobj = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").getObject();
			// 	this.recuringPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
			// 	if (this.recuringPaymentDetailsObj.__metadata) {
			// 		delete this.recuringPaymentDetailsObj.__metadata;
			// 	}
			// 	if (this.recuringPaymentDetailsObj.Requestdetails) {
			// 		delete this.recuringPaymentDetailsObj.Requestdetails;
			// 	}
			// 	var itemPath = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").sPath;
			// 	if (this.oRecuringPaymentdetailsDailog === undefined || this.oRecuringPaymentdetailsDailog === null) {
			// 		this.oRecuringPaymentdetailsDailog = sap.ui.xmlfragment(
			// 			"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecuringPaymentdetailsDailog",
			// 			this);
			// 		this.getView().addDependent(this.oRecuringPaymentdetailsDailog);
			// 	}
			// 	this.oRecuringPaymentdetailsDailog.bindElement({
			// 		path: itemPath,
			// 		model: "RecurringTabFormModel"
			// 	});
			// 	/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
			// 	this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
			// 	if (ofobj.Operation === "DEL") {
			// 		this.oRecuringPaymentdetailsDailog.getButtons()[0].setText("Close");
			// 	} else {
			// 		this.oRecuringPaymentdetailsDailog.getButtons()[0].setText("Ok");
			// 	}
			// 	this.oRecuringPaymentdetailsDailog.open();
			// 	/*	date picker only select (no need enter date) - in fragment - -start*/
			// 	var dateArray = ["idStartDateNew_RecuringPaymentDailog", "idEndDateNewRecuringPaymentDailog"];
			// 	dateArray.forEach(date => {
			// 		var oDatePicker = sap.ui.getCore().byId(date);
			// 		// var oDatePicker = this.getView().byId(date);
			// 		oDatePicker.addEventDelegate({
			// 			onAfterRendering: function() {
			// 				var oDateInner = this.$().find('.sapMInputBaseInner');
			// 				var oID = oDateInner[0].id;
			// 				$('#' + oID).attr("disabled", "disabled");
			// 			}
			// 		}, oDatePicker);
			// 	});
			// 	// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
			// 	// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
			// 	/*		date picker only select (no need enter date) - in fragment --End*/
			// 	/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			// 	var showValueHelp = function(event) {

			// 		if (event.keyCode === 27) {
			// 			event.preventDefault();
			// 			event.stopPropagation();
			// 			return false;
			// 		} else {
			// 			return true;
			// 		}

			// 	};
			// 	sap.ui.getCore().byId("idRecuringPaymentdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
			// 	/*		fragment dont close when ESC KEY PRESS - END*/
			// }

			// //field show / hide in form adde new records purpose - curent fields 
			// for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
			// 	if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
			// 		var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
			// 	}
			// }
			// // edit button visibility checking - based on user to add family members and add members
			// if (EditButtonVisible === "X") {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: false
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// } else {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: true
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// }
			//field show / hide in form adde new records purpose - curent fields  -end

		},
		onOkRecuringPaymentsDailog: function(oEvent) {
			if (oEvent.getSource().getText() === "Close") {
				// oEvent.getSource().setText("Ok");
				this.oRecuringPaymentdetailsDailog.close();
				return;
			}
			var itmePath = oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").sPath;
			var chnagObj = oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").getObject();

			// if (chnagObj.FirstNameNew === "" || chnagObj.LastNameNew == "" || chnagObj.GenderNew === "" || chnagObj.DateOfBirthNew === "" ||
			// 	chnagObj.DateOfBirthNew == null ||
			// 	chnagObj.AadharnumberNew === "" || chnagObj.DisablityNew === "" || chnagObj.AliveNew === "" || chnagObj.GovtEmployeNew === "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory Fields..!!");
			// 	return;
			// }
			// if (chnagObj.AliveNew === "N" && (chnagObj.DateOfDeathNew == "" || chnagObj.DateOfDeathNew == null)) {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Date of Death)Fields..!!");
			// 	return;
			// }
			// if (chnagObj.GovtEmployeNew === "01" && chnagObj.ServiceTypeNew == "" && chnagObj.EmployeecodeNew == "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Govt Emp Details Related)Fields..!!");
			// 	return;
			// }

			if (chnagObj.__metadata) {
				delete chnagObj.__metadata;
			}
			if (chnagObj.Requestdetails) {
				delete chnagObj.Requestdetails;
			}
			if (oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").getObject().Operation !== "INS") {
				/*code added for Stop action purpose -start */
				if (oEvent.getSource().getParent().sId === "idRecuringPaymentdetailsDailogStopPopup") {
					if (chnagObj.NewEndda === chnagObj.CurrEndda) {
						sap.m.MessageBox.error("Please Change End Date Begore going to Click OK..!!");
						return;
					}
					if (chnagObj.NewBegda > chnagObj.NewEndda) {
						sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
						return;
					}
					if (chnagObj.NewEndda !== this.recuringPaymentDetailsObj.NewEndda) {
						oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").getObject().Operation = "STP";
					}
				} else {
					/*code added for Stop action purpose -end */
					/*	code added for end date greter than the start date always- start cfms_ctm_npv(16_02_23)*/
					// if (chnagObj.CurrEndda > chnagObj.NewEndda) {
					// 	sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
					// 	return;
					// }
					/*	code added for end date greter than the start date always- end cfms_ctm_npv(16_02_23)*/
					/*	old code -start*/
					if (JSON.stringify(chnagObj) !== JSON.stringify(this.recuringPaymentDetailsObj)) {
						oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").getObject().Operation = "MOD";
					}
					/*	old code -end*/
				}
			}
			var data = this.getView().getModel("RecurringTabFormModel").getData();

			// this.getView().setModel(this.getView().getModel("RecurringTabModel"), "RecurringTabModel");
			var family = this.getView().getModel("RecurringTabModel");
			// if (chnagObj.Operation == "INS") {
			// family.setProperty(itmePath + "/CurrWageType", chnagObj.NewWageType);
			// family.setProperty(itmePath + '/CurrWagetypeText', chnagObj.NewWagetypeText);
			// family.setProperty(itmePath + '/CurrAmount', chnagObj.NewAmount);
			// family.setProperty(itmePath + '/CurrBegda', chnagObj.NewBegda);
			// family.setProperty(itmePath + '/CurrEndda', chnagObj.NewEndda);
			// family.setProperty(itmePath + '/Fullname', chnagObj.LastNameNew + chnagObj.FirstNameNew);
			// family.setProperty(itmePath + '/DateOfBirth', chnagObj.DateOfBirthNew);
			// this._dataConversion(chnagObj.DateOfBirthNew)
			// family.setProperty(itmePath + '/Aadharnumber', chnagObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumber', chnagObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatus', chnagObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSince', chnagObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/Disablity', chnagObj.DisablityNew);
			// family.setProperty(itmePath + '/Alive', chnagObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeath', chnagObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmploye', chnagObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceType', chnagObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/Employeecode', chnagObj.EmployeecodeNew);
			// }
			family.setData(data);
			data = this.dataMaking(data); //date of birth type object convetion
			this.FamilyFormModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.FamilyFormModel, "RecurringTabFormModel");

			// this.getView().setModel(this.simpleModel, "FamilyModel");
			if (oEvent.getSource().getParent().sId === "idRecuringPaymentdetailsDailogStopPopup") {
				this.oRecuringPaymentdetailsStopDailog.close();
			} else {
				this.oRecuringPaymentdetailsDailog.close();
			}
			/*		calling this functon nominee dialog relation or nomineename showing purpose */
			// this.NomineeRelation();

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end
		},
		OnPressCancelRecuringPaymentDialog: function(oEvent) {
			if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
				sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			}
			if (oEvent.getSource().getParent().sId === "idRecuringPaymentdetailsDailogStopPopup") {
				this.oRecuringPaymentdetailsStopDailog.close();
			} else {
				this.oRecuringPaymentdetailsDailog.close();
			}
			/*date value checking of string /not -start*/
			this.oldRecuringPaymentData = this.dataMaking(this.oldRecuringPaymentData);
			this.recuringPaymentFormModel = new sap.ui.model.json.JSONModel(this.oldRecuringPaymentData);
			this.getView().setModel(this.recuringPaymentFormModel, "RecurringTabFormModel");
			this.recuringPaymentModel = new sap.ui.model.json.JSONModel(this.oldRecuringPaymentData);
			// this.basicCompModel 
			this.getView().setModel(this.recuringPaymentModel, "RecurringTabModel");

			var oRecurData = this.getView().getModel("RecurringTabModel").getData();
			this.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + oRecurData.length);

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

			/*this.oldFamilyData  -- for old data before cancel*/
			// var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			// var family = this.getView().getModel("FamilyModel");
			// var data = this.getView().getModel("FamilyFormModel").getData();
			// if (this.familyObj.Operation == "INS") {
			// this.familyObj = JSON.stringify(this.familyObj);

			// family.setProperty(itmePath + "/FirstNameNew", this.familyObj.FirstNameNew);
			// family.setProperty(itmePath + '/LastNameNew', this.familyObj.LastNameNew);
			// family.setProperty(itmePath + '/GenderNew', this.familyObj.GenderNew);
			// family.setProperty(itmePath + '/DateOfBirthNew', this.familyObj.DateOfBirthNew);
			// family.setProperty(itmePath + '/AadharnumberNew', this.familyObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumberNew', this.familyObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatusNew', this.familyObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSinceNew', this.familyObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/DisablityNew', this.familyObj.DisablityNew);
			// family.setProperty(itmePath + '/AliveNew', this.familyObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeathNew', this.familyObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmployeNew', this.familyObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceTypeNew', this.familyObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/EmployeecodeNew', this.familyObj.EmployeecodeNew);
			// family.setProperty(itmePath + '/Operation', this.familyObj.Operation);
			// }
			// family.setData(data);

		},
		onEditRecuringPaymentPaychange: function(oEvent) {
			var data = this.getView().getModel("RecurringTabModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Edit..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("RecurringTabModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var oRecurPayData = this.getView().getModel("RecurringTabModel").getData();
				this.oldRecuringPaymentData = JSON.parse(JSON.stringify(oRecurPayData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("RecurringTabModel").getObject();
				this.recuringPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
				if (this.recuringPaymentDetailsObj.__metadata) {
					delete this.recuringPaymentDetailsObj.__metadata;
				}
				if (this.recuringPaymentDetailsObj.Requestdetails) {
					delete this.recuringPaymentDetailsObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").sPath;
				if (this.oRecuringPaymentdetailsDailog === undefined || this.oRecuringPaymentdetailsDailog === null) {
					this.oRecuringPaymentdetailsDailog = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecuringPaymentdetailsDailog",
						this);
					this.getView().addDependent(this.oRecuringPaymentdetailsDailog);
				}
				this.oRecuringPaymentdetailsDailog.bindElement({
					path: itemPath,
					model: "RecurringTabFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oRecuringPaymentdetailsDailog.getButtons()[0].setText("Close");
				} else {
					this.oRecuringPaymentdetailsDailog.getButtons()[0].setText("Ok");
				}
				this.oRecuringPaymentdetailsDailog.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				var dateArray = ["idStartDateNew_RecuringPaymentDailog", "idEndDateNewRecuringPaymentDailog"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idRecuringPaymentdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		onStopRecuringPaymentPaychange: function(oEvent) {
			var data = this.getView().getModel("RecurringTabModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Stop Wage Type Action..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					// if (SelectedContes[i].getObject().Operation == "INS") {
					// var spath = SelectedContes[i].sPath.split("/")[1];
					// data.splice(parseInt(spath), 1);
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
					// } else {
					// 	SelectedContes[i].getObject().Operation = "DEL";
					// }
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("RecurringTabModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var orecurpayData = this.getView().getModel("RecurringTabModel").getData();
				this.oldRecuringPaymentData = JSON.parse(JSON.stringify(orecurpayData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("RecurringTabModel").getObject();
				// oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").getObject();
				this.recuringPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
				if (this.recuringPaymentDetailsObj.__metadata) {
					delete this.recuringPaymentDetailsObj.__metadata;
				}
				if (this.recuringPaymentDetailsObj.Requestdetails) {
					delete this.recuringPaymentDetailsObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("RecurringTabModel").sPath;
				if (this.oRecuringPaymentdetailsStopDailog === undefined || this.oRecuringPaymentdetailsStopDailog === null) {
					this.oRecuringPaymentdetailsStopDailog = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecuringPaymentdetailsStopDailog",
						this);
					this.getView().addDependent(this.oRecuringPaymentdetailsStopDailog);
				}
				this.oRecuringPaymentdetailsStopDailog.bindElement({
					path: itemPath,
					model: "RecurringTabFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oRecuringPaymentdetailsStopDailog.getButtons()[0].setText("Close");
				} else {
					this.oRecuringPaymentdetailsStopDailog.getButtons()[0].setText("Ok");
				}
				this.oRecuringPaymentdetailsStopDailog.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				var dateArray = ["idStartDateNew_RecuringPaymentDailog_Stop", "idEndDateNewRecuringPaymentDailog_stop"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idRecuringPaymentdetailsDailogStopPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		onDisplayRecurringPaymentsWageTypePaychange: function(oEvent) {
			var data = this.getView().getModel("RecurringTabFormModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Display..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("RecurringTabModel")[0].sPath;
				if (this.oRecurringPaymentsDisplayDetails === undefined || this.oRecurringPaymentsDisplayDetails === null) {
					this.oRecurringPaymentsDisplayDetails = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecurringPaymentsDisplayDetails",
						this);
					this.getView().addDependent(this.oRecurringPaymentsDisplayDetails);
				}
				this.oRecurringPaymentsDisplayDetails.bindElement({
					path: itemPath,
					model: "RecurringTabFormModel"
				});
				this.oRecurringPaymentsDisplayDetails.open();
			}
		},
		OnPressCancelRecurringPaymentsDetailsDisplay: function() {
			this.oRecurringPaymentsDisplayDetails.close();
		},
		startateChangeNewRecuringPayment: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").sPath;
			var RecuringPayment = this.getView().getModel("RecurringTabFormModel");
			RecuringPayment.setProperty(itmePath + "/NewBegda", new Date(selValue));
		},
		EndDateChangeNewRecuringPayment: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("RecurringTabFormModel").sPath;
			var RecuringPayment = this.getView().getModel("RecurringTabFormModel");
			RecuringPayment.setProperty(itmePath + "/NewEndda", new Date(selValue));

		},
		/*	Recurring Payments table -end*/
		/*	Additional Payments table -start*/
		AdditionalPaymentsTablItempress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").getProperty();

			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			/*	for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
						var EditBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
					}
				}*/
			// if (EditBurronStatus == "X" || (EditBurronStatus == "" && this.getView().byId("idEditButton").getText() === "Edit")) {

			var itemPath = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").sPath;

			if (this.oAdditionalPaymentsDisplayDetails === undefined || this.oAdditionalPaymentsDisplayDetails === null) {
				this.oAdditionalPaymentsDisplayDetails = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentsDisplayDetails",
					this);
				this.getView().addDependent(this.oAdditionalPaymentsDisplayDetails);
			}
			this.oAdditionalPaymentsDisplayDetails.bindElement({
				path: itemPath,
				model: "AdditionalPaymentsTabFormModel"
			});
			this.oAdditionalPaymentsDisplayDetails.open();

			// } else {
			// 	/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
			// 	// old data before cancle write for code of Cancel -start
			// 	var oRecurpayData = this.getView().getModel("AdditionalPaymentsTabModel").getData();
			// 	this.oldAdditionalPaymentData = JSON.parse(JSON.stringify(oRecurpayData));
			// 	// end - old data before cancle write for code of Cancel
			// 	var ofobj = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").getObject();
			// 	this.additionalPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
			// 	if (this.additionalPaymentDetailsObj.__metadata) {
			// 		delete this.additionalPaymentDetailsObj.__metadata;
			// 	}
			// 	if (this.additionalPaymentDetailsObj.Requestdetails) {
			// 		delete this.additionalPaymentDetailsObj.Requestdetails;
			// 	}
			// 	var itemPath = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").sPath;
			// 	if (this.oAdditionalPaymentdetailsDailog === undefined || this.oAdditionalPaymentdetailsDailog === null) {
			// 		this.oAdditionalPaymentdetailsDailog = sap.ui.xmlfragment(
			// 			"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentdetailsDailog",
			// 			this);
			// 		this.getView().addDependent(this.oAdditionalPaymentdetailsDailog);
			// 	}
			// 	this.oAdditionalPaymentdetailsDailog.bindElement({
			// 		path: itemPath,
			// 		model: "AdditionalPaymentsTabFormModel"
			// 	});
			// 	/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
			// 	this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
			// 	if (ofobj.Operation === "DEL") {
			// 		this.oAdditionalPaymentdetailsDailog.getButtons()[0].setText("Close");
			// 	} else {
			// 		this.oAdditionalPaymentdetailsDailog.getButtons()[0].setText("Ok");
			// 	}
			// 	this.oAdditionalPaymentdetailsDailog.open();
			// 	/*	date picker only select (no need enter date) - in fragment - -start*/
			// 	var dateArray = ["idStartDateNew_AdditionalPaymentDailog", "idEndDateNewAdditionalPaymentDailog"];
			// 	dateArray.forEach(date => {
			// 		var oDatePicker = sap.ui.getCore().byId(date);
			// 		// var oDatePicker = this.getView().byId(date);
			// 		oDatePicker.addEventDelegate({
			// 			onAfterRendering: function() {
			// 				var oDateInner = this.$().find('.sapMInputBaseInner');
			// 				var oID = oDateInner[0].id;
			// 				$('#' + oID).attr("disabled", "disabled");
			// 			}
			// 		}, oDatePicker);
			// 	});
			// 	// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
			// 	// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
			// 	/*		date picker only select (no need enter date) - in fragment --End*/
			// 	/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			// 	var showValueHelp = function(event) {

			// 		if (event.keyCode === 27) {
			// 			event.preventDefault();
			// 			event.stopPropagation();
			// 			return false;
			// 		} else {
			// 			return true;
			// 		}

			// 	};
			// 	sap.ui.getCore().byId("idAdditionalPaymentsdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
			// 	/*		fragment dont close when ESC KEY PRESS - END*/
			// }

			// //field show / hide in form adde new records purpose - curent fields 
			// for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
			// 	if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
			// 		var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
			// 	}
			// }
			// // edit button visibility checking - based on user to add family members and add members
			// if (EditButtonVisible === "X") {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: false
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// } else {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: true
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// }
			//field show / hide in form adde new records purpose - curent fields  -end

		},
		onOkAdditionalPaymentsDailog: function(oEvent) {
			if (oEvent.getSource().getText() === "Close") {
				// oEvent.getSource().setText("Ok");
				this.oAdditionalPaymentdetailsDailog.close();
				return;
			}
			var itmePath = oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").sPath;
			var chnagObj = oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").getObject();

			// if (chnagObj.FirstNameNew === "" || chnagObj.LastNameNew == "" || chnagObj.GenderNew === "" || chnagObj.DateOfBirthNew === "" ||
			// 	chnagObj.DateOfBirthNew == null ||
			// 	chnagObj.AadharnumberNew === "" || chnagObj.DisablityNew === "" || chnagObj.AliveNew === "" || chnagObj.GovtEmployeNew === "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory Fields..!!");
			// 	return;
			// }
			// if (chnagObj.AliveNew === "N" && (chnagObj.DateOfDeathNew == "" || chnagObj.DateOfDeathNew == null)) {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Date of Death)Fields..!!");
			// 	return;
			// }
			// if (chnagObj.GovtEmployeNew === "01" && chnagObj.ServiceTypeNew == "" && chnagObj.EmployeecodeNew == "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Govt Emp Details Related)Fields..!!");
			// 	return;
			// }

			if (chnagObj.__metadata) {
				delete chnagObj.__metadata;
			}
			if (chnagObj.Requestdetails) {
				delete chnagObj.Requestdetails;
			}
			if (oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").getObject().Operation !== "INS") {
				/*code added for Stop action purpose -start */
				if (oEvent.getSource().getParent().sId === "idAdditionalPaymentsdetailsDailogStopPopup") {
					if (chnagObj.NewEndda === chnagObj.CurrEndda) {
						sap.m.MessageBox.error("Please Change End Date Begore going to Click OK..!!");
						return;
					}
					if (chnagObj.NewBegda > chnagObj.NewEndda) {
						sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
						return;
					}
					if (chnagObj.NewEndda !== this.additionalPaymentDetailsObj.NewEndda) {
						oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").getObject().Operation = "STP";
					}
				} else {
					/*code added for Stop action purpose -end */
					/*	code added for end date greter than the start date always- start cfms_ctm_npv(16_02_23)*/
					// if (chnagObj.CurrEndda > chnagObj.NewEndda) {
					// 	sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
					// 	return;
					// }
					/*	code added for end date greter than the start date always- end cfms_ctm_npv(16_02_23)*/
					/*	old code -start*/
					if (JSON.stringify(chnagObj) !== JSON.stringify(this.additionalPaymentDetailsObj)) {
						oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").getObject().Operation = "MOD";
					}
					/*	old code -end*/
				}
			}
			var data = this.getView().getModel("AdditionalPaymentsTabFormModel").getData();

			// this.getView().setModel(this.getView().getModel("AdditionalPaymentsTabModel"), "AdditionalPaymentsTabModel");
			var additionalPay = this.getView().getModel("AdditionalPaymentsTabModel");
			// if (chnagObj.Operation == "INS") {
			// additionalPay.setProperty(itmePath + "/CurrWageType", chnagObj.NewWageType);
			// additionalPay.setProperty(itmePath + '/CurrWagetypeText', chnagObj.NewWagetypeText);
			// additionalPay.setProperty(itmePath + '/CurrAmount', chnagObj.NewAmount);
			// additionalPay.setProperty(itmePath + '/CurrBegda', chnagObj.NewBegda);
			// additionalPay.setProperty(itmePath + '/CurrEndda', chnagObj.NewEndda);
			// additionalPay.setProperty(itmePath + '/Fullname', chnagObj.LastNameNew + chnagObj.FirstNameNew);
			// additionalPay.setProperty(itmePath + '/DateOfBirth', chnagObj.DateOfBirthNew);
			// this._dataConversion(chnagObj.DateOfBirthNew)
			// additionalPay.setProperty(itmePath + '/Aadharnumber', chnagObj.AadharnumberNew);
			// additionalPay.setProperty(itmePath + '/PhoneNumber', chnagObj.PhoneNumberNew);
			// additionalPay.setProperty(itmePath + '/MaritalStatus', chnagObj.MaritalStatusNew);
			// additionalPay.setProperty(itmePath + '/MarriedSince', chnagObj.MarriedSinceNew);
			// additionalPay.setProperty(itmePath + '/Disablity', chnagObj.DisablityNew);
			// additionalPay.setProperty(itmePath + '/Alive', chnagObj.AliveNew);
			// additionalPay.setProperty(itmePath + '/DateOfDeath', chnagObj.DateOfDeathNew);
			// additionalPay.setProperty(itmePath + '/GovtEmploye', chnagObj.GovtEmployeNew);
			// additionalPay.setProperty(itmePath + '/ServiceType', chnagObj.ServiceTypeNew);
			// additionalPay.setProperty(itmePath + '/Employeecode', chnagObj.EmployeecodeNew);
			// }
			additionalPay.setData(data);
			data = this.dataMaking(data); //date of birth type object convetion
			this.additionalPayFormModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.additionalPayFormModel, "AdditionalPaymentsTabFormModel");

			// this.getView().setModel(this.simpleModel, "FamilyModel");
			if (oEvent.getSource().getParent().sId === "idAdditionalPaymentsdetailsDailogStopPopup") {
				this.oAdditionalPaymentsdetailsStopDailog.close();
			} else {
				this.oAdditionalPaymentdetailsDailog.close();
			}
			/*		calling this functon nominee dialog relation or nomineename showing purpose */
			// this.NomineeRelation();

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end
		},
		OnPressCancelAdditionalPaymentsDialog: function(oEvent) {
			if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
				sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			}
			if (oEvent.getSource().getParent().sId === "idAdditionalPaymentsdetailsDailogStopPopup") {
				this.oAdditionalPaymentsdetailsStopDailog.close();
			} else {
				this.oAdditionalPaymentdetailsDailog.close();
			}
			/*date value checking of string /not -start*/
			this.oldAdditionalPaymentData = this.dataMaking(this.oldAdditionalPaymentData);
			this.additionalPayFormModel = new sap.ui.model.json.JSONModel(this.oldAdditionalPaymentData);
			this.getView().setModel(this.additionalPayFormModel, "AdditionalPaymentsTabFormModel");
			this.recuringPaymentModel = new sap.ui.model.json.JSONModel(this.oldAdditionalPaymentData);
			// this.basicCompModel 
			this.getView().setModel(this.recuringPaymentModel, "AdditionalPaymentsTabModel");

			var oAdditionalData = this.getView().getModel("AdditionalPaymentsTabModel").getData();
			this.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + oAdditionalData.length);

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

			/*this.oldFamilyData  -- for old data before cancel*/
			// var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			// var family = this.getView().getModel("FamilyModel");
			// var data = this.getView().getModel("FamilyFormModel").getData();
			// if (this.familyObj.Operation == "INS") {
			// this.familyObj = JSON.stringify(this.familyObj);

			// family.setProperty(itmePath + "/FirstNameNew", this.familyObj.FirstNameNew);
			// family.setProperty(itmePath + '/LastNameNew', this.familyObj.LastNameNew);
			// family.setProperty(itmePath + '/GenderNew', this.familyObj.GenderNew);
			// family.setProperty(itmePath + '/DateOfBirthNew', this.familyObj.DateOfBirthNew);
			// family.setProperty(itmePath + '/AadharnumberNew', this.familyObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumberNew', this.familyObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatusNew', this.familyObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSinceNew', this.familyObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/DisablityNew', this.familyObj.DisablityNew);
			// family.setProperty(itmePath + '/AliveNew', this.familyObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeathNew', this.familyObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmployeNew', this.familyObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceTypeNew', this.familyObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/EmployeecodeNew', this.familyObj.EmployeecodeNew);
			// family.setProperty(itmePath + '/Operation', this.familyObj.Operation);
			// }
			// family.setData(data);

		},
		onEditAdditionalPaymentsPaychange: function(oEvent) {
			var data = this.getView().getModel("AdditionalPaymentsTabModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Edit..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("AdditionalPaymentsTabModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var oAdditionalPayData = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				this.oldAdditionalPaymentData = JSON.parse(JSON.stringify(oAdditionalPayData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("AdditionalPaymentsTabModel").getObject();
				this.additionalPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
				if (this.additionalPaymentDetailsObj.__metadata) {
					delete this.additionalPaymentDetailsObj.__metadata;
				}
				if (this.additionalPaymentDetailsObj.Requestdetails) {
					delete this.additionalPaymentDetailsObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").sPath;
				if (this.oAdditionalPaymentdetailsDailog === undefined || this.oAdditionalPaymentdetailsDailog === null) {
					this.oAdditionalPaymentdetailsDailog = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentdetailsDailog",
						this);
					this.getView().addDependent(this.oAdditionalPaymentdetailsDailog);
				}
				this.oAdditionalPaymentdetailsDailog.bindElement({
					path: itemPath,
					model: "AdditionalPaymentsTabFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oAdditionalPaymentdetailsDailog.getButtons()[0].setText("Close");
				} else {
					this.oAdditionalPaymentdetailsDailog.getButtons()[0].setText("Ok");
				}
				this.oAdditionalPaymentdetailsDailog.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				// var dateArray = ["idStartDateNew_AdditionalPaymentDailog", "idEndDateNewAdditionalPaymentDailog"];
				var dateArray = ["idNewDateOfOrgiAdditionalPaymentDailog"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idAdditionalPaymentsdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		onStopAdditionalPaymentsPaychange: function(oEvent) {
			var data = this.getView().getModel("AdditionalPaymentsTabModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Stop Wage Type Action..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					// if (SelectedContes[i].getObject().Operation == "INS") {
					// var spath = SelectedContes[i].sPath.split("/")[1];
					// data.splice(parseInt(spath), 1);
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
					// } else {
					// 	SelectedContes[i].getObject().Operation = "DEL";
					// }
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("AdditionalPaymentsTabModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var oAddtionalpayData = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				this.oldAdditionalPaymentData = JSON.parse(JSON.stringify(oAddtionalpayData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("AdditionalPaymentsTabModel").getObject();
				// oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").getObject();
				this.additionalPaymentDetailsObj = JSON.parse(JSON.stringify(ofobj));
				if (this.additionalPaymentDetailsObj.__metadata) {
					delete this.additionalPaymentDetailsObj.__metadata;
				}
				if (this.additionalPaymentDetailsObj.Requestdetails) {
					delete this.additionalPaymentDetailsObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("AdditionalPaymentsTabModel").sPath;
				if (this.oAdditionalPaymentsdetailsStopDailog === undefined || this.oAdditionalPaymentsdetailsStopDailog === null) {
					this.oAdditionalPaymentsdetailsStopDailog = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentdetailsStopDailog",
						this);
					this.getView().addDependent(this.oAdditionalPaymentsdetailsStopDailog);
				}
				this.oAdditionalPaymentsdetailsStopDailog.bindElement({
					path: itemPath,
					model: "AdditionalPaymentsTabFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oAdditionalPaymentsdetailsStopDailog.getButtons()[0].setText("Close");
				} else {
					this.oAdditionalPaymentsdetailsStopDailog.getButtons()[0].setText("Ok");
				}
				this.oAdditionalPaymentsdetailsStopDailog.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				// var dateArray = ["idStartDateNew_AdditionalPaymentDailog_Stop", "idEndDateNewAdditionalPaymentDailog_stop"];
				var dateArray = ["idNewDateOfOrgiAdditionalPaymentDailog_stop"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idAdditionalPaymentsdetailsDailogStopPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		onDisplayAdditionalPaymentsWageTypePaychange: function(oEvent) {
			var data = this.getView().getModel("AdditionalPaymentsTabFormModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Display..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("AdditionalPaymentsTabModel")[0].sPath;
				if (this.oAdditionalPaymentsDisplayDetails === undefined || this.oAdditionalPaymentsDisplayDetails === null) {
					this.oAdditionalPaymentsDisplayDetails = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentsDisplayDetails",
						this);
					this.getView().addDependent(this.oAdditionalPaymentsDisplayDetails);
				}
				this.oAdditionalPaymentsDisplayDetails.bindElement({
					path: itemPath,
					model: "AdditionalPaymentsTabFormModel"
				});
				this.oAdditionalPaymentsDisplayDetails.open();
			}
		},
		OnPressCancelAdditionalPaymentsDetailsDisplay: function() {
			this.oAdditionalPaymentsDisplayDetails.close();
		},
		startateChangeNewAdditionalPayments: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").sPath;
			var AdditionalPayment = this.getView().getModel("AdditionalPaymentsTabFormModel");
			AdditionalPayment.setProperty(itmePath + "/NewBegda", new Date(selValue));
		},
		EndDateChangeNewAdditionalPayments: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").sPath;
			var AdditionalPayment = this.getView().getModel("AdditionalPaymentsTabFormModel");
			AdditionalPayment.setProperty(itmePath + "/NewEndda", new Date(selValue));

		},
		NewDateOfOrginChangeAdditionalPayments: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("AdditionalPaymentsTabFormModel").sPath;
			var AdditionalPayment = this.getView().getModel("AdditionalPaymentsTabFormModel");
			AdditionalPayment.setProperty(itmePath + "/NewDateOfOrgin", new Date(selValue));

		},
		/*	Additional Payments table -end*/
		/*	Basic Components  table -start*/
		onDisplayWageTypePaychange: function(oEvent) {
			var data = this.getView().getModel("BasicComponentModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Display..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("BasicComponentModel")[0].sPath;
				if (this.oBasicComponentsdetailsDisplay === undefined || this.oBasicComponentsdetailsDisplay === null) {
					this.oBasicComponentsdetailsDisplay = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsDisplay",
						this);
					this.getView().addDependent(this.oBasicComponentsdetailsDisplay);
				}
				this.oBasicComponentsdetailsDisplay.bindElement({
					path: itemPath,
					model: "BasicComponentFormModel"
				});
				this.oBasicComponentsdetailsDisplay.open();
			}
		},
		onStopWageTypePaychange: function(oEvent) {
			var data = this.getView().getModel("BasicComponentModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Stop Wage Type Action..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					// if (SelectedContes[i].getObject().Operation == "INS") {
					// var spath = SelectedContes[i].sPath.split("/")[1];
					// data.splice(parseInt(spath), 1);
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
					// } else {
					// 	SelectedContes[i].getObject().Operation = "DEL";
					// }
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().StopAllowed == false) {
						sap.m.MessageBox.error("Stop is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("BasicComponentModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var oBasicPayData = this.getView().getModel("BasicComponentModel").getData();
				this.oldBasicCompData = JSON.parse(JSON.stringify(oBasicPayData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("BasicComponentModel").getObject();
				// oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").getObject();
				this.familyObj = JSON.parse(JSON.stringify(ofobj));
				if (this.familyObj.__metadata) {
					delete this.familyObj.__metadata;
				}
				if (this.familyObj.Requestdetails) {
					delete this.familyObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").sPath;
				if (this.oBasicComponentsdetailsDailogStop === undefined || this.oBasicComponentsdetailsDailogStop === null) {
					this.oBasicComponentsdetailsDailogStop = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsStopDailog",
						this);
					this.getView().addDependent(this.oBasicComponentsdetailsDailogStop);
				}
				this.oBasicComponentsdetailsDailogStop.bindElement({
					path: itemPath,
					model: "BasicComponentFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oBasicComponentsdetailsDailogStop.getButtons()[0].setText("Close");
				} else {
					this.oBasicComponentsdetailsDailogStop.getButtons()[0].setText("Ok");
				}
				this.oBasicComponentsdetailsDailogStop.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				var dateArray = ["idStartDateNew_BasicComponetsDailog_Stop", "idEndDateNewBasicComponetsDailog_stop"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idBasicComponentsdetailsDailogStopPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		OnPressCancelBasicComponentsdetailsDialogStop: function(oEvent) {
			if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
				sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			}
			this.oBasicComponentsdetailsDailogStop.close();
			/*date value checking of string /not -start*/
			this.oldBasicCompData = this.dataMaking(this.oldBasicCompData);
			this.basicCompFormModel = new sap.ui.model.json.JSONModel(this.oldBasicCompData);
			this.getView().setModel(this.basicCompFormModel, "BasicComponentFormModel");
			this.basicCompModel = new sap.ui.model.json.JSONModel(this.oldBasicCompData);
			this.getView().setModel(this.basicCompModel, "BasicComponentModel");

			var ofamily = this.getView().getModel("BasicComponentModel").getData();
			this.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + ofamily.length);

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

			/*this.oldFamilyData  -- for old data before cancel*/
			// var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			// var family = this.getView().getModel("FamilyModel");
			// var data = this.getView().getModel("FamilyFormModel").getData();
			// if (this.familyObj.Operation == "INS") {
			// this.familyObj = JSON.stringify(this.familyObj);

			// family.setProperty(itmePath + "/FirstNameNew", this.familyObj.FirstNameNew);
			// family.setProperty(itmePath + '/LastNameNew', this.familyObj.LastNameNew);
			// family.setProperty(itmePath + '/GenderNew', this.familyObj.GenderNew);
			// family.setProperty(itmePath + '/DateOfBirthNew', this.familyObj.DateOfBirthNew);
			// family.setProperty(itmePath + '/AadharnumberNew', this.familyObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumberNew', this.familyObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatusNew', this.familyObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSinceNew', this.familyObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/DisablityNew', this.familyObj.DisablityNew);
			// family.setProperty(itmePath + '/AliveNew', this.familyObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeathNew', this.familyObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmployeNew', this.familyObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceTypeNew', this.familyObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/EmployeecodeNew', this.familyObj.EmployeecodeNew);
			// family.setProperty(itmePath + '/Operation', this.familyObj.Operation);
			// }
			// family.setData(data);

		},
		onEditWageTypePaychange: function(oEvent) {
			var data = this.getView().getModel("BasicComponentModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			if (SelectedContes.length === 0) {
				sap.m.MessageBox.error("Please select Atleast 1 Record to Edit..!!");
				return;
			} else if (SelectedContes.length > 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				sap.m.MessageBox.error("Please select 1 Record to Display the WageType Details..!!");
				return;
			} else if (SelectedContes.length === 1) {
				/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
				for (var i = 0; i < SelectedContes.length; i++) {
					if (SelectedContes[i].getObject().EditAllowed == false) {
						sap.m.MessageBox.error("Edit is not allowd for selected pay component..!!");
						return;
					}
					if (SelectedContes[i].getObject().Operation === "DEL") {
						sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
						return;
					}
				}
				/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
				var itemPath = oEvent.getSource().getParent().getParent().getSelectedContexts("BasicComponentModel")[0].sPath;
				/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
				// old data before cancle write for code of Cancel -start
				var oFamilyData = this.getView().getModel("BasicComponentModel").getData();
				this.oldBasicCompData = JSON.parse(JSON.stringify(oFamilyData));
				// end - old data before cancle write for code of Cancel
				var ofobj = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext("BasicComponentModel").getObject();
				this.familyObj = JSON.parse(JSON.stringify(ofobj));
				if (this.familyObj.__metadata) {
					delete this.familyObj.__metadata;
				}
				if (this.familyObj.Requestdetails) {
					delete this.familyObj.Requestdetails;
				}
				// var itemPath = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").sPath;
				if (this.oBasicComponentsdetailsDailog === undefined || this.oBasicComponentsdetailsDailog === null) {
					this.oBasicComponentsdetailsDailog = sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsDailog",
						this);
					this.getView().addDependent(this.oBasicComponentsdetailsDailog);
				}
				this.oBasicComponentsdetailsDailog.bindElement({
					path: itemPath,
					model: "BasicComponentFormModel"
				});
				/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
				this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
				if (ofobj.Operation === "DEL") {
					this.oBasicComponentsdetailsDailog.getButtons()[0].setText("Close");
				} else {
					this.oBasicComponentsdetailsDailog.getButtons()[0].setText("Ok");
				}
				this.oBasicComponentsdetailsDailog.open();
				/*	date picker only select (no need enter date) - in fragment - -start*/
				var dateArray = ["idStartDateNew_BasicComponetsDailog", "idEndDateNewBasicComponetsDailog"];
				dateArray.forEach(date => {
					var oDatePicker = sap.ui.getCore().byId(date);
					// var oDatePicker = this.getView().byId(date);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				});
				// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
				// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
				/*		date picker only select (no need enter date) - in fragment --End*/
				/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
				var showValueHelp = function(event) {

					if (event.keyCode === 27) {
						event.preventDefault();
						event.stopPropagation();
						return false;
					} else {
						return true;
					}

				};
				sap.ui.getCore().byId("idBasicComponentsdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
				/*		fragment dont close when ESC KEY PRESS - END*/
			}
		},
		/*	changes done - cfms_ctm_npv - (24_01_23) -start*/
		startateChangeNewBasicComponent: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").sPath;
			var BasicCompForm = this.getView().getModel("BasicComponentFormModel");
			BasicCompForm.setProperty(itmePath + "/NewBegda", new Date(selValue));
			var changedDate = this.changeDateToUTC(new Date(selValue));
		},
		EndDateChangeNewBasicComponent: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// oEvent.getSource().setValue(selValue);
			var itmePath = oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").sPath;
			var BasicCompForm = this.getView().getModel("BasicComponentFormModel");
			BasicCompForm.setProperty(itmePath + "/NewEndda", new Date(selValue));

		},
		dateofNextIncreamentDate: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// var itmePath = oEvent.getSource().getParent().getBindingContext("PaychangeModel").sPath;
			var BasicCompForm = this.getView().getModel("PaychangeModel");
			BasicCompForm.setProperty("/NextincrementdateNew", new Date(selValue));

		},
		dateofNewEffectiveHeaderDate: function(oEvent) {
			var selValue = oEvent.getSource().getValue();
			// var itmePath = oEvent.getSource().getParent().getBindingContext("PaychangeModel").sPath;
			var BasicCompForm = this.getView().getModel("PaychangeModel");
			BasicCompForm.setProperty("/NewEffectivedate", new Date(selValue));

		},
		oHandleWageTypeAmountNewLiveChange: function(oEvent) {
			// for Wage Amount validation in basicComponetrs dailog-fragement
			var textValue = oEvent.getParameters().value;
			// var regex = /[`0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var regex = /[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				// var no_spl_char = textValue.replace(/[`0123456789~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}
		},
		/*	changes done - cfms_ctm_npv - (24_01_23) -end*/
		BasicComponentsTablItempress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").getProperty();

			/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)start */
			/*for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}*/
			// if (EditBurronStatus == "X" || (EditBurronStatus == "" && this.getView().byId("idEditButton").getText() === "Edit")) {

			var itemPath = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").sPath;

			if (this.oBasicComponentsdetailsDisplay === undefined || this.oBasicComponentsdetailsDisplay === null) {
				this.oBasicComponentsdetailsDisplay = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsDisplay",
					this);
				this.getView().addDependent(this.oBasicComponentsdetailsDisplay);
			}
			this.oBasicComponentsdetailsDisplay.bindElement({
				path: itemPath,
				model: "BasicComponentFormModel"
			});
			this.oBasicComponentsdetailsDisplay.open();

			// } else {
			// 	/*the code is added for Edit button is not showing in that time only disply the data to see the user purpose this fragment opening -cfms_Ctm_npv(05_01_23)end */
			// 	// old data before cancle write for code of Cancel -start
			// 	var oFamilyData = this.getView().getModel("BasicComponentModel").getData();
			// 	this.oldBasicCompData = JSON.parse(JSON.stringify(oFamilyData));
			// 	// end - old data before cancle write for code of Cancel
			// 	var ofobj = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").getObject();
			// 	this.familyObj = JSON.parse(JSON.stringify(ofobj));
			// 	if (this.familyObj.__metadata) {
			// 		delete this.familyObj.__metadata;
			// 	}
			// 	if (this.familyObj.Requestdetails) {
			// 		delete this.familyObj.Requestdetails;
			// 	}
			// 	var itemPath = oEvent.getParameter("listItem").getBindingContext("BasicComponentModel").sPath;
			// 	if (this.oBasicComponentsdetailsDailog === undefined || this.oBasicComponentsdetailsDailog === null) {
			// 		this.oBasicComponentsdetailsDailog = sap.ui.xmlfragment(
			// 			"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsDailog",
			// 			this);
			// 		this.getView().addDependent(this.oBasicComponentsdetailsDailog);
			// 	}
			// 	this.oBasicComponentsdetailsDailog.bindElement({
			// 		path: itemPath,
			// 		model: "BasicComponentFormModel"
			// 	});
			// 	/*	this.familyLineItem = new sap.ui.model.json.JSONModel(item);
			// 	this.getView().setModel(this.familyLineItem ,"familyLineItem");*/
			// 	if (ofobj.Operation === "DEL") {
			// 		this.oBasicComponentsdetailsDailog.getButtons()[0].setText("Close");
			// 	} else {
			// 		this.oBasicComponentsdetailsDailog.getButtons()[0].setText("Ok");
			// 	}
			// 	this.oBasicComponentsdetailsDailog.open();
			// 	/*	date picker only select (no need enter date) - in fragment - -start*/
			// 	var dateArray = ["idStartDateNew_BasicComponetsDailog", "idEndDateNewBasicComponetsDailog"];
			// 	dateArray.forEach(date => {
			// 		var oDatePicker = sap.ui.getCore().byId(date);
			// 		// var oDatePicker = this.getView().byId(date);
			// 		oDatePicker.addEventDelegate({
			// 			onAfterRendering: function() {
			// 				var oDateInner = this.$().find('.sapMInputBaseInner');
			// 				var oID = oDateInner[0].id;
			// 				$('#' + oID).attr("disabled", "disabled");
			// 			}
			// 		}, oDatePicker);
			// 	});
			// 	// sap.ui.getCore().byId("idDateofBirthNewFamilyDailog").setMaxDate(new Date());
			// 	// sap.ui.getCore().byId("idMarriedSinceNewFamilyDailog").setMaxDate(new Date());
			// 	/*		date picker only select (no need enter date) - in fragment --End*/
			// 	/*		fragment dont close when ESC KEY PRESS -cfms_ctm_npv - START */
			// 	var showValueHelp = function(event) {

			// 		if (event.keyCode === 27) {
			// 			event.preventDefault();
			// 			event.stopPropagation();
			// 			return false;
			// 		} else {
			// 			return true;
			// 		}

			// 	};
			// 	sap.ui.getCore().byId("idBasicComponentsdetailsDailogPopup").attachBrowserEvent("keydown", showValueHelp);
			// 	/*		fragment dont close when ESC KEY PRESS - END*/
			// }

			// //field show / hide in form adde new records purpose - curent fields 
			// for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
			// 	if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
			// 		var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
			// 	}
			// }
			// // edit button visibility checking - based on user to add family members and add members
			// if (EditButtonVisible === "X") {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: false
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// } else {
			// 	var oModel = new JSONModel({
			// 		EditVisibility: true,
			// 		Editable: true
			// 	});
			// 	this.getView().setModel(oModel, "oViewModel");
			// }
			//field show / hide in form adde new records purpose - curent fields  -end

		},
		OnPressCancelBasicComponentsdetailsDisplay: function() {
			this.oBasicComponentsdetailsDisplay.close();
		},
		// OnPressCancelBasicComponentsdetailsDialog: function() {
		// 	this.oBasicComponentsdetailsDailog.close();
		// },
		onOkBasicComponentsDailog: function(oEvent) {
			if (oEvent.getSource().getText() === "Close") {
				// oEvent.getSource().setText("Ok");
				this.oBasicComponentsdetailsDailog.close();
				return;
			}
			var itmePath = oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").sPath;
			var chnagObj = oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").getObject();

			// if (chnagObj.FirstNameNew === "" || chnagObj.LastNameNew == "" || chnagObj.GenderNew === "" || chnagObj.DateOfBirthNew === "" ||
			// 	chnagObj.DateOfBirthNew == null ||
			// 	chnagObj.AadharnumberNew === "" || chnagObj.DisablityNew === "" || chnagObj.AliveNew === "" || chnagObj.GovtEmployeNew === "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory Fields..!!");
			// 	return;
			// }
			// if (chnagObj.AliveNew === "N" && (chnagObj.DateOfDeathNew == "" || chnagObj.DateOfDeathNew == null)) {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Date of Death)Fields..!!");
			// 	return;
			// }
			// if (chnagObj.GovtEmployeNew === "01" && chnagObj.ServiceTypeNew == "" && chnagObj.EmployeecodeNew == "") {
			// 	sap.m.MessageBox.error("Please fill All Mandatory (Govt Emp Details Related)Fields..!!");
			// 	return;
			// }

			if (chnagObj.__metadata) {
				delete chnagObj.__metadata;
			}
			if (chnagObj.Requestdetails) {
				delete chnagObj.Requestdetails;
			}
			if (oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").getObject().Operation !== "INS") {
				/*code added for Stop action purpose -start */
				if (oEvent.getSource().getParent().sId === "idBasicComponentsdetailsDailogStopPopup") {
					if (chnagObj.NewEndda === chnagObj.CurrEndda) {
						sap.m.MessageBox.error("Please Change End Date Begore going to Click OK..!!");
						return;
					}
					if (chnagObj.NewBegda > chnagObj.NewEndda) {
						sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
						return;
					}
					if (chnagObj.NewEndda !== this.familyObj.NewEndda) {
						oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").getObject().Operation = "STP";
					}
				} else {
					/*code added for Stop action purpose -end */
					/*	code added for end date greter than the start date always- start cfms_ctm_npv(16_02_23)*/
					// if (chnagObj.CurrEndda > chnagObj.NewEndda) {
					// 	sap.m.MessageBox.error("Please slecect End date greater than Start Date..!!");
					// 	return;
					// }
					/*	code added for end date greter than the start date always- end cfms_ctm_npv(16_02_23)*/
					/*	old code -start*/
					if (JSON.stringify(chnagObj) !== JSON.stringify(this.familyObj)) {
						oEvent.getSource().getParent().getBindingContext("BasicComponentFormModel").getObject().Operation = "MOD";
					}
					/*	old code -end*/
				}
			}
			var data = this.getView().getModel("BasicComponentFormModel").getData();

			// this.getView().setModel(this.getView().getModel("BasicComponentModel"), "BasicComponentModel");
			var family = this.getView().getModel("BasicComponentModel");
			// if (chnagObj.Operation == "INS") {
			// family.setProperty(itmePath + "/CurrWageType", chnagObj.NewWageType);
			// family.setProperty(itmePath + '/CurrWagetypeText', chnagObj.NewWagetypeText);
			// family.setProperty(itmePath + '/CurrAmount', chnagObj.NewAmount);
			// family.setProperty(itmePath + '/CurrBegda', chnagObj.NewBegda);
			// family.setProperty(itmePath + '/CurrEndda', chnagObj.NewEndda);
			// family.setProperty(itmePath + '/Fullname', chnagObj.LastNameNew + chnagObj.FirstNameNew);
			// family.setProperty(itmePath + '/DateOfBirth', chnagObj.DateOfBirthNew);
			// this._dataConversion(chnagObj.DateOfBirthNew)
			// family.setProperty(itmePath + '/Aadharnumber', chnagObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumber', chnagObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatus', chnagObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSince', chnagObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/Disablity', chnagObj.DisablityNew);
			// family.setProperty(itmePath + '/Alive', chnagObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeath', chnagObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmploye', chnagObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceType', chnagObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/Employeecode', chnagObj.EmployeecodeNew);
			// }
			family.setData(data);
			data = this.dataMaking(data); //date of birth type object convetion
			this.FamilyFormModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.FamilyFormModel, "BasicComponentFormModel");

			// this.getView().setModel(this.simpleModel, "FamilyModel");
			if (oEvent.getSource().getParent().sId === "idBasicComponentsdetailsDailogStopPopup") {
				this.oBasicComponentsdetailsDailogStop.close();
			} else {
				this.oBasicComponentsdetailsDailog.close();
			}
			/*		calling this functon nominee dialog relation or nomineename showing purpose */
			// this.NomineeRelation();

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end
		},
		onDeleteWageTypeyRow: function(oEvent) {
			// Deletion of wage type may leads to deduction the net payment of the salary bill, do you want to continue. 
			// for identifing the which table in based on tab
			var SeletTab = oEvent.getSource().getParent().getParent().getParent().getKey();
			if (SeletTab === "BasicComp") {
				var data = this.getView().getModel("BasicComponentModel").getData();
				var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
				if (SelectedContes.length === 0) {
					sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
				} else {
					/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
					for (var i = 0; i < SelectedContes.length; i++) {
						if (SelectedContes[i].getObject().DeleteAllowed == false) {
							sap.m.MessageBox.error("Delete is not allowd for selected pay component..!!");
							return;
						}
						if (SelectedContes[i].getObject().Operation === "DEL") {
							sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
							return;
						}
					}
					/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
					/*	message confirm purpose code added - start -cfms_ctm_npv -(16_2_23)*/
					sap.m.MessageBox.confirm(
						"Deletion of wage type may leads to deduction the net payment of the salary bill, do you want to continue ?", {
							actions: ["YES", "NO"],
							onClose: function(sAction) {
								if (sAction === "YES") {
									for (var i = 0; i < SelectedContes.length; i++) {
										if (SelectedContes[i].getObject().Operation == "INS") {
											var spath = SelectedContes[i].sPath.split("/")[1];
											data.splice(parseInt(spath), 1);

										} else {
											SelectedContes[i].getObject().Operation = "DEL";
										}
									}
									// aTable.getModel().setData(data);
									// 	aTable.getModel().refresh();
									if (SeletTab === "BasicComp") {
										this.getView().getModel("BasicComponentModel").setData(data);
									}
								}

							}.bind(this)
						});
					/*	this.simpleModel = new sap.ui.model.json.JSONModel(data);
						this.getView().setModel(this.simpleModel, "BasicComponentModel");*/

					// var data = aTable.getModel().getData().oInvoice;

					// var spath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
					/*		calling this functon nominee dialog relation or nomineename showing purpose */
					// this.NomineeRelation();

				}
				/*this code for delete records again user sholud not selct for written - start - (cfms_ctm_npv)- 16_02_23 commented*/
				// oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
				// 	var Operation = item.getBindingContext("BasicComponentModel").getProperty("Operation");
				// 	if (Operation === "DEL") {
				// 		var cb = item.$().find('.sapMCb');
				// 		var oCb = sap.ui.getCore().byId(cb.attr('id'));
				// 		oCb.setEnabled(false);
				// 	}
				// });
				/*this code for delete records again user sholud not selct for written - start - (cfms_ctm_npv)- 16_02_23 commented*/
				/* table count  update - puropse write  - start*/
				var basicComp = this.getView().getModel("BasicComponentModel").getData();
				this.getView().byId("idBasicComponentsTableRec").setText(
					"Total Records: " + basicComp.length);
				/* table count  update - puropse write  - end*/
			} else if (SeletTab === "RecuringPayment") {
				// RecuringPayment tab
				var data = this.getView().getModel("RecurringTabModel").getData();
				var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
				if (SelectedContes.length === 0) {
					sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
				} else {

					/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
					for (var i = 0; i < SelectedContes.length; i++) {
						if (SelectedContes[i].getObject().DeleteAllowed == false) {
							sap.m.MessageBox.error("Delete is not allowd for selected pay component..!!");
							return;
						}
						if (SelectedContes[i].getObject().Operation === "DEL") {
							sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
							return;
						}
					}
					/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
					/*	message confirm purpose code added - start -cfms_ctm_npv -(16_2_23)*/
					sap.m.MessageBox.confirm(
						"Deletion of wage type may leads to deduction the net payment of the salary bill, do you want to continue ?", {
							actions: ["YES", "NO"],
							onClose: function(sAction) {
								if (sAction === "YES") {
									for (var i = 0; i < SelectedContes.length; i++) {
										if (SelectedContes[i].getObject().Operation == "INS") {
											var spath = SelectedContes[i].sPath.split("/")[1];
											data.splice(parseInt(spath), 1);

										} else {
											SelectedContes[i].getObject().Operation = "DEL";
										}
									}
									// aTable.getModel().setData(data);
									// 	aTable.getModel().refresh();
									if (SeletTab === "RecuringPayment") {
										this.getView().getModel("RecurringTabModel").setData(data);
									}
								}

							}.bind(this)
						});
					// for (var i = 0; i < SelectedContes.length; i++) {
					// 	if (SelectedContes[i].getObject().Operation == "INS") {
					// 		var spath = SelectedContes[i].sPath.split("/")[1];
					// 		data.splice(parseInt(spath), 1);

					// 	} else {
					// 		SelectedContes[i].getObject().Operation = "DEL";
					// 	}
					// }

					/*	this.simpleModel = new sap.ui.model.json.JSONModel(data);
						this.getView().setModel(this.simpleModel, "RecurringTabModel");*/

					// var data = aTable.getModel().getData().oInvoice;

					// var spath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
					/*		calling this functon nominee dialog relation or nomineename showing purpose */
					// this.NomineeRelation();

				}
				/*this code for delete records again user sholud not selct for written - start - (cfms_ctm_npv)- 16_02_23 commented*/
				// oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
				// 	var Operation = item.getBindingContext("RecurringTabFormModel").getProperty("Operation");
				// 	if (Operation === "DEL") {
				// 		var cb = item.$().find('.sapMCb');
				// 		var oCb = sap.ui.getCore().byId(cb.attr('id'));
				// 		oCb.setEnabled(false);
				// 	}
				// });
				/*this code for delete records again user sholud not selct for written - start - (cfms_ctm_npv)- 16_02_23 commented*/
				/* table count  update - puropse write  - start*/
				var RecuringPayment = this.getView().getModel("RecurringTabModel").getData();
				this.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + RecuringPayment.length);
				/* table count  update - puropse write  - end*/

			} else if (SeletTab === "AdditionalPayments") {
				var data = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
				if (SelectedContes.length === 0) {
					sap.m.MessageBox.error("Please select Atleast 1 Record to Delete..!!");
				} else {
					/*for (var i = 0; i < SelectedContes.length; i++) {
						if (SelectedContes[i].getObject().Operation == "INS") {
							var spath = SelectedContes[i].sPath.split("/")[1];
							data.splice(parseInt(spath), 1);

						} else {
							SelectedContes[i].getObject().Operation = "DEL";
						}
					}*/
					/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
					for (var i = 0; i < SelectedContes.length; i++) {
						if (SelectedContes[i].getObject().DeleteAllowed == false) {
							sap.m.MessageBox.error("Delete is not allowd for selected pay component..!!");
							return;
						}
						if (SelectedContes[i].getObject().Operation === "DEL") {
							sap.m.MessageBox.error("Please select Other than Delete Record to Display the WageType Details..!!");
							return;
						}
					}
					/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
					sap.m.MessageBox.confirm(
						"Deletion of wage type may leads to deduction the net payment of the salary bill, do you want to continue ?", {
							actions: ["YES", "NO"],
							onClose: function(sAction) {
								if (sAction === "YES") {
									for (var i = 0; i < SelectedContes.length; i++) {
										if (SelectedContes[i].getObject().Operation == "INS") {
											var spath = SelectedContes[i].sPath.split("/")[1];
											data.splice(parseInt(spath), 1);

										} else {
											SelectedContes[i].getObject().Operation = "DEL";
										}
									}
									// aTable.getModel().setData(data);
									// 	aTable.getModel().refresh();
									if (SeletTab === "AdditionalPayments") {
										this.getView().getModel("AdditionalPaymentsTabModel").setData(data);
									}
								}

							}.bind(this)
						});

					// var data = aTable.getModel().getData().oInvoice;

					// var spath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
					/*		calling this functon nominee dialog relation or nomineename showing purpose */
					// this.NomineeRelation();

				}
				/*this code for delete records again user sholud not selct for written - start - (cfms_ctm_npv)- 16_02_23 commented*/
				/*oEvent.getSource().getParent().getParent().getItems().forEach(function(item) {
					var Operation = item.getBindingContext("AdditionalPaymentsTabModel").getProperty("Operation");
					if (Operation === "DEL") {
						var cb = item.$().find('.sapMCb');
						var oCb = sap.ui.getCore().byId(cb.attr('id'));
						oCb.setEnabled(false);
					}
				});*/
				/*this code for delete records again user sholud not selct for written - end - (cfms_ctm_npv)- 16_02_23 commented*/
				/* table count  update - puropse write  - start*/
				var AdditionalPayment = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				this.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + AdditionalPayment.length);
				/* table count  update - puropse write  - end*/

			}

		},
		OnPressCancelBasicComponentsdetailsDialog: function(oEvent) {
			if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
				sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			}
			if (oEvent.getSource().getParent().sId === "idBasicComponentsdetailsDailogStopPopup") {
				this.oBasicComponentsdetailsDailogStop.close();
			} else {
				this.oBasicComponentsdetailsDailog.close();
			}
			/*date value checking of string /not -start*/
			this.oldBasicCompData = this.dataMaking(this.oldBasicCompData);
			this.basicCompFormModel = new sap.ui.model.json.JSONModel(this.oldBasicCompData);
			this.getView().setModel(this.basicCompFormModel, "BasicComponentFormModel");
			this.basicCompModel = new sap.ui.model.json.JSONModel(this.oldBasicCompData);
			this.getView().setModel(this.basicCompModel, "BasicComponentModel");

			var ofamily = this.getView().getModel("BasicComponentModel").getData();
			this.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + ofamily.length);

			//field show / hide in form adde new records purpose - curent fields 
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "EDIT") {
					var EditButtonVisible = this.getView().getModel("ButtonVisibleModel").getData()[i].Hide;
				}
			}
			// edit button visibility checking - based on user to add family members and add members
			if (EditButtonVisible === "X") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			} else {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: true
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			//field show / hide in form adde new records purpose - curent fields  -end

			/*this.oldFamilyData  -- for old data before cancel*/
			// var itmePath = oEvent.getSource().getParent().getBindingContext("FamilyFormModel").sPath;
			// var family = this.getView().getModel("FamilyModel");
			// var data = this.getView().getModel("FamilyFormModel").getData();
			// if (this.familyObj.Operation == "INS") {
			// this.familyObj = JSON.stringify(this.familyObj);

			// family.setProperty(itmePath + "/FirstNameNew", this.familyObj.FirstNameNew);
			// family.setProperty(itmePath + '/LastNameNew', this.familyObj.LastNameNew);
			// family.setProperty(itmePath + '/GenderNew', this.familyObj.GenderNew);
			// family.setProperty(itmePath + '/DateOfBirthNew', this.familyObj.DateOfBirthNew);
			// family.setProperty(itmePath + '/AadharnumberNew', this.familyObj.AadharnumberNew);
			// family.setProperty(itmePath + '/PhoneNumberNew', this.familyObj.PhoneNumberNew);
			// family.setProperty(itmePath + '/MaritalStatusNew', this.familyObj.MaritalStatusNew);
			// family.setProperty(itmePath + '/MarriedSinceNew', this.familyObj.MarriedSinceNew);
			// family.setProperty(itmePath + '/DisablityNew', this.familyObj.DisablityNew);
			// family.setProperty(itmePath + '/AliveNew', this.familyObj.AliveNew);
			// family.setProperty(itmePath + '/DateOfDeathNew', this.familyObj.DateOfDeathNew);
			// family.setProperty(itmePath + '/GovtEmployeNew', this.familyObj.GovtEmployeNew);
			// family.setProperty(itmePath + '/ServiceTypeNew', this.familyObj.ServiceTypeNew);
			// family.setProperty(itmePath + '/EmployeecodeNew', this.familyObj.EmployeecodeNew);
			// family.setProperty(itmePath + '/Operation', this.familyObj.Operation);
			// }
			// family.setData(data);

		},

		BasicComponentMemberNewAddConfirm: function(oEvent) {

			if (this.infotype === "0008") {
				var selMember = sap.ui.getCore().byId("DetailActionWageTypeId").getValue();
				if (selMember == "") {
					sap.m.MessageBox.error("Please select Value to Add Member..!!");
					return;
				}
				this.AddWageTypeFragment.close();
				// old data before cancle write for code of Cancel -start
				// var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
				var oFamilyData = this.getView().getModel("BasicComponentModel").getData();
				this.oldFamilyData = JSON.parse(JSON.stringify(oFamilyData));
				// end - old data before cancle write for code of Cancel
				var data = this.getView().getModel("BasicComponentModel").getData();
				var lastRecord = this.getView().getModel("BasicComponentModel").getData()[data.length - 1];
				// if condition for last record is empty or not empty for checking each propery- 
				// lastRecord.Operation !== "INS" && 
				// if (lastRecord.Aadharnumber !== "" || lastRecord.AadharnumberNew !== "" ||
				// 	lastRecord.DateOfBirth !== "" || lastRecord.DateOfBirthNew !== "" || lastRecord.DateOfDeath !== "" || lastRecord.Disablity !== "" ||
				// 	lastRecord.DisablityNew !== "" ||
				// 	lastRecord.Employeecode !== "" || lastRecord.EmployeecodeNew !== "" || lastRecord.FirstName !== "" || lastRecord.FirstNameNew !==
				// 	"" || lastRecord.Gender !== "" ||
				// 	lastRecord.GenderNew !== "" || lastRecord.GovtEmploye !== "" || lastRecord.GovtEmployeNew !== "" || lastRecord.LastName !== "" ||
				// 	lastRecord.LastNameNew !== "" || lastRecord.MaritalStatus !== "" || lastRecord.MaritalStatusNew !== "" || lastRecord.MarriedSince !==
				// 	"" || lastRecord.MarriedSinceNew !== "" || lastRecord.MemberType !== "" || lastRecord.Pernr !== "" || lastRecord.PhoneNumber !==
				// 	"" || lastRecord.PhoneNumberNew !== "" || lastRecord.RequestGuid !== "" || lastRecord.ServiceType !== "" || lastRecord.ServiceTypeNew !==
				// 	"") {
				var famObj = {
					// Aadharnumber: "",
					// AadharnumberNew: "",
					// Alive: "X",
					// AliveNew: "X",
					// DateOfBirth: null,
					// DateOfBirthNew: null,
					// DateOfDeath: null,
					// DateOfDeathNew: null,
					// Disablity: "",
					// DisablityNew: "",
					// Employeecode: "",
					// EmployeecodeNew: "",
					// FirstName: "",
					// FirstNameNew: "",
					// Gender: "",
					// GenderNew: "",
					// GovtEmploye: "",
					// GovtEmployeNew: "",
					// LastName: "",
					// LastNameNew: "",
					// MaritalStatus: "",
					// MaritalStatusNew: "",
					// MarriedSince: null,
					// MarriedSinceNew: null,
					// MemberType: this.selectFamilyMemberDetails.ValueId,
					// MembertypeDesc: this.selectFamilyMemberDetails.ValueDesc,
					// Pernr: "",
					// PhoneNumber: "",
					// PhoneNumberNew: "",
					// RequestGuid: "",
					// ServiceType: "",
					// ServiceTypeNew: "",
					// Operation: "INS",
					// Remarks: "",
					// Seqnr: "",
					// selectWageTypeDetails
					// Serialno: data.length + 1,
					Serialno: (data.length + 1).toString(),
					Comments: "",
					CurrAmount: "0",
					CurrBasicAmount: "0",
					CurrBegda: null,
					CurrCurrency: "0.00",
					CurrDateOfOrgin: null,
					CurrEndda: null,
					CurrPercentage: "0",
					CurrWageType: this.selectWageTypeDetails.Wagetype,
					CurrWagetypeText: this.selectWageTypeDetails.wagedesc,
					Infotype: "0008",
					NewAmount: "0",
					NewBasicAmount: "0",
					NewBegda: null,
					NewCurrency: "0.00",
					NewDateOfOrgin: null,
					NewEndda: new Date(9999, 11, 31),
					NewPercentage: "0",
					NewWageType: this.selectWageTypeDetails.Wagetype,
					NewWagetypeText: this.selectWageTypeDetails.wagedesc,
					Operation: "INS",
					Pernr: "",
					Requestdetails: {
						ActionId: "",
						ActionName: "",
						ActionReasonId: "",
						ActionReasonName: "",
						ActionType: "",
						ApplicationName: "",
						CreatedBy: "",
						CreatedByName: "",
						CreatedOn: null,
						EffectiveDate: null,
						EmailAddress: "",
						EmployeeName: "",
						EmployeeStatus: "",
						FundcenterId: "",
						FundcenterName: "",
						JobId: "",
						MobileNumber: "",
						NoOfEmployees: 0,
						OfficeId: "",
						OfficeName: "",
						OverallStatus: "",
						PayrollStatus: "",
						Pernr: "",
						PositionId: "",
						PositionName: "",
						PrevReferenceNumber: "",
						ReferenceNumber: "",
						RelationId: "",
						ReqStatus: "",
						RequestGuid: "",
						TransStatus: "",
						UpdatedBy: "",
						UpdatedByName: "",
						// UpdatedOn: null,
						UpdatedTime: {
							ms: 0,
							__edmType: 'Edm.Time'
						}
						// ServiceType: "",
						//ServiceTypeNew: ""
					}
				};
				data.push(famObj);
				this.familyObj = JSON.parse(JSON.stringify(famObj));
				/*date value checking of string /not -start*/
				var data = this.dataMaking(data);
				var simpleModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(simpleModel, "BasicComponentModel");
				this.basicCompTablAddItempress(data.length - 1);

				var familyForm = this.getView().getModel("BasicComponentFormModel");
				familyForm.setData(data);
				/* table count  update - puropse write  - start*/
				var family = this.getView().getModel("BasicComponentModel").getData();
				this.getView().byId("idBasicComponentsTableRec").setText("Total Records: " + family.length);
				/* table count  update - puropse write  - end*/
				// }

			} else if (this.infotype === "0014") {
				var selMember = sap.ui.getCore().byId("DetailActionWageTypeId").getValue();
				if (selMember == "") {
					sap.m.MessageBox.error("Please select Value to Add Member..!!");
					return;
				}
				this.AddWageTypeFragment.close();
				// old data before cancle write for code of Cancel -start
				// var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
				var oRecuringPaymentData = this.getView().getModel("RecurringTabModel").getData();
				this.oldRecuringPaymentData = JSON.parse(JSON.stringify(oRecuringPaymentData));
				// end - old data before cancle write for code of Cancel
				var data = this.getView().getModel("RecurringTabModel").getData();
				var lastRecord = this.getView().getModel("RecurringTabModel").getData()[data.length - 1];
				// if condition for last record is empty or not empty for checking each propery- 
				// lastRecord.Operation !== "INS" && 
				// if (lastRecord.Aadharnumber !== "" || lastRecord.AadharnumberNew !== "" ||
				// 	lastRecord.DateOfBirth !== "" || lastRecord.DateOfBirthNew !== "" || lastRecord.DateOfDeath !== "" || lastRecord.Disablity !== "" ||
				// 	lastRecord.DisablityNew !== "" ||
				// 	lastRecord.Employeecode !== "" || lastRecord.EmployeecodeNew !== "" || lastRecord.FirstName !== "" || lastRecord.FirstNameNew !==
				// 	"" || lastRecord.Gender !== "" ||
				// 	lastRecord.GenderNew !== "" || lastRecord.GovtEmploye !== "" || lastRecord.GovtEmployeNew !== "" || lastRecord.LastName !== "" ||
				// 	lastRecord.LastNameNew !== "" || lastRecord.MaritalStatus !== "" || lastRecord.MaritalStatusNew !== "" || lastRecord.MarriedSince !==
				// 	"" || lastRecord.MarriedSinceNew !== "" || lastRecord.MemberType !== "" || lastRecord.Pernr !== "" || lastRecord.PhoneNumber !==
				// 	"" || lastRecord.PhoneNumberNew !== "" || lastRecord.RequestGuid !== "" || lastRecord.ServiceType !== "" || lastRecord.ServiceTypeNew !==
				// 	"") {
				var RecuringPaymentObj = {
					// Aadharnumber: "",
					// AadharnumberNew: "",
					// Alive: "X",
					// AliveNew: "X",
					// DateOfBirth: null,
					// DateOfBirthNew: null,
					// DateOfDeath: null,
					// DateOfDeathNew: null,
					// Disablity: "",
					// DisablityNew: "",
					// Employeecode: "",
					// EmployeecodeNew: "",
					// FirstName: "",
					// FirstNameNew: "",
					// Gender: "",
					// GenderNew: "",
					// GovtEmploye: "",
					// GovtEmployeNew: "",
					// LastName: "",
					// LastNameNew: "",
					// MaritalStatus: "",
					// MaritalStatusNew: "",
					// MarriedSince: null,
					// MarriedSinceNew: null,
					// MemberType: this.selectFamilyMemberDetails.ValueId,
					// MembertypeDesc: this.selectFamilyMemberDetails.ValueDesc,
					// Pernr: "",
					// PhoneNumber: "",
					// PhoneNumberNew: "",
					// RequestGuid: "",
					// ServiceType: "",
					// ServiceTypeNew: "",
					// Operation: "INS",
					// Remarks: "",
					// Seqnr: "",
					// selectWageTypeDetails
					// Serialno: data.length + 1,
					Serialno: (data.length + 1).toString(),
					Comments: "",
					CurrAmount: "0",
					CurrBasicAmount: "0",
					CurrBegda: null,
					CurrCurrency: "0.00",
					CurrDateOfOrgin: null,
					CurrEndda: null,
					CurrPercentage: "0",
					CurrWageType: this.selectWageTypeDetails.Wagetype,
					CurrWagetypeText: this.selectWageTypeDetails.wagedesc,
					Infotype: "0014",
					NewAmount: "0",
					NewBasicAmount: "0",
					NewBegda: null,
					NewCurrency: "0.00",
					NewDateOfOrgin: null,
					NewEndda: new Date(9999, 11, 31),
					NewPercentage: "0",
					NewWageType: this.selectWageTypeDetails.Wagetype,
					NewWagetypeText: this.selectWageTypeDetails.wagedesc,
					Operation: "INS",
					Pernr: "",
					Requestdetails: {
						ActionId: "",
						ActionName: "",
						ActionReasonId: "",
						ActionReasonName: "",
						ActionType: "",
						ApplicationName: "",
						CreatedBy: "",
						CreatedByName: "",
						CreatedOn: null,
						EffectiveDate: null,
						EmailAddress: "",
						EmployeeName: "",
						EmployeeStatus: "",
						FundcenterId: "",
						FundcenterName: "",
						JobId: "",
						MobileNumber: "",
						NoOfEmployees: 0,
						OfficeId: "",
						OfficeName: "",
						OverallStatus: "",
						PayrollStatus: "",
						Pernr: "",
						PositionId: "",
						PositionName: "",
						PrevReferenceNumber: "",
						ReferenceNumber: "",
						RelationId: "",
						ReqStatus: "",
						RequestGuid: "",
						TransStatus: "",
						UpdatedBy: "",
						UpdatedByName: "",
						// UpdatedOn: null,
						UpdatedTime: {
							ms: 0,
							__edmType: 'Edm.Time'
						}
						// ServiceType: "",
						//ServiceTypeNew: ""
					}
				};
				data.push(RecuringPaymentObj);
				this.recuringPaymentDetailsObj = JSON.parse(JSON.stringify(RecuringPaymentObj));
				/*date value checking of string /not -start*/
				var data = this.dataMaking(data);
				var simpleModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(simpleModel, "RecurringTabModel");
				this.RecuringPaymentTablAddItempress(data.length - 1);

				var RecuringPaymentForm = this.getView().getModel("RecurringTabFormModel");
				RecuringPaymentForm.setData(data);
				/* table count  update - puropse write  - start*/
				var RecuringPayment = this.getView().getModel("RecurringTabModel").getData();
				this.getView().byId("idRecuringPaymentTableRec").setText("Total Records: " + RecuringPayment.length);
				/* table count  update - puropse write  - end*/
				// }

			} else if (this.infotype === "0015") {
				var selMember = sap.ui.getCore().byId("DetailActionWageTypeId").getValue();
				if (selMember == "") {
					sap.m.MessageBox.error("Please select Value to Add Member..!!");
					return;
				}
				this.AddWageTypeFragment.close();
				// old data before cancle write for code of Cancel -start
				// var oNomineeData = this.getView().getModel("NomineeFormModel").getData();
				var oAdditionalPaymentsData = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				this.oldAdditionalPaymentData = JSON.parse(JSON.stringify(oAdditionalPaymentsData));
				// end - old data before cancle write for code of Cancel
				var data = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				var lastRecord = this.getView().getModel("AdditionalPaymentsTabModel").getData()[data.length - 1];
				// if condition for last record is empty or not empty for checking each propery- 
				// lastRecord.Operation !== "INS" && 
				// if (lastRecord.Aadharnumber !== "" || lastRecord.AadharnumberNew !== "" ||
				// 	lastRecord.DateOfBirth !== "" || lastRecord.DateOfBirthNew !== "" || lastRecord.DateOfDeath !== "" || lastRecord.Disablity !== "" ||
				// 	lastRecord.DisablityNew !== "" ||
				// 	lastRecord.Employeecode !== "" || lastRecord.EmployeecodeNew !== "" || lastRecord.FirstName !== "" || lastRecord.FirstNameNew !==
				// 	"" || lastRecord.Gender !== "" ||
				// 	lastRecord.GenderNew !== "" || lastRecord.GovtEmploye !== "" || lastRecord.GovtEmployeNew !== "" || lastRecord.LastName !== "" ||
				// 	lastRecord.LastNameNew !== "" || lastRecord.MaritalStatus !== "" || lastRecord.MaritalStatusNew !== "" || lastRecord.MarriedSince !==
				// 	"" || lastRecord.MarriedSinceNew !== "" || lastRecord.MemberType !== "" || lastRecord.Pernr !== "" || lastRecord.PhoneNumber !==
				// 	"" || lastRecord.PhoneNumberNew !== "" || lastRecord.RequestGuid !== "" || lastRecord.ServiceType !== "" || lastRecord.ServiceTypeNew !==
				// 	"") {
				var AdditionalPaymentObj = {
					// Aadharnumber: "",
					// AadharnumberNew: "",
					// Alive: "X",
					// AliveNew: "X",
					// DateOfBirth: null,
					// DateOfBirthNew: null,
					// DateOfDeath: null,
					// DateOfDeathNew: null,
					// Disablity: "",
					// DisablityNew: "",
					// Employeecode: "",
					// EmployeecodeNew: "",
					// FirstName: "",
					// FirstNameNew: "",
					// Gender: "",
					// GenderNew: "",
					// GovtEmploye: "",
					// GovtEmployeNew: "",
					// LastName: "",
					// LastNameNew: "",
					// MaritalStatus: "",
					// MaritalStatusNew: "",
					// MarriedSince: null,
					// MarriedSinceNew: null,
					// MemberType: this.selectFamilyMemberDetails.ValueId,
					// MembertypeDesc: this.selectFamilyMemberDetails.ValueDesc,
					// Pernr: "",
					// PhoneNumber: "",
					// PhoneNumberNew: "",
					// RequestGuid: "",
					// ServiceType: "",
					// ServiceTypeNew: "",
					// Operation: "INS",
					// Remarks: "",
					// Seqnr: "",
					// selectWageTypeDetails
					// Serialno: data.length + 1,
					Serialno: (data.length + 1).toString(),
					Comments: "",
					CurrAmount: "0",
					CurrBasicAmount: "0",
					CurrBegda: null,
					CurrCurrency: "0.00",
					CurrDateOfOrgin: null,
					CurrEndda: null,
					CurrPercentage: "0",
					CurrWageType: this.selectWageTypeDetails.Wagetype,
					CurrWagetypeText: this.selectWageTypeDetails.wagedesc,
					Infotype: "0015",
					NewAmount: "0",
					NewBasicAmount: "0",
					NewBegda: null,
					NewCurrency: "0.00",
					NewDateOfOrgin: null,
					NewEndda: new Date(9999, 11, 31),
					NewPercentage: "0",
					NewWageType: this.selectWageTypeDetails.Wagetype,
					NewWagetypeText: this.selectWageTypeDetails.wagedesc,
					Operation: "INS",
					Pernr: "",
					Requestdetails: {
						ActionId: "",
						ActionName: "",
						ActionReasonId: "",
						ActionReasonName: "",
						ActionType: "",
						ApplicationName: "",
						CreatedBy: "",
						CreatedByName: "",
						CreatedOn: null,
						EffectiveDate: null,
						EmailAddress: "",
						EmployeeName: "",
						EmployeeStatus: "",
						FundcenterId: "",
						FundcenterName: "",
						JobId: "",
						MobileNumber: "",
						NoOfEmployees: 0,
						OfficeId: "",
						OfficeName: "",
						OverallStatus: "",
						PayrollStatus: "",
						Pernr: "",
						PositionId: "",
						PositionName: "",
						PrevReferenceNumber: "",
						ReferenceNumber: "",
						RelationId: "",
						ReqStatus: "",
						RequestGuid: "",
						TransStatus: "",
						UpdatedBy: "",
						UpdatedByName: "",
						// UpdatedOn: null,
						UpdatedTime: {
							ms: 0,
							__edmType: 'Edm.Time'
						}
						// ServiceType: "",
						//ServiceTypeNew: ""
					}
				};
				data.push(AdditionalPaymentObj);
				this.additionalPaymentDetailsObj = JSON.parse(JSON.stringify(AdditionalPaymentObj));
				/*date value checking of string /not -start*/
				var data = this.dataMaking(data);
				var simpleModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(simpleModel, "AdditionalPaymentsTabModel");
				this.AdditionalPaymentTablAddItempress(data.length - 1);

				var RecuringPaymentForm = this.getView().getModel("AdditionalPaymentsTabFormModel");
				RecuringPaymentForm.setData(data);
				/* table count  update - puropse write  - start*/
				var RecuringPayment = this.getView().getModel("AdditionalPaymentsTabModel").getData();
				this.getView().byId("idAdditionalPaymentstTableRec").setText("Total Records: " + RecuringPayment.length);
				/* table count  update - puropse write  - end*/
				// }

			}
		},
		OnPressCancelWagetype: function() {
			this.AddWageTypeFragment.close();

			$.sap.BusyDialog.close();
			sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			// sap.ui.getCore().byId("DetailActionReasonId").setValue("");
			// sap.ui.getCore().byId("EffectedOnId").setValue("");
		},
		basicCompTablAddItempress: function(Path) {
			// if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
			// 	sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			// }
			var itemPath = "/" + Path;
			if (this.oBasicComponentsdetailsDailog === undefined || this.oBasicComponentsdetailsDailog === null) {
				this.oBasicComponentsdetailsDailog = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComponentsdetailsDailog",
					this);
				this.getView().addDependent(this.oBasicComponentsdetailsDailog);
			}
			// oFamilyDialog
			this.oBasicComponentsdetailsDailog.bindElement({
				path: itemPath,
				model: "BasicComponentFormModel"
			});
			this.oBasicComponentsdetailsDailog.open();
			//field show / hide in form adde new records purpose
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},
		RecuringPaymentTablAddItempress: function(Path) {
			// if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
			// 	sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			// }
			var itemPath = "/" + Path;
			if (this.oRecuringPaymentdetailsDailog === undefined || this.oRecuringPaymentdetailsDailog === null) {
				this.oRecuringPaymentdetailsDailog = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.RecuringPaymentdetailsDailog",
					this);
				this.getView().addDependent(this.oRecuringPaymentdetailsDailog);
			}
			// oFamilyDialog
			this.oRecuringPaymentdetailsDailog.bindElement({
				path: itemPath,
				model: "RecurringTabFormModel"
			});
			this.oRecuringPaymentdetailsDailog.open();
			//field show / hide in form adde new records purpose
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},
		AdditionalPaymentTablAddItempress: function(Path) {
			// if (sap.ui.getCore().byId("DetailActionWageTypeId")) {
			// 	sap.ui.getCore().byId("DetailActionWageTypeId").setValue("");
			// }
			var itemPath = "/" + Path;
			if (this.oAdditionalPaymentdetailsDailog === undefined || this.oAdditionalPaymentdetailsDailog === null) {
				this.oAdditionalPaymentdetailsDailog = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.AdditionalPaymentdetailsDailog",
					this);
				this.getView().addDependent(this.oAdditionalPaymentdetailsDailog);
			}
			// oFamilyDialog
			this.oAdditionalPaymentdetailsDailog.bindElement({
				path: itemPath,
				model: "AdditionalPaymentsTabFormModel"
			});
			this.oAdditionalPaymentdetailsDailog.open();
			//field show / hide in form adde new records purpose
			var oModel = new JSONModel({
				EditVisibility: false,
				Editable: false
			});
			this.getView().setModel(oModel, "oViewModel");
			//end

		},
		// onAddWagetype Row - fragment -start
		onAddBasicComponWageType: function(oEvent) {

			/*	loop checking for Delete records should not select -start cfms_ctm_npv - start(16_2_23)*/
			var data = this.getView().getModel("BasicComponentModel").getData();
			var SelectedContes = oEvent.getSource().getParent().getParent().getSelectedContexts();
			// if (SelectedContes.length === 0) {
			// 	sap.m.MessageBox.error("Please select Atleast 1 Record to Edit..!!");
			// 	return;
			// } else
			if (SelectedContes.length >= 1) {
				for (var i = 0; i < SelectedContes.length; i++) {
					// if (SelectedContes[i].getObject().Operation === "DEL") {
					sap.m.MessageBox.error("Please Un Select Table Records when Add WageType Details..!!");
					return;
					// }
				}
			}
			/*	loop checking for Delete records should not select -end cfms_ctm_npv - start(16_2_23)*/
			var sTab = oEvent.getSource().getParent().getParent().getParent().getKey();
			if (sTab === "BasicComp") {
				this.infotype = "0008";
			} else if (sTab === "RecuringPayment") {
				this.infotype = "0014";
			} else if (sTab === "AdditionalPayments") {
				this.infotype = "0015";
			}

			if (!this.AddWageTypeFragment) {
				this.AddWageTypeFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.BasicComWageTypeAdd",
					this);
				this.getView().addDependent(this.AddWageTypeFragment);
			}
			this.AddWageTypeFragment.open();
		},
		// onAddWagetype Row - fragment -end
		/*	add wagetype F4 - Start*/
		HandleRequestofWageType: function(oEvent) {
			var that = this;
			this.AddWageTypeInput = oEvent.getSource();
			var NewPayScalNewPayScalEffectivedate = this.getView().getModel("PaychangeModel").getData().NewEffectivedate;
			var payscalType = this.getView().getModel("PaychangeModel").getData().PayscaleTypeNew;
			var payscalArea = this.getView().getModel("PaychangeModel").getData().PayscaleAreaNew;
			var payscalGroup = this.getView().getModel("PaychangeModel").getData().PayscaleGroupNew;
			var payscalLevel = this.getView().getModel("PaychangeModel").getData().PayscaleLevelNew;
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, this.infotype),
				new sap.ui.model.Filter("PayscaleTypeNew", sap.ui.model.FilterOperator.EQ, payscalType),
				new sap.ui.model.Filter("PayscaleAreaNew", sap.ui.model.FilterOperator.EQ, payscalArea),
				new sap.ui.model.Filter("PayscaleGroupNew", sap.ui.model.FilterOperator.EQ, payscalGroup),
				new sap.ui.model.Filter("PayscaleLevelNew", sap.ui.model.FilterOperator
					.EQ, payscalLevel),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, this.saveEmp),
			);

			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VhpaywagesSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailWageTypeDialogFragment) {
						that.DetailWageTypeDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.WageTypeF4Dialog",
							that);
						that.getView().addDependent(that.DetailWageTypeDialogFragment);
					}
					that.DetailWageTypeDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailWageTypeDialogFragment.setModel(oModel, "FamilyAddMembDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		ConfirmWageTypeDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			this.selectWageTypeDetails = oEvent.getParameter("selectedItem").getBindingContext("FamilyAddMembDialogModel").getProperty();
			this.AddWageTypeInput.setValue(sValue);
		},
		livechangeWageTypesearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("wagedesc", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Wagetype", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseWageTypeDialog: function() {

		},
		/*	add wagetype F4 - end*/
		/*	Basic Components  table -end*/
		/*Paychange Details  fragment- cfms_Ctm_npv_ end*/

		/*	Address Details fragment F4 code_ cfms_Ctm_npv - start*/
		onchangebAddressStaeCombo: function(oEvent) {
			// combobox in basic details commen function
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			/*	for assing editable / not based on title select -start*/
			// var aGNDR = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			// this.getView().getModel("simple").setProperty("/GenderNew", aGNDR);
			// if (newval === "Ms" || newval === "Mrs" || newval === "Mr" || newval === "TGNDR") {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(false);
			// } else {
			// 	this.getView().byId("idGenderNewBasicDetal").setEditable(true);
			// }
			/*	for assing editable / not based on title select -end*/
			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
			} else {
				// oEvent.getSource().setValueState("None");
			}
		},
		OnPostalCodeValidate: function(oEvent) {
			var newval = oEvent.getParameter("newValue");
			if (newval.length < 6) {
				oEvent.getSource().setValue("");
				sap.m.MessageBox.error("Please enter Valid 6 Digit Pincode..!!");
			}
		},
		hanldeDistrict: function(oEvent) {
			var that = this;
			this.DistrictInput = oEvent.getSource();
			var Filters = [];
			var flag = "D";
			Filters.push(new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.EQ, flag));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VHDistrictMandalSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailDistrictFragment) {
						that.DetailDistrictFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DistrictDialog",
							that);
						that.getView().addDependent(that.DetailDistrictFragment);
					}
					that.DetailDistrictFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailDistrictFragment.setModel(oModel, "DistrictDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		ConfirmDistrictDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberDetails = oEvent.getParameter("selectedItem").getBindingContext("DistrictDialogModel").getProperty();
			this.DistrictInput.setValue(sValue);
			this.DistrictInput.setTooltip(sDiscripthion);
			this.DistrictInput.setName(sDiscripthion);
		},
		liveDistrictsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("Dstrict", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("District_ID", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseDistrictDialog: function(oEvent) {
			this.DistrictInput.setValue("");
			this.DistrictInput.setTooltip("");
			this.DistrictInput.setName("");
		},
		hanldeMandal: function(oEvent) {
			var that = this;
			this.MandalInput = oEvent.getSource();
			var Filters = [];
			var flag = "M";
			Filters.push(new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.EQ, flag));
			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel()
			this.oModel.read("/VHDistrictMandalSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!that.DetailMandalDialogFragment) {
						that.DetailMandalDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.MandalDialog",
							that);
						that.getView().addDependent(that.DetailMandalDialogFragment);
					}
					that.DetailMandalDialogFragment.open();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.results);
					that.DetailMandalDialogFragment.setModel(oModel, "MandalDialogModel");
					that.Action = true;
					that.ActionReason = false;
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},
		ConfirmMandalDialog: function(oEvent) {
			var sValue = oEvent.getParameter("selectedItem").getTitle();
			var sDiscripthion = oEvent.getParameter("selectedItem").getDescription();
			this.selecteMemberDetails = oEvent.getParameter("selectedItem").getBindingContext("MandalDialogModel").getProperty();
			this.MandalInput.setValue(sValue);
			this.MandalInput.setTooltip(sDiscripthion);
			this.MandalInput.setName(sDiscripthion);

		},
		liveMandalsearch: function(oEvent) {
			var sValue = oEvent.getParameters().value;
			var aFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("Mandal", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("Mandal_ID", sap.ui.model.FilterOperator.Contains, sValue)
			], false);
			oEvent.getSource().getBinding("items").filter(aFilter);
		},
		CloseMandalDialog: function(oEvent) {
			this.MandalInput.setValue("");
			this.MandalInput.setTooltip("");
			this.MandalInput.setName("");
		},

		/*	Address Details fragment F4 code- cfms_Ctm_npv - end*/

		/*Email Validate  & Phone no changes on Chnge - Contact Details fragement */
		oHanldeEmailChange: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			// var regex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			// var isSplChar = regex.test(textValue);
			// var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			// var isSplChar = textValue.match(regex);
			// if (isSplChar) {

			// 	var no_spl_char = textValue.replace(regex, '');
			// 	oEvent.getSource().setValue(no_spl_char);
			// }

			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(textValue)) {
				return (true);
			}
			sap.m.MessageBox.warning("You have entered an invalid email address!");
			oEvent.getSource().setValue("");
			return (false);

		},
		/*this for all iinput fields like phoneno, account no , pincode ,(only no inout fields)*/
		oHandlePhoneNoLiveChange: function(oEvent) {
			// var sValue = oEvent;
			var textValue = oEvent.getParameter("value");

			var regex = /[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				// abcdefghijklmnopqrstuvwxyz
				var no_spl_char = textValue.replace(/[` A-Za-z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				oEvent.getSource().setValue(no_spl_char);
			}

		},
		oHandlePhoneNoChange: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			if (textValue.length !== 10) {
				sap.m.MessageBox.error("Please enter Valid Phone Number!");
				return;
			}
		},

		handleAadharno: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			if (textValue.length !== 12) {
				sap.m.MessageBox.error("Please enter Valid Aadhaar Number!");
				return;
			}
			if (this.validate(oEvent.getSource().getValue()) == false) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
				sap.m.MessageBox.error("Please enter Valid 12 Digit Aadhaar Number!");
				return;
			}
		},
		changeAPGLI: function(oEvent) {
			var numZeroEx = /^([0])+$/;
			if (oEvent.getSource().getValue().match(numZeroEx)) {
				// this.getView().byId("reviewBtn").setEnabled(false);
				// oEvent.getSource().focus();
				// oEvent.getSource().setValue("");
				// oEvent.getSource().setValueState("Error");
				// oEvent.getSource().setValueStateText("You have entered an invalid APGLI number");
				sap.m.MessageBox.error("You have entered an invalid APGLI number..!!");
			} else {
				// this.getView().byId("reviewBtn").setEnabled(true);
				// oEvent.getSource().setValueState("None");

				oEvent.getSource().setValue(oEvent.getSource().getValue().toUpperCase());
			}
		},
		validate: function validate(aadharNumber) {
			var d = [
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
				[2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
				[3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
				[4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
				[5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
				[6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
				[7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
				[8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
				[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
			];
			var p = [
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
				[5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
				[8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
				[9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
				[4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
				[2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
				[7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
			];
			var c = 0;
			var invertedArray = aadharNumber.split("").map(Number).reverse();
			invertedArray.forEach(function(val, i) {
				c = d[c][p[i % 8][val]];
			});
			return c === 0;
		},
		handlePancard: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				return;
			} else {
				sap.m.MessageBox.warning("Invalid PAN;Please enter Valid Pan in correct format is AAAAA9999A..!");
				oEvent.getSource().setValue("");
			}

		},
		handleTancard: function(oEvent) {
			var textValue = oEvent.getParameter("value");
			var regex = /[A-Z]{4}[0-9]{5}[A-Z]{1}/gi;
			var isSplChar = regex.test(textValue);
			if (isSplChar) {
				return;
			} else {
				sap.m.MessageBox.warning("Please enter Valid Tan card..!");
				oEvent.getSource().setValue("");
			}

		},
		/*End*/
		/*Account Details / Bank Details Fragment data read */
		AccountDetals: function(empno, guid) {
			var that = this;
			var oEntitySet = "/AccountDetailsSet";
			// 			this.oBusy = new sap.m.BusyDialog();
			var aFilters = [
				new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator
					.EQ, guid),
				new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator
					.EQ, empno)
			];

			this.oBusy.open();
			// this.oModel.setUseBatch(false);
			this.oModel.read(oEntitySet, {
				async: false,
				filters: aFilters,
				success: function(oData) {
					that.oBusy.close();
					var reluts = oData.results[0];
					var formdata = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(formdata, "AccountModel");
					that.stausAssign(oData);
				},
				error: function(oError) {
					that.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.warning(t);

				}
			});
		},
		stausAssign: function(data) {
			if (this.appName == "ESS_Z303_SINGLE" || this.navPrameters.appName == "ESS_Z303_SINGLE") {
				this.stausModel.setData(data.results[0].FamilyMembersSet.results[0].Requestdetails);
				this.reqGuid = data.results[0].FamilyMembersSet.results[0].Requestdetails.RequestGuid;
				var application = data.results[0].FamilyMembersSet.results[0].Requestdetails.ApplicationName;
			} else if (this.appName == "ELCM_YE_ALL_SINGLE" || this.navPrameters.appName == "ELCM_YE_ALL_SINGLE") {
				// pay change Details
				this.stausModel.setData(data.Requestdetails);
				this.reqGuid = data.Requestdetails.RequestGuid;
				var application = data.Requestdetails.ApplicationName;
			} else {
				if (data.results[0].Requestdetails) {
					this.stausModel.setData(data.results[0].Requestdetails);
					this.reqGuid = data.results[0].Requestdetails.RequestGuid;
					var application = data.results[0].Requestdetails.ApplicationName;
				} else {
					this.stausModel.setData(data.results[0].RequestDetails);
					this.reqGuid = data.results[0].RequestDetails.RequestGuid;
					var application = data.results[0].RequestDetails.ApplicationName;
				}
			}

			// data.results[0].RequestDetails
			this.getView().setModel(this.stausModel, "StausModel");
			if (this.stausModel.getData().ReqStatus == "PENDING") {
				var oModel = new JSONModel({
					EditVisibility: true,
					Editable: false
				});
				this.getView().setModel(oModel, "oViewModel");
			}
			/*		 only for addressdetails purpose- cfms_Ctm_npv(04_11_23) -stat*/
			if (this.appName == "ESS_Z316_SINGLE") {
				this.getView().setModel(this.stausModel, "StausModel");
				if (this.stausModel.getData().ReqStatus == "ACCEPTED") {
					var oModel = new JSONModel({
						EditVisibility: true,
						Editable: false
					});
					this.getView().setModel(oModel, "oViewModel");
				}
			}
			/*		 only for addressdetails purpose- cfms_Ctm_npv(04_11_23) -end*/
			/*		 only for Group Transfer purpose- cfms_Ctm_npv(03_02_23) -stat*/
			// if (this.appName == "ELCM_Y5_ALL_GROUP") {
			// 	this.getView().setModel(this.stausModel, "StausModel");
			// 	if (this.stausModel.getData().ReqStatus == "DRAFT") {
			// 		var oModel = new JSONModel({
			// 			EditVisibility: true,
			// 			Editable: false
			// 		});
			// 		this.getView().setModel(oModel, "oViewModel");
			// 	}
			// }
			/*		 only for Group Transfer  purpose- cfms_Ctm_npv(03_02_23) -end*/

			/*	code for remove the empty record of backend based on member type -start*/
			if (this.appName == "ESS_Z303_SINGLE" || this.navPrameters.appName == "ESS_Z303_SINGLE") {
				var famliydata = this.getView().getModel("FamilyModel").getData();
				for (var i = 0; i < famliydata.length; i++) {
					if (famliydata[0].MemberType === "" && famliydata.length == 1) {
						// if (famliydata[i].__metadata) {
						// 	delete famliydata[i].__metadata;
						// }
						// if (famliydata[i].Requestdetails) {
						// 	delete famliydata[i].Requestdetails;
						// 	delete famliydata[i];
						// }
						// famliydata =  famliydata[i].shift();
						var simpleModel = new sap.ui.model.json.JSONModel([]);
						this.getView().setModel(simpleModel, "FamilyModel");
						this.FamilyFormModel = new sap.ui.model.json.JSONModel([]);
						this.getView().setModel(this.FamilyFormModel, "FamilyFormModel");
						this.getView().byId("idFamilyTableRec").setText("Total Records: 0");
						this.getView().setModel(this.FamilyFormModel, "NomFamilyData");
					}
				}

			}
			/*	code for remove the empty record of backend based on member type -start*/
			this.buttonDetails(this.reqGuid, application);
			// data.results[0].Requestdetails.ApplicationName
			// console.log(data.results[0].Requestdetails);
		},
		/* Account Details/ Bank Details Changes code- cfms_ctm_npv - starts */

		handleIFscF41: function(oEvent) {
			var that = this;
			// this.busyDialog.open();
			this.CDSName === "IFSC_CODE";
			this.sInputValueForMaterial = oEvent.getSource();
			this.label = oEvent.getSource().getName();
			var sSmartFilterBarId, oSmartTable;
			if (!this._smartValueHelpDialog) {
				this._smartValueHelpDialog = sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.SmartValueHelpDialogIFSC", this);
				this.getView().addDependent(this._smartValueHelpDialog);
				//	this.getOwnerComponent().getModel("ess").addDependent(this._smartValueHelpDialog);
			}
			sSmartFilterBarId = this._smartValueHelpDialog.getContent()[0].getIdForLabel();
			oSmartTable = this._smartValueHelpDialog.getContent()[1];
			oSmartTable.setSmartFilterId(sSmartFilterBarId);
			this.essModel = this.getOwnerComponent().getModel("ess");
			// this._smartValueHelpDialog.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			//	this.essModel.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			this._smartValueHelpDialog.setModel(this.essModel);
			this.getView().setModel(this.essModel);
			// this._smartValueHelpDialog.getModel("smartValueHelpDialogSettings").setProperty("/DialogTitle", "IFSC Code");
			// this._smartValueHelpDialog.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableEntitySet", "ZHRC_BANKS_IFSCVH");
			// this._smartValueHelpDialog.getModel("smartValueHelpDialogSettings").setProperty("/FilterBarEntitySet", "ZHRC_BANKS_IFSCVH");
			// this._smartValueHelpDialog.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableHeader", "IFSC Code");
			this._smartValueHelpDialog.open();
			// this.busyDialog.close();
		},
		handleIFscF4: function(oEvent) {
			// this.IfscSource = oEvent.getSource();
			// var that = this;
			// var oEntitySet = "/ZHRC_BANKS_IFSCVH";
			// this.oBusy = new sap.m.BusyDialog();
			// this.oBusy.open();
			// this.oModelESS = this.getOwnerComponent().getModel("ess");
			// this.oModelESS.read(oEntitySet, {
			// 	success: function(oData, response) {
			// 		that.oBusy.close();
			// 		if (response.headers['sap-message']) {
			// 			var responseHeader = response.headers['sap-message'];
			// 			var successMessage = JSON.parse(responseHeader).message;
			// 			sap.m.MessageBox.success(successMessage);
			// 		}
			// if (!that.DetailIFSCFragment) {
			// 	that.DetailIFSCFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.IfscDialog",
			// 		that);
			// 	that.getView().addDependent(that.DetailIFSCFragment);
			// }
			// 		that.DetailIFSCFragment.open();
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(oData.results);
			// 		that.DetailIFSCFragment.setModel(oModel, "IFSCDialogModel");
			// 	},
			// 	error: function(oError) {
			// 		that.oBusy.close();
			// 		var t = JSON.parse(oError.responseText).error.message.value;
			// 		sap.m.MessageBox.error(t, "Error");
			// 	}
			// });
			this.IfscSource = oEvent.getSource();
			// this.selEmployeeInput = oEvent.getSource();
			if (!this.DetailIFSCFragment) {
				this.DetailIFSCFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.IfscDialog",
					this);
				this.getView().addDependent(this.DetailIFSCFragment);
			}
			var oList = sap.ui.getCore().byId("IdIfscTabDailog");
			// .getAggregation("_dialog").getContent()[1];
			var oBindingInfo = oList.getBindingInfo("items"); // or "rows"
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom = {};
			oList.bindItems(oBindingInfo);

			this.DetailIFSCFragment.open();
			// this.oModelESS = this.getOwnerComponent().getModel("ess");
			// this.DetailIFSCFragment.setModel(this.oModelESS);
			// }.bind(this));

		},
		handleSearch: function(oEvent) {
			// var sValue = oEvent.getParameter("value");
			// var aFilter = new sap.ui.model.Filter([
			// 	new sap.ui.model.Filter("IFSC_CODE", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Branch", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Name", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Region", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Street", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_City", sap.ui.model.FilterOperator.Contains, sValue)
			// ], false);
			// var oBinding = oEvent.getSource().getBinding("items");
			// oBinding.filter([aFilter]);

			var sValue = oEvent.getParameter("value");
			// var oFilter = [new sap.ui.model.Filter("IFSC_CODE", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Branch", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Name", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Region", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_Street", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("Bank_City", sap.ui.model.FilterOperator.Contains, sValue)
			// ];
			// var oBinding = oEvent.getParameter("itemsBinding");

			// oBinding.filter(new sap.ui.model.Filter({
			// 	filters: oFilter,
			// 	and: false
			// }), sap.ui.model.FilterType.Application);

			var oList = sap.ui.getCore().byId("IdIfscTabDailog");
			var oBindingInfo = oList.getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom.search = sValue;
			oList.bindItems(oBindingInfo);

		},

		handleIfscConfirm: function(oEvent) {
			// var selectItem =oEvent.getParameters().selectedItem.getBindingContext("IFSCDialogModel").getObject();
			var oSelectedObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
			this.IfscSource.setValue(oSelectedObject.IFSC_CODE);
			var Account = this.getView().getModel("AccountModel");
			Account.setProperty("/BanknameNew", oSelectedObject.Bank_Name);
			Account.setProperty("/BankbranchNew", oSelectedObject.Bank_Branch);
			Account.setProperty("/BankcityNew", oSelectedObject.Bank_City);
		},
		handleIfscClose: function(oEvent) {
			this.DetailIFSCFragment.close();
		},
		onPressCancelCloseVH: function(oEvent) {
			// oEvent.getSource().getParent().close();
			//oEvent.getSource().getParent().destroy();
			this._smartValueHelpDialog.close();

		},
		handleSmartValueHelpSelection: function(oEvent) {
			var oSelectedObject = oEvent.getSource().getContextByIndex(oEvent.getSource().getSelectedIndex()).getObject();
		},
		/* Account Details code - end */
		/* Footer Buttons Code - starts */

		// Functions of Checklist Starts
		onPressCheckListDetail: function(oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData([]);
			this.getOwnerComponent().setModel(oModel, "CheckListModel");
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().read("/CheckListSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (!this.DetailChecklistFragment) {
						this.DetailChecklistFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailCheckList",
							this);
						this.getView().addDependent(this.DetailChecklistFragment);
					}
					this.DetailChecklistFragment.open();
					sap.ui.getCore().byId("SegmentBtnCheckListId").setSelectedKey("");
					sap.ui.getCore().byId("SegmentBtnCheckListId").setSelectedItem("None");
					var Array = [];
					var Object = {};
					for (var i = 0; i < oData.results.length; i++) {
						Object.DeleteAllowed = oData.results[i].DeleteAllowed;
						Object.RequestGuid = oData.results[i].RequestGuid;
						Object.Seqno = (Number(oData.results[i].Seqno)).toString();
						Object.ChecklistDescription = oData.results[i].ChecklistDescription;
						Object.ChecklistValue = oData.results[i].ChecklistValue;
						Object.DescriptionEditable = false;
						Array.push(Object);
						Object = {};
					}
					Array = {
						"results": Array
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Array);
					this.getOwnerComponent().setModel(oModel, "CheckListModel");

					// Enabling/Disabling the Buttons in Pop-Up
					sap.ui.getCore().byId("AddCheckListBtnId").setEnabled(true);
					sap.ui.getCore().byId("SegmentBtnCheckListId").setEnabled(true);
					sap.ui.getCore().byId("SaveChecklistBtnId").setEnabled(true);

					// this.getView().getModel("ButtonVisibleModel").getData()
					for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
						if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "CHECK_LIST" &&
							this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
							sap.ui.getCore().byId("AddCheckListBtnId").setEnabled(false);
							sap.ui.getCore().byId("SegmentBtnCheckListId").setEnabled(false);
							sap.ui.getCore().byId("SaveChecklistBtnId").setEnabled(false);
						}
					}
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},

		OnPressNewCheckList: function(oEvent) {
			var Obj = {
				DeleteAllowed: false,
				RequestGuid: "",
				Seqno: (this.getOwnerComponent().getModel("CheckListModel").getData().results.length + 1).toString(),
				ChecklistDescription: "",
				ChecklistValue: "",
				DescriptionEditable: true
			};
			this.getOwnerComponent().getModel("CheckListModel").getData().results.push(Obj);
			this.getOwnerComponent().getModel("CheckListModel").updateBindings();
			this.getOwnerComponent().getModel("CheckListModel").refresh();
		},

		OnPressSaveCheckList: function(oEvent) {
			var Array = [];
			var Object = {};
			for (var i = 0; i < this.getOwnerComponent().getModel("CheckListModel").getData().results.length; i++) {
				Object.DeleteAllowed = this.getOwnerComponent().getModel("CheckListModel").getData().results[i].DeleteAllowed;
				Object.RequestGuid = this.reqGuid;
				Object.Seqno = this.getOwnerComponent().getModel("CheckListModel").getData().results[i].Seqno;
				Object.ChecklistDescription = this.getOwnerComponent().getModel("CheckListModel").getData().results[i].ChecklistDescription;
				Object.ChecklistValue = this.getOwnerComponent().getModel("CheckListModel").getData().results[i].ChecklistValue;
				Array.push(Object);
				Object = {};
			}
			var ReqRootPayload = {
				RequestGuid: this.reqGuid,
				CheckList: {
					results: Array
				},
				ApproversPath: {
					results: []
				}
			};
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().create("/RequestRootSet", ReqRootPayload, {
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					this.DetailChecklistFragment.close();
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},

		OnPressCancelCheckList: function() {
			this.DetailChecklistFragment.close();
			$.sap.BusyDialog.close();
		},
		// Functions of Checklist Ends

		// Functions of Remarks Starts
		onPressRemarksDetail: function(oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData([]);
			this.getOwnerComponent().setModel(oModel, "RemarksModel");
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().read("/RemarksSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!this.DetailRemarksFragment) {
						this.DetailRemarksFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailRemarks",
							this);
						this.getView().addDependent(this.DetailRemarksFragment);
					}
					this.DetailRemarksFragment.open();
					var Array = [];
					var Object = {};
					for (var i = 0; i < oData.results.length; i++) {
						Object.Sender = oData.results[i].RemarksHeader.split(",")[0];
						Object.Designation = oData.results[i].RemarksHeader.split(",")[1] + ", " + oData.results[i].RoleDescription;
						//oData.results[i].RemarksHeader.split(",")[2] changed on cfms_ctm_npv(20_3_23) as per Yuvarj property changes done
						Object.RequestGuid = oData.results[i].RequestGuid;
						Object.Seqno = (Number(oData.results[i].Seqno)).toString();
						Object.RemarksBody = oData.results[i].RemarksBody;
						Object.CreatedBy = oData.results[i].CreatedBy;
						Object.CreatedDate = oData.results[i].CreatedDate;
						Object.CreatedTime = oData.results[i].CreatedTime.ms;
						Array.push(Object);
						Object = {};
					}
					Array = {
						"results": Array
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Array);
					this.getOwnerComponent().setModel(oModel, "RemarksModel");

					// Enabling/Disabling the Buttons in Pop-Up
					sap.ui.getCore().byId("AddRemarksFeedId").setEnabled(true);
					// this.getView().getModel("ButtonVisibleModel").getData() 
					for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
						if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REMARKS" &&
							this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
							sap.ui.getCore().byId("AddRemarksFeedId").setEnabled(false);
						}
					}
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
				}
			});
		},

		OnPostofRemarks: function(oEvent) {
			var Obj = {
				RequestGuid: this.reqGuid,
				Seqno: (this.getOwnerComponent().getModel("RemarksModel").getData().results.length + 1).toString(),
				RemarksBody: oEvent.getSource().getValue(),
				RemarksHeader: "",
				CreatedBy: "",
				CreatedDate: new Date(),
				CreatedTime: null
			};
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().create("/RemarksSet", Obj, {
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					var Object = {};
					Object.Sender = oData.RemarksHeader.split(",")[0];
					Object.Designation = oData.RemarksHeader.split(",")[1] + ", " + oData.RoleDescription;
					//	oData.RemarksHeader.split(",")[2]
					Object.RequestGuid = oData.RequestGuid;
					Object.Seqno = (Number(oData.Seqno)).toString();
					Object.RemarksBody = oData.RemarksBody;
					Object.CreatedBy = oData.CreatedBy;
					Object.CreatedDate = oData.CreatedDate;
					Object.CreatedTime = oData.CreatedTime.ms;
					this.getOwnerComponent().getModel("RemarksModel").getData().results.push(Object);
					this.getOwnerComponent().getModel("RemarksModel").updateBindings();
					this.getOwnerComponent().getModel("RemarksModel").refresh();
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
				}
			});
		},

		OnPressCancelRemarks: function() {
			this.DetailRemarksFragment.close();
			$.sap.BusyDialog.close();
		},
		// Functions of Remarks Ends

		// Functions of Attachment Starts
		onPressAttachmentDetail: function(oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData([]);
			this.getOwnerComponent().setModel(oModel, "AttachmentModel");
			var Filters = [];
			// this.reqGuid 
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().read("/AttachmentsSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (!this.DetailAttachmentFragment) {
						this.DetailAttachmentFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailAttachment",
							this);
						this.getView().addDependent(this.DetailAttachmentFragment);
					}
					this.DetailAttachmentFragment.open();
					var Array = [];
					var Object = {};
					for (var i = 0; i < oData.results.length; i++) {
						Object.DocumentNo = oData.results[i].DocumentNo;
						Object.DeleteAllowed = oData.results[i].DeleteAllowed;
						Object.AttachemntName = oData.results[i].AttachemntName;
						Object.MymeType = oData.results[i].MymeType;
						Object.RequestGuid = oData.results[i].RequestGuid;
						Object.Seqno = (Number(oData.results[i].Seqno)).toString();
						Object.UpdatedBy = oData.results[i].UpdatedBy;
						Object.UpdatedByName = oData.results[i].UpdatedByName;
						Object.UpdatedOn = oData.results[i].UpdatedOn;
						Object.UpdatedTime = oData.results[i].UpdatedTime.ms;
						Object.URL = oData.results[i].__metadata.media_src;
						Array.push(Object);
						Object = {};
					}
					Array = {
						"results": Array
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Array);
					this.getOwnerComponent().setModel(oModel, "AttachmentModel");
					// Enabling/Disabling the Button in Pop-Up
					sap.ui.getCore().byId("AttachmentCollectionId").setUploadButtonInvisible(false);
					// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
					for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
						if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "ATTACHMENTS" &&
							this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
							sap.ui.getCore().byId("AttachmentCollectionId").setUploadButtonInvisible(true); // sap.ui.getCore().byId("AddAttachmentBtnId").setEnabled(false);
						}
					}

					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
				}
			});
		},

		OnPressCancelAttachment: function() {
			this.DetailAttachmentFragment.close();
			$.sap.BusyDialog.close();
		},

		OnPressOfDownloadAttachment: function(oEvent) {
			var RowId = Number(oEvent.getSource().getId().split("-")[2]);
			var URL = this.getOwnerComponent().getModel("AttachmentModel").getData().results[RowId].URL;
			var encodeUrl = encodeURI(URL);
			sap.m.URLHelper.redirect(encodeUrl, true);
		},

		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var response = this.getResponse("/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV/AttachmentsSet", "fetch");
			var token = response.getResponseHeader("X-CSRF-Token");
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: token
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		odataupload: function(oEvent) {
			var that = this;
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "SLUG",
				value: oEvent.getParameter("fileName") + "," + this.reqGuid
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},

		getResponse: function(serverUrl, token) {
			var oResp;
			$.ajax(encodeURI(serverUrl), {
				type: "GET",
				async: false,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Accept", "application/json");
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.setRequestHeader("X-CSRF-Token", token);
				}
			}).fail(function() {}).complete(function(response) {
				oResp = response;
			});
			return oResp;
		},

		onFileSizeExceed: function() {
			var size = this.getOwnerComponent().getModel("fsizemodel").getData().filesize;
			sap.m.MessageBox.error("File Size exceeds, File Size should not be more than " + size + "MB");
		},

		onUploadComplete: function(oEvent) {
			var uploadDetails = {
				AttachemntName: oEvent.getParameters().files[0].fileName,
				RequestGuid: oEvent.getParameters().files[0].headers.location.slice(oEvent.getParameters().files[0].headers.location.indexOf(
					"RequestGuid=")).split(",")[0].slice(13, 45),
				MymeType: "application/pdf",
				DocumentNo: "",
				DeleteAllowed: true,
				Seqno: Number(oEvent.getParameters().files[0].headers.location.slice(oEvent.getParameters().files[0].headers.location.indexOf(
					"RequestGuid=")).split(",")[1].slice(7, 15)).toString(),
				UpdatedBy: "",
				UpdatedByName: "",
				UpdatedOn: ""
			};

			if (this.getOwnerComponent().getModel("AttachmentModel") === undefined) {
				var data = new sap.ui.model.json.JSONModel({
					results: []
				});
				this.getOwnerComponent().setModel(data, "AttachmentModel");
				this.getOwnerComponent().getModel("AttachmentModel").getData().results.push(uploadDetails);
				this.getOwnerComponent().getModel("AttachmentModel").refresh();
			} else {
				this.getOwnerComponent().getModel("AttachmentModel").getData().results.push(uploadDetails);
				this.getOwnerComponent().getModel("AttachmentModel").refresh();
			}
		},

		OnPressDeleteAttachment: function(oEvent) {
			var DeleteRowID = oEvent.getSource()._oItemForDelete._iLineNumber;
			this.DeleteAttachRowID = DeleteRowID;
			// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
			// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results[i]
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "ATTACHMENTS" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
					sap.m.MessageBox.error("You can't delete document.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (!(this.getOwnerComponent().getModel("AttachmentModel").getData().results[DeleteRowID].DeleteAllowed)) {
				sap.m.MessageBox.error("Delete or Modify action only allDeleting this level is not allowed for this document.");
				$.sap.BusyDialog.close();
				return false;
			}
			var DeletedRecordGUID = this.getOwnerComponent().getModel("AttachmentModel").getData().results[DeleteRowID].RequestGuid;
			var DeletedRecordSeq = this.getOwnerComponent().getModel("AttachmentModel").getData().results[DeleteRowID].Seqno;
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().remove("/AttachmentsSet(RequestGuid='" + DeletedRecordGUID + "',Seqno='" + DeletedRecordSeq +
				"')", {
					success: function(oData, oResponse) {
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.getOwnerComponent().getModel("AttachmentModel").getData().results.splice(Number(this.DeleteAttachRowID), 1);
						var Count = 1;
						for (var i = 0; i < this.getOwnerComponent().getModel("AttachmentModel").getData().results.length; i++) {
							this.getOwnerComponent().getModel("AttachmentModel").getData().results[i].Seqno = Count.toString();
							Count = Count + 1;
						}
						this.getOwnerComponent().getModel("AttachmentModel").updateBindings();
						this.getOwnerComponent().getModel("AttachmentModel").refresh();
						$.sap.BusyDialog.close();
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
		},
		// Funtions of Attachment Ends

		// Function of CFMS Acknowledgement Starts
		onPressCFMSAckDetail: function(oEvent) {
			var url = "/sap/opu/odata/sap/ZGW_HCM_ELCM_EASY_ACTION_SRV/CFMSAcknowledgementSet(RequestGuid='" + this.reqGuid + "')/$value";
			var encodeUrl = encodeURI(url);
			sap.m.URLHelper.redirect(encodeUrl, true);
		},
		// Function of CFMS Acknowledgement Ends
		/*Process flow - button code start - */
		// Function of Approver Path Starts
		onPressApproverPathDetail: function() {
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().read("/ApproversPathSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					var Array = [];
					var Object = {};
					var currentProcObj = {};

					for (var i = 0; i < oData.results.length; i++) {
						Object.OfficeId = oData.results[i].OfficeId;
						Object.AddedByName = oData.results[i].AddedByName;
						Object.OfficeName = oData.results[i].OfficeName;
						Object.PositionId = oData.results[i].PositionId;
						Object.RequestGuid = oData.results[i].RequestGuid;
						Object.PositionEdit = false;
						Object.WfroleEdit = false;
						Object.WfroleName = oData.results[i].WfroleName;
						Object.CurrentProcessor = oData.results[i].CurrentProcessor;
						Object.PositionName = oData.results[i].PositionName;
						Object.Seqno = (Number(oData.results[i].Seqno)).toString();
						Object.UpdatedBy = oData.results[i].UpdatedBy;
						Object.UpdatedByName = oData.results[i].UpdatedByName;
						Object.Wfrole = oData.results[i].Wfrole;
						Object.Pernr = oData.results[i].Pernr;
						Object.EmpName = oData.results[i].EmpName;
						Object.ErrorMessage = oData.results[i].ErrorMessage;
						Object.AddedBy = oData.results[i].AddedBy;
						Object.AddedByName = oData.results[i].AddedByName;
						Object.AddedOn = oData.results[i].AddedOn;
						Object.AddedTime = oData.results[i].AddedTime;
						Object.ActionTaken = oData.results[i].ActionTaken;
						Object.UpdatedOn = oData.results[i].UpdatedOn;
						Object.UpdatedTime = oData.results[i].UpdatedTime;
						Object.DeleteBtn = "sap-icon://delete";
						Object.DeleteAllowed = oData.results[i].DeleteAllowed;

						if (oData.results[i].DeleteAllowed == true) {
							Object.DeleteBtnVisible = true;

						} else if (oData.results[i].DeleteAllowed == false) {
							Object.DeleteBtnVisible = false;
						}
						/*if (this.getView().getModel("ButtonVisibleModel").getData() !== undefined) {
							for (var k = 0; k < this.getView().getModel("ButtonVisibleModel").getData().length; k++) {
								if (this.getView().getModel("ButtonVisibleModel").getData()[k].ButtonId === "APPROVAL_FLOW" &&
									this.getView().getModel("ButtonVisibleModel").getData()[k].ReadOnly === "X") {
									Object.DeleteBtnVisible = false;
									break;
								} else {
									Object.DeleteBtnVisible = true;
									break;
								}
							}
						}*/

						Array.push(Object);
						// get Current Processer -start
						if (Object.CurrentProcessor === "X") {
							currentProcObj = Object;
						}
						// get Current Processer -end
						Object = {};
					}
					Array = {
						"results": Array
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Array);
					this.getOwnerComponent().setModel(oModel, "ApproverPathModel");

					if (!this.DetailApproverPathFragment) {
						this.DetailApproverPathFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailApproverPath",
							this);
						this.getView().addDependent(this.DetailApproverPathFragment);
					}

					// buttons checker and approver button visibility -start
					if (currentProcObj.Wfrole == "A") {
						// show checker
						sap.ui.getCore().byId("AddApproverPathBtnIdAddChecker").setVisible(true);
						sap.ui.getCore().byId("AddApproverPathBtnIdAddApprover").setVisible(false);
						sap.ui.getCore().byId("AddApproverPathBtnId").setVisible(false);
					} else if (currentProcObj.Wfrole == "C") {
						// show checker and approver
						sap.ui.getCore().byId("AddApproverPathBtnIdAddChecker").setVisible(true);
						sap.ui.getCore().byId("AddApproverPathBtnIdAddApprover").setVisible(true);
						sap.ui.getCore().byId("AddApproverPathBtnId").setVisible(false);
					} else if (currentProcObj.Wfrole == "M") {
						// hide checker and approver
						sap.ui.getCore().byId("AddApproverPathBtnIdAddChecker").setVisible(false);
						sap.ui.getCore().byId("AddApproverPathBtnIdAddApprover").setVisible(false);
						sap.ui.getCore().byId("AddApproverPathBtnId").setVisible(true);
					}
					// buttons checker and approver button visibility -end
					this.DetailApproverPathFragment.open();

					// Enabling/Disabling the Buttons in Pop-Up
					sap.ui.getCore().byId("AddApproverPathBtnId").setEnabled(true);
					sap.ui.getCore().byId("SaveApproverPathBtnId").setEnabled(true);
					for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
						if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVAL_FLOW" &&
							this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
							sap.ui.getCore().byId("AddApproverPathBtnId").setEnabled(false);
							sap.ui.getCore().byId("SaveApproverPathBtnId").setEnabled(false);
						}
					}
					$.sap.BusyDialog.close();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});

		},

		// approverflow fragment Add Approver selection purpose add - ApproverPositionDailog fragment- start - ProcessFlow of F4 CDS View
		onAddApprovPositionValueHelp: function(oEvent) {
			// this.PathPosition = oEvent.getSource().getParent().getBindingContextPath();
			if (oEvent.getSource().getId() === "AddApproverPathBtnIdAddApprover") {
				this.work_role_approverflow = "A";
			} else
			if (oEvent.getSource().getId() === "AddApproverPathBtnIdAddChecker") {
				this.work_role_approverflow = "C";
			}
			// this.ApprovPosition = oEvent.getSource();
			if (!this._smartValuehelpDialogApproverflowAddApprover) {
				this._smartValuehelpDialogApproverflowAddApprover = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.ApproverflowAddApproverPositionDialog",
					this);
				this.getView().addDependent(this._smartValuehelpDialogApproverflowAddApprover);
			}
			this.getView().addDependent(this._smartValuehelpDialogApproverflowAddApprover);
			var oList = sap.ui.getCore().byId("IdApprverflowApprovPosTabDail");
			// .getAggregation("_dialog").getContent()[1];
			var oBindingInfo = oList.getBindingInfo("items"); // or "rows"
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom = {};
			oList.bindItems(oBindingInfo);
			this._smartValuehelpDialogApproverflowAddApprover.open();
		},

		handleSearchApprverFlowApprovePosition: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			// var oFilter = [new sap.ui.model.Filter("Plans", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("plans_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("department_id", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("orgeh", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("orgeh_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("employee_no", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("employee_name", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("fundcenter", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("fundcenter_text", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sValue),
			// 	new sap.ui.model.Filter("HOO_FLAG", sap.ui.model.FilterOperator.Contains, sValue)
			// ];
			// var oBinding = oEvent.getParameter("itemsBinding");
			// oBinding.filter(new sap.ui.model.Filter({
			// 	filters: oFilter,
			// 	and: false
			// }), sap.ui.model.FilterType.Application);

			// IdApprovPosTabDail
			var oList = sap.ui.getCore().byId("IdApprverflowApprovPosTabDail");
			var oBindingInfo = oList.getBindingInfo("items");
			if (!oBindingInfo.parameters) {
				oBindingInfo.parameters = {};
			}
			if (!oBindingInfo.parameters.custom) {
				oBindingInfo.parameters.custom = {};
			}
			oBindingInfo.parameters.custom.search = sValue;
			oList.bindItems(oBindingInfo);
		},
		handleApproverFlowApprvPositionConfirm: function(oEvent) {

			var oSelectedObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
			// this.ApprovPosition.setValue(oSelectedObject.Plans + "(" + oSelectedObject.plans_text + ")");
			// for binding data of position slected - cfms_ctm_npv -start
			// var path = this.PathPosition.split("/")[2]
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].OfficeName = oSelectedObject.orgeh_text;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].OfficeId = oSelectedObject.orgeh;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].PositionName = oSelectedObject.plans_text;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].PositionId = oSelectedObject.Plans;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].EmpName = oSelectedObject.employee_name;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].Pernr = oSelectedObject.employee_no;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].AddedOn = new Date();
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].AddedTime = null;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].UpdatedOn = null;
			// this.getOwnerComponent().getModel("ApproverPathModel").getData().results[path].UpdatedTime = null;
			// this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
			// this.getOwnerComponent().getModel("ApproverPathModel").refresh();
			// for binding data of position slected - cfms_ctm_npv -end
			var payload = {};
			// var ApproversPath = [];
			// for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
			payload.OfficeId = oSelectedObject.orgeh;
			if (oSelectedObject.AddedByName) {
				payload.AddedByName = oSelectedObject.AddedByName;
			} else {
				payload.AddedByName = "";
			}
			if (oSelectedObject.OfficeName) {
				payload.OfficeName = oSelectedObject.OfficeName;
			} else {
				payload.OfficeName = "";
			}

			if (oSelectedObject.Plans) {
				payload.PositionId = oSelectedObject.Plans;
			} else {
				payload.PositionId = "";
			}
			if (oSelectedObject.WfroleName) {
				payload.WfroleName = oSelectedObject.WfroleName;
			} else {
				payload.WfroleName = "";
			}
			payload.RequestGuid = this.reqGuid;
			if (oSelectedObject.plans_text) {
				payload.PositionName = oSelectedObject.plans_text;
			} else {
				payload.PositionName = "";
			}
			if (oSelectedObject.Seqno) {
				payload.Seqno = oSelectedObject.Seqno;
			} else {
				payload.Seqno = "";
			}
			if (oSelectedObject.UpdatedBy) {
				payload.UpdatedBy = oSelectedObject.UpdatedBy;
			} else {
				payload.UpdatedBy = "";
			}
			if (oSelectedObject.UpdatedByName) {
				payload.UpdatedByName = oSelectedObject.UpdatedByName;
			} else {
				payload.UpdatedByName = "";
			}
			// if (oSelectedObject.Wfrole) {
			payload.Wfrole = this.work_role_approverflow;
			// } else {
			// 	payload.Wfrole = "";
			// }
			if (oSelectedObject.employee_no) {
				payload.Pernr = oSelectedObject.employee_no;
			} else {
				payload.Pernr = "";
			}
			if (oSelectedObject.employee_name) {
				payload.EmpName = oSelectedObject.employee_name;
			} else {
				payload.EmpName = "";
			}
			if (oSelectedObject.AddedBy) {
				payload.AddedBy = oSelectedObject.AddedBy;
			} else {
				payload.AddedBy = "";
			}

			//	if conditon is added new Designation selected have to assin the value  -start
			if (oSelectedObject.AddedOn == "") {
				payload.AddedOn = new Date();
			} else {
				payload.AddedOn = oSelectedObject.AddedOn;
			}
			if (oSelectedObject.AddedTime == "") {
				payload.AddedTime = null;
			} else {
				payload.AddedTime = oSelectedObject.AddedTime;
			}
			if (oSelectedObject.UpdatedOn == "") {
				payload.UpdatedOn = null;
			} else {
				payload.UpdatedOn = oSelectedObject.UpdatedOn;
			}
			if (oSelectedObject.UpdatedTime == "") {
				ApproversPathObject.UpdatedTime = null;
			} else {
				payload.UpdatedTime = oSelectedObject.UpdatedTime;
			}
			//	if conditon is added new Designation selected have to assin the value  -end
			payload.ActionTaken = oSelectedObject.ActionTaken;
			this.onapproverPathAddApprover(payload);
			this._smartValuehelpDialogApproverflowAddApprover.close();

		},
		handleApproverFlowApprvPositionClose: function(oEvent) {
			this._smartValuehelpDialogApproverflowAddApprover.close();
		},
		// approver Position selection purpose add - ApproverPositionDailog fragment- end
		onapproverPathAddApprover: function(payloadData) {
			/*var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));*/
			var ApproversPathObject = payloadData;

			this.getOwnerComponent().getModel().create("/ApproversPathSet", ApproversPathObject, {
				// filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					if (oData.Reaction == "GO_HOME") {
						if (this.navigation == "HCMDashboard") {
							// window.history.go(-1);
							this._navToParticularApp("zess_app", "display", {});
						} else if (this.navigation == "ActionHistory") {
							this._navToParticularApp("ZHR_TRANSFER_II", "display", {});
						} else {
							this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
						}

					} else if (oData.Reaction == "REFRESH") {
						this.onPressApproverPathDetail();
					} else if (oData.Reaction == "") {

					}

				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
				}
			});
		},
		OnPressNewApproverPath: function(oEvent) {
			var SeqNumber = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[
				this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length - 1].Seqno;
			var Obj = {
				OfficeId: "",
				AddedByName: "",
				OfficeName: "",
				PositionId: "",
				RequestGuid: "",
				WfroleName: "",
				PositionName: "",
				PositionEdit: true,
				WfroleEdit: true,
				Seqno: (Number(SeqNumber) + 1).toString(),
				UpdatedBy: "",
				UpdatedByName: "",
				Wfrole: "",
				Pernr: "",
				EmpName: "",
				AddedBy: "",
				AddedOn: "",
				AddedTime: "",
				ActionTaken: "",
				UpdatedOn: "",
				UpdatedTime: "",
				DeleteBtn: "sap-icon://delete",
				DeleteAllowed: true
			};
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results.push(Obj);
			this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
			this.getOwnerComponent().getModel("ApproverPathModel").refresh();
		},

		// Function to delete approver path row 
		OnPressDeleteApproverPath: function(oEvent) {
			this.DeleteRowID = oEvent.getSource().getId().split("-")[2];
			/*for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVAL_FLOW" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly === "X") {
					sap.m.MessageBox.error("You can't delete Processor Flow.");
					$.sap.BusyDialog.close();
					return false;
				}
			}*/
			if (!(this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.DeleteRowID].DeleteAllowed)) {
				// sap.m.MessageBox.error("Deleting this level is not allowed.");
				sap.m.MessageBox.error(this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.DeleteRowID].ErrorMessage);
				$.sap.BusyDialog.close();
				return false;
			}
			if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.DeleteRowID].AddedBy === "") {
				this.getOwnerComponent().getModel("ApproverPathModel").getData().results.splice(Number(this.DeleteRowID), 1);
				var Count = 1;
				for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
					this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Seqno = Count.toString();
					Count = Count + 1;
				}
				this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
				this.getOwnerComponent().getModel("ApproverPathModel").refresh();
			} else {
				sap.m.MessageBox.confirm("Do you really want to delete this processor from the list ? ", {
					actions: ["YES", "NO"],
					onClose: function(sAction) {
						if (sAction === "YES") {
							this._DeleteApproverPathRow();
						}
					}.bind(this)
				});
			}
		},

		_DeleteApproverPathRow: function() {
			var DeletedRecordGUID = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.DeleteRowID].RequestGuid;
			var DeletedRecordSeq = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[this.DeleteRowID].Seqno;
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().remove("/ApproversPathSet(RequestGuid='" + DeletedRecordGUID + "',Seqno='" +
				DeletedRecordSeq +
				"')", {
					success: function(oData, oResponse) {
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.getOwnerComponent().getModel("ApproverPathModel").getData().results.splice(Number(this.DeleteRowID), 1);
						var Count = 1;
						for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
							this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Seqno = Count.toString();
							Count = Count + 1;
						}
						this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
						this.getOwnerComponent().getModel("ApproverPathModel").refresh();
						$.sap.BusyDialog.close();
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								return false;
							}
						}
					}
				});
		},
		// Function to delete approver path row 

		OnSelectWorkFlowRole: function(oEvent) {
			if (oEvent.getSource().getSelectedKey() === "M") {
				sap.m.MessageBox.error("You can't select Maker as a Role.");
				oEvent.getSource().setSelectedKey("");
				$.sap.BusyDialog.close();
				return false;
			}
			var RowId = oEvent.getSource().getId().split("-")[2];
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[RowId].Wfrole = oEvent.getSource().getSelectedItem().getKey();
			this.getOwnerComponent().getModel("ApproverPathModel").getData().results[RowId].WfroleName = oEvent.getSource().getSelectedItem()
				.getText();
			this.getOwnerComponent().getModel("ApproverPathModel").updateBindings();
			this.getOwnerComponent().getModel("ApproverPathModel").refresh();
		},

		HandleRequestDesiginationApproverPath: function(oEvent) {
			this.RowId = oEvent.getSource().getId().split("-")[2];
			this.CDSName = "ZC_PROCESSOR_SEARCH";
			var CDSNameType = "ZC_PROCESSOR_SEARCHType";
			if (!this._smartValueHelpDialogApprover) {
				this._smartValueHelpDialogApprover = sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.SmartValueHelpDialog",
					this);
				this.getView().addDependent(this._smartValueHelpDialogApprover);
			}
			$.sap.BusyDialog.open();
			var sSmartFilterBarId = this._smartValueHelpDialogApprover.getContent()[0].getIdForLabel();
			var oSmartTable = this._smartValueHelpDialogApprover.getContent()[1];
			oSmartTable.setSmartFilterId(sSmartFilterBarId);
			this._smartValueHelpDialogApprover.setModel(new sap.ui.model.json.JSONModel(), "smartValueHelpDialogSettings");
			this._smartValueHelpDialogApprover.getModel("smartValueHelpDialogSettings").setProperty("/DialogTitle", "Select Next Approver");
			this._smartValueHelpDialogApprover.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableEntitySet", this.CDSName);
			this._smartValueHelpDialogApprover.getModel("smartValueHelpDialogSettings").setProperty("/FilterBarEntitySet", this.CDSName);
			this._smartValueHelpDialogApprover.getModel("smartValueHelpDialogSettings").setProperty("/SmartTableHeader",
				"Select Next Approver");
			this._smartValueHelpDialogApprover.open();
			$.sap.BusyDialog.close();
		},

		OnPressSaveApproverPath: function(oEvent) {
			/* workflow roleselected or not for checkeing purpose added this code before going to save click in approver button fragment- cfms_ctm_npv(06_01_23) -start*/
			// for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
			// 	if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVAL_FLOW") {
			// 		var AddBurronStatus = this.getView().getModel("ButtonVisibleModel").getData()[i].ReadOnly;
			// 	}
			// }
			if (sap.ui.getCore().byId("AddApproverPathBtnId").getEnabled() === true) {
				var lenth = this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length;
				var lastRecord = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[lenth - 1];
				if (lastRecord.Wfrole === "" || lastRecord.PositionId === "") {
					sap.m.MessageBox.error("Please Fill New Record values..Before going to Save..!!");
					return;
				}
			}
			/* workflow roleselected or not for checkeing purpose added this code before going to save click in approver button fragment- cfms_ctm_npv(06_01_23) -start*/
			var ApproversPathObject = {};
			var ApproversPath = [];
			for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
				ApproversPathObject.OfficeId = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].OfficeId;
				ApproversPathObject.AddedByName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedByName;
				ApproversPathObject.OfficeName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].OfficeName;
				ApproversPathObject.PositionId = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].PositionId;
				ApproversPathObject.RequestGuid = this.reqGuid;
				ApproversPathObject.WfroleName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].WfroleName;
				ApproversPathObject.PositionName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].PositionName;
				ApproversPathObject.Seqno = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Seqno;
				ApproversPathObject.UpdatedBy = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedBy;
				ApproversPathObject.UpdatedByName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedByName;
				ApproversPathObject.Wfrole = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Wfrole;
				ApproversPathObject.Pernr = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Pernr;
				ApproversPathObject.EmpName = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].EmpName;
				ApproversPathObject.AddedBy = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedBy;
				//	if conditon is added new Designation selected have to assin the value  -start
				if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedOn == "") {
					ApproversPathObject.AddedOn = new Date();
				} else {
					ApproversPathObject.AddedOn = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedOn;
				}
				if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedTime == "") {
					ApproversPathObject.AddedTime = null;
				} else {
					ApproversPathObject.AddedTime = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].AddedTime;
				}
				if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedOn == "") {
					ApproversPathObject.UpdatedOn = null;
				} else {
					ApproversPathObject.UpdatedOn = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedOn;
				}
				if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedTime == "") {
					ApproversPathObject.UpdatedTime = null;
				} else {
					ApproversPathObject.UpdatedTime = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].UpdatedTime;
				}
				//	if conditon is added new Designation selected have to assin the value  -end
				ApproversPathObject.ActionTaken = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].ActionTaken;

				ApproversPath.push(ApproversPathObject);
				ApproversPathObject = {};
			}
			var ReqRootPayload = {
				RequestGuid: this.reqGuid,
				CheckList: {
					results: []
				},
				ApproversPath: {
					results: ApproversPath
				}
			};
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().create("/RequestRootSet", ReqRootPayload, {
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					this.DetailApproverPathFragment.close();
					$.sap.BusyDialog.close();
					/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
					// window.history.go(-1);
					// if (this.navigation == "HCMDashboard") {
					// 	this._navToParticularApp("zess_app", "display", {});
					// } else {
					// 	this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
					// }
					/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},

		OnPressCancelApproverPath: function(oEvent) {
			this.DetailApproverPathFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of Approver Path Ends

		/*Process flow - button code end - */
		// Function of SEND Start
		onPressSendDetail: function(oEvent) {

			//code added to show the leve of details  in DetailsSendBackDailog -start - cfms_ctm_npv - (11_10_22)
			$.sap.BusyDialog.open();
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND") {
					var NextApprover = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(NextApprover);
			this.getOwnerComponent().setModel(oModel, "NextApproverModel");
			if (!this.DetailSendDialogFragment) {
				this.DetailSendDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailSendDialog",
					this);
				this.getView().addDependent(this.DetailSendDialogFragment);
			}
			this.DetailSendDialogFragment.open();
			sap.ui.getCore().byId("TermsCheckBoxSendId").setSelected(false);
			sap.ui.getCore().byId("SendDialogRemarksId").setValue("");
			// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
					sap.ui.getCore().byId("TermsCheckBoxSendId").setVisible(false);
					sap.ui.getCore().byId("SendDialogTermsTextId").setVisible(false);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
					sap.ui.getCore().byId("TermsCheckBoxSendId").setVisible(true);
					sap.ui.getCore().byId("SendDialogTermsTextId").setVisible(true);
					sap.ui.getCore().byId("SendDialogTermsTextId").setText(
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
				}
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
					sap.ui.getCore().byId("SendRemarksLabelId").setVisible(true);
					sap.ui.getCore().byId("SendDialogRemarksId").setVisible(true);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
					sap.ui.getCore().byId("SendRemarksLabelId").setVisible(false);
					sap.ui.getCore().byId("SendDialogRemarksId").setVisible(false);
				}
			}
			$.sap.BusyDialog.close();

			//code added to show the leve of details  in DetailsSendBackDailog -end - cfms_ctm_npv - (11_10_22)

			if (NextApprover.Wfrole == "") {
				$.sap.BusyDialog.open();
				if (!(this.getOwnerComponent().getModel("ApproverPathModel"))) {
					this._GetApproverPathDetail();
				}

				// jQuery.sap.delayedCall(4000, this, function() {
				// if (sendBackApprover.Wfrole == "") {
				if (this.navPrameters.appName == "ESS_Z316_SINGLE") {
					var SavePayload = this.getView().getModel("AdressModel").getData();
					var Entity = "/AddressInfoSet";
				}

				//  var SavePayload =  this.getOwnerComponent().getModel("DetailTransferModel").getData();
				// var Entity = "";
				// if (this.RequestAction === "Y4") {
				// 	Entity = "/TransferInSet";
				// } else if (this.RequestAction === "YF") {
				// 	Entity = "/SeparationSet";
				// } else {
				// 	Entity = "/TransferSet";
				// }

				// this.getOwnerComponent().getModel().update("" + Entity + "(RequestGuid='" + this.reqGuid + "')", SavePayload, {
				// 	success: function(oData, oResponse) {
				// 		if (this.getOwnerComponent().getModel("ApproverPathModel")) {
				// 			for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
				// 				if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].CurrentProcessor === "X") {
				// 					if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i + 1]) {
				// 						var NextApprover = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i + 1];
				// 						break;
				// 					} else {
				// 						sap.m.MessageBox.error(
				// 							"Approver's flow is incomplete. No approver ID is maintained in the process flow. Please configure the appropriate Checkers and Approvers for this Approver's flow."
				// 						);
				// 						$.sap.BusyDialog.close();
				// 						return false;
				// 					}
				// 				}
				// 			}
				// 		} else {
				// 			sap.m.MessageBox.error(
				// 				"Approver's flow is incomplete. No approver ID is maintained in the Approver's flow. Please configure the appropriate Checkers and Approvers for this Approver's flow."
				// 			);
				// 			$.sap.BusyDialog.close();
				// 			return false;
				// 		}
				/* added this code for showing data in table of fragment -cfms_ctm_npv (18_01_23) -start*/
				if (this.getOwnerComponent().getModel("ApproverPathModel")) {
					for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
						if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].CurrentProcessor === "X") {
							if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i + 1]) {
								var NextApprover = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i + 1];
								break;
							} else {
								sap.m.MessageBox.error(
									"Approver's flow is incomplete. No approver ID is maintained in the Approver's flow. Please configure the appropriate Checkers and Approvers for this Approver's flow."
								);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				} else {
					sap.m.MessageBox.error(
						"Approver's flow is incomplete. No approver ID is maintained in the process flow. Please configure the appropriate Checkers and Approvers for this Approver's flow."
					);
					this.DetailSendDialogFragment.close();
					$.sap.BusyDialog.close();
					return false;
				}
				/* added this code for showing data in table of fragment -cfms_ctm_npv (18_01_23) -end*/
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(NextApprover);
				this.getOwnerComponent().setModel(oModel, "NextApproverModel");
				if (!this.DetailSendDialogFragment) {
					this.DetailSendDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailSendDialog",
						this);
					this.getView().addDependent(this.DetailSendDialogFragment);
				}
				this.DetailSendDialogFragment.open();
				sap.ui.getCore().byId("TermsCheckBoxSendId").setSelected(false);
				sap.ui.getCore().byId("SendDialogRemarksId").setValue("");
				// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
				for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
						sap.ui.getCore().byId("TermsCheckBoxSendId").setVisible(false);
						sap.ui.getCore().byId("SendDialogTermsTextId").setVisible(false);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
						sap.ui.getCore().byId("TermsCheckBoxSendId").setVisible(true);
						sap.ui.getCore().byId("SendDialogTermsTextId").setVisible(true);
						sap.ui.getCore().byId("SendDialogTermsTextId").setText(
							this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
					}
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
						sap.ui.getCore().byId("SendRemarksLabelId").setVisible(true);
						sap.ui.getCore().byId("SendDialogRemarksId").setVisible(true);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
						sap.ui.getCore().byId("SendRemarksLabelId").setVisible(false);
						sap.ui.getCore().byId("SendDialogRemarksId").setVisible(false);
					}
				}
				$.sap.BusyDialog.close();
				// }.bind(this),
				// 	error: function(error) {
				// 		$.sap.BusyDialog.close();
				// 		if (error.headers["sap-message"]) {
				// 			if (JSON.parse(error.headers["sap-message"]).severity === "success") {
				// 				sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
				// 			} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
				// 				sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
				// 				$.sap.BusyDialog.close();
				// 				return false;
				// 			}
				// 		}
				// 	}
				// });
				// });

			} // regular button details checking
		},

		OnPressSendToNext: function() {
			if (sap.ui.getCore().byId("TermsCheckBoxSendId").getVisible()) {
				if (!(sap.ui.getCore().byId("TermsCheckBoxSendId").getSelected())) {
					sap.m.MessageBox.error("Please select verify the Terms and Conditions.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (sap.ui.getCore().byId("SendDialogRemarksId").getVisible()) {
				if (sap.ui.getCore().byId("SendDialogRemarksId").getValue() === "") {
					sap.m.MessageBox.error("Please enter the Remarks first.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SEND") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].Remarks = sap.ui.getCore().byId(
						"SendDialogRemarksId").getValue();
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
			this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='SEND',RequestGuid='" + this.reqGuid + "')",
				UploadPayload, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {

										if (sAction === "OK") {
											//	that.DetailSendDialogFragment.close();
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
											if (that.navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else {
												that.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
											}
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
											// if (that.SelectedParameters.Action === "PENDING") {
											// 	var router = sap.ui.core.UIComponent.getRouterFor(that);
											// 	router.navTo("Display", true);
											// 	// Pending Action Tab Request Call 
											// 	that.getOwnerComponent().getModel().read("/PendingActionListSet", {
											// 		success: function(oData, oResponse) {
											// 			if (oResponse.headers["sap-message"]) {
											// 				if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 				} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 			var oModel1 = new sap.ui.model.json.JSONModel();
											// 			oModel1.setData(oData);
											// 			that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
											// 			that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
											// 			that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
											// 			that.getOwnerComponent().getModel("RecordNumberModel").refresh();
											// 		},
											// 		error: function(error) {
											// 			$.sap.BusyDialog.close();
											// 			if (error.headers["sap-message"]) {
											// 				if (JSON.parse(error.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
											// 				} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 		}
											// 	});
											// 	// Pending Action Tab Request Call 
											// } else {
											// window.location.reload();
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// 	that._EmployeeHistory(that.SelectedParameters);
											// 	that.getView().byId("AttachmentBtnId").setVisible(false);
											// 	that.getView().byId("CheckListBtnId").setVisible(false);
											// 	that.getView().byId("ApproverPathBtnId").setVisible(false);
											// 	that.getView().byId("RemarksBtnId").setVisible(false);
											// 	that.getView().byId("CFMSAckBtnId").setVisible(false);
											// 	that.getView().byId("SaveBtnId").setVisible(false);
											// 	that.getView().byId("DiscardBtnId").setVisible(false);
											// 	that.getView().byId("ApproverBtnId").setVisible(false);
											// 	that.getView().byId("RejectBtnId").setVisible(false);
											// 	that.getView().byId("SendBtnId").setVisible(false);
											// 	that.getView().byId("ReturnToMakerBtnId").setVisible(false);
											// 	that.getView().byId("SentBackBtnId").setVisible(false);
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// }
										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.DetailSendDialogFragment.close();

					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
		},

		OnPressCancelSend: function() {
			this.DetailSendDialogFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of SEND End

		// Function of SEND BACK Starts
		onPressSentBackDetail: function(oEvent) {
			var selBtnText = oEvent.getSource().getText();
			$.sap.BusyDialog.open();

			//code added to show the leve of details  in DetailsSendBackDailog -start - cfms_ctm_npv - (11_10_22)
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK") {
					var sendBackApprover = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			//code added to show the leve of details  in DetailsSendBackDailog -end - cfms_ctm_npv - (11_10_22)
			if (sendBackApprover.Wfrole === "") {
				if (!(this.getOwnerComponent().getModel("ApproverPathModel"))) {
					this._GetApproverPathDetail();
				}
				for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
					if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].CurrentProcessor === "X") {
						var sendBackApprover = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i - 1];
						break;
					}
				}
			}
			jQuery.sap.delayedCall(4000, this, function() {
				// if (sendBackApprover.Wfrole === "") {

				// }

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(sendBackApprover);
				this.getOwnerComponent().setModel(oModel, "SendBackApproverModel");
				if (!this.DetailSendBackDialogFragment) {
					this.DetailSendBackDialogFragment = new sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailSendBackDialog",
						this);
					this.getView().addDependent(this.DetailSendBackDialogFragment);
				}
				this.DetailSendBackDialogFragment.open();
				sap.ui.getCore().byId("TermsCheckBoxSendBackId").setSelected(false);
				sap.ui.getCore().byId("SendBackDialogRemarksId").setValue("");
				// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
				for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
						sap.ui.getCore().byId("TermsCheckBoxSendBackId").setVisible(false);
						sap.ui.getCore().byId("SendBackDialogRemarksId").setVisible(false);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
						sap.ui.getCore().byId("TermsCheckBoxSendBackId").setVisible(true);
						sap.ui.getCore().byId("SendBackDialogRemarksId").setVisible(true);
						sap.ui.getCore().byId("SendBackDialogTermsTextId").setText(
							this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
					}
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
						sap.ui.getCore().byId("SendBackRemarksLabelId").setVisible(true);
						sap.ui.getCore().byId("SendBackDialogRemarksId").setVisible(true);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
						sap.ui.getCore().byId("SendBackRemarksLabelId").setVisible(false);
						sap.ui.getCore().byId("SendBackDialogRemarksId").setVisible(false);
					}
				}
			});
		},

		OnPressSendToBack: function() {
			if (sap.ui.getCore().byId("TermsCheckBoxSendBackId").getVisible()) {
				if (!(sap.ui.getCore().byId("TermsCheckBoxSendBackId").getSelected())) {
					sap.m.MessageBox.error("Please select verify the Terms and Conditions.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (sap.ui.getCore().byId("SendBackDialogRemarksId").getVisible()) {
				if (sap.ui.getCore().byId("SendBackDialogRemarksId").getValue() === "") {
					sap.m.MessageBox.error("Please enter the Remarks first.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "SENT_BACK") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].Remarks = sap.ui.getCore().byId(
						"SendBackDialogRemarksId").getValue();
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
			this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='SENT_BACK',RequestGuid='" + this.reqGuid + "')",
				UploadPayload, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {
										that.DetailSendBackDialogFragment.close();
										if (sAction === "OK") {

											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
											if (that.navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else {
												that.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
											}
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
											// if (that.SelectedParameters.Action === "PENDING") {
											// 	var router = sap.ui.core.UIComponent.getRouterFor(that);
											// 	router.navTo("Display", true);
											// 	// Pending Action Tab Request Call 
											// 	that.getOwnerComponent().getModel().read("/PendingActionListSet", {
											// 		success: function(oData, oResponse) {
											// 			if (oResponse.headers["sap-message"]) {
											// 				if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 				} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 			var oModel1 = new sap.ui.model.json.JSONModel();
											// 			oModel1.setData(oData);
											// 			that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
											// 			that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
											// 			that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
											// 			that.getOwnerComponent().getModel("RecordNumberModel").refresh();
											// 		},
											// 		error: function(error) {
											// 			$.sap.BusyDialog.close();
											// 			if (error.headers["sap-message"]) {
											// 				if (JSON.parse(error.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
											// 				} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 		}
											// 	});
											// Pending Action Tab Request Call 
											// } else {
											// 	// window.location.reload();
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// 	that._EmployeeHistory(that.SelectedParameters);
											// 	that.getView().byId("AttachmentBtnId").setVisible(false);
											// 	that.getView().byId("CheckListBtnId").setVisible(false);
											// 	that.getView().byId("ApproverPathBtnId").setVisible(false);
											// 	that.getView().byId("RemarksBtnId").setVisible(false);
											// 	that.getView().byId("CFMSAckBtnId").setVisible(false);
											// 	that.getView().byId("SaveBtnId").setVisible(false);
											// 	that.getView().byId("DiscardBtnId").setVisible(false);
											// 	that.getView().byId("ApproverBtnId").setVisible(false);
											// 	that.getView().byId("RejectBtnId").setVisible(false);
											// 	that.getView().byId("SendBtnId").setVisible(false);
											// 	that.getView().byId("ReturnToMakerBtnId").setVisible(false);
											// 	that.getView().byId("SentBackBtnId").setVisible(false);
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// }
										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.DetailSendBackDialogFragment.close();

					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
			$.sap.BusyDialog.close();
		},

		OnPressCancelSendBack: function() {
			this.DetailSendBackDialogFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of SEND BACK Ends

		// Function of RETURN TO MAKER Starts
		onPressBackToMakerDetail: function() {
			$.sap.BusyDialog.open();

			//code added to show the leve of details  in DetailsSendBackDailog -start - cfms_ctm_npv - (11_10_22)
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER") {
					var ReturnToMaker = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			//code added to show the leve of details  in DetailsSendBackDailog -end - cfms_ctm_npv - (11_10_22)
			if (ReturnToMaker.Wfrole == "") {
				if (!(this.getOwnerComponent().getModel("ApproverPathModel"))) {
					this._GetApproverPathDetail();
				}

				for (var i = 0; i < this.getOwnerComponent().getModel("ApproverPathModel").getData().results.length; i++) {
					if (this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i].Wfrole === "M") {
						var ReturnToMaker = this.getOwnerComponent().getModel("ApproverPathModel").getData().results[i];
						break;
					}
				}
			}
			jQuery.sap.delayedCall(4000, this, function() {

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(ReturnToMaker);
				this.getOwnerComponent().setModel(oModel, "ReturnToMakerModel");
				if (!this.DetailReturnMakerDialogFragment) {
					this.DetailReturnMakerDialogFragment = new sap.ui.xmlfragment(
						"com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailReturnMakerDialog",
						this);
					this.getView().addDependent(this.DetailReturnMakerDialogFragment);
				}
				this.DetailReturnMakerDialogFragment.open();
				sap.ui.getCore().byId("TermsCheckBoxReturnMakerId").setSelected(false);
				sap.ui.getCore().byId("ReturnMakerDialogRemarksId").setValue("");
				for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
						sap.ui.getCore().byId("TermsCheckBoxReturnMakerId").setVisible(false);
						sap.ui.getCore().byId("ReturnMakerDialogTermsTextId").setVisible(false);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
						sap.ui.getCore().byId("ReturnMakerDialogTermsTextId").setText(
							this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
						sap.ui.getCore().byId("TermsCheckBoxReturnMakerId").setVisible(true);
						sap.ui.getCore().byId("ReturnMakerDialogTermsTextId").setVisible(true);
					}
					if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
						sap.ui.getCore().byId("ReturnMakerRemarksLabelId").setVisible(true);
						sap.ui.getCore().byId("ReturnMakerDialogRemarksId").setVisible(true);
					} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER" &&
						this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
						sap.ui.getCore().byId("ReturnMakerRemarksLabelId").setVisible(false);
						sap.ui.getCore().byId("ReturnMakerDialogRemarksId").setVisible(false);
					}
				}
			});
		},

		OnPressSendReturnToMaker: function() {
			if (sap.ui.getCore().byId("TermsCheckBoxReturnMakerId").getVisible()) {
				if (!(sap.ui.getCore().byId("TermsCheckBoxReturnMakerId").getSelected())) {
					sap.m.MessageBox.error("Please select verify the Terms and Conditions.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (sap.ui.getCore().byId("ReturnMakerDialogRemarksId").getVisible()) {
				if (sap.ui.getCore().byId("ReturnMakerDialogRemarksId").getValue() === "") {
					sap.m.MessageBox.error("Please enter the Remarks first.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			$.sap.BusyDialog.open();
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "RETURN_TO_MAKER") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].Remarks = sap.ui.getCore().byId(
						"ReturnMakerDialogRemarksId").getValue();
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*	this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
				this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='RETURN_TO_MAKER',RequestGuid='" + this.reqGuid +
				"')",
				UploadPayload, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {
										if (sAction === "OK") {
											//that.DetailReturnMakerDialogFragment.close();
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
											if (that.navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else {
												that.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
											}
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
											// if (that.SelectedParameters.Action === "PENDING") {
											// 	var router = sap.ui.core.UIComponent.getRouterFor(that);
											// 	router.navTo("Display", true);
											// 	// Pending Action Tab Request Call 
											// 	that.getOwnerComponent().getModel().read("/PendingActionListSet", {
											// 		success: function(oData, oResponse) {
											// 			if (oResponse.headers["sap-message"]) {
											// 				if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 				} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 			var oModel1 = new sap.ui.model.json.JSONModel();
											// 			oModel1.setData(oData);
											// 			that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
											// 			that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
											// 			that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
											// 			that.getOwnerComponent().getModel("RecordNumberModel").refresh();
											// 		},
											// 		error: function(error) {
											// 			$.sap.BusyDialog.close();
											// 			if (error.headers["sap-message"]) {
											// 				if (JSON.parse(error.headers["sap-message"]).severity === "success") {
											// 					sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
											// 				} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
											// 					sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
											// 					$.sap.BusyDialog.close();
											// 					return false;
											// 				}
											// 			}
											// 		}
											// 	});
											// Pending Action Tab Request Call 
											// } else {
											// 	// window.location.reload();
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// 	that._EmployeeHistory(that.SelectedParameters);
											// 	that.getView().byId("AttachmentBtnId").setVisible(false);
											// 	that.getView().byId("CheckListBtnId").setVisible(false);
											// 	that.getView().byId("ApproverPathBtnId").setVisible(false);
											// 	that.getView().byId("RemarksBtnId").setVisible(false);
											// 	that.getView().byId("CFMSAckBtnId").setVisible(false);
											// 	that.getView().byId("SaveBtnId").setVisible(false);
											// 	that.getView().byId("DiscardBtnId").setVisible(false);
											// 	that.getView().byId("ApproverBtnId").setVisible(false);
											// 	that.getView().byId("RejectBtnId").setVisible(false);
											// 	that.getView().byId("SendBtnId").setVisible(false);
											// 	that.getView().byId("ReturnToMakerBtnId").setVisible(false);
											// 	that.getView().byId("SentBackBtnId").setVisible(false);
											// 	that.getView().byId("HistoryToLayoutId").setVisible(true);
											// 	that.getView().byId("TransferToLayoutId").setVisible(false);
											// }
										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.DetailReturnMakerDialogFragment.close();
						$.sap.BusyDialog.close();

					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
			$.sap.BusyDialog.close();
		},

		OnPressCancelReturnToMakers: function() {
			this.DetailReturnMakerDialogFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of RETURN TO MAKER Ends

		// Function of APPROVE Starts
		onPressApproveDetail: function() {
			// this.onSavePress();
			if (!this.DetailApproveDialogFragment) {
				this.DetailApproveDialogFragment = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailApproveDialog",
					this);
				this.getView().addDependent(this.DetailApproveDialogFragment);
			}
			sap.ui.getCore().byId("TermsCheckBoxApproveId").setSelected(false);
			sap.ui.getCore().byId("ApproveDialogRemarksId").setValue("");
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
					sap.ui.getCore().byId("TermsCheckBoxApproveId").setVisible(false);
					sap.ui.getCore().byId("ApproveDialogTermsTextId").setVisible(false);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
					sap.ui.getCore().byId("ApproveDialogTermsTextId").setText(
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
					sap.ui.getCore().byId("TermsCheckBoxApproveId").setVisible(true);
					sap.ui.getCore().byId("ApproveDialogTermsTextId").setVisible(true);
				}
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
					sap.ui.getCore().byId("ApproveRemarksLabelId").setVisible(true);
					sap.ui.getCore().byId("ApproveDialogRemarksId").setVisible(true);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
					sap.ui.getCore().byId("ApproveRemarksLabelId").setVisible(false);
					sap.ui.getCore().byId("ApproveDialogRemarksId").setVisible(false);
				}
			}
			// if (sap.ui.getCore().byId("ApproveRemarksLabelId").getVisible() || sap.ui.getCore().byId("ApproveDialogTermsTextId").getVisible()) {
			// 	this.DetailApproveDialogFragment.open();
			// }
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					this.getView().getModel("ButtonVisibleModel").getData()[i].CallFor = "CHECK";
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
			this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='APPROVE',RequestGuid='" + this.reqGuid + "')",
				UploadPayload, {
					success: function(oData, oResponse) {
						$.sap.BusyDialog.close();
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							} else {
								this.DetailApproveDialogFragment.open();
							}
						} else {
							this.DetailApproveDialogFragment.open();
						}
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
			$.sap.BusyDialog.close();
		},

		OnPressSendApprove: function() {
			if (sap.ui.getCore().byId("TermsCheckBoxApproveId").getVisible()) {
				if (!(sap.ui.getCore().byId("TermsCheckBoxApproveId").getSelected())) {
					sap.m.MessageBox.error("Please select verify the Terms and Conditions.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (sap.ui.getCore().byId("ApproveDialogRemarksId").getVisible()) {
				if (sap.ui.getCore().byId("ApproveDialogRemarksId").getValue() === "") {
					sap.m.MessageBox.error("Please enter the Remarks first.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "APPROVE") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					this.getView().getModel("ButtonVisibleModel").getData()[i].CallFor = "";
					this.getView().getModel("ButtonVisibleModel").getData()[i].Remarks = sap.ui.getCore().byId(
						"ApproveDialogRemarksId").getValue();
					var UploadPayloadWithBlank = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
			this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='APPROVE',RequestGuid='" + this.reqGuid + "')",
				UploadPayloadWithBlank, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {
										if (sAction === "OK") {
											// that.DetailReturnMakerDialogFragment.close();
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
											if (that.navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else {
												that.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
											}
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
											if (that.SelectedParameters.Action === "PENDING") {
												var router = sap.ui.core.UIComponent.getRouterFor(that);
												router.navTo("Display", true);
												// Pending Action Tab Request Call 
												that.getOwnerComponent().getModel().read("/PendingActionListSet", {
													success: function(oData, oResponse) {
														if (oResponse.headers["sap-message"]) {
															if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
																sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
															} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
																sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
																$.sap.BusyDialog.close();
																return false;
															}
														}
														var oModel1 = new sap.ui.model.json.JSONModel();
														oModel1.setData(oData);
														that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
														that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
														that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
														that.getOwnerComponent().getModel("RecordNumberModel").refresh();
													},
													error: function(error) {
														$.sap.BusyDialog.close();
														if (error.headers["sap-message"]) {
															if (JSON.parse(error.headers["sap-message"]).severity === "success") {
																sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
															} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
																sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
																$.sap.BusyDialog.close();
																return false;
															}
														}
													}
												});
												// Pending Action Tab Request Call 
											} else {
												// window.location.reload();
												that.getView().byId("HistoryToLayoutId").setVisible(true);
												that.getView().byId("TransferToLayoutId").setVisible(false);
												that._EmployeeHistory(that.SelectedParameters);
												that.getView().byId("AttachmentBtnId").setVisible(false);
												that.getView().byId("CheckListBtnId").setVisible(false);
												that.getView().byId("ApproverPathBtnId").setVisible(false);
												that.getView().byId("RemarksBtnId").setVisible(false);
												that.getView().byId("CFMSAckBtnId").setVisible(false);
												that.getView().byId("SaveBtnId").setVisible(false);
												that.getView().byId("DiscardBtnId").setVisible(false);
												that.getView().byId("ApproverBtnId").setVisible(false);
												that.getView().byId("RejectBtnId").setVisible(false);
												that.getView().byId("SendBtnId").setVisible(false);
												that.getView().byId("ReturnToMakerBtnId").setVisible(false);
												that.getView().byId("SentBackBtnId").setVisible(false);
												that.getView().byId("HistoryToLayoutId").setVisible(true);
												that.getView().byId("TransferToLayoutId").setVisible(false);
											}
										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.DetailApproveDialogFragment.close();
						$.sap.BusyDialog.close();
						/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
						// if (this.navigation == "HCMDashboard") {

						// 	this._navToParticularApp("zess_app", "display", {});
						// } else {
						// 	this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
						// }
						/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});

		},

		OnPressCancelApprove: function() {
			this.DetailApproveDialogFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of APPROVE Ends

		// Function of REJECT Starts
		onPressRejectDetail: function() {
			if (!this.DetailRejectDialogFragment) {
				this.DetailRejectDialogFragment = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.DetailRejectDialog",
					this);
				this.getView().addDependent(this.DetailRejectDialogFragment);
			}
			sap.ui.getCore().byId("TermsCheckBoxRejectId").setSelected(false);
			sap.ui.getCore().byId("RejectDialogRemarksId").setValue("");
			// this.getOwnerComponent().getModel("ButtonVisibleModel").getData().results
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REJECT" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition === "") {
					sap.ui.getCore().byId("TermsCheckBoxRejectId").setVisible(false);
					sap.ui.getCore().byId("RejectDialogTermsTextId").setVisible(false);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REJECT" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition !== "") {
					sap.ui.getCore().byId("RejectDialogTermsTextId").setText(
						this.getView().getModel("ButtonVisibleModel").getData()[i].TermsAndCondition);
					sap.ui.getCore().byId("TermsCheckBoxRejectId").setVisible(true);
					sap.ui.getCore().byId("RejectDialogTermsTextId").setVisible(true);
				}
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REJECT" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "X") {
					sap.ui.getCore().byId("RejectRemarksLabelId").setVisible(true);
					sap.ui.getCore().byId("RejectDialogRemarksId").setVisible(true);
				} else if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REJECT" &&
					this.getView().getModel("ButtonVisibleModel").getData()[i].RemarksRequired === "") {
					sap.ui.getCore().byId("RejectRemarksLabelId").setVisible(false);
					sap.ui.getCore().byId("RejectDialogRemarksId").setVisible(false);
				}
			}
			this.DetailRejectDialogFragment.open();
			$.sap.BusyDialog.close();
		},

		OnPressSendReject: function() {
			if (sap.ui.getCore().byId("TermsCheckBoxRejectId").getVisible()) {
				if (!(sap.ui.getCore().byId("TermsCheckBoxRejectId").getSelected())) {
					sap.m.MessageBox.error("Please select verify the Terms and Conditions.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			if (sap.ui.getCore().byId("RejectDialogRemarksId").getVisible()) {
				if (sap.ui.getCore().byId("RejectDialogRemarksId").getValue() === "") {
					sap.m.MessageBox.error("Please enter the Remarks first.");
					$.sap.BusyDialog.close();
					return false;
				}
			}
			$.sap.BusyDialog.open();
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "REJECT") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					this.getView().getModel("ButtonVisibleModel").getData()[i].Remarks = sap.ui.getCore().byId(
						"RejectDialogRemarksId").getValue();
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			/*	this.getView().getModel("ButtonVisibleModel").getData().updateBindings();
				this.getView().getModel("ButtonVisibleModel").getData().refresh();*/
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='REJECT',RequestGuid='" + this.reqGuid + "')",
				UploadPayload, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {
										if (sAction === "OK") {
											//	that.DetailReturnMakerDialogFragment.close();
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
											if (that.navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else {
												that.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
											}
											/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/

											if (that.SelectedParameters.Action === "PENDING") {
												var router = sap.ui.core.UIComponent.getRouterFor(that);
												router.navTo("Display", true);
												// Pending Action Tab Request Call 
												that.getOwnerComponent().getModel().read("/PendingActionListSet", {
													success: function(oData, oResponse) {
														if (oResponse.headers["sap-message"]) {
															if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
																sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
															} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
																sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
																$.sap.BusyDialog.close();
																return false;
															}
														}
														var oModel1 = new sap.ui.model.json.JSONModel();
														oModel1.setData(oData);
														that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
														that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
														that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
														that.getOwnerComponent().getModel("RecordNumberModel").refresh();
													},
													error: function(error) {
														$.sap.BusyDialog.close();
														if (error.headers["sap-message"]) {
															if (JSON.parse(error.headers["sap-message"]).severity === "success") {
																sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
															} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
																sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
																$.sap.BusyDialog.close();
																return false;
															}
														}
													}
												});
												// Pending Action Tab Request Call 
											} else {
												// window.location.reload();
												that.getView().byId("HistoryToLayoutId").setVisible(true);
												that.getView().byId("TransferToLayoutId").setVisible(false);
												that._EmployeeHistory(that.SelectedParameters);
												that.getView().byId("AttachmentBtnId").setVisible(false);
												that.getView().byId("CheckListBtnId").setVisible(false);
												that.getView().byId("ApproverPathBtnId").setVisible(false);
												that.getView().byId("RemarksBtnId").setVisible(false);
												that.getView().byId("CFMSAckBtnId").setVisible(false);
												that.getView().byId("SaveBtnId").setVisible(false);
												that.getView().byId("DiscardBtnId").setVisible(false);
												that.getView().byId("ApproverBtnId").setVisible(false);
												that.getView().byId("RejectBtnId").setVisible(false);
												that.getView().byId("SendBtnId").setVisible(false);
												that.getView().byId("ReturnToMakerBtnId").setVisible(false);
												that.getView().byId("SentBackBtnId").setVisible(false);
												that.getView().byId("HistoryToLayoutId").setVisible(true);
												that.getView().byId("TransferToLayoutId").setVisible(false);
											}
										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						this.DetailRejectDialogFragment.close();
						$.sap.BusyDialog.close();
						/* nav back to back screen - cfms_Ctm_npv -28_9_22 -start*/
						// if (this.navigation == "HCMDashboard") {
						// 	// window.history.go(-1);
						// 	this._navToParticularApp("zess_app", "display", {});
						// } else {
						// 	this.getOwnerComponent().getRouter().navTo("Masterpage", {}, true);
						// }
						/* nav back to back screen - cfms_Ctm_npv -28_9_22 -end*/
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						var t = JSON.parse(error.responseText).error.message.value;
						sap.m.MessageBox.error(t);
					}
				});
		},

		OnPressCancelReject: function() {
			this.DetailRejectDialogFragment.close();
			$.sap.BusyDialog.close();
		},
		// Function of REJECT Ends

		// Function of DELETE Starts
		onPressDiscardDetail: function(oEvent) {
			sap.m.MessageBox.confirm("Do you really want to withdraw this request?", {
				actions: ["YES", "NO"],
				onClose: function(sAction) {
					if (sAction === "YES") {
						this._CallDeleteBtnFunction();
					}
				}.bind(this)
			});
		},

		_CallDeleteBtnFunction: function() {
			debugger;
			for (var i = 0; i < this.getView().getModel("ButtonVisibleModel").getData().length; i++) {
				if (this.getView().getModel("ButtonVisibleModel").getData()[i].ButtonId === "DELETE") {
					this.getView().getModel("ButtonVisibleModel").getData()[i].RequestGuid = this.reqGuid;
					var UploadPayload = this.getView().getModel("ButtonVisibleModel").getData()[i];
				}
			}
			if (this.getOwnerComponent().oComponentData.startupParameters) {
				if (this.getOwnerComponent().oComponentData.startupParameters.navigation) {
					var navigation = this.getOwnerComponent().oComponentData.startupParameters.navigation[0];
				} else {
					var navigation = "";
				}
			}

			var router = this.getOwnerComponent().getRouter();
			$.sap.BusyDialog.open();
			this.getOwnerComponent().getModel().update("/ButtonPropertySet(ButtonId='REJECT',RequestGuid='" + this.reqGuid + "')",
				UploadPayload, {
					success: function(oData, oResponse) {
						var that = this;
						if (oResponse.headers["sap-message"]) {
							if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message, {
									actions: ["OK"],
									onClose: function(sAction) {
										if (sAction === "OK") {
											/*	if (that.SelectedParameters.Action === "PENDING") {
													var router = sap.ui.core.UIComponent.getRouterFor(that);
													router.navTo("Display", true);
													// Pending Action Tab Request Call 
													that.getOwnerComponent().getModel().read("/PendingActionListSet", {
														success: function(oData, oResponse) {
															if (oResponse.headers["sap-message"]) {
																if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
																	sap.m.MessageBox.success("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
																} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
																	sap.m.MessageBox.error("" + JSON.parse(oResponse.headers["sap-message"]).message + "");
																	$.sap.BusyDialog.close();
																	return false;
																}
															}
															var oModel1 = new sap.ui.model.json.JSONModel();
															oModel1.setData(oData);
															that.getOwnerComponent().setModel(oModel1, "DisplayPendingActionModel");
															that.getOwnerComponent().getModel("RecordNumberModel").getData().PendingRequest = oData.results.length;
															that.getOwnerComponent().getModel("RecordNumberModel").updateBindings();
															that.getOwnerComponent().getModel("RecordNumberModel").refresh();
														},
														error: function(error) {
															$.sap.BusyDialog.close();
															if (error.headers["sap-message"]) {
																if (JSON.parse(error.headers["sap-message"]).severity === "success") {
																	sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
																} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
																	sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
																	$.sap.BusyDialog.close();
																	return false;
																}
															}
														}
													});
													// Pending Action Tab Request Call 
												} else {
													// window.location.reload();
													that.getView().byId("HistoryToLayoutId").setVisible(true);
													that.getView().byId("TransferToLayoutId").setVisible(false);
													that._EmployeeHistory(that.SelectedParameters);
													that.getView().byId("AttachmentBtnId").setVisible(false);
													that.getView().byId("CheckListBtnId").setVisible(false);
													that.getView().byId("ApproverPathBtnId").setVisible(false);
													that.getView().byId("RemarksBtnId").setVisible(false);
													that.getView().byId("CFMSAckBtnId").setVisible(false);
													that.getView().byId("SaveBtnId").setVisible(false);
													that.getView().byId("DiscardBtnId").setVisible(false);
													that.getView().byId("ApproverBtnId").setVisible(false);
													that.getView().byId("RejectBtnId").setVisible(false);
													that.getView().byId("SendBtnId").setVisible(false);
													that.getView().byId("ReturnToMakerBtnId").setVisible(false);
													that.getView().byId("SentBackBtnId").setVisible(false);
													that.getView().byId("HistoryToLayoutId").setVisible(true);
													that.getView().byId("TransferToLayoutId").setVisible(false);
												}*/
											//navigation purpose added code - cfms_ctm_npv	-(27_10_22) -start
											// this.navigation
											if (navigation == "HCMDashboard") {
												// window.history.go(-1);
												that._navToParticularApp("zess_app", "display", {});
											} else if (navigation == "ActionHistory") {
												that._navToParticularApp("ZHR_TRANSFER_II", "display", {});
											} else {
												// that.getOwnerComponent().getRouter()
												router.navTo("Masterpage", {}, true);
											}
											//navigation purpose added code - cfms_ctm_npv	-(27_10_22) -end

										}
									}
								});
							} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
						$.sap.BusyDialog.close();
					}.bind(this),
					error: function(error) {
						$.sap.BusyDialog.close();
						if (error.headers["sap-message"]) {
							if (JSON.parse(error.headers["sap-message"]).severity === "success") {
								sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
							} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
								sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
								$.sap.BusyDialog.close();
								return false;
							}
						}
					}
				});
		},
		// Function of DELETE Ends
		// Common Functions/ Validation Functions
		_GetApproverPathDetail: function() {
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("RequestGuid", sap.ui.model.FilterOperator.EQ, this.reqGuid));
			this.getOwnerComponent().getModel().read("/ApproversPathSet", {
				filters: Filters,
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					var Array = [];
					var Object = {};

					for (var i = 0; i < oData.results.length; i++) {
						Object.OfficeId = oData.results[i].OfficeId;
						Object.AddedByName = oData.results[i].AddedByName;
						Object.OfficeName = oData.results[i].OfficeName;
						Object.PositionId = oData.results[i].PositionId;
						Object.RequestGuid = oData.results[i].RequestGuid;
						Object.PositionEdit = false;
						Object.WfroleEdit = false;
						Object.WfroleName = oData.results[i].WfroleName;
						Object.CurrentProcessor = oData.results[i].CurrentProcessor;
						Object.PositionName = oData.results[i].PositionName;
						Object.Seqno = (Number(oData.results[i].Seqno)).toString();
						Object.UpdatedBy = oData.results[i].UpdatedBy;
						Object.UpdatedByName = oData.results[i].UpdatedByName;
						Object.Wfrole = oData.results[i].Wfrole;
						Object.Pernr = oData.results[i].Pernr;
						Object.EmpName = oData.results[i].EmpName;
						Object.AddedBy = oData.results[i].AddedBy;
						Object.AddedOn = oData.results[i].AddedOn;
						Object.AddedTime = oData.results[i].AddedTime;
						Object.ActionTaken = oData.results[i].ActionTaken;
						Object.UpdatedOn = oData.results[i].UpdatedOn;
						Object.UpdatedTime = oData.results[i].UpdatedTime;
						Object.DeleteBtn = "sap-icon://delete";
						Object.DeleteAllowed = oData.results[i].DeleteAllowed;
						Array.push(Object);

						Object = {};
					}
					Array = {
						"results": Array
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Array);
					this.getOwnerComponent().setModel(oModel, "ApproverPathModel");

				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
				}
			});
		},
		// Common Fuctions/ Validation Functions

		// footer Button code -ends
		_manuallyDisabledDatePicker: function(control) {
			control.addDelegate({
				onAfterRendering: function() {
					control.$().find("INPUT").attr("disabled", true);
				}
			}, control);
		},

		addZero: function(val) {
			if (val < 10) {
				val = "0" + val;
				return val;
			} else {
				return val;
			}
		},

		// _dataConversion: function(date) {
		// 	var d = date.slice(6, 8);
		// 	var m = date.slice(4, 6);
		// 	var y = date.slice(0, 4);
		// 	var fulldate = new Date(y, m - 1, Number(d) + 1);
		// 	return fulldate;
		// },
		// emploee data showing when click on link of employee number -start
		onemphrinfo: function(oEvent) {
			/*	employee Profile data*/
			/*for getting leave oever view added on cfms_ctm_phn (01_03_23 -start)*/
			this.leaveRequestOverview();
			/*	for getting leave oever view added on cfms_ctm_phn (01_03_23 -start)*/
			var that = this;
			if (oEvent.getSource().sId) {
				if (oEvent.getSource().sId.split("-")[0].includes("__item")) {
					var employeeId = oEvent.getSource().getSender().split("(")[1].split(")")[0];
				} else {
					var employeeId = oEvent.getSource().getText();
				}
			}
			this._EmployeeHistory(employeeId);
			var fragment = "";

			fragment = "com.hcm.dashZHCM_DASHBOARD.view.fragments.EmployeeProfileDailog";
			if (!this.oDialogempdetail2) {
				this.oDialogempdetail2 = sap.ui.xmlfragment(fragment, this);
				this.getView().addDependent(this.oDialogempdetail2);
			}
			// var oModel = new sap.ui.model.json.JSONModel();
			// that.getView().setModel(oModel, "libCommon");
			// var date = new Date;
			// var time = date.getTime();
			// var imageurl =
			// 	"/sap/opu/odata/sap/HCMFAB_COMMON_SRV/EmployeePictureSet(ApplicationId='MYPERSONALDATA',EmployeeId='" + employeeId +
			// 	"')/$value?photoDate= " + time + " "
			// that.getView().getModel("libCommon").setProperty("/srcPath", imageurl);

			var that = this;
			var Filters = [];
			Filters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, employeeId));
			//this.oBusy.open();
			// this.getOwnerComponent().getModel().read("/EmployeeInfoSet(Pernr='" + employeeId + "')", {
			this.oModel.setUseBatch(false);
			// this.oModel.read("/EmployeDetailSet(Pernr='" + employeeId + "')", {
			this.oModel.read("/EmployeDetailSet", {
				async: false,
				filters: Filters,
				// urlParameters: {
				// 	"$expand": "EmployeeLastEventDetails,EmployeeLeaveInfoSet,EmployeePersonalInfo,EmployeeRemunerationInfoSet,EmpPayscaleInfoSet,SlabRangeSet"
				// },
				// urlParameters: {
				// 	"$expand": "EmployementInfo,OfficeInfo,ReportingOfficeInfo"
				// },
				success: function(oData, oResponse) {
					that.oBusy.close();
					var empdata = oData;
					// var leaveinfo = oData.EmployeeLeaveInfoSet;
					// var slabinfo = oData.SlabRangeSet;
					// var oModelleaveinfo = new sap.ui.model.json.JSONModel({
					// 	results: leaveinfo
					// });
					// var oModeltableearn = new sap.ui.model.json.JSONModel({
					// 	results: empdata
					// });
					var oModeltableearn = new sap.ui.model.json.JSONModel(oData.results[0]);
					that.getView().setModel(oModeltableearn, "formhrinfomodel");
					// sap.ui.getCore().byId("Absencestable").setModel(oModelleaveinfo,
					// "leaveinfomodel");
				},
				error: function(error) {
					that.oBusy.close();
					console.log(error)
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t, "Error");

				}
			});

			this.oDialogempdetail2.open();
		},
		//      else if (oControllerS1.filetype == "YF47" || oControllerS1.filetype === "YDA" || oControllerS1.filetype === "YTB" || oControllerS1.filetype ==
		//       "YLTA" || oControllerS1.filetype == "YLON" || oControllerS1.filetype ===
		//       "YRON" || oControllerS1.filetype === "YMR" || oControllerS1.filetype == "YS47" || oControllerS1.filetype == "YRPB" || oControllerS1.filetype ==
		//       "YSPB"  || oControllerS1.filetype === "YLSP" || oControllerS1.filetype === "YSAP" || oControllerS1.filetype === "YFAC" || oControllerS1.filetype === "YMLB" || oControllerS1.filetype === "YTFR" || oControllerS1.filetype === "YEAW" ||
		// oControllerS1.file+
		// type === "YEEL" || oControllerS1.filetype === "YRDE") {
		//       // sap.ui.getCore().byId("leavesection").setVisible(true);
		//       fragment = "flm.fiori.PSINDSFLM_FILESExtension.view.empobjectpage";
		//       if (!this.oDialogempdetail) {
		//         this.oDialogempdetail = sap.ui.xmlfragment(fragment, this);
		//         this.getView().addDependent(this.oDialogempdetail);
		//       }
		//       var oModel = new sap.ui.model.json.JSONModel();
		//       that.getView().setModel(oModel, "libCommon");
		//       var date = new Date;
		//       var time = date.getTime();
		//       var imageurl =
		//         "/sap/opu/odata/sap/HCMFAB_COMMON_SRV/EmployeePictureSet(ApplicationId='MYPERSONALDATA',EmployeeId='" + employeeId +
		//         "')/$value?photoDate= " + time + " "
		//       that.getView().getModel("libCommon").setProperty("/srcPath", imageurl);

		//       var that = this;
		//       this.getOwnerComponent().getModel().read("/EmployeeInfoSet(Pernr='" + employeeId + "')", {
		//         async: false,
		//         urlParameters: {
		//           "$expand": "EmployeeLastEventDetails,EmployeeLeaveInfoSet,EmployeePersonalInfo,EmployeeRemunerationInfoSet,EmpPayscaleInfoSet,SlabRangeSet"
		//         },
		//         success: function (oData, oResponse) {
		//           var empdata = oData;
		//           var leaveinfo = oData.EmployeeLeaveInfoSet.results;
		//           var slabinfo = oData.SlabRangeSet.results;

		//           var oModelleaveinfo = new sap.ui.model.json.JSONModel({
		//             results: leaveinfo
		//           });
		//           var oModelslabinfo = new sap.ui.model.json.JSONModel({
		//             results: slabinfo
		//           });
		//           var oModeltableearn = new sap.ui.model.json.JSONModel({
		//             results: empdata
		//           });

		//           that.getView().setModel(oModeltableearn, "formhrinfomodel");
		//           sap.ui.getCore().byId("Absencestable").setModel(oModelleaveinfo, "leaveinfomodel");
		//           sap.ui.getCore().byId("slabtable1").setModel(oModelslabinfo, "slabinfomodel");
		//         },
		//         error: function (error) {
		//           console.log(error)
		//         }
		//       });
		//       this.oDialogempdetail.open();
		//     }

		// this.oDialogempdetail.open();

		//},

		onCancelempdetailpen: function() {
			this.oDialogempdetail2.close();

		},
		_EmployeeHistory: function(parameter) {
			var that = this;
			var Employee = parameter;
			// if (parameter.navigation === undefined) {
			// 	Employee = parameter.Employee;
			// } else {
			// 	Employee = parameter.Employee[0];
			// }

			$.sap.BusyDialog.open();
			// this.getOwnerComponent().getModel().
			this.oModel.setUseBatch(false);
			this.oModel.read("/AllEmployeeListSet(Pernr='" + Employee + "')", {
				urlParameters: {
					"$expand": "EmployeeActionHistory"
				},
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData);
					that.getOwnerComponent().setModel(oModel, "DetailEmployeeHeaderModel");
					var Array = [];
					var Obj = {};
					for (var i = 0; i < oData.EmployeeActionHistory.results.length; i++) {
						Obj.ActionId = oData.EmployeeActionHistory.results[i].ActionId;
						Obj.ActionName = oData.EmployeeActionHistory.results[i].ActionName;
						Obj.ActionReasonId = oData.EmployeeActionHistory.results[i].ActionReasonId;
						Obj.ActionReasonName = oData.EmployeeActionHistory.results[i].ActionReasonName;
						Obj.EffectiveDate = oData.EmployeeActionHistory.results[i].EffectiveDate;
						Obj.EmployeeName = oData.EmployeeActionHistory.results[i].EmployeeName;
						Obj.FundcenterId = oData.EmployeeActionHistory.results[i].FundcenterId;
						Obj.Pernr = oData.EmployeeActionHistory.results[i].Pernr;
						Obj.ReqStatus = oData.EmployeeActionHistory.results[i].ReqStatus;
						Obj.RequestGuid = oData.EmployeeActionHistory.results[i].RequestGuid;
						Obj.ReferenceNumber = oData.EmployeeActionHistory.results[i].ReferenceNumber;
						Obj.Transfer = oData.EmployeeActionHistory.results[i].Transfer;
						Obj.UpdatedBy = oData.EmployeeActionHistory.results[i].UpdatedBy;
						Obj.UpdatedByName = oData.EmployeeActionHistory.results[i].UpdatedByName;
						Obj.UpdatedOn = oData.EmployeeActionHistory.results[i].UpdatedOn;
						Obj.UpdatedTime = oData.EmployeeActionHistory.results[i].UpdatedTime;
						if (Obj.ReqStatus === "DRAFT") {
							Obj.ActionPerformed = "MOD";
						} else {
							Obj.ActionPerformed = "";
						}
						Array.push(Obj);
						Obj = {};
					}
					Array = {
						"results": Array
					};
					var oModel1 = new sap.ui.model.json.JSONModel();
					oModel1.setData(Array);
					that.getOwnerComponent().setModel(oModel1, "DetailEmployeeTableModel");
					// if (that.typeofparams === "false") {
					// 	if (that.Parameters.Action === "SEARCH") {
					// 		that.getView().byId("HistoryPageId").setTitle(
					// 			that.getOwnerComponent().getModel("DetailEmployeeHeaderModel").getData().EmployeeName + "'s Action History"
					// 		);
					// 	}
					// } else {
					// 	if (that.Parameters.Action[0] === "SEARCH") {
					// 		that.getView().byId("HistoryPageId").setTitle(
					// 			that.getOwnerComponent().getModel("DetailEmployeeHeaderModel").getData().EmployeeName + "'s Action History"
					// 		);
					// 	}
					// }
					$.sap.BusyDialog.close();
				},
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}
				}
			});
		},

		// emploee data showing when click on link of employee number -end
		//for getting DetailTransferModel data purpose added
		_OnPendingToTransfer: function(GUID) {
			this.ReqGuid = GUID;
			$.sap.BusyDialog.open();
			var Entity = "";
			if (this.RequestAction === "Y4") {
				Entity = "/TransferInSet";
			} else if (this.RequestAction === "YF") {
				Entity = "/SeparationSet";
			} else {
				Entity = "/TransferSet";
			}
			this.getOwnerComponent().getModel().read("" + Entity + "(RequestGuid='" + this.ReqGuid + "')", {
				success: function(oData, oResponse) {
					if (oResponse.headers["sap-message"]) {
						if (JSON.parse(oResponse.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(oResponse.headers["sap-message"]).message);
						} else if (JSON.parse(oResponse.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(oResponse.headers["sap-message"]).message);
							$.sap.BusyDialog.close();
							return false;
						}
					}
					// Set Title of Page
					this.getView().byId("HistoryPageId").setTitle(
						oData.ActionName + "-" + oData.ActionReasonName + " for " + oData.EmployeeName + " ( " + oData.Pernr + " )"
					);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData);
					this.getOwnerComponent().setModel(oModel, "DetailTransferModel");
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().FromPositionId) === 0) {
						this.getView().byId("CurrPositionId").setText("");
					}
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().FromJobId) === 0) {
						this.getView().byId("CurrJobId").setText("");
					}
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().FromOfficeId) === 0) {
						this.getView().byId("CurrOfficeId").setText("");
					}
					if (this.getOwnerComponent().getModel("DetailTransferModel").getData().FromDdoId === "") {
						this.getView().byId("CurrDDOId").setText("");
					}
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().ToPositionId) === 0) {
						this.getView().byId("TransferPositionId").setValue("");
					}
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().ToJobId) === 0) {
						this.getView().byId("TransferJobId").setText("");
					}
					if (Number(this.getOwnerComponent().getModel("DetailTransferModel").getData().ToOfficeId) === 0) {
						this.getView().byId("TransferOfficeId").setText("");
					}
					if (this.getOwnerComponent().getModel("DetailTransferModel").getData().ToDdoId === "") {
						this.getView().byId("TransferDDOId").setText("");
					}
					this.getView().byId("HistoryToLayoutId").setVisible(false);
					this.getView().byId("TransferToLayoutId").setVisible(true);
					if (this.RequestAction === "YF") {
						this.getView().byId("EffectDateTransferTextId").setVisible(true);
						this.getView().byId("EffectDateTransferTextId").setText("Separation Date:");
						this.getView().byId("EffectDateTransferId").setVisible(true);
						this.getView().byId("segmentedBtnId").setVisible(false);
						this.getView().byId("CurrentTitleStyleId").setText("");
						this.getView().byId("ToBeTransferredId").setText("");
						this.getView().byId("DateOfBirthLabelId").setVisible(true);
						this.getView().byId("DateOfBirthId").setVisible(true);
						this.getView().byId("DateOfJoinLabelId").setVisible(true);
						this.getView().byId("DateOfJoinId").setVisible(true);
						this.getView().byId("DateOfSeparationLabelId").setVisible(true);
						this.getView().byId("DateOfSeparationId").setVisible(true);
						this.getView().byId("TransferPositionLabelId").setVisible(false);
						this.getView().byId("TransferPositionId").setVisible(false);
						this.getView().byId("TransferJobLabelId").setVisible(false);
						this.getView().byId("TransferJobId").setVisible(false);
						this.getView().byId("TransferOfficeLabelId").setVisible(false);
						this.getView().byId("TransferOfficeId").setVisible(false);
						this.getView().byId("TransferDDOLabelId").setVisible(false);
						this.getView().byId("TransferDDOId").setVisible(false);
					} else {
						this.getView().byId("EffectDateTransferTextId").setVisible(true);
						this.getView().byId("EffectDateTransferTextId").setText("Effective Date:");
						this.getView().byId("EffectDateTransferId").setVisible(true);
						this.getView().byId("segmentedBtnId").setVisible(true);
						this.getView().byId("CurrentTitleStyleId").setText("Current");
						this.getView().byId("ToBeTransferredId").setText("To be transferred");
						this.getView().byId("DateOfBirthLabelId").setVisible(false);
						this.getView().byId("DateOfBirthId").setVisible(false);
						this.getView().byId("DateOfJoinLabelId").setVisible(false);
						this.getView().byId("DateOfJoinId").setVisible(false);
						this.getView().byId("DateOfSeparationLabelId").setVisible(false);
						this.getView().byId("DateOfSeparationId").setVisible(false);
						this.getView().byId("TransferPositionLabelId").setVisible(true);
						this.getView().byId("TransferPositionId").setVisible(true);
						this.getView().byId("TransferJobLabelId").setVisible(true);
						this.getView().byId("TransferJobId").setVisible(true);
						this.getView().byId("TransferOfficeLabelId").setVisible(true);
						this.getView().byId("TransferOfficeId").setVisible(true);
						this.getView().byId("TransferDDOLabelId").setVisible(true);
						this.getView().byId("TransferDDOId").setVisible(true);
					}
					$.sap.BusyDialog.close();
					this._ButtonDetails();
				}.bind(this),
				error: function(error) {
					$.sap.BusyDialog.close();
					if (error.headers["sap-message"]) {
						if (JSON.parse(error.headers["sap-message"]).severity === "success") {
							sap.m.MessageBox.success(JSON.parse(error.headers["sap-message"]).message);
						} else if (JSON.parse(error.headers["sap-message"]).severity === "error") {
							sap.m.MessageBox.error(JSON.parse(error.headers["sap-message"]).message);
							return false;
						}
					}

				}
			});

		},

		/**
		 * Start of Integratation for Loans APP
		 * By: cfms_ctm_ual
		 * on: 23.01.2023
		 **/
		oHandleValueHelp: function(oEvent) {
			var sName = oEvent.getSource().getName();
			var ViewData = new Object();
			var aFilters, oEntityset, LoanType, LoanReason,
				CategoryID = this.getView().byId("idCategory").getSelectedKey(),
				empno = this.getView().getModel("LoansCWModel").getProperty("/Pernr"),
				GPFAmt = this.getView().byId("idGpfBalance").getValue().trim(),
				LoanType = this.getView().byId("idLoanType").getValue(),
				LoanReason = this.getView().byId("idLoanReason").getValue(),
				TotalNumOfInstallments = this.getView().byId("idTotalNumOfInstallments").getValue().split(" ")[0],
				EligibleLoanAmt = this.getView().byId("idEligibleLoanAmt").getValue().trim(),
				RequiredAmt = this.getView().byId("idRequiredAmt").getValue().trim();
			if (CategoryID === "") {
				sap.m.MessageBox.error("Please Select Loan Category");
				return;
			}
			// if (sName !== "LoanType" && !this.LoanType) {
			// 	sap.m.MessageBox.error("Please Select Loan Type");
			// 	return;
			// }
			// if (sName !== "LoanType" && sName !== "LoanReason" && !this.LoanReason) {
			// 	sap.m.MessageBox.error("Please Select Loan Reason");
			// 	return;
			// }
			if (LoanType) {
				LoanType = LoanType.split(" - ")[0];
			}
			if (LoanReason) {
				LoanReason = LoanReason.split(" - ")[0]
			}
			if (sName !== "LoanType" && LoanType === "") {
				sap.m.MessageBox.error("Please Select Loan Type");
				return;
			}
			if (sName !== "LoanType" && sName !== "LoanReason" && LoanReason === "") {
				sap.m.MessageBox.error("Please Select Loan Reason");
				return;
			}
			if (sName === "EligibleLoanAmt") {
				if (Number(GPFAmt) === 0 || GPFAmt === "") {
					sap.m.MessageBox.error("Please Provide GPF Bal");
					return;
				}
			}
			if (sName === "TotalNumOfInstallments") {
				if (Number(RequiredAmt) === 0 || RequiredAmt === "") {
					sap.m.MessageBox.error("Please Provide Eligible Loan Amount");
					return;
				}
			}
			if (!this.LoanTypeDialogFragment) {
				this.LoanTypeDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.LoansTypeF4", this);
				this.getView().addDependent(this.LoanTypeDialogFragment);
			}
			if (!this.LoanReasonDialogFragment) {
				this.LoanReasonDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.LoansReasonF4", this);
				this.getView().addDependent(this.LoanReasonDialogFragment);
			}
			if (!this.AdvanceForDialogFragment) {
				this.AdvanceForDialogFragment = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.AdvanceForwhomF4", this);
				this.getView().addDependent(this.AdvanceForDialogFragment);
			}
			if (!this.EligibleLoanAmountDialogFragment) {
				this.EligibleLoanAmountDialogFragment = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.EligibleLoanAmountF4",
					this);
				this.getView().addDependent(this.EligibleLoanAmountDialogFragment);
			}
			if (!this.TotalNumOfInstallmentsF4) {
				this.TotalNumOfInstallmentsF4 = new sap.ui.xmlfragment(
					"com.hcm.dashZHCM_DASHBOARD.view.fragments.TotalNumOfInstallmentsF4",
					this);
				this.getView().addDependent(this.TotalNumOfInstallmentsF4);
			}

			if (sName === "LoanType") {
				ViewData.LoanType = true;
				ViewData.LoanReason = false;
				this.LoanType = oEvent.getSource();
				aFilters = [
					new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, CategoryID)
				];
				oEntityset = "/VHLoanTypeSet";

				this.getView().byId("idLoanReason").setValue("");
				this.getView().byId("idAdvanceFor").setValue("");
				this.getView().byId("idFamMemberName").setValue("");
				this.getView().byId("idBasicPay").setValue("0.000");
				this.getView().byId("idGpfBalance").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setDescription("");
				this.getView().byId("idRequiredAmt").setValue("0.000");
				this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
				this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
				this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
				this.getView().byId("idFestivalDate").setValue("");
				this.getView().byId("idFestivalName").setValue("");
			}
			if (sName === "LoanReason") {
				ViewData.LoanType = false;
				ViewData.LoanReason = true;
				this.LoanReason = oEvent.getSource();
				aFilters = [
					new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, CategoryID),
					new sap.ui.model.Filter("LoanType", sap.ui.model.FilterOperator.EQ, LoanType),
					new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
				];
				oEntityset = "/VHReasonSet";
				this.getView().byId("idAdvanceFor").setValue("");
				this.getView().byId("idFamMemberName").setValue("");
				this.getView().byId("idGpfBalance").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setDescription("");
				this.getView().byId("idRequiredAmt").setValue("0.000");
				this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
				this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
				this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
			}
			if (sName === "AdvanceForWhom") {
				this.AdvanceForWhom = oEvent.getSource();
				oEntityset = "/VHFamilyDepenedentsSet";
				aFilters = [
					new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno)
				];
				this.getView().byId("idFamMemberName").setValue("");
				this.getView().byId("idGpfBalance").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setValue("0.000");
				this.getView().byId("idEligibleLoanAmt").setDescription("");
				this.getView().byId("idRequiredAmt").setValue("0.000");
				this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
				this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
				this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
			}
			if (sName === "EligibleLoanAmt") {
				this.EligibleLoanAmt = oEvent.getSource();
				oEntityset = "/EligibleLoanAmountSet";
				aFilters = [
					new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno),
					new sap.ui.model.Filter("LoanCat", sap.ui.model.FilterOperator.EQ, CategoryID),
					new sap.ui.model.Filter("LoanType", sap.ui.model.FilterOperator.EQ, LoanType),
					new sap.ui.model.Filter("LoanReason", sap.ui.model.FilterOperator.EQ, LoanReason),
					new sap.ui.model.Filter("SourceAmount", sap.ui.model.FilterOperator.EQ, GPFAmt)
				];
				this.getView().byId("idRequiredAmt").setValue("0.000");
				this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
				this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
				this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
			}
			if (sName === "TotalNumOfInstallments") {
				this.TotalNumOfInstallments = oEvent.getSource();
				oEntityset = "/VHNumberOfInstalmentSet";
				aFilters = [
					new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, empno),
					new sap.ui.model.Filter("LoanCategoryId", sap.ui.model.FilterOperator.EQ, CategoryID),
					new sap.ui.model.Filter("LoanTypeId", sap.ui.model.FilterOperator.EQ, LoanType),
					new sap.ui.model.Filter("LoanReasonId", sap.ui.model.FilterOperator.EQ, LoanReason),
					new sap.ui.model.Filter("GpfBalance", sap.ui.model.FilterOperator.EQ, GPFAmt),
					new sap.ui.model.Filter("RequiredAmt", sap.ui.model.FilterOperator.EQ, RequiredAmt)
				];
				this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
				this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
				this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
			}
			// 			this.oBusy = new sap.m.BusyDialog();
			this.oBusy.open();
			this.oModel.setUseBatch(false);
			this.oModel.read(oEntityset, {
				filters: aFilters,
				// urlParameters: {
				// 	"$expand": "RequestDetails"
				// },
				success: function(oData, response) {
					this.oBusy.close();
					var LoanF4Model = new sap.ui.model.json.JSONModel(oData.results);
					if (sName === "LoanType") {
						this.LoanTypeDialogFragment.open();
						this.LoanTypeDialogFragment.setModel(LoanF4Model);
					}
					if (sName === "LoanReason") {
						this.LoanReasonDialogFragment.open();
						this.LoanReasonDialogFragment.setModel(LoanF4Model);
					}
					if (sName === "AdvanceForWhom") {
						this.AdvanceForDialogFragment.open();
						this.AdvanceForDialogFragment.setModel(LoanF4Model);
					}
					if (sName === "EligibleLoanAmt") {
						this.EligibleLoanAmountDialogFragment.open();
						this.EligibleLoanAmountDialogFragment.setModel(LoanF4Model);
					}
					if (sName === "TotalNumOfInstallments") {
						this.TotalNumOfInstallmentsF4.open();
						this.TotalNumOfInstallmentsF4.setModel(LoanF4Model);
					}
				}.bind(this),
				error: function(oError) {
					this.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}.bind(this)
			});
		},
		oHandleLoansFestivalDate: function(oEvent) {
			if (!this.FestivalDateF4) {
				this.FestivalDateF4 = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.FestivalDateF4", this);
				this.getView().addDependent(this.FestivalDateF4);
			}
			this.FestivalDate = oEvent.getSource();
			this.oBusy.open();
			var oModel = this.getOwnerComponent().getModel("leavereq");
			oModel.setUseBatch(false);
			oModel.read("/HolidayListSet", {
				success: function(oData, response) {
					this.oBusy.close();
					var LoanF4Model = new sap.ui.model.json.JSONModel(oData.results);
					this.FestivalDateF4.setModel(LoanF4Model);
					this.FestivalDateF4.open();
				}.bind(this),
				error: function(oError) {
					this.oBusy.close();
					var t = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.error(t);
				}.bind(this)
			});
		},
		ConfirmLoanTypeDialog: function(oEvent) {
			this.LoanType.setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("LoanType") + " - " + oEvent.getParameter(
				"selectedItem").getBindingContext().getProperty("LoanTypeDesc"));
			this.LoanType.setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("LoanType") + " - " + oEvent.getParameter(
				"selectedItem").getBindingContext().getProperty("LoanTypeDesc"));
			this.oHandleLoansTypeChange(oEvent.getParameter("selectedItem").getBindingContext().getProperty("LoanType"));
		},
		ConfirmLoanReasonDialog: function(oEvent) {
			this.LoanReason.setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("LoanReasonID") + " - " + oEvent.getParameter(
				"selectedItem").getBindingContext().getProperty("LoanReasonDesc"));
			this.LoanReason.setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("LoanReasonID") + " - " + oEvent
				.getParameter(
					"selectedItem").getBindingContext().getProperty("LoanReasonDesc"));
			this.getView().byId("idBasicPay").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("BasicPay"));
			this.getView().byId("idBasicPay").setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("BasicPay"));
			this.getView().byId("idGpfAccountNum").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty(
				"GPFACCNumber"));
			this.getView().byId("idGpfAccountNum").setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty(
				"GPFACCNumber"));
			this.getView().byId("idGpfBalance").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("GPFBalance"));
			this.getView().byId("idGpfBalance").setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("GPFBalance"));
			this.getView().byId("idEligibleLoanAmt").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty(
				"EligibleAmount"));
			this.getView().byId("idEligibleLoanAmt").setDescription("");
		},
		ConfirmAdvanceForwhomDialog: function(oEvent) {
			this.AdvanceForWhom.setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("MIDDescription"));
			this.AdvanceForWhom.setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("MIDDescription"));
			this.getView().byId("idFamMemberName").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("Name"));
			this.getView().byId("idFamMemberName").setTooltip(oEvent.getParameter("selectedItem").getBindingContext().getProperty("Name"));
		},
		onchangeLoanCategory: function(oEvent) {
			this.getView().byId("idLoanType").setValue("");
			this.getView().byId("idLoanReason").setValue("");
			this.getView().byId("idAdvanceFor").setValue("");
			this.getView().byId("idFamMemberName").setValue("");
			this.getView().byId("idBasicPay").setValue("0.000");
			this.getView().byId("idGpfBalance").setValue("0.000");
			this.getView().byId("idEligibleLoanAmt").setValue("0.000");
			this.getView().byId("idRequiredAmt").setValue("0.000");
			this.getView().byId("idTotalNumOfInstallments").setValue("0.000");
			this.getView().byId("idMonthlyInstallmentAmt").setValue("0.000");
			this.getView().byId("idAdditionalLoanAmt").setValue("0.000");
			this.getView().byId("idFestivalDate").setValue("");
			this.getView().byId("idFestivalName").setValue("");
			var oLoanViewModel = new sap.ui.model.json.JSONModel({
				GPFVisible: false,
				FVisible: false
			});
			this.getView().setModel(oLoanViewModel, "oLoanViewModel");
		},
		oValidateLoansForm: function() {
			if (this.getView().byId("idCategory").getSelectedKey() === "") {
				sap.m.MessageBox.error("Please Select Loan Category");
				return false;
			}
			if (this.getView().byId("idLoanType").getValue() === "") {
				sap.m.MessageBox.error("Please Select Loan Type");
				return false;
			}
			if (this.getView().byId("idLoanReason").getValue() === "") {
				sap.m.MessageBox.error("Please Select Loan Reason");
				return false;
			}
			if (this.getView().byId("idAdvanceFor").getValue() === "") {
				sap.m.MessageBox.error("Please Select Advance For Whom");
				return false;
			}
			if (this.getView().byId("idLoanType").getValue().startsWith("G")) {
				if (this.getView().byId("idGpfBalance").getValue() === "" || Number(this.getView().byId("idGpfBalance").getValue()) === 0) {
					sap.m.MessageBox.error("Please Select GPF Balance");
					return false;
				}
			}
			if (this.getView().byId("idLoanType").getValue().startsWith("F") || this.getView().byId("idLoanType").getValue().startsWith("A")) {
				if (this.getView().byId("idFestivalDate").getValue() === "") {
					sap.m.MessageBox.error("Please Select Festival Date");
					return false;
				}
			}
			if (this.getView().byId("idEligibleLoanAmt").getValue() === "" || Number(this.getView().byId("idEligibleLoanAmt").getValue()) === 0) {
				sap.m.MessageBox.error("Please Select Eligible Loan Amount");
				return false;
			}
			if (this.getView().byId("idRequiredAmt").getValue() === "" || Number(this.getView().byId("idRequiredAmt").getValue()) === 0) {
				sap.m.MessageBox.error("Please Select Required Amount");
				return false;
			}
			if (this.getView().byId("idTotalNumOfInstallments").getValue() === "") {
				sap.m.MessageBox.error("Please Select Total Number Of Installments");
				return false;
			}
			return true;

		},
		saveLoaneDetailsPayload: function() {
			var oPayloadData = JSON.parse(JSON.stringify(this.getView().getModel("LoansCWModel").getData()));
			var Requestdetails = oPayloadData.Requestdetails;
			if (oPayloadData.__metadata) {
				delete oPayloadData.__metadata;
			}
			if (Requestdetails.__metadata) {
				delete Requestdetails.__metadata;
			}

			oPayloadData.LoanCategoryId = this.getView().byId("idCategory").getSelectedKey();
			oPayloadData.LoanCategoryDesc = this.getView().byId("idCategory").getValue();
			oPayloadData.LoanTypeId = this.getView().byId("idLoanType").getValue().split(" - ")[0];
			oPayloadData.LoanTypeDesc = this.getView().byId("idLoanType").getValue().split(" - ")[1];
			oPayloadData.LoanReasonId = this.getView().byId("idLoanReason").getValue().split(" - ")[0];
			oPayloadData.LoanReasonDesc = this.getView().byId("idLoanReason").getValue().split(" - ")[1];
			oPayloadData.AdvanceFor = this.getView().byId("idAdvanceFor").getValue();
			oPayloadData.FamMemberName = this.getView().byId("idFamMemberName").getValue();
			oPayloadData.BasicPay = this.getView().byId("idBasicPay").getValue("").trim();
			oPayloadData.GpfAccountNum = this.getView().byId("idGpfAccountNum").getValue();
			oPayloadData.GpfBalance = this.getView().byId("idGpfBalance").getValue().trim();
			oPayloadData.EligibleLoanAmt = this.getView().byId("idEligibleLoanAmt").getValue().trim();
			oPayloadData.RequiredAmt = this.getView().byId("idRequiredAmt").getValue().trim();
			oPayloadData.LeftOverService = this.getView().byId("idLeftOverService").getValue();
			oPayloadData.ReasonForLoan = this.getView().byId("idReasonForLoan").getValue();
			oPayloadData.TotalNumOfInstl = Number(this.getView().byId("idTotalNumOfInstallments").getValue().split(" ")[0]);
			oPayloadData.MonthlyInstallmentAmt = this.getView().byId("idMonthlyInstallmentAmt").getValue();
			oPayloadData.FestivalDate = this.FestDate === undefined ? null : this.FestDate;
			oPayloadData.FestivalName = this.getView().byId("idFestivalName").getValue();
			oPayloadData.PayscaleLimit = this.getView().byId("idPayscaleLimit").getValue();
			return oPayloadData
		},
		ConfirmEligibleLoanAmountDialog: function(oEvent) {
			this.EligibleLoanAmt.setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("EligibleAmount"));
			this.EligibleLoanAmt.setDescription(oEvent.getParameter("selectedItem").getBindingContext().getProperty("EligibleAmtDesc"));
		},
		ConfirmTotalNumOfInstallmentsDialog: function(oEvent) {
			this.getView().byId("idMonthlyInstallmentAmt").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty(
				"MonthlyInstallmentAmt"));
			this.TotalNumOfInstallments.setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("Numberofinstalment") +
				" Months");
		},
		ConfirmConfirmFestivalDateDialog: function(oEvent) {
			this.getView().byId("idFestivalName").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty(
				"HolidayName"));
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd MMMM yyyy"
			});
			this.FestDate = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Date");
			var sDate = oDateFormat.format(oEvent.getParameter("selectedItem").getBindingContext().getProperty("Date"));
			this.FestivalDate.setValue(sDate);
		},
		oHandleReqAmountValidate: function(oEvent) {
			var EligibleLoanAmt = this.getView().byId("idEligibleLoanAmt").getValue();
			if (EligibleLoanAmt === "") {
				sap.m.MessageBox.error("Please Provide Mandatory Fields");
				return;
			}
			var RequiredAmt = oEvent.getSource().getValue();
			if (Number(EligibleLoanAmt) <= Number(RequiredAmt)) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText("Please Provide Valid Request Amount");
				sap.m.MessageBox.error("Please Provide Valid Request Amount");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		oResetLoanView: function() {
			this.getView().byId("idCategory").setSelectedKey("");
			this.getView().byId("idLoanType").setValue("");
			this.getView().byId("idLoanReason").setValue("");
			this.getView().byId("idLoanReason").setValue("");
			this.getView().byId("idAdvanceFor").setSelectedKey("");
			this.getView().byId("idFamMemberName").setValue("");
			this.getView().byId("idBasicPay").setValue("");
			this.getView().byId("idGpfAccountNum").setValue("");
			this.getView().byId("idGpfBalance").setValue("");
			this.getView().byId("idEligibleLoanAmt").setValue("");
			this.getView().byId("idRequiredAmt").setValue("");
			this.getView().byId("idLeftOverService").setValue("");
		},
		oHandleConverGpf: function(oEvent) {
			var sItemProperty = oEvent.getSource().getBindingContext("LoansCWDetailsModel").getProperty();
			if (!this.ConvertGPFFormDetails) {
				this.ConvertGPFFormDetails = new sap.ui.xmlfragment("com.hcm.dashZHCM_DASHBOARD.view.fragments.ConvertGPFFormDetails", this);
				this.getView().addDependent(this.ConvertGPFFormDetails);
			}
			var oModel = new JSONModel(sItemProperty);
			this.ConvertGPFFormDetails.setModel(oModel, "ConvertGPFModel");
			this.ConvertGPFFormDetails.open();
		},
		onCancGPF: function() {
			this.ConvertGPFFormDetails.close();
		},
		onGPFSubmit: function(oEvent) {
				var context = oEvent;
			}
			/*End of Integratation*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.hcm.dashZHCM_DASHBOARD.view.Detailspage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.hcm.dashZHCM_DASHBOARD.view.Detailspage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.hcm.dashZHCM_DASHBOARD.view.Detailspage
		 */
		//	onExit: function() {
		//
		//	}

	});

});
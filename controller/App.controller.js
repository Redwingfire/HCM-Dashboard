/*sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.hcm.dashZHCM_DASHBOARD.controller.App", {

		

	});

});*/

sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.hcm.dashZHCM_DASHBOARD.controller.App", {

        onInit : function () {
            // apply content density mode to root view
            //this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });

});
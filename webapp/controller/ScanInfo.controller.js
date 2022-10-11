sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("viscofan.ewminvregister.controller.ScanInfo", {
            onInit: function () {
                this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            _formatScannedValue: function (oInput) {
                var sValue = oInput.getValue();
                //Etiquetas en general
                if (sValue && sValue.substring(0, 2) === "##") {
                    sValue = sValue.substring(2);
                }
                //Etiquetas cartones
                if (sValue.length === 32) {
                    sValue = sValue.substring(9, 25);
                } else if (sValue.length === 44) {
                    sValue = sValue.substring(28);
                } else if (sValue.charAt(0) === "(") {
                    if (sValue.length === 46) {
                        sValue = sValue.substring(30);
                    } else {
                        sValue = sValue.substring(38);
                    }
                } else if (sValue.charAt(0) === "]") {
                    var aSplit = sValue.split("10");
                    var iCount = 1;
                    var sAuxValue = aSplit[aSplit.length - iCount];
                    while (sAuxValue.length < 10) {
                        iCount++;
                        sAuxValue = aSplit[aSplit.length - iCount] + "10" + sAuxValue;
                    }
                    sValue = sAuxValue;
                } else if (sValue.length !== 16) {
                    var sAuxValue = sValue.substring(sValue.length - 10);
                    if (sAuxValue.length > 9) {
                        var sAux1Char = sAuxValue.charAt(0);
                        if (sAux1Char !== "1") {
                            var sAuxValue = sValue.substring(sValue.length - 11);
                        }
                        sValue = sAuxValue;
                    }
                }
                return sValue;
            },

            onScanArticle: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                var oView = this.getView();
                oInput.setValueState("None");
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputMaterial").focus();
                });
            },
            onScanMaterial: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                oInput.setValueState("None");
                var oView = this.getView();
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputQuan").focus();
                });
            },
            onScanQuan: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                oInput.setValueState("None");
                //quitamos decimales y el punto de miles
                var str = oInput.getValue();
                if (str !== '') {
                    str = str.replace('.', '');
                    //str = str.replace(/\s/g, '');
                    oInput.setValue(str);

                    var coma = str.search(',');
                    str = str.substring(0, coma);
                    oInput.setValue(str);
                }

                var oView = this.getView();
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputGrams").focus();
                });
            },
            onScanGrams: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                var oView = this.getView();
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputBatch").focus();
                });
            },
            onScanBatch: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                oInput.setValueState("None");
                var oView = this.getView();
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputManufDate").focus();
                });
            },
            onScanManufDate: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                var oView = this.getView();
                jQuery.sap.delayedCall(100, this, function () {
                    oView.byId("inputLocation").focus();
                });
            },


            onScanLocation: function (oEvent) {
                var oInput = oEvent.getSource();
                oInput.setValue(this._formatScannedValue(oInput));
                var oView = this.getView();
                this._onPressAddTask(oView);
            },


            _onPressAddTask: function (oView) {
                var oInputAddTask = oView.byId("inputArticle");
                var oInputAddTask2 = oView.byId("inputMaterial");
                var oInputAddTask3 = oView.byId("inputQuan");
                var oInputAddTask4 = oView.byId("inputBatch");
                var oInputAddTask5 = oView.byId("inputLocation");
                var oInputAddTask6 = oView.byId("inputGrams");
                var oInputAddTask7 = oView.byId("inputManufDate");
                //   var oButtonAddTask = oView.byId("buttonAddTask");

                oInputAddTask.setValueState("None");
                oInputAddTask2.setValueState("None");
                oInputAddTask3.setValueState("None");
                oInputAddTask4.setValueState("None");

                var sTaskDescription = oInputAddTask.getValue();
                var sTaskDescription2 = oInputAddTask2.getValue();
                var sTaskDescription3 = oInputAddTask3.getValue();
                var str = sTaskDescription3;
                if (str !== '') {
                    str = str.replace('.', '');
                    var coma = str.search(',');
                    str = str.substring(0, coma);
                    oInputAddTask3.setValue(str);
                }

                var sTaskDescription4 = oInputAddTask4.getValue();
                var sTaskDescription5 = oInputAddTask5.getValue();
                var sTaskDescription6 = oInputAddTask6.getValue();
                var sTaskDescription7 = oInputAddTask7.getDateValue();
                if (sTaskDescription7) {
                    sTaskDescription7 = sTaskDescription7.toLocaleDateString('sv').replaceAll('-', '');
                }
                var oStaticModel = oView.getModel("MainStaticModel");
                var oArticlesData = oStaticModel.getProperty("/Articles");
                var oDataModel = oView.getModel();

                if (sTaskDescription && sTaskDescription2 && sTaskDescription3 && sTaskDescription4 && sTaskDescription5) {
                    var that = this;
                    // var sUrl = "/ArticleSet(Key='" + sTaskDescription + "')";
                    var sUrl = "/ArticleCheckSet(zarticle_id='" + sTaskDescription + "',zbin='" + sTaskDescription5 + "',zmaterial='" + sTaskDescription2 + "')";
                    //var sUrl = "/ArticleCheckSet(zarticle_id='" + sTaskDescription + "')";
                    oDataModel.read(sUrl, {
                        success: function (oData, oResponse) {
                            var oArticle = {
                                "zarticle_id": sTaskDescription,
                                "zmaterial": sTaskDescription2,
                                "zmeters": sTaskDescription3,
                                "zbatch": sTaskDescription4,
                                "zbin": sTaskDescription5,
                                "zgrams": sTaskDescription6,
                                "zmanuf_date": sTaskDescription7
                            }

                            oArticlesData.push(oArticle);
                            oStaticModel.setProperty("/Articles", oArticlesData);
                            oStaticModel.refresh();

                            oInputAddTask.setValue("");
                            oInputAddTask2.setValue("");
                            oInputAddTask3.setValue("");
                            oInputAddTask4.setValue("");
                            oInputAddTask5.setValue("");
                            oInputAddTask6.setValue("");
                            oInputAddTask7.setDateValue();

                            jQuery.sap.delayedCall(100, that, function () {
                                that.getView().byId("inputArticle").focus();
                            });
                        },

                        error: function (oError) {
                            var sMessage = oError.statusCode !== 500 &&
                                JSON.parse(oError.responseText).error.message.value &&
                                JSON.parse(oError.responseText).error.message.value !== "" ?
                                JSON.parse(oError.responseText).error.message.value :
                                oResourceBundle.getText("errorScan");
                            MessageBox.error(sMessage);
                            //that._showColor("#cc1919");

                        }
                    });
                } else {
                    if (sTaskDescription === '') {
                        oInputAddTask.setValueState("Error");
                    }
                    if (sTaskDescription2 === '') {
                        oInputAddTask2.setValueState("Error");
                    }
                    if (sTaskDescription3 === '') {
                        oInputAddTask3.setValueState("Error");
                    }
                    if (sTaskDescription4 === '') {
                        oInputAddTask4.setValueState("Error");
                    }
                    var sMessage = this.oResourceBundle.getText("mandatoryFields");
                    MessageBox.error(sMessage);
                }
            },

            onDeleteItem: function (oEvent) {
                var oView = this.getView();
                var oSelectedItem = oEvent.getSource().getParent();
                var sPath = oSelectedItem.getBindingContextPath();
                var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
                var oStaticModel = oView.getModel("MainStaticModel");
                var oArticlesData = oStaticModel.getProperty("/Articles");

                oArticlesData.splice(oIndex, 1);
                oStaticModel.setProperty("/Articles", oArticlesData);
                oStaticModel.refresh();
            },

            onPressPost: function (oEvent) {
                var oStaticModel = this.getView().getModel("MainStaticModel");
                var oDataScan = oStaticModel.getProperty("/Articles");
                var oPage = this.getView().byId("page");
                oPage.setBusy(true);
                const string = JSON.stringify(oDataScan); // convert Object to a String
                var encodeString = btoa(string); // Base64 encode the String
                var sKey = "";

                var oModel = this.getView().getModel();

                if (oStaticModel.getProperty("/FLAG_PALLET")) {
                    sKey = "NEWPALLET"
                } else {
                    sKey = "NOPALLET"
                }

                var oEntry = {
                    "Key": sKey,
                    "Value": encodeString
                };
                var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                oModel.create("/ArticleSet", oEntry, {
                    success: function (oData, oResponse) {
                        oPage.setBusy(false);
                        oStaticModel.setProperty("/Articles", []);
                        oStaticModel.refresh();
                        var sMessage = oResourceBundle.getText("postOK");
                        MessageBox.success(sMessage);
                    },

                    error: function (oError) {
                        oPage.setBusy(false);
                        var sMessage = oError.statusCode !== 500 &&
                            JSON.parse(oError.responseText).error.message.value &&
                            JSON.parse(oError.responseText).error.message.value !== "" ?
                            JSON.parse(oError.responseText).error.message.value :
                            oResourceBundle.getText("errorScan");
                        MessageBox.error(sMessage);
                        //that._showColor("#cc1919");

                    }
                });
            },

            onValueHelpBatchRequested: function (oEvent) {
                if (!this.BatchVHDialog) {
                    this.BatchVHDialog = sap.ui.xmlfragment(
                        "viscofan.ewminvregister.view.fragments.BatchVH", this
                    );
                    this.getView().addDependent(this.BatchVHDialog);
                }
                this.BatchVHDialog.getBinding("items").filter([]);
                this.BatchVHDialog.open();
            },

            batSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oItemsBinding = oEvent.getParameter("itemsBinding");
                var oFilters = [];
                var aTotFilters = [];

                var sFilterMat = new sap.ui.model.Filter({
                    path: "matnr",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });
                var sFilterBat = new sap.ui.model.Filter({
                    path: "charg",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });


                // oFilters.push(sFilterMat);
                oFilters.push(sFilterBat);

                var allFilters = new sap.ui.model.Filter(oFilters, false);
                aTotFilters.push(allFilters);

                oItemsBinding.filter(aTotFilters);

            },
            chargSelected: function (oEvent) {
                var oTargetInput = this.getView().byId("inputBatch");
                var oItemSelected = oEvent.getParameter("selectedItem");
                var oSelectedObject = oItemSelected.getBindingContext().getObject();

                oTargetInput.setValue(oSelectedObject.charg);
                oTargetInput.fireSubmit();

            },
            onValueHelpMatRequested: function (oEvent) {
                if (!this.MatVHDialog) {
                    this.MatVHDialog = sap.ui.xmlfragment(
                        "viscofan.ewminvregister.view.fragments.MaterialVH", this
                    );
                    this.getView().addDependent(this.MatVHDialog);
                }
                this.MatVHDialog.getBinding("items").filter([]);
                this.MatVHDialog.open();
            },
            /*
             * Controls the search within the Business Areas dialogue 
             */
            matSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oItemsBinding = oEvent.getParameter("itemsBinding");
                var oFilters = [];
                var aTotFilters = [];

                var sFilterMat = new sap.ui.model.Filter({
                    path: "Material",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });
                var sFilterMatName = new sap.ui.model.Filter({
                    path: "MaterialName",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });
                var sFilterMatType = new sap.ui.model.Filter({
                    path: "MaterialType",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });

                oFilters.push(sFilterMat);
                oFilters.push(sFilterMatName);
                oFilters.push(sFilterMatType);

                var allFilters = new sap.ui.model.Filter(oFilters, false);
                aTotFilters.push(allFilters);

                oItemsBinding.filter(aTotFilters);

            },

            /*
             * Controls the selection of an item within the Business Areas dialog
             */
            materialSelected: function (oEvent) {
                var oTargetInput = this.getView().byId("inputMaterial");
                var oItemSelected = oEvent.getParameter("selectedItem");
                var oSelectedObject = oItemSelected.getBindingContext().getObject();

                oTargetInput.setValue(oSelectedObject.Material);
                oTargetInput.fireSubmit();

            },

            /*
             * Opening dialogue of possible Bin Locations
             */
            handleHelpStorBin: function (oEvent) {
                if (!this.StorageBinVHDialog) {
                    this.StorageBinVHDialog = sap.ui.xmlfragment(
                        "viscofan.ewminvregister.view.fragments.StorageBinVH", this
                    );
                    this.getView().addDependent(this.StorageBinVHDialog);
                }
                this.StorageBinVHDialog.getBinding("items").filter([]);
                this.StorageBinVHDialog.open();
            },

            /*
             * Controls the search within the Bin Locations dialogue 
             */
            binSearch: function (oEvent) {
                ;
                var sValue = oEvent.getParameter("value");
                //var oItemsBinding = oEvent.getParameter("itemsBinding");
                var oItemsBinding = oEvent.getSource().getBinding("items");
                var oFilters = [];
                var aTotFilters = [];

                var sFilterLgpla = new sap.ui.model.Filter({
                    path: "lgpla",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });
                var sFilterLbert = new sap.ui.model.Filter({
                    path: "lbert",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });

                var sFilterLtypt = new sap.ui.model.Filter({
                    path: "ltypt",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sValue
                });

                oFilters.push(sFilterLgpla);
                oFilters.push(sFilterLbert);
                oFilters.push(sFilterLtypt);

                var allFilters = new sap.ui.model.Filter(oFilters, false);
                aTotFilters.push(allFilters);

                oItemsBinding.filter(aTotFilters);

            },

            /*
             * Controls the selection of an item within the Bin Locations dialog
             */
            binSelected: function (oEvent) {
                var oTargetInput = this.getView().byId("inputLocation");
                var oItemSelected = oEvent.getParameter("selectedItem");
                var oSelectedObject = oItemSelected.getBindingContext().getObject();

                oTargetInput.setValue(oSelectedObject.lgpla);
                oTargetInput.fireSubmit();
            },

            handleHelpManufDate: function (oEvent) {

                let manufDate = oEvent.getSource().getDateValue();
            }

        });
    });
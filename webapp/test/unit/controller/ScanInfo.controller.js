/*global QUnit*/

sap.ui.define([
	"viscofan/ewm_invregister/controller/ScanInfo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ScanInfo Controller");

	QUnit.test("I should test the ScanInfo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

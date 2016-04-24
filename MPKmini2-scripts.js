/*
* Script for regrouping effectrack control on the fly
* */

MPKmini = new function () {
    this.currentUnitNum = 1;
    this.currentEffectNum = 1;
};

MPKmini.init = function () {
    MPKmini.updateLed();
    engine.beginTimer(200, "MPKmini.updateLed()");
};
MPKmini.shutdown = function () {};

//MPKmini.enableSoftTakeover = function () {
//    for (var unitNum = 1; unitNum <= 2; unitNum++) {
//        for (var effectNum = 1; effectNum <= 3; effectNum++) {
//            for (var parameterNum = 1; parameterNum <= 8; parameterNum++) {
//                engine.softTakeover("[EffectRack1_EffectUnit" + unitNum + "_Effect" + effectNum + "]", "parameter" + parameterNum, true);
//            }
//        }
//    }
//};

MPKmini.getCurrentGroup = function (withEffect, withUnit) {
    if (withEffect) {
        return "[EffectRack1_EffectUnit" + MPKmini.currentUnitNum + "_Effect" + MPKmini.currentEffectNum + "]";
    } else if (withUnit) {
        return "[EffectRack1_EffectUnit" + MPKmini.currentUnitNum + "]";
    } else {
        return "[EffectRack1]";
    }
};

MPKmini.resetLed = function () {
    for (var i = 9; i < 16; i++) {
        midi.sendShortMsg(0x90, i, 0);
    }
};

MPKmini.updateLed = function () {
    MPKmini.resetLed();

    var start;

    if (MPKmini.currentUnitNum == 1) {
        start = 12;
    } else {
        start = 8;
    }

    midi.sendShortMsg(0x90, start + MPKmini.currentEffectNum, 127)
};

/*
 * Control mapping
 */
MPKmini.setValue = function (group, key, newValue) {
    var withEffect = false;

    if (group == "[Effect]") {
        withEffect = true;
    }

    newValue = newValue / 127;

    var threshold = 0.07; //on the CMD Studio 4a this threshold got the right balance between smooth takeover and keeping up with quick turns, but you can adjust the value to suit your needs

    var currentParamValue = engine.getParameter(MPKmini.getCurrentGroup(withEffect, true), key);
    var spread = Math.abs(currentParamValue - newValue);

    if (spread < threshold){
        engine.setParameter(MPKmini.getCurrentGroup(withEffect, true), key, newValue);
    } else {
        return;
    }
};

MPKmini.parameter1 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter1", value); };
MPKmini.parameter2 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter2", value); };
MPKmini.parameter3 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter3", value); };
MPKmini.parameter4 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter4", value); };
MPKmini.parameter5 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter5", value); };
MPKmini.parameter6 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter6", value); };
MPKmini.parameter7 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter7", value); };
MPKmini.parameter8 = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter8", value); };
//MPKmini.parameter1_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter1_set_default", value); };
//MPKmini.parameter2_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter2_set_default", value); };
//MPKmini.parameter3_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter3_set_default", value); };
//MPKmini.parameter4_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter4_set_default", value); };
//MPKmini.parameter5_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter5_set_default", value); };
//MPKmini.parameter6_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter6_set_default", value); };
//MPKmini.parameter7_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter7_set_default", value); };
//MPKmini.parameter8_set_default = function (channel, control, value, status, group) { MPKmini.setValue(group, "parameter8_set_default", value); };
MPKmini.parameter1_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(1, 1); };
MPKmini.parameter2_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(1, 2); };
MPKmini.parameter3_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(1, 3); };
MPKmini.parameter4_set_default = function (channel, control, value, status, group) { };
MPKmini.parameter5_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(2, 1); };
MPKmini.parameter6_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(2, 2); };
MPKmini.parameter7_set_default = function (channel, control, value, status, group) { MPKmini.selectUnitEffect(2, 3); };
MPKmini.parameter8_set_default = function (channel, control, value, status, group) { };

/*
 * Shortcuts for switching between 2 racks and 3 effects
 */
MPKmini.switchUnit = function (channel, control, value, status, group) {
    print("next unit")
    MPKmini.currentUnitNum++;
    if (MPKmini.currentUnitNum > 2) {
        MPKmini.currentUnitNum = 1;
    }
    MPKmini.currentEffectNum = 1;

    MPKmini.updateLed();
};

MPKmini.switchEffect = function (channel, control, value, status, group) {
    print("next effect")
    MPKmini.currentEffectNum++;
    if (MPKmini.currentEffectNum > 3) {
        MPKmini.currentEffectNum = 1;
    }

    MPKmini.updateLed();
};

MPKmini.selectUnitEffect = function (unitNum, effectNum) {
    MPKmini.currentUnitNum = unitNum;
    MPKmini.currentEffectNum = effectNum;
};

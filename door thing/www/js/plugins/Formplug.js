//=============================================================================
// Formplug.js V1.0
//=============================================================================

/*:
 * @plugindesc Formplug
 * @author Mr. Smith
 *
 * @param thumbsVariable
 * @desc The variable's number that stores your thumb status.
 * @default 11
 * 
 * @param modeVariable
 * @desc The variable's number that stores the poll mode status.
 * @default 12
 *
 * @help 
 * Commands:
 *  FP_GetThumb         :   Changes 'thumbsVariable' Variable to your thumbs status
 *  FP_GetMode          :   Sets 'modeVariable' to 0/1/2/3 for poll/tutd/abcd/text
 *  FP_Thumb <tutd>     :   Sends the <tutd> thumb, which can be up/down/wiggle/oops
 *  FP_SetName <slot>   :   Change your <slot> Actor's name your your Formbar name
 *      
 */

(function () {

    // Make sure the given parameter is actually a number
    function toNumber(str, def) {
        if (isNaN(str)) {
            console.log(str + " is not a number!");
            return def
        } else {
            return +(str || def)
        }
        // return isNaN(str) ? def : +(str || def); // The old shorthand
    }

    // Grab all of the parameters from the RPG Maker Plugin Menu
    var parameters = PluginManager.parameters('Formplug');
    // An example parameter
    var thumbsVariable = toNumber(parameters['thumbsVariable'], 11);
    var modeVariable = toNumber(parameters['modeVariable'], 12);

    // Collect all of the plugin commands and handle them here
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        // Check the plugin command
        if (command === "FP_SetName") {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://192.168.10.69:420/api/me", false); // false for synchronous request
            xmlHttp.send(null);
            $gameParty.members()[toNumber(args[0], 0)]._name = JSON.parse(xmlHttp.responseText).name;
        } else if (command === "FP_GetThumb") {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://192.168.10.69:420/api/me", false); // false for synchronous request
            xmlHttp.send(null);

            let thumbReply = JSON.parse(xmlHttp.responseText).thumb;

            console.log(thumbReply);

            switch (thumbReply) {
                case "up":
                    thumbReply = 1;
                    break;
                case "wiggle":
                    thumbReply = 2;
                    break;
                case "down":
                    thumbReply = 3;
                    break;
                default:
                    thumbReply = 0;
                    break;
            }

            $gameVariables.setValue(thumbsVariable, thumbReply);
        } else if (command === "FP_MaxGamer") {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://192.168.10.69:420/api/students", false); // false for synchronous request
            xmlHttp.send(null);
            console.log(JSON.parse(xmlHttp.responseText));
        } else if (command === "FP_Thumb") {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://192.168.10.69:420/tutd?thumb=" + args[0], false); // false for synchronous request
            xmlHttp.send(null);
            console.log(xmlHttp.responseText);
        } else if (command === "FP_GetMode") {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://192.168.10.69:420/api/mode", false); // false for synchronous request
            xmlHttp.send(null);

            let modeReply = JSON.parse(xmlHttp.responseText).mode;

            switch (modeReply) {
                case "poll":
                    modeReply = 0;
                    break;
                case "tutd":
                    modeReply = 1;
                    break;
                case "abcd":
                    modeReply = 2;
                    break;
                case "text":
                    modeReply = 3;
                    break;
                default:
                    modeReply = 0;
                    break;
            }

            $gameVariables.setValue(modeVariable, modeReply);
        };
    }
})();
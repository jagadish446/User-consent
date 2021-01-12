var client;
function removeHttp(val) {
    return val.replace("https://", "").replace("http://", "").replace("/", "");
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};
const isEmpty = str => !str.trim().length;

function showValidationMessage(inputClass, message) {
    var validationSelector = $(`#${inputClass}-validation`);
    validationSelector.fadeIn();
    validationSelector.text(message);
    validationSelector.fadeOut(1500);
}
function postConfigs() {
    return {
        __meta: {
            secure: ["apiKey", "authKey", "subKey"]
        },
        domain: removeHttp($("#domain").val()),
        apiKey: $("#api-key").val(),
        clientID: $("#clientid").val(),
        authKey: $("#auth-key").val(),
        authroles: $("#authroles").val(),
        storeID: $("#storeid").val(),
        // searchId: $("#searchId").val(),
        subKey: $("#sub-key").val(),
        customFieldID: $("#customfieldid").val(),
        tdlDomain: $("#tdldomain").val()
    };
}
function getConfigs(savedConfigs) {
    if (savedConfigs && !$.isEmptyObject(savedConfigs)) {
        $("#domain").val(removeHttp(savedConfigs.domain));
        $("#api-key").val(savedConfigs.apiKey);
        onVerifyClick(savedConfigs);
    }
}

function onAppInit(_client) {
    client = _client;
    $("#submit-btn").click(onVerifyClick);
}
function onVerifyClick(preConfig) {
    $(".overlay").show();
    getTicketFields(preConfig);
}
function validateEmpty() {
    if (isEmpty($("#domain").val())) {
        showValidationMessage("comm", "Enter the Freshdesk account URL value");
        return false;
    }
    if (isEmpty($("#api-key").val())) {
        showValidationMessage("comm", "Enter the Freshdesk API key");
        return false;
    }
    return true;
}
function validate() {
    var fdvalidate = validateEmpty();
    if (fdvalidate === false) {
        return false;
    }
    if (!validateTDL()) {
        return false;
    }
    if (!validateRoles("#authroles", "Select Authorize roles")) {
        return false;
    }
    return true;
}
function validateRoles(id, message) {
    if ($.isEmptyObject($(`${id}`).val())) {
        showValidationMessage("comm", `${message}`);
        return false;
    }
    return true
}
function validateTDL() {
    if (isEmpty($("#tdldomain").val())) {
        showValidationMessage("comm", "Enter the TDL domain");
        return false;
    }
    if (isEmpty($("#clientid").val())) {
        showValidationMessage("comm", "Enter the client ID value");
        return false;
    }
    if (isEmpty($("#auth-key").val())) {
        showValidationMessage("comm", "Enter the Authorization key");
        return false;
    }
    if (isEmpty($("#storeid").val())) {
        showValidationMessage("comm", "Enter the Program ID value");
        return false;
    }
    // if (isEmpty($("#searchId").val())) {
    //     showValidationMessage("comm", "Enter the Search Program ID value");
    //     return false;
    // }
    if (isEmpty($("#sub-key").val())) {
        showValidationMessage("comm", "Enter the subscription key");
        return false;
    }
    if (isEmpty($("#customfieldid").val())) {
        showValidationMessage("comm", "Enter the custom field");
        return false;
    }
    return true;
}
function getApiOptions() {
    return {
        headers: { Authorization: "Basic " + btoa($("#api-key").val() + ":*") },
    };
}
/*function getTicketFields(presetdata) {
    var options = getApiOptions();
    var ticketFieldsUrl = "https://" + $("#domain").val() + "/api/v2/ticket_fields";
    client.request.get(ticketFieldsUrl, options)
        .then(
            function () {
                $(".overlay").hide();
                $(".tdl-credentials").show();
                $(".fd-settings").show();
                onApiSuccess(presetdata);
            },
            function (error) {
                $(".overlay").hide();
                validateEmpty();
                showValidationMessage("comm", "Invalid URL or API Key");
                console.error(error);
            }
        );
}*/
function getTicketFields(presetdata) {
    var options = getApiOptions();
    // var ticketFieldsUrl = "https://" + $("#domain").val() + "/api/v2/ticket_fields";
    var rolesUrl = "https://" + $("#domain").val() + "/api/v2/roles";
    client.request.get(rolesUrl, options)
        .then(
            function (data) {
                $(".overlay").hide();
                $(".tdl-credentials").show();
                $(".fd-settings").show();
                let roles = JSON.parse(data["response"]);
                let rolesOptions = getRoles(roles);
                $(".fd-roles").select2({
                    placeholder: "Select roles",
                    multiple: true,
                    data: rolesOptions,
                    width: "100%",
                    bottom: "10%"
                })
                onApiSuccess(presetdata);
            },
            function (error) {
                $(".overlay").hide();
                validateEmpty();
                showValidationMessage("comm", "Invalid URL or API Key");
                console.error(error);
            }
        );
}
function onApiSuccess(params) {
    setValue(params, "tdlDomain", "tdldomain");
    setValue(params, "clientID", "clientid");
    setValue(params, "authKey", "auth-key");
    setValue(params, "storeID", "storeid");
    // setValue(params, "searchId", "searchId");
    setValue(params, "subKey", "sub-key");
    setValue(params, "customFieldID", "customfieldid");
    if (params && params["authroles"]) {
        $("#authroles").val(params["authroles"]).trigger("change");
    }
}
function getRoles(roles) {
    return roles.map(singlData => {
        return {
            id: singlData.id,
            text: singlData.name
        }
    });
}
function setValue(params, key, id) {
    if (params && params[key]) {
        $(`#${id}`).val(params[key]);
    }
}
$(document).ready(function () {
    app.initialized().then(onAppInit);
    $("#domain").focusout(function () {
        $(this).val(removeHttp($(this).val()));
    })
    $("#tdldomain").focusout(function () {
        $(this).val(removeHttp($(this).val()));
    })
    $(".overlay").hide();
    $(".tdl-credentials").hide();
    $(".fd-settings").hide();
});
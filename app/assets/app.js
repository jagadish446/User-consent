const onAppActivate = () => {
    getAllInfo().then(information => {
        // destructure the information data..
        $('#offer-list').empty();
        $(".spinner").show();
        const { contact: { custom_fields } } = information[0];
        const settings = information[1];
        const { authroles: allowedAuthRoles } = information[1];
        var { loggedInUser: { role_ids: userRoles } } = information[2];
        var hasAccess = false;

        hasAccess = _.some(userRoles, value => {
            return $.inArray(value.toString(), allowedAuthRoles) !== -1;
        })

        if (!hasAccess) {
            showNotification("danger", 'You are not authorised to use this app');
            $('#apptext').text("You are not authorised to use this app");
            $('.spinner').hide();
            $('#offer-list').hide();
            return null;
        }
        if (!custom_fields || !custom_fields[settings.customFieldID]) {
            const template = constructNoOfferMessage('Customer Hash Not found');
            $('#offer-list').append(template);
            $(".spinner").hide();
            return null;
        }
        getConsent(settings, custom_fields).then(res => {
            const { status, marketingCommunication, programTnC, customerHash } = res;
            if (parseInt(status['code']) != 200) {
                // Function to build the Template to construct HTML elements.
                const template = constructNoOfferMessage(status.message);
                $('#offer-list').append(template);
                $(".spinner").hide();
            } else if (parseInt(status['code']) === 200 && marketingCommunication) {

                // Function to build the Template to construct the offer HTML elements.
                const elements = {};
                Object.keys(marketingCommunication).forEach((val) => {
                    elements[val] = marketingCommunication[val];
                });
                elements["programTnC"] = programTnC;
                elements["customerHash"] = customerHash;
                const template = constructConsent(elements);
                $('#offer-list').append(template);
                $(".spinner").hide();
                $(`.update-btn`).on('click', () => {
                    sendDataToModal(elements);
                });
            }
        })
    })
    client.instance.receive(getDataFromModal);
}

function sendDataToModal(data) {
    client.interface.trigger("showModal", {
        title: 'Edit Consent',
        template: "offerDetails.html",
        data: data
    })
}

function getDataFromModal(event) {
    const data = event.helper.getData();
    const { message: { type, message } } = data;
    console.log("Type : ", type);
    client.interface.trigger("showNotify", {
        type: type,
        message: message
    }).then(function () {
        // data - success message
        onAppActivate();
    });
}
function showNotification(type, message) {
    client.interface.trigger("showNotify", {
        type: type,
        message: message ? message : "app initialization failed"
    });
}

/**
 * 
 * @param { any } __client
 * - App main method which runs when ever client page loads.
 */
const onAppInit = function (__client) {
    window.client = __client;
    client.events.on('app.activated', onAppActivate);
}

// App initialized event
$(document).ready(function () {
    app.initialized().then(onAppInit);
    $(`#search-btn`).on('click', searchData);
});
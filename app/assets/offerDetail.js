let jsonFields = {
    "sms": {
        "name": "SMS"
    },
    "call": {
        "name": "Call"
    },
    "email": {
        "name": "Email"
    },
    "pushNotification": {
        "name": "Push Notification"
    },
    "mail": {
        "name": "Mail"
    },
    "dndFlag":{
        "name": "DND Flag"
    },
    "programTnC":{
        "name": "Program TnC"
    }
};

let val = {
    marketingCommunication:{}
};

const getAllData = () => {
    client.instance.context().then(context => {
        val['customerHash'] = context['data']['customerHash'];
        renderConsentForm(context['data'], jsonFields);
    })
    .catch(err => {
        console.log(err);
    });
}

const onAppInit = (__client) => {
    window.client = __client;
    getAllData();
}

const save = function(){
    const fields = Object.keys(jsonFields);
    $('.update-spinner').show();
    fields.forEach((result) => {
        if(result === 'programTnC'){
            val[result] = $(`input[name="${result}"]:checked`).val() ? true : false;
        }else{
            val['marketingCommunication'][result] = $(`input[name="${result}"]:checked`).val() ? true : false;
        }
    });
    updateConsent(val).then(res => {
        if(res.status.code === "200"){
            getAllInfo().then(info => {
                const settings = info[1];
                const { ticket } = info[3];
                addPrivateNote(settings, ticket.id).then(res => {
                    console.log("Response : ", res);
                })
                .catch(err => {
                    console.log("Error : ", err);
                })
                const data = {
                    message: {
                        type: "success",
                        message: "Consent updated successfully."
                    }
                }
                client.instance.send(data);
                client.instance.close();
            })
            .catch(err => {
                console.log(err);
                const data = {
                    message: {
                        type: "danger",
                        message: "Something went wrong to add the private note."
                    }
                }
                client.instance.send(data);
                client.instance.close();                
            })
        }else{
            const data = {
                message: {
                    type: "danger",
                    message: "Something went wrong to consent."
                }
            }
            client.instance.send(data);
            client.instance.close();
        }
    })
    .catch(err =>{
        console.log("Error : ", err);
        const data = {
            message: {
                type: "danger",
                message: "Something went wrong to update consent."
            }
        }
        client.instance.send(data);
        client.instance.close();
    })
}

// Initiating the app event
$(document).ready(function () {
    app.initialized().then(onAppInit);
    $("#update-consent-form").on('click', save);
});
//const getAllInfo = () => {
    try{
        var promise = [
            client.data.get('contact'),
            client.iparams.get(),
            client.data.get("loggedInUser"),
            client.data.get("ticket")
        ];
        return Promise.all(promise).then(data => {
            return data;
        });
    }catch(err){
        return Error(err)
    }
}

const addPrivateNote = (credentials, ticket_id) => {
    var url = `https://${credentials.domain}/api/v2/tickets/${ticket_id}/notes`;
    var options = {
        "headers": {
            Authorization: "Basic <%= encode(iparam.apiKey + ':X') %>",
            "Content-Type": "application/json"
        }
    }

    options["body"] = JSON.stringify({
        "body" : "<div>Consent updated successfully.</div>",
        "private" : true
    });
    
    return client.request.post(url, options).then(res => {
        return res;
    })
    .catch(err => {
        throw err;
    })
}

const getConsent = ( credentials, custom_fields ) => {
    var url = `https://${credentials.tdlDomain}/api/v1/pos/user-consent/${custom_fields[credentials.customFieldID]}/consent`;
    // var url = `https://${credentials.tdlDomain}/api/v1/pos/user-consent/590d8c81fc5333db830d0fea0c9f96b9/consent`;
    var options = {};
    options['headers'] = consentHeaders();
        return client.request.get(url, options).then(result => {
            return JSON.parse(result.response);
        })
        .catch(err => {
            return {
                status:{
                    message: "Page Not Found",
                    error: err,
                    code: 404
                }
            }
        });
}

const updateConsent = (body) => {
    var url = `https://<%= iparam.tdlDomain %>/api/v1/pos/user-consent/consent`;
    var options = {};
    options['headers'] = consentHeaders();
    options['body'] = JSON.stringify(body);
    return client.request.put(url, options).then(result => {
        return JSON.parse(result.response);
    })
    .catch(err => {
        throw JSON.parse(err.response);
    });
}

const consentHeaders = () => {
    const header = {};
    header['client_id'] = '<%= iparam.clientID %>';
    header['store_id'] = '<%= iparam.storeID %>';
    header['Authorization'] = '<%= iparam.authKey %>';
    header['Ocp-Apim-Subscription-Key'] = '<%= iparam.subKey %>';
    header['Content-Type'] = 'application/json';
    return header;
}
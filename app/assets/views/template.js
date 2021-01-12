const consentTitle = {
  "sms":{
    "name": "SMS"
  },
  "call":{
    "name": "Call"
  },

}

const constructConsent = (consent) => {
      if(typeof consent === 'object' && !consent.length){
          const elements = Object.keys(consent);
          let template = `
            <table class="table-container">
                <tr class="tr-data">
                    <th class="table-data">Name</th>
                    <th class="table-data">Value</th>
                </tr>
          `
          elements.forEach((val) => {
            if(val !== "customerHash"){
                template += `
                    <tr class="tr-data">
                        <td class="table-data">${toTitleCase(val.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))}</td>
                        <td class="table-data">${consent[val]}</td>
                    </tr>
                `;
            }
          });
          template += `
                </table>
                <div class="update-btn">
                    <fw-button id="update-consent">Edit</fw-button>
                </div>
          `
        return template;
      }
  }

  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const constructNoOfferMessage = (message) => {
    let htmlElement = `
          <p class="error-message">
              <b>${message}</b>
          </P>
      `;
    return htmlElement;
  };
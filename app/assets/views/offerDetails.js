
const renderConsentForm = (consent, consent_fields) =>{
    let colId;
    const element = Object.keys(consent);
    element.map((val, i) => {
        if(i % 2 === 0){
            colId = i;
            const leftTemplate = `
                <div class="row consent-row" id="row-${colId}" data-id=${i}>
                    <div class="columns labels">
                        <input type="checkbox" id="consent-box" name=${val} value="${consent[val]}" ${consent[val] ? "checked" : null}>
                        <label for="vehicle1">${consent_fields[val].name}</label><br>
                    </div>
                </div>
            `;
            $('#display-details').append(leftTemplate);
        }else{
            const rightTemplate = `
            <div class="columns labels right-column">
                <input type="checkbox" id="consent-box" name=${val} value="${consent[val]}" ${consent[val] ? "checked" : null}>
                <label for="vehicle1">${consent_fields[val].name}</label><br>
            </div>
        `;
        $(`#row-${colId}`).append(rightTemplate);
        }
    });
}

const renderOffers = (offer, custom_fields) => {
    let colId;
    custom_fields.forEach(({ tag, name }, i) => {
        if(i % 2 === 0){
            colId = i;
            const leftTemplate = `
                <div class="row" id="row-${colId}">
                    <div class="columns labels">${name}</div>
                    <div class="columns right-content">${offer[tag] ? offer[tag] : "--"}</div>
                </div>
            `;
            $('#display-details').append(leftTemplate);
        }else{
            const rightTemplate = `
                <div class="columns labels right-column">${name}</div>
                <div class="columns right-content">${offer[tag] ? offer[tag] : "--"}</div>
            `;
            $(`#row-${colId}`).append(rightTemplate);
        }
    });
}
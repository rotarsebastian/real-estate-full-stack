const search = document.querySelector('#search_input');
const results = document.querySelector('#results');

search.addEventListener('input', function () {

    if ($('#search_input').val().length >= 2) {
        $('#results').empty();
        setTimeout(() => {
            $.ajax({
                    url: './apis/api-search.php',
                    data: {
                        search: search.value
                    },
                    dataType: "JSON"
                })
                .done(function (matches) {
                    $('#results').empty();
                    // matches.forEach((match) => {
                    //     $('#results').append(`<div>${match}</div>`);
                    // })
                    $.each(matches, (index, zip) => {
                        let divZip = `<div class="result showPropertiesByZipCode">${zip}</div>`;
                        $('#results').append(divZip);
                    });
                })
                .fail(function () {
                    console.log('Error');
                });
        }, 700);

    }

    if (search.value.length < 2) {
        results.style.display = 'none';
    } else {
        results.style.display = 'block';
    }

});

$(document).on('click', '.result', function () {
    $('#search_input').val('');
    $('#properties').empty();
    $('#results').empty();
    $('#properties').css('grid-template-columns', '1fr 1fr');
    $sZipCode = $(this).text();
    $.ajax({
            url: `./apis/api-get-properties-zip-code.php?search=${$sZipCode}`,
            method: "GET",
        })
        .done((data) => {
            properties = JSON.parse(data);
            $.each(properties, (propertyID, propertyObject) => {
                $('#properties').append(`
        <div id="${propertyID}" class="property">
        <img src="${propertyObject.imagePath}">
        <div class="firstRow">
            <div class="price">$${numberWithCommas(propertyObject.price)}</div>
            <div class="details">
                <div>${propertyObject.bedrooms} bd &nbsp;</div>
                <div class="bath">&nbsp;${propertyObject.bathrooms} ba &nbsp;</div>
                <div>&nbsp;${propertyObject.squareFt} sqft &nbsp;</div>
            </div>
        </div>
        <div class="address">${propertyObject.zipCode} ${propertyObject.address}</div>
    </div>`);
            });

            $('.property').on("click", function () {
                const sPropertyId = $(this).attr('id');
                showProperty(sPropertyId);
                showInfoOnMarker(sPropertyId);
            });

            reloadMap(properties);

        }).fail(() => {
            console.log('Properties not loaded');
        });
});
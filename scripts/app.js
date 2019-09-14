let infoWindows = [];
let markers = [];
let map;

$(document).ready(() => {
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAfd0obzUPQmGHd8hqzhQs1UlMFnG8J1gY&callback=init")
        .done(function (script, textStatus) {
            getAllProperties();
        })
        .fail(function (jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.");
        });

});

function getAllProperties() {
    $('#properties').empty();
    $('#properties').css('grid-template-columns', '1fr 1fr');
    $.ajax({
            url: './apis/api-get-all-properties.php',
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
}

function init() {
    initMap(properties);
}

function reloadMap(newProperties) {
    initMap(newProperties);
}

// $(document).on('blur', '.agent input', function () {
// $('.agent input').blur(function () {

$('#seeAllProperties').click(() => {
    getAllProperties();
});

function initMap(properties) {

    const propertiesLength = Object.keys(properties).length;
    const propertiesIDArray = Object.keys(properties);

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 55.704024,
            lng: 12.537925,
            zoom: 12
        },
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            featureType: "administrative",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "water",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }]
    });



    //HERE WAS THE SET MARKER ON CLICK

    let infowindow = new google.maps.InfoWindow();

    let marker, i;


    for (i = 0; i < propertiesLength; i++) {

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(properties[`${propertiesIDArray[i]}`].long, properties[`${propertiesIDArray[i]}`].lat),
            map: map,
            icon: './images/marker.svg',
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);


        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                let elem = $(`#${propertiesIDArray[i]}`);

                $('#properties').animate({
                    scrollTop: elem.offset().top - 20
                }, 300);

                closeAllInfoWindows();
                showProperty(propertiesIDArray[i]);
                infowindow.setContent(
                    `<div style='float:left;'><img class="mapInfoPropertyImage" src='${properties[`${propertiesIDArray[i]}`].imagePath}'>
                                    </div><div class="mapInfoPropertyDetails"><b>$${numberWithCommas(properties[`${propertiesIDArray[i]}`].price)}</b><br/>${properties[`${propertiesIDArray[i]}`].zipCode} ${properties[`${propertiesIDArray[i]}`].address}<br/> ${properties[`${propertiesIDArray[i]}`].city}, ${properties[`${propertiesIDArray[i]}`].country}</div>`
                );
                infoWindows.push(infowindow);
                infowindow.open(map, marker);

                google.maps.event.addDomListener(document.getElementById(`${propertiesIDArray[i]}`), "click", function (ev) {
                    map.setCenter(marker.getPosition());
                });

            }

        })(marker, i));

        if (i == 0) {
            map.setCenter(marker.getPosition());
        }
    }

    google.maps.event.addListener(map, "click", function (event) {
        closeAllInfoWindows();
    });

}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showInfoOnMarker(sPropertyId) {
    let infowindow = new google.maps.InfoWindow();
    let currentMarker, i;

    for (i = 0; i < markers.length; i++) {
        if (markers[i].getPosition().lng().toFixed(6) == properties[`${sPropertyId}`].lat.toFixed(6)) {
            currentMarker = markers[i];
        }
    }

    infowindow.setContent(
        `<div style='float:left;'>
            <img class="mapInfoPropertyImage" src='${properties[`${sPropertyId}`].imagePath}'>
        </div>
        <div class="mapInfoPropertyDetails">
        <b>$${numberWithCommas(properties[`${sPropertyId}`].price)}</b>
            <br/>${properties[`${sPropertyId}`].address}
            <br/> ${properties[`${sPropertyId}`].city}, ${properties[`${sPropertyId}`].country}
        </div>`
    );
    infoWindows.push(infowindow);
    infowindow.open(map, currentMarker);
}

function showProperty(id) {
    cleanLastActive();
    $(`#${id}`).addClass('active');

}

function cleanLastActive() {
    closeAllInfoWindows();
    $('.active').removeClass('active');
}

function closeAllInfoWindows() {
    for (let i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
}

function closeAllMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
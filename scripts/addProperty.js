$(document).on('click', '#addNewProperty', function () {
    $('#properties').empty();

    closeAllMarkers();

    if (curentMarker != null) {
        curentMarker.setMap(null);
        curentMarker = null;
    }


    $('#properties').css('grid-template-columns', '1fr');

    $('#properties').append(`<div class="form-style-5">
        <form id="frmAddProperty" method="POST">
        <fieldset>
        <legend><span class="number">1</span> Property Details</legend>
        <input type="text" maxlength="12" name="price" data-type="integer" data-min="1" data-max="999999999" placeholder="Price *">
        <input type="text" name="address" maxlength="80" data-type="string" data-min="5" data-max="80" placeholder="Address *">
        <select id="country" name="country">
            <option value="" disabled selected>Select your country *</option>
            <option value="Denmark">Denmark</option>
        </select> 
        <select id="city" name="city">
          <option value="" disabled selected>Select your city *</option>
          <option value="Copenhagen">Copenhagen</option>
          <option value="Aarhus">Aarhus</option>
          <option value="Aalborg">Aalborg</option>
        </select> 
        <input type="text" maxlength="6" data-type="integer"  data-max="999999" name="size" placeholder="Square meters (m2) *">
        <input type="text" maxlength="3" data-type="integer" data-max="999" name="bedrooms" placeholder="Bedrooms Number *">
        <input type="text" maxlength="3" data-type="integer" data-min="0" data-max="999" name="bathrooms" placeholder="Bathrooms Number *">
        <label for="zipCode">Postal code</label>
        <select id="zipCode" name="zipCode">
          <option value="" disabled selected>Select your postal code *</option>
          <option value="1600">1600</option>
          <option value="1800">1800</option>
          <option value="2000">2000</option>
          <option value="2200">2200</option>
          <option value="2400">2400</option>
          <option value="2600">2600</option>
          <option value="3600">3600</option>
          <option value="4200">4200</option>
          <option value="5100">5100</option>
          <option value="5200">5200</option>
          <option value="6000">6000</option>
          <option value="8200">8200</option>
        </select>      
        </fieldset>
        <fieldset>
        <legend><span class="number">2</span> Upload Image *</legend>
        <input type="file" name="image" data-type="image" id="imageInput" accept="image/x-png,image/gif,image/jpeg">
        </fieldset>
        <fieldset>
        <legend class="set_marker_on_map"><span class="number">3</span> Pick your address on the map *</legend>
        </fieldset>
        <div class="infoMessage">You must upload an image (.png, .jpg, .jpeg) and put your marker on the map</div>
        <button class="formActionButton" type="submit" onclick="addProperty(this); return false" data-start="Upload Property"
        data-wait="WAIT ...">Upload Property</button>
        </form>
        </div>`);

    map.setOptions({
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
                visibility: "on"
            }]
        }]
    });

    //ADD NEW PROPERTY FUNCTIONALITY
    google.maps.event.addListener(map, 'click', function (event) {
        var location = event.latLng;
        if (curentMarker == null) {
            curentMarker = new google.maps.Marker({
                position: location,
                map: map,
                icon: './images/house.svg',
                animation: google.maps.Animation.BOUNCE
            });
        } else {
            curentMarker.setPosition(location);
        }

    });
});


function addProperty(oBtn) {
    var frmAddProperty = document.querySelector('#frmAddProperty');
    var bIsValid = fnbIsFormValid(frmAddProperty)
    if (bIsValid == false) {
        return
    }

    if (!curentMarker) {
        document.querySelector('.set_marker_on_map').classList.add('errorText');
        return
    } else {
        document.querySelector('.set_marker_on_map').classList.remove('errorText');
    }

    oBtn.innerText = oBtn.getAttribute('data-wait')
    oBtn.disabled = true

    var formData = new FormData(document.getElementById('frmAddProperty'));
    formData.append('long', curentMarker.getPosition().lat());
    formData.append('lat', curentMarker.getPosition().lng());

    $.ajax({
            url: "./apis/api-add-property.php",
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "JSON"
        })
        .done(response => {
            console.log(response);
            if (response.status == 1) {
                oBtn.innerText = oBtn.getAttribute('data-start');
                oBtn.disabled = false;
                fvDo(frmAddProperty.querySelectorAll('input'), function (oElement) {
                    oElement.value = ''
                });
                document.querySelector('.infoMessage').innerText = 'Success! Your house has been posted!';
                document.querySelector('.infoMessage').style.color = '#a5ec37';
                setTimeout(function () {
                    if (document.querySelector('.infoMessage')) {
                        document.querySelector('.infoMessage').innerText = 'You must upload an image (.png, .jpg, .jpeg) and put your marker on the map';
                        document.querySelector('.infoMessage').style.color = '#FF851B';
                    }
                }, 3000);
            }

        })
        .fail(err => {
            console.log(err);
        });


}
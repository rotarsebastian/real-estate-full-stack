$('.dropDownProfile').click(() => {
    $('.dropDownProfile').toggleClass('colorChange');
    $('.dropdown-content').toggle('show');
});

// $(document).on('click', '#editProfileLink', function () {
$('#editProfileLink').click(() => {

    $('#properties').empty();
    $('#properties').css('grid-template-columns', '1fr');

    closeAllMarkers();

    //MAKE ONE API TO CALL THE USER DETAILS BEFORE APPENDING THE FORM
    $.ajax({
            url: "./apis/api-get-user-details.php",
            method: "GET",
            dataType: "JSON"
        })
        .done(response => {
            console.log(response);

            if (response.status == 1) {


                if (response.user.currentHouseLat && response.user.currentHouseLong) {

                    if (curentMarker == null) {
                        var location = new google.maps.LatLng(response.user.currentHouseLong, response.user.currentHouseLat);
                        curentMarker = new google.maps.Marker({
                            position: location,
                            map: map,
                            icon: './images/house.svg',
                            animation: google.maps.Animation.DROP
                        });
                    } else {
                        curentMarker.setMap(null);
                        var location1 = new google.maps.LatLng(response.user.currentHouseLong, response.user.currentHouseLat);
                        curentMarker = new google.maps.Marker({
                            position: location1,
                            map: map,
                            icon: './images/house.svg',
                            animation: google.maps.Animation.DROP
                        });
                    }

                }


                $('#properties').append(`<div class="form-style-5">
                <form id="frmEditUserProfile" method="POST">
                <fieldset>
                <legend><span class="number">1</span> User Details</legend>
                <select id="gender" name="gender">
                    <option value="" disabled selected>Select your gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select> 
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
                <legend><span class="number">2</span> Upload Profile Image *</legend>
                <input type="file" data-type="image" name="image" id="imageEditProfile" accept="image/x-png,image/gif,image/jpeg">
                </fieldset>
                <fieldset>
                <legend class="set_marker_on_map"><span class="number">3</span> Pick your current address on the map *</legend>
                </fieldset>
                <div class="infoMessage">You must upload an image (.png, .jpg, .jpeg) and put your marker on the map</div>
                <button class="formActionButton" type="submit" onclick="editUserProfile(this); return false" data-start="Upload Property"
                data-wait="WAIT ...">Edit Profile</button>
                </form>
                <a href="#ex2" id="deleteProfileButton" rel="modal:open">Delete profile</a>
                <div id="ex2" class="modal">
                    <div class="modalQuestion">Are you sure you want to delete your profile account?</div>
                    <div class="answersModal">
                    <a class="noButton" rel="modal:close">No</a>
                    <a class="deleteAccountForever" rel="modal:close">Yes</a>
                </div>
        </div>
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

                //ADD NEW ADDRESS FUNCTIONALITY
                google.maps.event.addListener(map, 'click', function (event) {
                    var location = event.latLng;
                    if (curentMarker == null) {
                        curentMarker = new google.maps.Marker({
                            position: location,
                            map: map,
                            icon: './images/house.svg',
                        });
                    } else {
                        curentMarker.setPosition(location);
                    }

                });

                if (response.user.address) {
                    $("input[name='address']").val(response.user.address);
                    $("select[name='gender']").val(response.user.gender);
                    $("select[name='country']").val(response.user.country);
                    $("select[name='city']").val(response.user.city);
                    $("select[name='zipCode']").val(response.user.zipCode);
                }
            }

        })
        .fail(err => {
            console.log(err);
        });

});


function editUserProfile(oBtn) {
    var frmEditUserProfile = document.querySelector('#frmEditUserProfile');
    var bIsValid = fnbIsFormValid(frmEditUserProfile)
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

    var formData = new FormData(document.getElementById('frmEditUserProfile'));
    formData.append('long', curentMarker.getPosition().lat());
    formData.append('lat', curentMarker.getPosition().lng());

    $.ajax({
            url: "./apis/api-edit-user-profile.php",
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
                $('.profile_img').attr("src", response.user.image);
                oBtn.innerText = oBtn.getAttribute('data-start');
                oBtn.disabled = false;
                document.querySelector('.infoMessage').innerText = 'Success! Your profile has been updated!';
                document.querySelector('.infoMessage').style.color = '#a5ec37';
                setTimeout(function () {
                    if (document.querySelector('.infoMessage')) {
                        document.querySelector('.infoMessage').innerText = 'You must upload an image (.png, .jpg, .jpeg) and put your marker on the map';
                        document.querySelector('.infoMessage').style.color = '#FF851B';
                    }
                }, 3000);

                $("input[name='address']").val(response.user.address);
                $("select[name='gender']").val(response.user.gender);
                $("select[name='country']").val(response.user.country);
                $("select[name='city']").val(response.user.city);
                $("select[name='zipCode']").val(response.user.zipCode);
            }

        })
        .fail(err => {
            console.log(err);
        });

}

$(document).on("click", ".deleteAccountForever", function () {
    console.log('da');
    $.ajax({
            url: './apis/api-delete-account.php',
            method: "POST",
            dataType: "JSON"
        })
        .done(response => {
            console.log(response);
            if (response.status == 1) {
                location.href = './home.php';
            }

        })
        .fail(err => {
            console.log(err);
        });
});
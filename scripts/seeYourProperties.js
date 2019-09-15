let currentPropertyID;
$(document).on('click', '#seeYourProperties', function () {
    $('#properties').empty();
    $('#properties').css('grid-template-columns', '1fr 1fr');
    $.ajax({
            url: './apis/api-get-user-properties.php',
            method: "GET",
        })
        .done((data) => {
            properties = JSON.parse(data);
            if ($.isEmptyObject(properties)) {
                $('#properties').append('<div class="noProperties">You have no properties</div>');
            }
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
        <div class="manageProperty">
                <div class="editPrice">Edit price</div>
                <div class="editImage">Change Image</div>
                <div class="deleteProperty"><a href="#ex1" class="deletePropertyButton" data-id="${propertyID}" rel="modal:open">Delete</a></div>
                
        </div>
        <div class="editBar">
        <form class="editPropertyForm" method="POST">
            <input class="editableInput" name="data" type="text" maxlength="12" accept="image/x-png,image/gif,image/jpeg">
            <button class="editProperty" type="button">Change</button>
        </form>
        </div>
        <div id="ex1" class="modal">
            <div class="modalQuestion">Are you sure you want to delete this property?</div>
            <div class="answersModal">
                <a class="noButton" rel="modal:close">No</a>
                <a class="deletePropertyForever" rel="modal:close">Yes</a>
            </div>
        </div>
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

$(document).on("click", ".editPrice", function (e) {
    $(".property").removeClass("expand");
    $(".editBar").removeClass("show");
    $("input.error").removeClass("error");
    $(this).parent().siblings('.editBar').children().get()[0].firstElementChild.type = 'text';
    $editBar = $(this).parent().siblings('.editBar').get()[0];
    $(this).closest('.property')[0].classList.toggle('expand');
    $editBar.classList.toggle('show');
    $priceElement = $(this).parent().siblings('.firstRow').children()[0];
    let oldPrice = $priceElement.innerHTML.replace(/\D/g, '');
    $(this).parent().siblings('.editBar').children().get()[0].firstElementChild.value = oldPrice;
});

$(document).on("click", ".deletePropertyButton", function (e) {
    currentPropertyID = null;
    $(".property").removeClass("expand");
    $(".editBar").removeClass("show");
    $("input.error").removeClass("error");
    // console.log($(this).data('id'));
    currentPropertyID = $(this).data('id').toString();
});


$(document).on("click", ".deletePropertyForever", function () {
    $(".property").removeClass("expand");
    $(".editBar").removeClass("show");
    $("input.error").removeClass("error");

    let propertyID = currentPropertyID;

    $.ajax({
            url: './apis/api-delete-property.php',
            method: "POST",
            data: {
                propertyID: propertyID
            },
            dataType: "JSON"
        })
        .done(response => {
            if (response.status == 1) {
                $(".property").removeClass("expand");
                $(".editBar").removeClass("show");

                //TODO: DELETE PROPERTY MARKER ON MAP

                //delete property on HTML
                $(`#${propertyID}`).remove();
            }

        })
        .fail(err => {
            console.log(err);
        });
});

$(document).on("click", ".editImage", function () {
    $(".property").removeClass("expand");
    $(".editBar").removeClass("show");
    $("input.error").removeClass("error");
    $(this).parent().siblings('.editBar').children().get()[0].firstElementChild.type = 'file';
    $editBar = $(this).parent().siblings('.editBar').get()[0];
    $(this).closest('.property')[0].classList.toggle('expand');
    $editBar.classList.toggle('show');
});


$(document).on('click', '.editProperty', function (e) {
    e.preventDefault();
    const thisPropertyID = $(this).closest('.property')[0].id;
    let itemToEdit = null;

    if ($(this).siblings('.editableInput').get()[0].type == 'file') {
        itemToEdit = 'image';

        if ($(this).siblings('.editableInput').get(0).files.length === 0) {
            $(this).siblings('.editableInput').addClass('error');
            return;
        } else {
            $(this).siblings('.editableInput').removeClass('error');
        }

        var file = $(this).siblings('.editableInput').prop('files')[0];
        var fileType = file["type"];
        var validImageTypes = ["image/gif", "image/jpeg", "image/png"];

        if ($.inArray(fileType, validImageTypes) < 0) {
            $(this).siblings('.editableInput').addClass('error');
            return
        } else {
            $(this).siblings('.editableInput').removeClass('error');
        }
    }

    if ($(this).siblings('.editableInput').get()[0].type == 'text') {
        itemToEdit = 'price';

        var intRegex = /^\d+$/;
        var newPrice = $(this).siblings('.editableInput').val();

        if (!intRegex.test(newPrice)) {
            $(this).siblings('.editableInput').addClass('error');
            return
        } else {
            $(this).siblings('.editableInput').removeClass('error');
        }

        newPrice = parseInt(newPrice);
        newPrice = newPrice.toString();
    }

    let dataToSend = new FormData($(this).closest('form').get()[0]);
    dataToSend.append('propertyID', thisPropertyID);

    $.ajax({
            url: `./apis/api-update-property-${itemToEdit}.php`,
            method: "POST",
            data: dataToSend,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "JSON"
        })
        .done(response => {
            if (response.status == 1) {
                $(".property").removeClass("expand");
                $(".editBar").removeClass("show");
                if (response.message == 'price updated') {
                    $(this).parents('.property').children('.firstRow').children()[0].innerHTML = '$' + numberWithCommas(response.newPrice);
                }
                if (response.message == 'image updated') {
                    $(this).parents('.property').children('img').get()[0].src = response.image;
                }
            }

        })
        .fail(err => {
            console.log(err);
        });
});
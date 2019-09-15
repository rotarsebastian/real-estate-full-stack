function fvDo(aElements, fvCallback) {
    for (var i = 0; i < aElements.length; i++) {
        fvCallback(aElements[i])
    }
}

function fnbIsFormValid(oForm) {
    fvDo(oForm.querySelectorAll('input[data-type]'), function (oElement) {
        oElement.classList.remove('error')
        if (document.querySelector('#passwordError')) {
            document.querySelector('#passwordError').classList.remove('visible')
            document.querySelector('#duplicateEmailError').classList.remove('visible')
        }
        if (document.querySelector('#notRegistered')) {
            document.querySelector('#notRegistered').classList.remove('visible');
            document.querySelector('#notActivated').classList.remove('visible');
        }
        if (document.querySelector('#zipCode')) {
            $('#city').removeClass('error');
            $('#country').removeClass('error');
            $('#zipCode').removeClass('error');
        }
    })

    fvDo(oForm.querySelectorAll('input[data-type]'), function (oElement) {
        if (oElement.id === 'password') {
            if (oElement.nextSibling.nextSibling.value !== oElement.value) {
                document.querySelector('#passwordError').classList.add('visible');
            }
        }
        var sValue = oElement.value
        var sDataType = oElement.getAttribute('data-type') // $(oInput).attr('data-type')
        var iMin = oElement.getAttribute('data-min') //$(oInput).attr('data-min')
        var iMax = oElement.getAttribute('data-max') // $(oInput).attr('data-max')  
        switch (sDataType) {
            case 'string':
                if (sValue.length < iMin || sValue.length > iMax) {
                    oElement.classList.add('error')
                }
                break
            case 'integer':
                if (!parseInt(sValue) || parseInt(sValue) < parseInt(iMin) || parseInt(sValue) > parseInt(iMax)) {
                    oElement.classList.add('error')
                }
                break
            case 'email':
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(String(sValue).toLowerCase()) == false) {
                    oElement.classList.add('error')
                }
                break
            case 'image':
                if (oElement.files.length === 0) {
                    oElement.classList.add('error')
                }
                break
            default:
        }
    })

    if ($('#city option:selected').prop('disabled') == true) {
        $('#city').addClass('error');
    }

    if ($('#country option:selected').prop('disabled') == true) {
        $('#country').addClass('error');
    }

    if ($('#zipCode option:selected').prop('disabled') == true) {
        $('#zipCode').addClass('error');
    }

    if (oForm.querySelectorAll('select.error').length) {
        return false
    }

    if (oForm.querySelectorAll('input.error').length) {
        return false
    }
    if (oForm.querySelectorAll('div.visible').length) {
        return false
    }
    return true;
}
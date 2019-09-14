function signUp(oBtn) {
    var frmSignup = document.querySelector('#frmSignup');
    var bIsValid = fnbIsFormValid(frmSignup)
    if (bIsValid == false) {
        return
    }

    oBtn.innerText = oBtn.getAttribute('data-wait')
    oBtn.disabled = true

    var passwordEl = document.querySelector('#password');
    var rePasswordEl = document.querySelector('#rePassword');

    if (passwordEl.value === rePasswordEl.value) {

        $.ajax({
                url: "./apis/api-signup.php",
                method: "POST",
                data: $('form').serialize(),
                dataType: "JSON" // get text and convert it into JSON
            })
            .done(response => {
                if (response.status == 1) {
                    oBtn.innerText = oBtn.getAttribute('data-start')
                    oBtn.disabled = false
                    fvDo(frmSignup.querySelectorAll('input'), function (oElement) {
                        oElement.value = ''
                    })
                    document.querySelector('#successActivationSent').classList.add('visible');
                    setTimeout(function () {
                        document.querySelector('#successActivationSent').classList.remove('visible');
                    }, 6000);
                    $.ajax({
                            url: "apis/api-send-email.php",
                            method: "POST",
                            data: {
                                key: response.user.activationKey,
                                userID: response.userID,
                                email: response.user.email,
                                userType: response.userType
                            },
                            dataType: "JSON" // get text and convert it into JSON
                        })
                        .done(response => {
                            // console.log(response);
                        })
                        .fail(err => {
                            return
                        });

                } else {
                    oBtn.innerText = oBtn.getAttribute('data-start')
                    oBtn.disabled = false
                    if (response.message == 'user already existent' || response.message == 'agent already existent') {
                        document.querySelector('#duplicateEmailError').classList.add('visible')

                    } else {
                        console.log(response);
                    }
                }
            })
            .fail(err => {
                console.log(err);
            });

    }
}
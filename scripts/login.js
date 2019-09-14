function login(oBtn) {
    console.log('clicked')
    var frmLogin = document.querySelector('#frmLogin')
    var bIsValid = fnbIsFormValid(frmLogin);
    if (bIsValid == false) {
        return
    }

    oBtn.innerText = oBtn.getAttribute('data-wait')
    oBtn.disabled = true;

    $.ajax({
            url: "./apis/api-login.php",
            method: "POST",
            data: $('form').serialize(),
            dataType: "JSON" // get text and convert it into JSON
        })
        .done(response => {
            if (response.status == 1) {
                oBtn.innerText = oBtn.getAttribute('data-start')
                oBtn.disabled = false
                fvDo(frmLogin.querySelectorAll('input'), function (oElement) {
                    oElement.value = ''
                })
                location.href = './home.php';
            } else {
                oBtn.innerText = oBtn.getAttribute('data-start')
                oBtn.disabled = false
                if (response.message == 'already logged') {
                    location.href = './home.php';
                } else if (response.message == 'incorrect credentials') {
                    document.querySelector('#notRegistered').classList.add('visible')
                } else if (response.message == 'activate account') {
                    document.querySelector('#notActivated').classList.add('visible')
                }
            }
        })
        .fail(err => {
            console.log(err);
        });


}
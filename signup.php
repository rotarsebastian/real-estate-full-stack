
<?php 

session_start();
if($_SESSION){
    header('Location: home.php');
    exit;
}

$sPageName = basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING']);
$sPageName = str_replace(".php", "", $sPageName);
$sPageName = ucfirst($sPageName);

//TODO: IF TIME MAKE SIGNUP AND LOGIN ONE PAGE CALLED AUTHENTICATION
$sTitle = $sPageName.' - eState';
$sSignOrLoginStylesPath = './styles/signup-login-styles.css';

require_once(__DIR__.'/components/signup-login-top.php'); 

?>


<h3 class="welcome-title">Welcome to eState. Best real estate company in Copenhagen!
</h3>


<div class="container">
    <div class="form-description" >Please sign up to continue</div>
        <form method="POST" id="frmSignup">
            <div class="user-choice">
                <div class="one-option">
                    <input class="form-radio" type="radio" name="userType" value="users" checked="checked" id="user-option">
                    <label for="user-option">I am a house seeker</label>
                </div>
                <div class="one-option">
                    <input class="form-radio" type="radio" name="userType" value="agents" id="agent-option">
                    <label for="agent-option">I am an agent</label>
                </div>
            </div>
            <div class="input-info">2 to 20 characters</div>
            <input class="text-input" type="text"  name="firstName" maxlength="20" data-type="string" data-min="2" data-max="20" placeholder="Enter your first name here">
            <input class="text-input" type="text"  name="lastName" maxlength="20" data-type="string" data-min="2" data-max="20" placeholder="Enter your last name here">
            <input class="text-input" type="text"  name="userEmail" data-type="email" placeholder="Enter your email here">
            <div class="input-info">8 to 50 characters</div>
            <input id="password" class="text-input" type="password"  name="userPassword" maxlength="50" data-type="string" data-min="8" data-max="50" placeholder="Enter your password here">
            <input id="rePassword" class="text-input" type="password"  name="userPasswordRepeat" maxlength="50" data-type="string" data-min="8" data-max="50" placeholder="Re-enter your password here">
            <div id="passwordError" class="input-info">Passwords do not match</div>
            <div id="duplicateEmailError" class="input-info">Your email is already used</div>
            <div id="successActivationSent" class="input-info">Success! Check your email for activation</div>
            <button id="signUpButton" onclick="signUp(this); return false" data-start="SIGNUP"
                data-wait="WAIT ...">SIGN UP</button>
        </form>
    </div>

<a class="switchPages" href="./login.php">Switch to Login</a>
<a class="switchPages" href="./home.php">Continue to the home page</a>

<p>&copy; Copyright eState 2019. All rights reserved</p>

<script src="./scripts/signup.js"></script>
 


<?php require_once(__DIR__.'/components/bottom.php'); ?>
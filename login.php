<?php 

session_start();
if($_SESSION){
    header('Location: home.php');
}

$sTitle = 'Login - eState';
$sSignOrLoginStylesPath = 'styles/signup-login-styles.css';
require_once(__DIR__.'/components/signup-login-top.php'); 

?>


<?= isset($_GET['name']) ? '<h3 class="welcome-title">'."Welcome, {$_GET['name']}!</h3>" : '<h3 class="welcome-title">Welcome to eState. Best real estate company in Copenhagen!</h3>'; ?>

<div class="container">
    <div class="form-description" >Log in to access eState</div>
            <form id="frmLogin" method="POST">
                 <div class="input-info">email</div>
                <input class="text-input" data-type="email" type="text" <?= isset($_GET['email']) ? 'value="'."{$_GET['email']}".'"' : ''; ?>name="userEmail" placeholder="name@example.com">
                <div class="input-info">8 to 50 characters</div>
                <input class="text-input" type="password" maxlength="50" data-type="string" data-min="8" data-max="50" name="userPassword" placeholder="Enter your password here" <?= isset($_GET['email']) ? 'autofocus' : '';?> >
                <div id="notRegistered" class="input-info">Your email or password was entered incorrectly</div>
                <div id="notActivated" class="input-info">Please activate your account first</div>
                <button id="btnLogin" onclick="login(this); return false" data-start="LOGIN" data-wait="WAIT ...">LOGIN</button>
            </form>
</div>
<a class="switchPages" href="./signup.php">Switch to Sign Up</a>

<p>&copy; Copyright eState 2019. All rights reserved</p>  
<script src="./scripts/login.js"></script>
<?php require_once(__DIR__.'/components/bottom.php'); ?>
 





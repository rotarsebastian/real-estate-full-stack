<?php session_start(); ?>

<nav>
        <ul>
            <img <?= $_SESSION ? '' : 'class="noUser"' ?>src="./images/logo.svg">
        <?php 
        if( !$_SESSION ){ 
            echo '
            <li><a class="activePage" href="#home">Search properties</a></li>
            <li><a href="./login.php">Login</a></li>
            <li><a href="./signup.php">Sign Up</a></li>';
        }
        ?>
        </ul>
        <?php
            if( $_SESSION ){ 
                echo '<a class="logoutButton" href="./logout.php">Logout</a>';
            }
        ?>
</nav>
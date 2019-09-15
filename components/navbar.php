<nav>
        <ul>
            <img <?= $_SESSION ? 'class="hide' : 'class="noUser"' ?>src="./images/logo.svg">
        <?php 
        if( !$_SESSION ){ 
            echo '
            <li><a href="./login.php">Login</a></li>
            <li><a href="./signup.php">Sign Up</a></li>';
        }
        ?>
        </ul>
        <?php
            if( $_SESSION ){ 
                echo '<div class="dropDownProfile">
                        <img class="profile_img" ';
                
                $sUserImg = 'src="./images/user_profile.svg"';
                if($_SESSION['userDetails']->image != 'user_profile.svg'){
                    $sUserImg = 'src="'.$_SESSION['userDetails']->image.'"';
                }
                echo ''.$sUserImg.' />
                <div class="profile_text">My profile</div>
                <div class="dropdown-content">
                    <a id="editProfileLink">Edit profile</a>
                    <a href="./logout.php">Logout</a>
                </div>
            </div>';
            }
        ?>
</nav>
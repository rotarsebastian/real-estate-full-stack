<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="./images/favicon.png"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
    <link rel="stylesheet" href="./styles/app.css">
    <link rel="stylesheet" href="./styles/form-styles.css">
    <title>HOME</title>
</head>

<body>

    <div id="map_properties">
        <div id="map">
            
        </div>
        <div id="properties">
            
        </div>
    </div>


    <div id="searchBar_addProperty">
        <div id="searchBar">
                <input id="search_input" type="text" placeholder="Search zip code" name="search" maxlength="4">
                <div id="seeAllProperties">See all listed properties</div>
            <div id="results"></div>
        </div>

        <?php 
        session_start();
        
        if( isset($_SESSION['userType']) && $_SESSION['userType'] == 'agents' ){ 
            echo '<div id="addProperty">
            <div id="seeYourProperties">Your properties</div>
            <button type="button" id="addNewProperty">Upload property</button>
        </div>';
        }
        ?>

    </div>

    <?php   
    require_once('./components/navbar.php');
    ?>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
   
    <script src="./scripts/validate.js"></script>
    <script src="./scripts/app.js"></script>
    <script src="./scripts/search.js"></script>
    <script src="./scripts/addProperty.js"></script>
    <script src="./scripts/seeYourProperties.js"></script>
    <script src="./scripts/dropDown.js"></script>
</body>

</html>
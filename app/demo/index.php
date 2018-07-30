<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Spatium JS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js"></script>
  <script src="js/spatium.jquery.js"></script>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
    
    <div class="container-fluid">
        <div class="row-fluid">
        
            <div class="col-xs-12 text-center">
                <img src="img/spatium_logo.png" alt="Spatium.js Logo">
            </div>
        
        </div>
        <div class="row">
            
            <div class="col-xs-12 col-sm-6">
                <div id="map"></div>
            </div>

            <div class="col-xs-12 col-sm-6">
                
                <form action="" method="" role="form">
                    <legend>Spatium: Search locations in radius</legend>
                
                    <div class="form-group">
                        <label for="">Location:</label>
                        <input type="text" class="form-control" id="inputLocation" placeholder="Input location">
                        <br>
                        <label for="">Radius:</label>
                        <input type="number" class="form-control" id="radius" placeholder="Default in km">
                    </div>
                
                    <button id="searchLocations" type="button" class="btn btn-primary">Search</button>
                </form>
                
            </div>
            
        </div>

        <div class="row">
            
            <div class="col-xs-12 locations-container">
                
            </div>
            
        </div>
    </div>
    
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=[YOUR-API-KEY]&callback=mapInit">
    </script>
    <script src="js/main.js"></script>
</body>
</html>

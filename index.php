<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>D3 Tom Klaversma 2062459</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/dashboard.css" rel="stylesheet">
    <link href='css/nv.d3.css' rel='stylesheet'>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <li class="active" id='tab1'><a href="#">Nationaliteit <span class="sr-only">(current)</span></a></li>
            <li id='tab2'><a href="#" >Oorzaak</a></li>
            <li id='tab3'><a href="#" >Jaren</a></li>
          </ul>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 class="page-header">Omgekomen vluchtelingen</h1>
          <div class="row">
            <div id="visual">
               <h3 id='visualTitle'> Totaal omgekomen per afkomst </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>

    <!-- D3 -->
    <script src="js/d3.v3.js" charset="utf-8"></script>
    <!-- underscore -->
    <script type="text/javascript" src='js/underscore-min.js'></script>
    <!-- nv -->
    <script src='js/nv.d3.js' type="text/javascript"></script>


    <!-- controller -->
    <script src="js/visualisation.js" type="text/javascript"></script>
  </body>
</html>
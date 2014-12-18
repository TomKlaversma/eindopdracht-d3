function makeVisual() {
    var meesteDoden = 0;

    // begin met het formatteren van de data
    d3.csv('data/listofdeath-full.csv', function(data) {
        data = formatData(data);
        visualize(data);
    })

    // format data
    function formatData(data) {
        data = data.map(function(item) {
            item.cause = formatCause(item.cause);
            item.date = formatDate(item.date);
            return item;
        });
        return data;
    }

    function formatCause(cause) {     
        var causes = [  "drowned", "washed ashore", "suffocated", "missing", "fell", "suicide", "starvation", "unknown", "stowaway", 
                    "dehydration", "hypothermia", "asphyxiation", "murdered", "froze to death", "heart attack", "died of thirst", "shot"];

        cause = cause.replace(/,/g, " ");
        var adverbCause;
        var checkedSwitch = false;
        // prepare data
        causes.forEach(function(c){
            var regExp = new RegExp(c, 'g');
            if(checkedSwitch == false){             
                if(cause.match(regExp)){
                    if(c == "washed ashore"){
                        adverbCause = "drowned";
                    }else if(c === "died of thirst"){
                        adverbCause = "dehydration";
                    }else if(c === "froze to death"){
                        adverbCause = "hypothermia";
                    }else if(c === "fell"){
                        adverbCause = "Falldamage";
                    }else{
                        adverbCause = c;
                    }
                    checkedSwitch = true;

                }else{
                    adverbCause = "other";
                }
            }
        })
        return adverbCause;
    }

    function formatDate(dateGiven){
        var regExp = new RegExp("/", 'g');
        var d = dateGiven.replace(regExp, "-"); 
        return d;
    }

    // Prepare data for different visualisations
    function displayTotalDeaths(data){
        var deaths = _.pluck(data, 'count');
        var count = 0;
        deaths.forEach(function(record){
            count += parseInt(record);
        })
        return count;
    }

    function getCountries(data) {
        var deaths = _.pluck(data, 'count');
        var countries = _.pluck(data, 'origin');
        var countriesUnique = _.unique(_.pluck(data, 'origin'));
        var countriesAndDeaths = [];

        for (var i = 0; i < countriesUnique.length; i++) {
            var deathsCountry = 0;
            for(var j = 0; j < countries.length; j++){
                if(countries[j] == countriesUnique[i]){
                    deathsCountry += parseInt(deaths[j]);
                }
            }
            // zorg dat het de moeite waard is de landen te laten zien
            if(deathsCountry > 100){
                var oneCountry = { name: countriesUnique[i], deaths: deathsCountry};
                countriesAndDeaths.push(oneCountry);
            }
        }
        // sorteer hoog naar laag
        countriesAndDeaths.sort(function (a, b) {
          if (a.deaths > b.deaths) {
            return -1;
          }
          if (a.deaths < b.deaths) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
        return countriesAndDeaths;
    }

    function getCauses(data){
        // alle oorzaken
        var allCauses = _.pluck(data, 'cause');
        var deaths = _.pluck(data, 'count');
        var causesUnique = _.unique(_.pluck(data, 'cause'));
        // tel hoe vaak ze voorkomen
        var causeAndCount = [];

        for (var i = 0; i < causesUnique.length; i++) {
            var deathsCause = 0;
            for(var j = 0; j < allCauses.length; j++){
                if(allCauses[j] == causesUnique[i]){
                    deathsCause += parseInt(deaths[j]);
                }
            }
            // zorg dat het de moeite waard is de landen te laten zien
            if(deathsCause > 100){
                var oneCause = { cause: causesUnique[i], deaths: deathsCause};
                causeAndCount.push(oneCause);
            }
        }
        return causeAndCount;
    }

    function getDeathsAndYears(data){

        var allCauses = _.pluck(data, 'cause');
        var allDeaths = _.pluck(data, 'count');
        var allDates = _.pluck(data, 'date');
       
        // bekijk hoeveel jaren er zijn
        var years = [];
        allDates.forEach(function(date){
            date = date.substr(date.length - 2);
            years.push(date);
        })
        years = _.unique(years);

        var deathsAndYears = [];
        years.forEach(function(year){
            var deaths = 0;
            for(var i = 0; i < data.length; i++){
                var regExp = new RegExp(year, 'g');
                if(data[i].date.match(regExp)){
                    var deathsThisAccident = parseInt(data[i].count);
                    deaths += deathsThisAccident;
                }
            }
            if(year > 12){
                year = parseInt("19" +year);
            }else{
                year = parseInt("20" +year);
            }
            var yearAndRecords = {year: year, deaths:deaths}
            deathsAndYears.push(yearAndRecords);
        })
        return deathsAndYears;
    }
    // make different visualisations
    function makeVisual1(data){
        // reset canvas
        wipeCanvas();
        $( "#visual" ).append( "<h3>Totaal omgekomen per afkomst, (" + displayTotalDeaths(data) + " omgekomen in totaal)</h3>" );

        countriesAndDeaths = getCountries(data);

        var mostDeaths =  _.max(countriesAndDeaths, function(countriesAndDeaths){ return countriesAndDeaths.deaths; });
        var containerWidth = document.getElementById("visual").offsetWidth;
        var steps =  containerWidth / mostDeaths.deaths;

        d3.select("#visual")
            .selectAll('div')
                .data(countriesAndDeaths)
            .enter()
                .append('div')
                .text(function(countriesAndDeaths) { return countriesAndDeaths.name; })
                .append('div')
                .attr('class','barchartBar')
                .style("width", function(countriesAndDeaths) { return countriesAndDeaths.deaths * steps + "px"; })
                .text(function(countriesAndDeaths) { return countriesAndDeaths.deaths; })
    }

    function makeVisual2(data){
        // reset canvas
        wipeCanvas();
        $( "#visual" ).append( "<h3>Meest voorkomende oorzaken, (" + displayTotalDeaths(data) + " omgekomen in totaal)</h3>" );
        // haal de data op
        var commonCauses = getCauses(data);
        // maak de piechart
        d3.select('#visual').append('svg');
        
        //Regular pie chart example
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) { return d.cause })
                .y(function(d) { return d.deaths })
                .showLabels(true)
                .labelThreshold(.05)
                .labelType('percent')

            d3.select("#visual svg")
                .datum(commonCauses)
                .transition().duration(350)
                .call(chart);
            return chart;
        });
    }

    function makeVisual3(data){
        // prepare data
        var yearsAndDeaths = getDeathsAndYears(data);
        var maxDeaths = _.max(yearsAndDeaths, function(record){ return record.deaths; });
        var deaths = _.pluck(yearsAndDeaths, 'deaths');
        var years = _.pluck(yearsAndDeaths, 'year');
        console.log(years);

        // reset screen
        wipeCanvas();
        $( "#visual" ).append( "<h3>Aantal omgekomen per jaar, (" + displayTotalDeaths(data) + " omgekomen in totaal)</h3>" );

        // visualize
        // define dimensions of graph
        var m = [80, 80, 80, 80]; // margins
        var w = $('#visual').innerWidth() - m[1] - m[3]; // width
        var h = 400 - m[0] - m[2]; // height in px

        // X scale will fit all values from data[] within pixels 0-w
        var x = d3.scale.linear().domain([0, yearsAndDeaths.length-1]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        var y = d3.scale.linear().domain([0, maxDeaths.deaths]).range([h, 0]);
            // automatically determining max range can work something like this
            // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
            // assign the X and Y function to plot our line as we wish
            .x(function(d,i) { 
                return x(i); 
            })
            .y(function(d,i) {
                var label = years[i];
                return y(d, label); 
            })

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select("#visual").append("svg:svg")
              .attr("id", "linechart")
              .attr("width", w + m[1] + m[3])
              .attr("height", h + m[0] + m[2])
            .append("svg:g")
              .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);//.tickValues(years);

        // Add the x-axis.

        graph.append("svg:g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h + ")")
              .call(xAxis);
        
        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
              .attr("class", "y axis")
              .attr("transform", "translate(-25,0)")
              .call(yAxisLeft);
        
        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("d", line(deaths));

        $( "#visual" ).append('<h3>Legenda</h3>');
        $( "#visual" ).append('<ul id="legend">');
        // zorg voor toelichting labels
        for(var i = 0; i < years.length; i++){
            $( "#legend" ).append( "<li><span class='label2'>"+i +'</span> ' +years[i]+"</li>" );
        }        
    }

    // wipe canvas and change buttonclasses
    function wipeCanvas(){
        var parent = document.getElementById('visual');
        var children = [].slice.call(parent.children);
        children.forEach(function(e){
            parent.removeChild(e);
        })
    }

    function changeActiveButton(e){
        if(e == 1){
            $('#tab1').addClass("active");
            $('#tab2').removeClass("active");
            $('#tab3').removeClass("active");
        }else if(e == 2){
            $('#tab2').addClass("active");
            $('#tab1').removeClass("active");
            $('#tab3').removeClass("active");
        }else if(e == 3){
            $('#tab3').addClass("active");
            $('#tab2').removeClass("active");
            $('#tab1').removeClass("active");
        }
    }
    
    // controller
    function visualize(data){
        // de data is geladen en klaar gebruikt te worden:
        makeVisual1(data);

        $('#tab1').click(function(){
            changeActiveButton(1);
            makeVisual1(data);
        })

        $('#tab2').click(function(){
            changeActiveButton(2);
            makeVisual2(data);
        })
        $('#tab3').click(function(){
            changeActiveButton(3);
            makeVisual3(data);
        })   
    }
}


$(document).ready(function(){
    makeVisual();
})
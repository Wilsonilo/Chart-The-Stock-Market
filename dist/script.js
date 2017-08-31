// PLEASE IGNORE ALL MY DAMM TRASH HERE, I PROMISE TO CLEAN IT UP
// Doing some D3 tests with this exercise later so this is why i leaving some other code


/// GLOBALS
var coins               = ["BTC"] // Coins Array, initiates with Bitcoin
var blockChainUrl       = "http://www.coincap.io/history/30day/" // API
var coinsPrices         = []; // Holder for information of each coin

//Coll on init document with Jquery.
$(document).ready(function(){
    
    //Call constructor
    callCoins();


    //Handler for add Coin
    $("#addcoinbutton").on('click', function(e){
        var coin = $("#addcoin").val();
        e.preventDefault();

        if(coin !== "" && coin !== undefined){
            
            //Loading
            $("#loading").fadeIn();

            //Reset Canvas
            $("canvas").remove();
            $("#canvasarea").append('<canvas id="chart" width="1000" height="500"></canvas>').each(function() {
                coin = coin.toUpperCase();
                coins.push(coin);
                callCoins();
            })



        }
    })

});

/// Helpers
/// For each coin on the coins array we call the API and save the information into the coinsPrices Object
function callCoins(){

    //Reset
    console.log(coins);
    var proccesedCoins = 0; //Counter

    coins.forEach(function(coinName){

        //Nested loop to look for it
        var coinFound = false;
        coinsPrices.forEach(function(coinObject){
            if(coinObject.coin === coinName){
                coinFound = true;
                return;
            }
        });


        //Checks if we already have that coin, avoid unnecessary calls to API
        if(coinFound === false){

            var newCoin = {
                coin : coinName
            }
            $.get(blockChainUrl+coinName, function(data){

                newCoin.prices = data.price; //Append information

            }).done(function(){

                //Information stream finished, move forward
                proccesedCoins += 1; // Used to like ++, until Javascript the good parts.
                coinsPrices.push(newCoin);
                checkIfWeAredone(); 
            });

        } else {

            //Coin already fetched, move forward.
            proccesedCoins += 1;
            checkIfWeAredone(); 
        }

        //Check if we are finished, if we are, we callback
        function checkIfWeAredone(){
            
            if(proccesedCoins === coins.length){
                reloadChart();
            }
        }

    }); //Ends Foreach

}//Ends callCoins()

/// Reloads Chart and parses the "content" global
/// IGNORE!
function runD3(){
    var count = 0;
    var max = d3.max(content.price, function(d) { 
        return d[1];
    } );
    var min = d3.min(content.price, function(d) { 
        return d[1];
    } );

    // var xScale = d3.scaleLinear()
    // .domain([min, max])
    // .range([0, 500]);
    var xScale = d3.scaleLinear()
    .domain([min, max])
    .range([0, 1000]);
    var yScale = d3.scaleLinear()
    .domain([max, min])
    .range([0, 1000]);

    var days = d3.select("svg")
    .selectAll("g")
    .data(content.price)
    .enter()
    .append("circle")
    .attr("fill", "red")
    .attr("r", 1)
    .attr("cx", function(d){
        return xScale(d[1])
    })
    .attr("cy", function(d){
        return yScale(d[1])
    })
    // .style("width", function(d) { 
    //     console.log(d);
    //     return d + "px"; 
    // })
    //.attr("class", "day")
    // .attr("transform", function(d){
    //     count ++;
    //     return "translate("+ (d[0] * 0.0000000001 + count ) + ", "+ (d[1] * 0.0000000002 + count ) +")";
    // })
    // .attr("height", function(d){
    //     var median = ((d[0] + d[1])/2)
    //     median = (median * 300) / max;
    //     return median;
    // });
    //.text(function(d) { return "Max: "+ d[0] + "- Min: "+ d[1]; });

    // days.append("circle")
    // .attr("r", 5)
    // .attr("fill", "red")
    // .attr("x", function(d){
    //     count++;
    //     return d[0] * 0.0000000001 + count;
    // })
    // .attr("y", function(d){

    //     return d[1] * 0.0000000002 + count;
    // })
}


//Loads Charts based on dataset
function reloadChart(){

    var datasets    = []; // Holder
    var dates       = []; // Holder
    var counter     = 0;

    //Internal Functions
    function conformDatasets(){

        coinsPrices.forEach(function(coinObject){

            //Conform prices for dataset, if is first element create the dates var.
            var pricesFinal = [];
            coinObject['prices'].forEach(function(arrayPrice){
                pricesFinal.push(arrayPrice[1]);

                //We need the dates, the first element is enough.
                if(counter === 0){
                    dates.push(moment(arrayPrice[0]).format("MM-DD-YYYY HH:mm:ss"))
                }
            });

            // Data Set
            var newDataSet = {
                label: coinObject.coin,
                backgroundColor: getRandomColor(),
                //borderColor: 'rgb(255, 99, 132)',
                fill: false,
                data: pricesFinal
            };

            //Push it to array and increase.
            datasets.push(newDataSet);
            counter += 1;

            //If we done we work the label dates
            if(counter === coins.length){
                setChart(); // All done, set Chart
            }

        });

    }


    //Creates Cart
    function setChart(){

        //Get id element
        var ctx = $("canvas");

        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: dates,
                datasets: datasets
            },

            // Configuration options go here
            //options: {}
        });
        $("#loading").fadeOut();
    }

    //Based on coinsPrices we create the datasets for the chart
    conformDatasets()

}

//Long live Stack Overflow

//Helper for money parsing
//https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
}

//Helper for random Color
//https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

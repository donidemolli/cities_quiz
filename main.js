window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [1829564.2714719987, 6869199.5644658115],
            zoom: 4,
            maxZoom: 6,
            minZoom: 4,
            extent: [-5032578.433759354, 3547189.874306874, 8686681.064810457, 8670871.220071884]
        }),
        
        target: 'js-map'
    });

    const blankMap = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url:'./libs/map.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'BlankMap'
    })

    map.addLayer(blankMap)

    var score = 1500;
    var cities = 0;
    $.when(
        $.getJSON('capitalCities.json')
    ).done( function(json) {
        console.log(json);
        capitalCities = Array.from(json.capitalCities);

        document.querySelector('.map').addEventListener('click', function(){

            if(score>0 && capitalCities.length>1){
                var i = Math.floor(Math.random()*capitalCities.length);
                var latitude = parseFloat(capitalCities[i].latitude);
                var longitude = parseFloat(capitalCities[i].longitude);
                var question = "Select the location of " + capitalCities[i].capitalCity;

                quest.innerHTML = question;

                map.once('click', function(evt){
                   
                    var coords = ol.proj.toLonLat(evt.coordinate);
                    var lat = parseFloat(coords[1]);
                    var lon = parseFloat(coords[0]);

                    var clickPointer = new ol.layer.Vector({
                       source: new ol.source.Vector({
                           features: [
                               new ol.Feature({
                                   geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
                               })
                           ]
                       })
                    });
                    var positionPointer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: [
                                new ol.Feature({
                                 geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                                 })
                            ]
                         })
                    });

                    map.addLayer(clickPointer); //The pointer
                    map.addLayer(positionPointer); // The true position of the location)
        
                    var dist = distance(latitude, longitude, lat, lon);

                    if(dist<50){
                        var response = "You found it!!!"
                        capitalCities.splice(i,1);
                        cities++;
                        if(capitalCities.length<1){
                            quest.innerHTML = "GAME OVER\nYou found "
                            alert("You won the game\nYou found all the cities");
                        }
                    }else{
                        var response = "You are " + dist.toFixed(2) +" km away from "+capitalCities[i].capitalCity
                        score = score - dist;
                        score = score.toFixed(2);
                        capitalCities.splice(i,1);
                    }
                    responseTXT.innerHTML = response;
                    citiesFound.innerHTML = "You found " + cities + " cities";
                    kmLeft.innerHTML ="You have "+ score + " km left";
                });

                   
                
            }else{
                if(score<0){
                    score=0
                }
                quest.innerHTML = "GAME OVER";
                kmLeft.innerHTML ="You have "+ score + " km left";
                responseTXT.innerHTML = "You found "+cities+" out of 9 cities<br>You have "+score+" km left";
                alert("GAME OVER\nYou found "+cities+" out of 9 cities\nYou have "+score+" km left");
                setTimeout(function(){
                    questDiv.style.cssText = "visibility:hidden; height:0";
                    playAgain.style.cssText = "visibility:visible; height: 30%";
                },2000)
            }
        })
 
    });
}


var citiesFound = document.querySelector(".cities-found");
var kmLeft = document.querySelector(".km-left");
var quest = document.querySelector(".question");
var responseTXT = document.querySelector(".response");
var playAgain = document.querySelector(".play-again");
var questDiv = document.querySelector(".questiondiv");



function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

		return dist;
	}
}
function reload(){
    location.reload();
};

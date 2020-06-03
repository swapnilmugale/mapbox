//set mapboxgl token properties to user token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3dhcG5pbG11Z2xlNjAiLCJhIjoiY2thcnUyeDl4MHAyazJxbXhwcnU4OWZudyJ9.hEdtF4_FjtHpukf5iikQHQ';




//Render the map to html page with map container


var bounds = [
    [-74.04728500751165, 40.68392799015035], // Southwest coordinates
    [-73.91058699000139, 40.87764500765852] // Northeast coordinates
    ];

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [73.838814, 18.534739 ],
zoom: 6,
});






//console.log(map);

map.on('load',function(ev)
    {
        //Create a input field with marker on map 
        var sourcePlace = new MapboxGeocoder(
            {
                accessToken: mapboxgl.accessToken,
                marker:{
                    color:'orange'
                },
                placeholder:'Enter Source',
                mapboxgl:mapboxgl
            }

        );
        map.addControl(sourcePlace , 'top-left');
        //Create a input field with marker on map 
        var destinationPlace = new MapboxGeocoder(
            {
                accessToken: mapboxgl.accessToken,
                marker:{
                    color:'yellow'
                },
                placeholder:'Enter Destination',
        
                mapboxgl:mapboxgl
            }

        );
        map.addControl(destinationPlace , 'top-left');

        var nothing = turf.featureCollection([]);
    

        var routeSource = map.addSource('route',{
                                          type:'geojson',
                                          data:nothing
                                    }                       
                                  );

          map.addLayer({
              id: 'routeline-active',
              type: 'line',
              source: 'route',
              layout: {
              'line-join': 'round',
              'line-cap': 'round'
              },
              paint: {
              'line-color': '#3887be',
              'line-width': [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 3,
                  22, 12
              ]
              }
          }, 'waterway-label');
       // console.log(destinationPlace);

//function to get coordinates from place

         sourcePlace.on('result',function(ev)
            {
               var data = ev.result;
               var dataContainer = document.getElementById('CoordinateSource');
               //console.log(dataContainer);
               dataContainer.innerHTML = data.geometry.coordinates;
               var sourceCoord = data.geometry.coordinates;

               destinationPlace.on('result',function(ev)
               {
                    var data = ev.result;
                  var dataContainer = document.getElementById('CoordinateDest');
                  //console.log(dataContainer);
                   dataContainer.innerHTML = data.geometry.coordinates;
                   var destinationCoord = data.geometry.coordinates;
                   console.log(sourceCoord);
                  console.log(destinationCoord);


                  //Add route to source and Destinatio

                    //function to assemble url in data
                    function assembleUrl()
                    {
                        return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + sourceCoord + ";"+ destinationCoord +
                               '?&overview=full&steps=true&geometries=geojson&source=first&access_token='
                                +mapboxgl.accessToken;
                    }

                    //function to make request
                    function makeCall()
                    {
                        const proxyurl = "https://cors-anywhere.herokuapp.com/";


                        $.ajax(
                            {
                                method: "GET",
                                url:assembleUrl(),
                                header:{
                                    "X-Requested-With": "XMLHttpRequest",
                                    'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
                                }
                            }
                        ).done(function(data)
                        {
                            var routeGeoJSON = turf.featureCollection([turf.feature(data.trips[0].geometry)]);
                            console.log(routeGeoJSON);
                            map.getSource('route')
                            .setData(routeGeoJSON);
                            var route2GeoJSON = turf.featureCollection([turf.feature(data.trips[1].geometry)]);
                            map.getSource('route')
                            .setData(route2GeoJSON);
                            
                            console.log(data.trip[1]);

                        }   
                        );

                     } makeCall();

                }
              ); 

            }
            );
       
        
            
    }
            
 );

    

  
  





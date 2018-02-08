  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
  //document.getElementById("encuentrame").addEventListener("click", buscar);
  // var latitud, longitud;
 

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.4188304, lng: -70.6423391},
    zoom: 18
    });

    function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }
  /*
  * Evento para el botón "encuentrame", busca la posición actual utilizando la latitud y longitud
  */
  document.getElementById("encuentrame").addEventListener("click", buscar);
  var latitud, longitud;

  /*
  * Con funcionExito obtendremos nuestra latitud o longitud y además crearemos un marcador de nuestra ubicación.
  */
  var funcionExito = function(position){
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;

    var miUbicacion = new google.maps.Marker({
      position: {lat:latitud, lng:longitud},
      animation: google.maps.Animation.DROP,
      map: map
    });
    // El zoom muestra el tamaño del mapa
    map.setZoom(17);
    map.setCenter({lat:latitud, lng:longitud});
  }
  /*
  * En caso de que tengamos problemas de conexión, o simplemente no se encuentre nuestra ubicación, 
  * Se ejecuta nuestra función de error
  */
  var funcionError = function(error){
    alert("tenemos un problema con encontrar tu ubicación");
  }

    new AutocompleteDirectionsHandler(map);

    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var beachMarker = new google.maps.Marker({
    position: {lat: -35.4316852, lng: -71.542969},
    map: map,
    icon: image
    });
  }
   
  
  

/*
* @constructor
*/
  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

   
    
  }

/*
/* Sets a listener on a radio button to change the filter type on Places
*/
  AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
      radioButton.addEventListener('click', function() {
        me.travelMode = mode;
        me.route();
      });
  };

  AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
      autocomplete.bindTo('bounds', this.map);
      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
      });
  };

  AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
        }
    var me = this;

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
  };


   
 

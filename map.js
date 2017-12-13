google.load('visualization', '1', {packages:['corechart']});

var markers=[];

function myMap() { //Create a google map

     function getData(type){ //request data from Firebase and convert them back to JSON
       var data= $.ajax({
                   url: 'datalog.php',
                   dataType: "json",
                   async: false
                   }).responseText;
       data=JSON.parse(data);
       return data
     }

      var tempdata= getData('temperature'), //Call function to get all data
         humdata= getData('humidity'),
         pressdata=getData('pressure');
// ------------------------------------------------------------------------

      function getLastvalue(jsondata){ //Get the lastest value in JSON
        var i, lastvalue;
          for (i in jsondata){
            lastvalue= jsondata[i].value;
          }
        return lastvalue;
      }

       var currenttemp=getLastvalue(tempdata),
          currenthum=getLastvalue(humdata),
          currentpress=getLastvalue(pressdata);
// -----------------------------------------------------------------------

       var locations= [['LeHongPhong WeatherStation',10.763889,106.681975],
                       ['DHSP WeatherStation',10.76,106.68],
                       ['Nha Dinh Tung',10.773725,106.685588]];
       var myCenter = new google.maps.LatLng(10.763889,106.681975);
       var mapCanvas = document.getElementById("map");
       var mapOptions = {center: myCenter, zoom: 15};
       var map = new google.maps.Map(mapCanvas, mapOptions);
       var infoBubble = new InfoBubble({
                borderRadius: 4
                , maxWidth: 1000
            });

      infoBubble.addTab('temp', 'hello');
      infoBubble.addTab('hum', 'hi');
      infoBubble.addTab('press', 'hi');
      infoBubble.addTab('current', 'hi');

       for (var i= 0; i<locations.length; i++){
         marker = new google.maps.Marker({
               animation:google.maps.Animation.BOUNCE,
               position:new google.maps.LatLng(locations[i][1],locations[i][2] ),
               map:map
         });
         google.maps.event.addListener(marker, 'click', (function (marker,i) {
           return function(){
            infoBubble.updateTab(0,'Current Info',drawTable(locations[i][0],currenttemp,currenthum,currentpress));
            infoBubble.updateTab(1,'Temperature', drawChart(tempdata,locations[i][0],'Temperature','red'));
            infoBubble.updateTab(2,'Humidity', drawChart(humdata,locations[i][0],'Humidity','orange'));
            infoBubble.updateTab(3,'Pressure', drawChart(pressdata,locations[i][0],
              'Pressure','blue'));
            infoBubble.open(marker.getMap(), marker);
           }
         })(marker, i));
         markers.push(marker);
       }
     }


function drawChart(jsondata, name, element,color) { //Chart drawing function
       var  data = new google.visualization.DataTable();
       data.addColumn('datetime', 'Time');
       data.addColumn('number', element);
       var node = document.createElement('div');

           $.each(jsondata, function (i, row) {
               data.addRow([
                   (new Date(row.time_stamp)),
                   parseFloat(row.value)
               ]);
           });

           console.log('drawing chart');
           var chart = new google.visualization.LineChart(node);
           chart.draw(data, {
               height: 500,
               width: 700,
               interpolateNulls: false,
               title: name,
               colors: [color]
           });
   return node;
   }


function drawTable(name,currenttemp,currenthum,currentpress){ //Table drawing function
           var table = "<table id=\"data\"> <tr><th scope=\"row\">Temperature</th>";
                              table += "<td>" + currenttemp + "o".sup()+ "C"+ "</td></tr>";
                              table += "<tr><th scope=\"row\">Humidity</th>";
                              table += "<td>" + currenthum +"%"+ "</td></tr>";
                              table += "<tr><th scope=\"row\">Pressure</th>";
                              table += "<td>" + currentpress +" Pa"+ "</td></tr>";
                              table += "</table>";
           var htmltable = "<h1>"+name+"</h1><br><h2>" + Date().toString() + "</h2><hr>" + table;
          return htmltable;
   }


function demo(id) {
     google.maps.event.trigger(markers[id], 'click');
 }

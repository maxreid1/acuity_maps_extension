/// <reference types="@types/googlemaps" />
import { LookerEmbedSDK } from '@looker/embed-sdk';
import {
  ExtensionContext,
  ExtensionContextData,
  getCore40SDK
 } from '@looker/extension-sdk-react';
import React, { useContext, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Box, Icon } from '@looker/components';
import { Flag } from '@looker/icons'




// import { google } from 'googlemaps';
export default function MapViz (props: any) {
  let map: google.maps.Map, heatmap: google.maps.visualization.HeatmapLayer;
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  // this will store the list coordinates retreived from the Looker API
  const [coords, setCoords] = React.useState({    
    "positions": [{lat:33.640841832091844, lng:-84.43388428963304}],
    "options": {   
      "radius": 20,   
      "opacity": 0.6
  }})
  // this will store the center coordinates retreived from the Looker API
  const [centerCoords, setCenterCoords] = React.useState({lat:33.640841832091844, lng:-84.43388428963304})
  // this will store the marker 
  const [markers, setMarkers] = React.useState<any[]>()

  /// The below query gets list of lat/lngs for the Map
  const MapQuery = () => {
    sdk.run_inline_query(
      {
        result_format: 'json',
        body: {
          model: 'acuity',
          view: 'search_partitioned',
          fields: [
            'positionchanged_partitioned.lat',
            'positionchanged_partitioned.lng',
            'search_partitioned.count'
          ],
          filters: {"search_partitioned.installid":"59ce7b9d-1205-44af-9af0-5c407efacad1"},
          limit: '1000',
          total: false,
        }
      }).then((result:any ) => {
        if(result.ok){
          const latlng = result.value.map((r:any) => ({
            lat: r["positionchanged_partitioned.lat"],
            lng: r["positionchanged_partitioned.lng"]
          }))
          console.log("map results: ", latlng)
          setCoords({    
            "positions": latlng,
            "options": {   
              "radius": 20,   
              "opacity": 0.6
          }});
          console.log({    
            "positions": latlng,
            "options": {   
              "radius": 100,   
              "opacity": 0.9
          }})
          setMarkers(latlng);
        }
      })
  }

  // This runs to get centerpoint of the map
  const MapCenterQuery =  () => {
    sdk.run_inline_query(
      {
        result_format: 'json',
        body: {
          model: 'acuity',
          view: 'search_partitioned',
          fields: [
            'positionchanged_partitioned.avg_lat',
            'positionchanged_partitioned.avg_lng'
          ],
          filters: {"search_partitioned.installid":"59ce7b9d-1205-44af-9af0-5c407efacad1"},
          limit: '1',
          total: false,
        }
      }).then((result:any ) => {
        if(result.ok){
          const latlng = result.value.map((r:any) => ({
            lat: r["positionchanged_partitioned.avg_lat"],
            lng: r["positionchanged_partitioned.avg_lng"]
          }))
          console.log("central: ", latlng, " ", latlng[0])
          setCenterCoords(latlng[0])
        }
      })
  }

  // Call the MapQuery and MapCenterQuery on load
  useEffect(() => {
    MapQuery();
    MapCenterQuery();
  },[props.selectedInstalls])

  const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2e5d4"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5dac6"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5c6c6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e4d7c6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbfaf7"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#acbcc9"
            }
        ]
    }
]





  return(
    <>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "{{INSERTKEY}}" }}
        defaultCenter={centerCoords}
        defaultZoom={15}
        heatmapLibrary={true}
        heatmap={coords}
        options={{
          styles:mapStyles
        }}
       
      >
      { markers ?
        markers.map((m, index)=>
          <Marker
            lat={m.lat}
            lng={m.lng}
            key={index}
          />)
          : <></>
      }
      </GoogleMapReact>
    </>
  )

}

export function Marker (props: any){
  return (
    // Add the click stuff
    <Icon icon={<Flag />} color="inform" size="medium" />
  )

}




// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 15,
//     center: { lat: 33.64147562122921, lng: -84.4376896191860 },
//     mapTypeId: "roadmap",
//   });
// /*   map.addListener("click", (event) => {
//     addMarker(event.latLng);
//   }); */
//   heatmap = new google.maps.visualization.HeatmapLayer({
//     data: getPoints(),
//     map: map,
//   });
//   // document
//   //   .getElementById("toggle-heatmap")
//   //   .addEventListener("click", toggleHeatmap);
//   // document
//   //   .getElementById("change-gradient")
//   //   .addEventListener("click", changeGradient);
//   // document
//   //   .getElementById("change-opacity")
//   //   .addEventListener("click", changeOpacity);
//   // document
//   //   .getElementById("change-radius")
//   //   .addEventListener("click", changeRadius);
//   // document
//   //   .getElementById("show-markers")
//   //   .addEventListener("click", showMarkers);
//   // document
//   //   .getElementById("hide-markers")
//   //   .addEventListener("click", hideMarkers);
//   // document
//   //   .getElementById("delete-markers")
//   //   .addEventListener("click", deleteMarkers);
//   // Adds a marker at the center of the map.
//   addMarker(latlng);
   
// }

// function toggleHeatmap() {
//   heatmap.setMap(heatmap.getMap() ? null : map);
// }

// function changeGradient() {
//   const gradient = [
//     "rgba(0, 255, 255, 0)",
//     "rgba(0, 255, 255, 1)",
//     "rgba(0, 191, 255, 1)",
//     "rgba(0, 127, 255, 1)",
//     "rgba(0, 63, 255, 1)",
//     "rgba(0, 0, 255, 1)",
//     "rgba(0, 0, 223, 1)",
//     "rgba(0, 0, 191, 1)",
//     "rgba(0, 0, 159, 1)",
//     "rgba(0, 0, 127, 1)",
//     "rgba(63, 0, 91, 1)",
//     "rgba(127, 0, 63, 1)",
//     "rgba(191, 0, 31, 1)",
//     "rgba(255, 0, 0, 1)",
//   ];
//   heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
// }

// function changeRadius() {
//   heatmap.set("radius", heatmap.get("radius") ? null : 20);
// }

// function changeOpacity() {
//   heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
// }

// const latlng = { lat: 33.64147562122921, lng: -84.43768961918602 };


// // Feed MapQuery results into here
// function getPoints() {
//   return [
//   new google.maps.LatLng(33.64147562122921,-84.43768961918602),
// new google.maps.LatLng(33.64181610904627,-84.43693177827933),
// new google.maps.LatLng(33.64199203642343,-84.43649952141087),
// new google.maps.LatLng(33.64197704644435,-84.4367557401521),
// new google.maps.LatLng(33.64186313102627,-84.4368159098574),
// new google.maps.LatLng(33.64079386550329,-84.4310330888808),
// new google.maps.LatLng(33.64189922801551,-84.43670321063667),
// new google.maps.LatLng(33.64446796007704,-84.43483951499948),
// new google.maps.LatLng(33.64445149717064,-84.43489881668677),
// new google.maps.LatLng(33.64438951500051,-84.43506033921491),
// new google.maps.LatLng(33.64434047388653,-84.4351256613226),
// new google.maps.LatLng(33.64187586445617,-84.43694415793922),
// new google.maps.LatLng(33.6418422728064,-84.43698655181245),
// new google.maps.LatLng(33.64177812690674,-84.4370674354105),
// new google.maps.LatLng(33.64176381796538,-84.43709304920733),
// new google.maps.LatLng(33.641655441026025,-84.43733750248015),
// new google.maps.LatLng(33.64122519936952,-84.43758632137926),
// new google.maps.LatLng(33.64217904052279,-84.43656951384797),
// new google.maps.LatLng(33.642252065527,-84.43655220125216),
// new google.maps.LatLng(33.64122848163358,-84.4376433709335),
// new google.maps.LatLng(33.64216929863345,-84.43657600457114),
// new google.maps.LatLng(33.641333913224614,-84.43743293806845),
// new google.maps.LatLng(33.641747790042665,-84.43689639933065),
// new google.maps.LatLng(33.64220262965286,-84.4366451826524),
// new google.maps.LatLng(33.64217030127977,-84.43659857490395),
// new google.maps.LatLng(33.644441512573806,-84.43466682795008),
// new google.maps.LatLng(33.644474491617615,-84.4345708673368),
// new google.maps.LatLng(33.644480870033554,-84.43471811747382),
// new google.maps.LatLng(33.64448198357691,-84.43452398681936),
// new google.maps.LatLng(33.64446114424572,-84.43462177129699),
// new google.maps.LatLng(33.64448282287647,-84.43478509044668),
// new google.maps.LatLng(33.64443973986707,-84.43497637445154),
// new google.maps.LatLng(33.64434091536973,-84.43520954946804),
// new google.maps.LatLng(33.64220646445221,-84.43520743873991),
// new google.maps.LatLng(33.6424719576675,-84.43511036789685),
// new google.maps.LatLng(33.64277148118893,-84.43502834235434),
// new google.maps.LatLng(33.64150802207897,-84.43766881823947),
// new google.maps.LatLng(33.64191463143641,-84.43660449370921),
// new google.maps.LatLng(33.6421154529472,-84.43665219357548),
// new google.maps.LatLng(33.64192025814435,-84.43688328399173),
// new google.maps.LatLng(33.6418883778144,-84.43682086639652),
// new google.maps.LatLng(33.64197380393605,-84.43683156057564),
// new google.maps.LatLng(33.641830542190654,-84.43651543796835),
// new google.maps.LatLng(33.64180017274103,-84.43703405251016),
// new google.maps.LatLng(33.6421154529471,-84.43665219357548),
// new google.maps.LatLng(33.64175531910677,-84.43711214705827),
// new google.maps.LatLng(33.642084816993346,-84.43667469364195),
// new google.maps.LatLng(33.64177614093049,-84.43703580849909),
// new google.maps.LatLng(33.64204640152453,-84.43673149107359),
// new google.maps.LatLng(33.64197456214938,-84.43655329123244),
// new google.maps.LatLng(33.64213223304532,-84.4359196095393),
// new google.maps.LatLng(33.641849037914405,-84.43657345388816),
// new google.maps.LatLng(33.641787957283626,-84.43672785595557),
// new google.maps.LatLng(33.64180979006832,-84.43665282865771),
// new google.maps.LatLng(33.64216432996167,-84.43659017638012),
// new google.maps.LatLng(33.642196661239694,-84.43657698622984),
// new google.maps.LatLng(33.64140384468156,-84.4376615267817),
// new google.maps.LatLng(33.642170673959,-84.435921220055),
// new google.maps.LatLng(33.641656301207625,-84.43658135208146),
// new google.maps.LatLng(33.641710039718326,-84.43644913043623),
// new google.maps.LatLng(33.64168379031519,-84.43648007951583),
// new google.maps.LatLng(33.6419826283934,-84.43583402956598),
// new google.maps.LatLng(33.641218793079545,-84.43756268124532),
// new google.maps.LatLng(33.64173303825,-84.43666143550635),
// new google.maps.LatLng(33.64200849581581,-84.43583330940628),
// new google.maps.LatLng(33.64201100565533,-84.43583172168942),
// new google.maps.LatLng(33.64215040026991,-84.43592077722553),
// new google.maps.LatLng(33.6416992026337,-84.43680837338177),
// new google.maps.LatLng(33.64200993543989,-84.43582651585876),
// new google.maps.LatLng(33.64171716885792,-84.43647151237442),
// new google.maps.LatLng(33.64088439941405,-84.43595886230466),
// new google.maps.LatLng(33.641604267459265,-84.43767036187455),
// new google.maps.LatLng(33.64165044907686,-84.43650577161303),
// new google.maps.LatLng(33.641643783081,-84.43654900231088),
// new google.maps.LatLng(33.64198239320488,-84.43583210169301),
// new google.maps.LatLng(33.64198866549656,-84.43586466625366),
// new google.maps.LatLng(33.64198393485934,-84.43583154452541),
// new google.maps.LatLng(33.641743237612566,-84.43660605759037),
// new google.maps.LatLng(33.641677401493226,-84.43660696522456),
// new google.maps.LatLng(33.63996167032614,-84.42017992083422),
// new google.maps.LatLng(33.64192571208288,-84.43588652885099),
// new google.maps.LatLng(33.64194786420679,-84.43588809689534),
// new google.maps.LatLng(33.64186592532676,-84.4372682607199),
// new google.maps.LatLng(33.64201481224837,-84.43590814251728),
// new google.maps.LatLng(33.64150799571826,-84.43771525509736),
// new google.maps.LatLng(33.64147086160667,-84.437727744601),
// new google.maps.LatLng(33.64219690781239,-84.43592156436111),
// new google.maps.LatLng(33.64128348210612,-84.4349255505501),
// new google.maps.LatLng(33.64223547754651,-84.43592330379109),
// new google.maps.LatLng(33.6419860436372,-84.43585295675442),
// new google.maps.LatLng(33.64153838712973,-84.43771153847781),
// new google.maps.LatLng(33.641648224698905,-84.43766057409263),
// new google.maps.LatLng(33.64220281346033,-84.4359223343805),
// new google.maps.LatLng(33.64175509282819,-84.43762016353894),
// new google.maps.LatLng(33.64144460102256,-84.43769521019078),
// new google.maps.LatLng(33.64168839946491,-84.43764539513145),
// new google.maps.LatLng(33.641524976899525,-84.43771365471348),
// new google.maps.LatLng(33.64198220195902,-84.43584445613591),
// new google.maps.LatLng(33.64126291836503,-84.43487794677952),
// new google.maps.LatLng(33.64137073896319,-84.43764260661625),
// new google.maps.LatLng(33.64023462884912,-84.42465310293751),
// new google.maps.LatLng(33.64201879577902,-84.43579813906545),
// new google.maps.LatLng(33.64109744755356,-84.43540035844481),
// new google.maps.LatLng(33.64109316213102,-84.43536167539523),
// new google.maps.LatLng(33.64108434881677,-84.43538805676693),
// new google.maps.LatLng(33.64107560362784,-84.43549448637962),
// new google.maps.LatLng(33.641110174046574,-84.4354066426564),
// new google.maps.LatLng(33.64200583405881,-84.43701911172155),
// new google.maps.LatLng(33.64023215685771,-84.42465822405426),
// new google.maps.LatLng(33.6402823389323,-84.42463821994089),
// new google.maps.LatLng(33.64128627364374,-84.43488903045944),
// new google.maps.LatLng(33.6401830045863,-84.42462754701268),
// new google.maps.LatLng(33.64020954230645,-84.42465743037087),
// new google.maps.LatLng(33.64114969821044,-84.43765555485628),
// new google.maps.LatLng(33.642019415386805,-84.43579774129229),
// new google.maps.LatLng(33.64172968769962,-84.4377199595596),
// new google.maps.LatLng(33.64146467190776,-84.43771406961922),
// new google.maps.LatLng(33.64059535653382,-84.43780893139615),
// new google.maps.LatLng(33.64153456433178,-84.43773135359805),
// new google.maps.LatLng(33.64202035241967,-84.43578893512525),
// new google.maps.LatLng(33.64024754341171,-84.42463706875462),
// new google.maps.LatLng(33.64148681434936,-84.43772607632529),
// new google.maps.LatLng(33.64223600401084,-84.43595739362657),
// new google.maps.LatLng(33.64104717852107,-84.43590740706222),
// new google.maps.LatLng(33.64225034589311,-84.4359209637503),
// new google.maps.LatLng(33.64226385983389,-84.43586480817166),
// new google.maps.LatLng(33.6402650239317,-84.42462197147319),
// new google.maps.LatLng(33.64234120315874,-84.43592021587385),
// new google.maps.LatLng(33.641594119445394,-84.43774276683439),
// new google.maps.LatLng(33.640294495809805,-84.42467761293494),
// new google.maps.LatLng(33.6421591932474,-84.43590173651467),
// new google.maps.LatLng(33.64107922547552,-84.43469624432701),
// new google.maps.LatLng(33.64201983120344,-84.43579012068227),
// new google.maps.LatLng(33.64027404723354,-84.42472746596661),
// new google.maps.LatLng(33.64127007129464,-84.43775383652229),
// new google.maps.LatLng(33.641112344930505,-84.43468591203833),
// new google.maps.LatLng(33.64228275169752,-84.43591886309092),
// new google.maps.LatLng(33.64210201412668,-84.43590296098192),
// new google.maps.LatLng(33.64160959205096,-84.43774385499776),
// new google.maps.LatLng(33.640299482917825,-84.42467725080975),
// new google.maps.LatLng(33.64104777700904,-84.43590721216978),
// new google.maps.LatLng(33.64105420749191,-84.43469495469635),
// new google.maps.LatLng(33.64028654468066,-84.42473484284582),
//  ]
// }
// // TO-DO: feed API data (count from MapQuery) into the hoverover in below function. The below function adds markers to the map.

// function addMarker(position:any) {
//   const marker = new google.maps.Marker({
//     position,
//     map,
//   });
//   markers.push(marker);
//   const contentString =
//         '<div id="content">' +
//         '<div id="siteNotice">' +
//         "</div>" +
//         '<h1 id="firstHeading" class="firstHeading">Looker API Data</h1>' +
//         '<div id="bodyContent">' +
//         "<p>This can be Looker data or links to Looker content</p>" +
//         "</div>" +
//         "</div>";
//   const infowindow = new google.maps.InfoWindow({
//     content: contentString,
//     maxWidth: 200,
//   });
//   marker.addListener("click", () => {
//     infowindow.open({
//       anchor: marker,
//       map,
//       shouldFocus: false,
//     });
//   });
// }

// // Sets the map on all markers in the array.
// function setMapOnAll(map:any) {
//   for (let i = 0; i < markers.length; i++) {
//     markers[i].setMap(map);
//   }
// }

// // Removes the markers from the map, but keeps them in the array.
// function hideMarkers() {
//   setMapOnAll(null);
// }

// // Shows any markers currently in the array.
// function showMarkers() {
//   setMapOnAll(map);
// }

// // Deletes all markers in the array by removing references to them.
// function deleteMarkers() {
//   hideMarkers();
//   markers = [];
// }








// const MapQuery = async () => {
//   try {
//     const value = sdk.ok(sdk.run_inline_query(
//       {
//         model: 'acuity',
//         view: 'search_partitioned',
//         fields: [
//           'positionchanged_partitioned.lat',
//           'positionchanged_partitioned.lng',
//           'search_partitioned.count'
//         ],
//         limit: -1,
//         total: false
//       }))
//     return value
//   } catch (error) {
//   }
// }



// const gkey = process.env.GOOGLE_MAPS_API_KEY;
// const vis_lib = "https://maps.googleapis.com/maps/api/js?key=" + gkey + "libraries=visualization&callback=initMap";
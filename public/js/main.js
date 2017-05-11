$(function initializeMap () {

  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    }, 
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    }, 
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker (type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  // 0. Fetch the database, parsed from json to a js object
  const db = fetch('/api').then(r => r.json())
  console.log("we got here")
  //when page loads, load all the days (count them and load that number of them)
  $.ajax('/api/days', {method: 'get'})
  .then(function(days) {
    days.forEach(function(day, index) {
      //$('button.addDay').click()   
      // Add a new day
      $('button.addDay').before(
        $(`<ol class="current day"><h3><span class=day-head>Day ${index + 1}</span><button class=delDay>x</button></h3></ol>`)
      )

      //console.log("day.hotel is ", day.hotel)
      //console.log("this is day ", day)
      if (day.hotelId) {
        let newLi = $(`<li>${day.hotel.name}</li>`)
        newLi.appendTo($(`#${day.id}`))
      }
      
      //$('.day[dataid = day.id]').append("hello")
      //console.log("hopefully this gets the day with the day id we want: ", $( ".day" ).data( "dayid" ) === day.id)
      //console.log("day.id is ", day.id)
      
      

    })
  }) //(using the alt formatting just to switch it up)


  // 1. Populate the <select>s with <option>s
  $('select').each(
    (_index, select) => {
      db.then(db =>
        $(select).append(
          db[select.dataset.type].map (
            item => Object.assign(
              $(`<option>${item.name}</option>`)[0]
              , {
                item: item,
              })
          )
        )
      )
    })

  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  $('button.add').click(    
    evt =>
      $(evt.target.dataset.from)
        .find('option:selected')
        .each((_i, option) => {
          const item = option.item
              , type = $(option)
                  .closest('select')[0]
                  .dataset.type

          // Make a li out of this item
          const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0]

          // Draw a marker on the map and attach the marker to the li
          li.marker = drawMarker(type, item.place.location)

          // Add this item to our itinerary for the current day
          $('.current.day').append(li)

          //if it's a hotel direct to a post route that can set the hotel on a day
          // dayRouter.post('/:dayNum/hotels', (req, res, next) => {

          // });
          
          //sometimes this is undefined
          console.log("current day ", $('.current.day'))
          let dayId = $('.current.day')[0].dataset.dayid;
      
          if (evt.target.dataset.from === '#hotels') {
              $.ajax(`/api/days/${dayId}/hotels`, {
                method: 'post',
                data: {
                  "hotelName": item.name,
                  "dayId": dayId
                }
              });
           }
        })
  )

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null)
      $(li).remove()
    })
  )

  // 4. Deal with adding days
  $('button.addDay').click(
    evt => {
      // Deselect all days
      $('.day.current').removeClass('current')
      
       //posting the day to the database

       
      $.post('/api/days')
      .then(function(day){
        var dayid = day.id;
        $(evt.target).before(
        $(`<ol id="#${dayid}" class="current day" data-dayid =${dayid}><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`));
        numberDays();
      }).catch(next);

      // Add a new day
      

      let dayNum = Number($('.current.day').find("span")[0].innerHTML.slice(4));
      //posting the day to the database
      $.post('/api/days')
      .then(function(day){
        console.log(day)
      });
    }
  )

  function numberDays() {
    $('.day').each((index, day) =>
      $(day).find('.day-head').text(`day ${index + 1}`)
    )
  }

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('.day.current').removeClass('current')
      const $day = $(evt.target).closest('.day')

      $('li').each((_i, li) => li.marker && li.marker.setMap(null))      
      $day.addClass('current')
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
    }
  )

  // 6. Remove a day
  $(document).on('click', 'button.delDay',
    evt => {
      const $day = $(evt.target).closest('.day')
      if ($day.hasClass('current')) {
        const prev = $day.prev('.day')[0]
            , next = $day.next('.day')[0]
        $day.removeClass('current')
        $(prev || next).addClass('current')
      }

      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))      
      $day.remove()
      numberDays()
    })

  // When we start, add a day
  //$('button.addDay').click()
});

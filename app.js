'use strict';
var G = {};
var url = window.location.href;
var access_token = url.split("#")[1].split("=")[1].split("&")[0];
var userId = url.split("#")[1].split("=")[2].split("&")[0];

// get BMR calories so far for today
function minsToMidnight() {
  var now = new Date();
  var then = new Date(now);
  then.setHours(24, 0, 0, 0);
  return (then - now) / 6e4;
}
G.minsToMidnight = minsToMidnight();

// yesterday
var date = new Date();
date.setDate(date.getDate() - 1);
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
G.yesterday = formatDate(date);

$.when (
  //
  $.ajax({ // activities/calories ... includes tracker, bmr, manually-logged activity
    type: 'GET',
    beforeSend: function(request) { request.setRequestHeader("Authorization", 'Bearer ' + access_token); },
    url: "https://api.fitbit.com/1/user/"+userId+"/activities/calories/date/today/1d.json",
    success:function(data, status, xhr){
      // console.log(data);
      G.tracker_bmr_logged_calories = parseInt(data['activities-calories'][0]['value']);
        //        G.BMR_by_minute = bmr / ( 24 * 60 );
      }
  }),

      $.ajax({ // activities/caloriesBMR - Only BMR calories. FOR PAST MONTH
        type: 'GET',
        beforeSend: function(request) { request.setRequestHeader("Authorization", 'Bearer ' + access_token); },
        url: "https://api.fitbit.com/1/user/"+userId+"/activities/caloriesBMR/date/today/1m.json",
        success:function(data, status, xhr){
           G.data_length = data['activities-caloriesBMR'].length;
           var totalBMR = 0;
           for( var i = 0; i < (G.data_length-1); i++ ){
             totalBMR += parseInt(data['activities-caloriesBMR'][i]['value']);
           }
           G.totalBMR = totalBMR;
           console.log('totalBMR ', totalBMR);
          }
      }),

    $.ajax({ // activities/tracker/calories - ALL ACTIVITY FOR PAST MONTH.
      type: 'GET',
      beforeSend: function(request) { request.setRequestHeader("Authorization", 'Bearer ' + access_token); },
      url: "https://api.fitbit.com/1/user/"+userId+"/activities/tracker/calories/date/today/1m.json",
      success:function(data, status, xhr){
        var data_length = data['activities-tracker-calories'].length;
        var totalCalories = 0;
        for( var i = 0; i < (data_length-1); i++ ){
          totalCalories += parseInt(data['activities-tracker-calories'][i]['value']);
        }
        G.totalCalories = totalCalories;
        console.log('totalCalories ', totalCalories);
        }
    }),



  $.ajax({ // activities/caloriesBMR - Only BMR calories.
    type: 'GET',
    beforeSend: function(request) { request.setRequestHeader("Authorization", 'Bearer ' + access_token); },
    url: "https://api.fitbit.com/1/user/"+userId+"/activities/caloriesBMR/date/" + G.yesterday + "/1d.json",
    success:function(data, status, xhr){
      // console.log(data);
      var bmr = G.BMR_total_yesterday = parseInt(data['activities-caloriesBMR'][0]['value']);
                G.BMR_by_minute = bmr / ( 24 * 60 );
      }
  }),

          $.ajax({ //activities/tracker/calories - Calories burned inclusive of BMR according to movement captured by a Fitbit tracker.
            type: 'GET',
            beforeSend: function(request) { request.setRequestHeader("Authorization", 'Bearer ' + access_token); },
            url: "https://api.fitbit.com/1/user/"+userId+"/foods/log/caloriesIn/date/today/1d.json",
            success:function(data, status, xhr){
              //console.log(data);

              G.caloriesIn = parseInt(data['foods-log-caloriesIn'][0]['value']);
              }
          })

)
    .then( myFunc, myFailure );

    function myFunc() {
      //console.log (G.BMR_by_minute);
      G.remaining_BMR_calories = G.minsToMidnight * G.BMR_by_minute;
      G.avg_activity_by_day = ((G.totalCalories - G.totalBMR)/G.data_length)/2;
      G.avg_activity_by_min = (G.avg_activity_by_day)/( 24 * 60 );

      console.log('G.BMR_total_yesterday ', G.BMR_total_yesterday);
      console.log('G.avg_activity_by_day ', G.avg_activity_by_day);


      G.remaining_activity_calories = G.minsToMidnight * G.avg_activity_by_min;
      console.log('G.remaining_activity_calories ', G.remaining_activity_calories);

      G.BMR_calories_so_far = G.BMR_total_yesterday - G.remaining_BMR_calories;

      G.projected_burn = parseInt(G.tracker_bmr_logged_calories + G.remaining_BMR_calories);

      G.projected_burn_2 = parseInt(G.tracker_bmr_logged_calories + G.remaining_activity_calories + G.remaining_BMR_calories);




      $('#calories-in').html(G.caloriesIn);
      $('#calories-burned').html(G.tracker_bmr_logged_calories);

      $('#projected-burn').html(G.projected_burn);
      $('#projected-burn-2').html(G.projected_burn_2 );

      $('#calorie-deficit').html(G.projected_burn - G.caloriesIn);
      $('#calorie-deficit-2').html(G.projected_burn_2 - G.caloriesIn);

      $('#current-deficit').html(G.tracker_bmr_logged_calories - G.caloriesIn);

      //$('#calories-left').html('Rem: ' + parseInt(G.remaining_BMR_calories));
      //$('#calories-out').html('Curr Out: ' + G.tracker_bmr_logged_calories);
    }

    function myFailure() {
      console.log('failure');
    }

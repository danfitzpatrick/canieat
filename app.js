'use strict';
// get the url
var url = window.location.href;
//getting the access token from url
var access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
var userId = url.split("#")[1].split("=")[2].split("&")[0];

var caloriesBMR = ""

var date = new Date();
date.setDate(date.getDate() - 1);
var yesterday = formatDate(date);

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function yourFunction(callback) {
    $.ajax({ //activities/tracker/calories - Calories burned inclusive of BMR according to movement captured by a Fitbit tracker.
      type: 'GET',
      beforeSend: function(request) {
         request.setRequestHeader("Authorization", 'Bearer ' + access_token);
      },
        url: "https://api.fitbit.com/1/user/"+userId+"/activities/tracker/calories/date/today/1d.json",
        success:function(data, status, xhr){
        	//var trackerCalories = data['activities-tracker-calories'][0]['value'];
          //console.log('trackerCalories = ' + trackerCalories);
          //$('#calories-left').html(trackerCalories);
              //function myClosure(trackerCalories){
                //   return trackerCalories;
            //  }

        }
    }).done(function(result) {
        /* do something with the result here */
        result = result['activities-tracker-calories'][0]['value'];
        callback(result); // invokes the callback function passed as parameter
    });

}

yourFunction(function(result) {
    console.log('Result! ', result);
});

// $.ajax({ //activities/tracker/calories - Calories burned inclusive of BMR according to movement captured by a Fitbit tracker.
//   type: 'GET',
//   beforeSend: function(request) {
//      request.setRequestHeader("Authorization", 'Bearer ' + access_token);
//   },
//     url: "https://api.fitbit.com/1/user/"+userId+"/activities/tracker/calories/date/today/1d.json",
//     success:function(data, status, xhr){
//     	var trackerCalories = data['activities-tracker-calories'][0]['value'];
//       console.log('trackerCalories = ' + trackerCalories);
//       $('#calories-left').html(trackerCalories);
//     }
// });

// $.ajax({ // activities/caloriesBMR - Only BMR calories.
//   type: 'GET',
//   beforeSend: function(request) {
//      request.setRequestHeader("Authorization", 'Bearer ' + access_token);
//   },
//     url: "https://api.fitbit.com/1/user/"+userId+"/activities/caloriesBMR/date/"+yesterday+"/1d.json",
//     success:function(data, status, xhr){
//     	caloriesBMR = data['activities-caloriesBMR'][0]['value'];
//       //console.log(data['activities-tracker-calories'][0]['value']);
//       console.log('caloriesBMR = ' + caloriesBMR);
//       //$('#calories-left').html(myNumber);
//     }
// });
//
// $.ajax({ //activities/activityCalories - The number of calories burned during the day for periods of time when the user was active above sedentary level. This value is calculated minute by minute for minutes that fall under this criteria. This includes BMR for those minutes as well as activity burned calories.
//   type: 'GET',
//   beforeSend: function(request) {
//      request.setRequestHeader("Authorization", 'Bearer ' + access_token);
//   },
//     url: "https://api.fitbit.com/1/user/"+userId+"/activities/activityCalories/date/today/1d.json",
//     success:function(data, status, xhr){
//     	var activityCalories = data['activities-activityCalories'][0]['value'];
//       console.log('activityCalories = ' + activityCalories);
//     }
// });
//
// $.ajax({ // activities/caloriesBMR - Only BMR calories.
//   type: 'GET',
//   beforeSend: function(request) {
//      request.setRequestHeader("Authorization", 'Bearer ' + access_token);
//   },
//     url: "https://api.fitbit.com/1/user/"+userId+"/activities/caloriesBMR/date/today/1w.json",
//     success:function(data, status, xhr){
//     	//var caloriesBMR = data['activities-caloriesBMR'][0]['value'];
//       //console.log(data['activities-tracker-calories'][0]['value']);
//       //console.log('caloriesBMR = ' + caloriesBMR);
//       //$('#calories-left').html(myNumber);
//       console.log(data);
//     }
// });
//
// console.log(caloriesBMR);
//
//
// var bob = myClosure();
// console.log(bob);


/*


function celebrityName (firstName) {
    var nameIntro = "This celebrity is ";
    // this inner function has access to the outer function's variables, including the parameter​
   function lastName (theLastName) {
        return nameIntro + firstName + " " + theLastName;
    }
    return lastName;
}
​
​var mjName = celebrityName ("Michael"); // At this juncture, the celebrityName outer function has returned.​
​
​// The closure (lastName) is called here after the outer function has returned above​
​// Yet, the closure still has access to the outer function's variables and parameter​
mjName ("Jackson"); // This celebrity is Michael Jackson 




Calorie Time Series Differences

activities/calories - The top level time series for calories burned inclusive of BMR, tracked activity, and manually logged activities.

activities/caloriesBMR - Only BMR calories.

activities/activityCalories - The number of calories burned during the day for periods of time when the user was active above sedentary level. This value is calculated minute by minute for minutes that fall under this criteria. This includes BMR for those minutes as well as activity burned calories.

activities/tracker/calories - Calories burned inclusive of BMR according to movement captured by a Fitbit tracker.

activities/tracker/activityCalories - Calculated similarly to activities/activityCalories, but uses only tracker data. This means that manually logged activities are excluded.
*/

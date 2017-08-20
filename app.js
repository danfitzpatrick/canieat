'use strict';
// get the url 
var url = window.location.href;
//getting the access token from url
var access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
var userId = url.split("#")[1].split("=")[2].split("&")[0];

// let us try to fetch logged in Fitbit user profile data 
$.ajax({
  type: 'GET',
  beforeSend: function(request) {
     request.setRequestHeader("Authorization", 'Bearer ' + access_token);
  },
    url: "https://api.fitbit.com/1/user/"+userId+"/activities/tracker/calories/date/today/1d.json",
    success:function(data, status, xhr){
    	//myNumber = data['activities-tracker-calories'][0]['value'];
      console.log(data['activities-tracker-calories'][0]['value']);
      $('#calories-left').html(myNumber);
    }
});
// = = Gets called on document loaded = =

function getAppointments(key, day, month, year) {
  $.ajax({
    url: 'Rablabla?key=' + key + '&day=' + day + '&month=' + month + '&year=' + year,
    type: 'GET',
    success: (answer) => {
      var data = JSON.parse(answer);
      console.log(data);
    },
    error: (error) => {
      console.log(error);
    }
  });
  return "Accessing appointments...";
}

function getYearlyCalendar(key) {
  $.ajax({
    url: 'Rablabla?key=' + key,
    type: 'POST',
    success: (answer) => {
    		console.log(answer);
    },
    error: (error) => {
      console.log(error);
    }
  });
  return "Accessing calendar file...";
}

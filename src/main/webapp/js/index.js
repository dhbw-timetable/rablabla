// = = Gets called on document loaded = =

function requestAppointments(key, day, month, year) {
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
}

function exportYearlyICS(key, year) {
  $.ajax({
    url: 'Rablabla?key=' + key + '&year=' + year,
    type: 'POST',
    success: (answer) => {
    		console.log("Finished creating .ics file!");
    },
    error: (error) => {
      console.log(error);
    }
  });
  return "Generating .ics file...";
}

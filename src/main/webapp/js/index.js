// = = Gets called on document loaded = =

var paragraph = document.querySelector('p');
var btn = document.querySelector('button');

btn.addEventListener('click', (e) => {
  var now = new Date();
  requestAppointments('txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo', now.getDate(), now.getMonth()+1, now.getFullYear());
});

function requestAppointments(key, day, month, year) {
  $.ajax({
    url: 'Rablabla?key=' + key + '&day=' + day + '&month=' + month + '&year=' + year,
    type: 'GET',
    success: (answer) => {
      var data = JSON.parse(answer);
      console.log(data);
      paragraph.innerHTML = data;
    },
    error: (error) => {
      console.log(error);
    }
  });
}

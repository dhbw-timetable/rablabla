// = = Gets called on document loaded = =

var paragraph = document.querySelector('p');

$.ajax({
  url: "Rablabla",
  type: "GET",
  success: (answer) => {
      paragraph.innerHTML = answer;
  },
  error: (error) => {
    console.log(error);
  }
});

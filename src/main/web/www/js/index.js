
function getAppointments(url, day, month, year) {
  const pUrl = encodeURIComponent(url);
  $.ajax({
    url: `Rablabla?url=${pUrl}&day=${day}&month=${month}&year=${year}`,
    type: 'GET',
    success: (answer) => {
      const data = JSON.parse(answer);
      console.log(data);
    },
    error: (error) => {
      console.log(error);
    },
  });
  return 'Accessing appointments...';
}

function getParams(args) {
  const params = {};
  const pStrings = args.split('&');
  Object.keys(pStrings).forEach((param) => {
    const kvStrings = pStrings[param].split('=');
    params[kvStrings[0]] = kvStrings[1];
  });
  return params;
}

function getYearlyCalendar(url) {
  const deSuffix = '.de/rapla?';
  const params = getParams(url.substring(url.indexOf(deSuffix) + deSuffix.length));
  if (params.key) {
    $.ajax({
      url: `Rablabla?url=${url}`,
      type: 'POST',
      success: (answer) => {
        // TODO Display link to user
        console.log(answer);
      },
      error: (error) => {
        console.log(error);
      },
    });
    return 'Accessing calendar file...';
  } else if (params.user && params.file) {
    // TODO Display link to user
    console.log(`${url}&page=ical`);
  } else {
    console.error(`Yearly calendar not supported for url: ${url}`);
  }
}

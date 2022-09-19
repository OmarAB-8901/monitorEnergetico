let urlApi = "http://localhost:1880";
let myChart;
// let _today = moment().date() + "/" + ( moment().month() < 10 ? "0" + moment().month() : moment().month() ) + "/" + moment().year();
let _today = moment().year() + "-" + ( moment().month() < 10 ? "0" + (moment().month()+1) : moment().month()+1 ) + "-" + moment().date();

document.getElementById('dateInitial').value = _today;

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-14 10:21:52 
 * @Desc: This functions disapear beacuse are only for tha makeup 
 */
let randomValues = () => {

  let values = [];
  let random;

  for (let i = 1; i <= 60; i++) {
    random = i + Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    values.push(random);
  }

  return values;
}

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-19 11:22:18 
 * @Desc: Obtain info from the database 
 */

let dataObtained = async () => {

  let date = document.getElementById('dateInitial').value;
  let typeGraph = document.getElementById('graphSelector').value;

  let dataReceived = await fetch(urlApi + '/obtainDataChart?date='+date+"&typeGraph="+typeGraph).then(json => json.json()).then(data => data);

  let dataToReturn = dataReceived.map(data => {
  
    return { dateFormated: moment(data.DateAndTime).minute(), value: data.Val }
  });

  return timeToShow().map(minute => {

    let temp = dataToReturn.filter(data => {

      if (data.dateFormated == minute)
        return data;
    });

    return temp.length > 0 ? temp[0].value : 0;
  });
}

let showTableData = (dataToShow) => {

  let totKwh = 0;
  let rows = "";

  // let time = 0;
  // dataToShow = dataToShow.map( data => { return { timeLabel: time++, value: data } }).filter( data => data.value != 0 ? data : 0 );

  // for (let i = 1; i <= dataToShow.length; i++) {
  //   rows += "<tr><td>" + dataToShow[i - 1].timeLabel + "</td><td>" + dataToShow[i - 1].value + "</td></tr>";
  //   totKwh += dataToShow[i - 1].value;
  // }

  for (let i = 1; i <= dataToShow.length; i++) {
    rows += "<tr><td>" + i + "</td><td>" + dataToShow[i - 1] + "</td></tr>";
    totKwh += dataToShow[i - 1];
  }

  document.getElementsByClassName('tblDesgloseBody')[0].innerHTML = rows;
  document.getElementsByClassName('kwh_Value')[0].innerHTML = totKwh.toFixed(2);

  // let tableCreated = document.querySelector('#tablaDesglose').DataTable();
  // $('#tablaDesglose').DataTable({
  //   dom: 'Blfrtip',
  //   // "paging": true,
  //   "pageLength": 10,
  //   "searching": false,
  //   'ordering': false,
  // });
}
// END

function typeGraph(...graphs) {

  for (let j = 0; j < graphs.length; j++) {

    let slctGraph = document.getElementById('graphSelector');
    var option = document.createElement("option");
    option.value = graphs[j];
    option.text = "Grafica de " + graphs[j];
    slctGraph.add(option);
  }
}

let getSeconds = () => {

  let secondLabels = [];

  for (let i = 1; i <= 60; i++)
    secondLabels.push(i);

  return secondLabels;
};

let compareDates = () => {

  let dateInitial = document.getElementById('dataInitial').value;
  dateInitial = moment(dateInitial);

  let dateEnding = document.getElementById('dateEnding').value;
  dateEnding = moment(dateEnding);

  let diffdates = dateEnding.diff(dateInitial);

  return diffdates < 0 ? false : true;
};

let showErrorDates = () => {

  let errorDates = document.getElementsByClassName('errorDates')[0];
  errorDates.classList.toggle('show');

  setTimeout(() => {
    errorDates.classList.toggle('show');
  }, 7000);
}

document.getElementById('btnBuscar').addEventListener('click', function () {

  if (!compareDates()) {

    showErrorDates();
    return;
  }

  myChart.destroy();
  printChart();
});

async function printChart() {

  let dataToShow = await dataObtained();

  let typeChart = 'line';
  let nameChart = 'KWh / minuto';
  let smooth = true;
  let isFilled = false;
  const ctx = document.getElementById('energyChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: typeChart,
    data: {
      labels: timeToShow(),
      datasets: [{
        label: nameChart,
        data: dataToShow,
        // data: [],
        borderColor: 'rgba(56, 102, 242, 0.9)',
        backgroundColor: 'rgba(56, 102, 242, 0.7)',
        fill: isFilled,
      }
        // ,{
        //   label: 'Dataset Prueba',
        //   data:  randomValues(),
        //    borderColor: 'rgba(254, 22, 28, 0.9)',
        //   backgroundColor: 'rgba(254, 22, 28, 0.7)',
        //   fill: isFilled,
        // }
        // ,{
        //   label: 'Dataset Prueba',
        //   data:  randomValues(),
        //   borderColor: 'rgba(31, 52, 245, 0.8)',
        //   backgroundColor: 'rgba(31, 52, 245, 0.6)',
        //   fill: isFilled,
        // }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      elements: {
        line: {
          tension: smooth ? 0.4 : 0
        }
      }
    }
  });

  showTableData(dataToShow);
}

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-19 12:09:03 
 * @Desc: Function to obtain the minutes 
 */

function timeToShow() {

  let minutes = [];

  for (let i = 1; i <= 60; i++)
    minutes.push(i);

  return minutes;
}

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-19 12:30:11 
 * @Desc: call to function to show data on the graphic
 */

typeGraph("Consumo", "Voltaje", "Corriente");
printChart();

// let urlApi = "http://localhost:1880";
let urlApi = "http://10.10.101.155:1880";
let myChart;
let _today = moment().year() + "-" + ( moment().month() < 10 ? "0" + (moment().month()+1) : moment().month()+1 ) + "-" + moment().date();
let _onlyMonth = moment().year() + "-" + ( moment().month() < 10 ? "0" + (moment().month()+1) : moment().month()+1 );

document.getElementById('dateInitial').value = _today;
document.getElementById('dateMonth').value = _onlyMonth;

// document.querySelectorAll('.showDate').forEach((val, index) => { val.innerText = _today; });

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
    // random = i + Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    random = i + Math.floor(Math.random() * (3 + 1)) + 1;
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
  
  let typeGraph = document.getElementById('graphSelector').value;

  let dateI;
  switch(typeGraph.toLowerCase()){

      case 'dia':
        dateI = document.getElementById('dateInitial').value;
        break;
      
      case 'mes':
        dateI = document.getElementById('dateMonth').value;
        break;
  }

  let dataReceived = await fetch(urlApi + '/obtainDataChart?dateI='+dateI+'&typeGraph='+typeGraph).then(json => json.json()).then(data => data);

  let dataToReturn = dataReceived.map(data => {

    return { dateFormated: typeGraph.toLowerCase() == 'dia' ? moment(data.DateAndTime).get('hour') : moment(data.DateAndTime).get('date') , value: data.consumoKW }
  });

  return timeToShow(typeGraph).map(timeLabel => {

    let temp = dataToReturn.filter(data => {

      if (data.dateFormated == timeLabel)
        return data.value;
    });

    return temp.length > 0 ? temp[0].value : 0;
  });
}

function typeGraph(...graphs) {

  for (let j = 0; j < graphs.length; j++) {

    let slctGraph = document.getElementById('graphSelector');
    var option = document.createElement("option");
    option.value = graphs[j];
    option.text = "Grafica por " + graphs[j];
    slctGraph.add(option);
  }
}

document.getElementById('btnBuscar').addEventListener('click', function () {

  myChart.destroy();
  printChart();
});

document.getElementById('graphSelector').addEventListener('change', function () {

  document.querySelectorAll('.datesGraph').forEach( (val, index) => { val.classList.toggle('hide') } );
});

let setDataPrinter = () => {

  document.querySelectorAll('.headerPrint div p.valuePrint').forEach((val, i) => {

    let value;
    let sel;
    switch(val.id){

      case 'tipoReporte':
        sel = document.querySelector('#graphSelector');
        value = sel.options[sel.selectedIndex].text;
        break;
  
      case 'fecha':
        sel = document.querySelector('#graphSelector');
        
        if(sel.value.toLowerCase() == 'dia')
          value = document.getElementById('dateInitial').value;
        else
          value = document.getElementById('dateMonth').value;
        break;
      
      case 'consumo':
        sel = document.querySelector('.totalsCard .cardBody');
        value = sel.querySelector('.kwh_Value').innerText + " " + sel.querySelector('.label_wh').innerText;
        break;
    }
  
    document.getElementById(val.id).innerText = value;
  });
}

async function printChart() {

  let dataToShow = await dataObtained();
  let typeGraph = document.getElementById('graphSelector').value;

  let typeLabel = typeGraph.toLowerCase() == 'dia' ? 'Hora' : 'Día' 

  let typeChart = 'line';
  let nameChart = 'KWh / ' + typeLabel;
  let smooth = false;
  let isFilled = false;
  const ctx = document.getElementById('energyChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: typeChart,
    data: {
      labels: timeToShow(typeGraph),
      datasets: [{
          label: nameChart,
          data: dataToShow,
          borderColor: 'rgba(56, 102, 242, 0.9)',
          backgroundColor: 'rgba(56, 102, 242, 0.7)',
          fill: isFilled,
          // stepped: 'after',
          // pointStyle: 'circle',
          pointRadius: 6,
          pointHoverRadius: 8
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
      // scales: {
      //   y: {
      //     beginAtZero: true
      //   }
      // },
      elements: {
        line: {
          tension: smooth ? 0.2 : 0
        }
      }
    }
  });

  showTableData(dataToShow, typeGraph, typeLabel);
  setDataPrinter();
}

let showTableData = (dataToShow, typeGraph, typeLabel) => {

  let totKwh = 0;
  let rows = "";

  switch(typeGraph.toLowerCase()){

    case 'dia':
      for (let i = 0; i < dataToShow.length; i++) {
        rows += "<tr><td>" + i + ":00</td><td>" + dataToShow[i].toLocaleString('en-US') + "</td></tr>";
        totKwh += dataToShow[i];
      }
      document.getElementsByClassName('label_wh')[0].innerText = "KWh"
      break;

    case 'mes':
      for (let i = 1; i <= dataToShow.length; i++) {
        rows += "<tr><td>" + i + "</td><td>" + dataToShow[i - 1].toLocaleString('en-US') + "</td></tr>";
        totKwh += dataToShow[i - 1];
      }
      totKwh = totKwh / 1000;
      document.getElementsByClassName('label_wh')[0].innerText = "MWh"
      break;
  }

  document.querySelectorAll('#tablaDesglose thead tr th')[0].innerText = typeLabel;

  document.getElementsByClassName('tblDesgloseBody')[0].innerHTML = rows;
  document.getElementsByClassName('kwh_Value')[0].innerHTML = totKwh.toLocaleString('en-US');
}
// END

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-19 12:09:03 
 * @Desc: Function to obtain the minutes 
 */

function timeToShow(typeGraph='dia') {

  let labels;

  switch (typeGraph.toLowerCase()) {
    case 'dia':
      labels = [];
      for (let i = 0; i < 24; i++)
      labels.push(i);
      break;
  
      case 'mes':
        labels =daysInMonth();
        break;
  }
  return labels;
}

let daysInMonth = () => {

  let di = document.getElementById('dateMonth').value + "-1";

  let dateSelected = new Date(di);

  var dt = new Date( dateSelected );

  // dt.getMonth() will return a month between 0 - 11
  // we add one to get to the last day of the month
  // so that when getDate() is called it will return the last day of the month
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();

  // this line does the magic (in collab with the lines above)
  var daysInMonth = new Date(year, month, 0).getDate();

  let daysArray = []
  for (var i = 1; i <= daysInMonth; i++) {

    daysArray.push(i);
  }

  return daysArray;
}

/** 
 * javascript comment 
 * @Author: Carlos Omar Anaya Barajas 
 * @Date: 2022-09-19 12:30:11 
 * @Desc: call to function to show data on the graphic
 */

typeGraph("Mes", "Dia");
printChart();

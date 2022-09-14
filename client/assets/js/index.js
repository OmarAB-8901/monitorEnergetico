let myChart;

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

// let graphSelector = document.getElementById('graphSelector');
// graphSelector.addEventListener('change', function (e) {
  
//   myChart.destroy();
//   printChart();
// });

let showTableData = () => {

   let rows = "";
   for(let i=0; i<=23; i++){
 
     rows += "<tr><td>"+ i +"</td><td>"+ Math.floor(Math.random() * (10 - 1 + 1)) + 1 +"</td></tr>";
   }
 
   document.getElementsByClassName('tblDesgloseBody')[0].innerHTML = rows;
   document.getElementsByClassName('kwh_Value')[0].innerHTML = (Math.floor(Math.random() * (100- 1 + 1)) + 1).toFixed(2);

  //  let tableCreated = document.querySelector('#tablaDesglose').DataTable();
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

  let diffdates = dateEnding.diff( dateInitial );

  return diffdates < 0 ? false : true;
};

let showErrorDates = () => {

  let errorDates = document.getElementsByClassName('errorDates')[0];
  errorDates.classList.toggle('show');

  setTimeout(() => {
    errorDates.classList.toggle('show');
  }, 7000);
}

document.getElementById('btnBuscar').addEventListener('click', function(){

  if(!compareDates()){
    
    showErrorDates();
    return;
  }

  myChart.destroy();
  printChart();
});

function printChart() {

  let typeChart = 'line';
  let nameChart = 'KWh / segundo';
  let smooth = true;
  let isFilled = false;
  const ctx = document.getElementById('energyChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: typeChart,
    data: {
      labels: getSeconds(),
      datasets: [{
          label: nameChart,
          data: randomValues(),
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

  showTableData();
}

typeGraph("Consumo", "Voltaje", "Corriente");
printChart();
const labels = document.getElementsByClassName('lblGraph');

for (let i = 0; i < labels.length; i++) {

  labels[i].addEventListener('click', function (e) {

    document.getElementsByClassName('inputGraph')[i].focus();
  });
}

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

  for (let i = 1; i <= 60; i++) {
    secondLabels.push(i);
  }

  return secondLabels;
};

let randomValues = () => {

  let values = [];
  let random;

  for (let i = 1; i <= 60; i++) {
    // random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    random = i + Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    // random =  i + Math.floor(Math.random() * (i - 1 + 1)) + 1;
    // random = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    values.push(random);
  }

  return values;
}

let myChart;
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
}

typeGraph("Consumo", "Voltaje", "Corriente");
printChart();

let rows = "";
for(let i=1; i<=10; i++){

  rows += "<tr><td>"+ i +"</td><td>"+ Math.floor(Math.random() * (7 - 1 + 1)) + 1 +"</td></tr>";
}

document.getElementsByClassName('tblDesgloseBody')[0].innerHTML = rows;

let graphSelector = document.getElementById('graphSelector');
graphSelector.addEventListener('change', function (e) {

  console.log( graphSelector.value );
  myChart.destroy();
  printChart();
});
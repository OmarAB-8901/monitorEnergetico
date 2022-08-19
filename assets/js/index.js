const labels = document.getElementsByClassName('lblGraph');

for(let i=0; i<labels.length; i++){

  labels[i].addEventListener('click', function(e) {

    document.getElementsByClassName('inputGraph')[i].focus();
  });
}

function typeGraph(...graphs){
  
  for(let j=0; j<graphs.length; j++){

    let slctGraph = document.getElementById('graphSelector');
    var option = document.createElement("option");
    option.value = graphs[j];
    option.text = "Grafica de "+graphs[j];
    slctGraph.add(option);
  }
}

let smooth = true;
const ctx = document.getElementById('energyChart').getContext('2d');

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Data Prueba',
          data:  [12, 19, 3, 15, 2, 13],
          borderColor: 'rgba(254, 22, 28, 1)',
          backgroundColor: 'rgba(254, 22, 28, 0.5)',
          // fill: true,
        },
        {
          label: 'Dataset Prueba',
          data:  [16, 2, 9, 11, 7, 5],
          borderColor: 'rgba(31, 52, 245, 1)',
          backgroundColor: 'rgba(31, 52, 245, 0.5)',
          // fill: true,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        elements:{
          line:{
            tension: smooth ? 0.4 : 0
          }
        }
    }
});

typeGraph("Consumo", "Voltaje", "Corriente");
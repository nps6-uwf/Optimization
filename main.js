// 0) Closed Interval Logic
function coeff_keyup() {

    var cA = parseFloat(document.querySelector("#coeff-A").value),
    cB = parseFloat(document.querySelector("#coeff-B").value)
    cC = parseFloat(document.querySelector("#coeff-C").value)
    cD = parseFloat(document.querySelector("#coeff-D").value),
    A = parseFloat(document.querySelector("#intv-A").value),
    B = parseFloat(document.querySelector("#intv-B").value);

    cA = isNaN(cA)? 0 : cA;
    cB = isNaN(cB)? 0 : cB;
    cC = isNaN(cC)? 0 : cC;
    cD = isNaN(cD)? 0 : cD;

    var func = function (x, A = 0, B = 0, C = 0, D = 0) {
        return A * Math.pow(x, 3) + A * Math.pow(x, 2) + C * x + D 
    };

    var criticalPoints = [
        A,
        B
    ];

    Array.from(document.querySelectorAll(".cia-fprime")).forEach(function(val, idx){
        var res = "";
        if (cA !== 0) {
            res += (String(cA * 3) + "x&sup2;");
            // case1) X's: Quadratic
            var discrim = ((2*cB * 2*cB) - 4 * (cA * 3) * cC), x1 = void(0), x2 = void(0);
            console.log("discrim: ", discrim);
            if (discrim === 0) {
                console.log("1 real")
                // 1 real root
                x1 = -2*cB + Math.sqrt(discrim)/ 2*(cA*3);
                x2 = x1;
                document.querySelector(".poly-res").innerHTML = `x = ${x1}`;
                if (idx === 0) {
                    criticalPoints.push(x1);
                }
                

            } else if (discrim > 0) {
                console.log("2 real")
                // 2 real roots
                x1 = -2*cB + Math.sqrt(discrim)/ 2*3*cA;
                x2 = -2*cB - Math.sqrt(discrim)/ 2*3*cA;
                document.querySelector(".poly-res").innerHTML = `x = ${x1}, x= ${x2}`;
                if (idx === 0) {
                    criticalPoints.push(x1);
                    criticalPoints.push(x2);
                }
            } else {
                console.log("no real")
                // no real roots
                x1 = void(0), x2 = void(0)
                document.querySelector(".poly-res").innerHTML = "x = undefined, x = undefined";
            }
        }

        if (cB !== 0) {
            if (cA === 0){
                res += (String(cB * 2) + "x");
                // case2) X's: Linear
                document.querySelector(".poly-res").innerHTML = `x = ${-cC/(cB*2)}`;
                if (idx === 0) {
                    criticalPoints.push(-cC/(cB*2));
                }
                
            } else {
                res += (" + " + String(cB * 2) + "x");
            }
        }
        if (cC !== 0) {
            if (cA === 0 && cB === 0){
                res += (String(cC));
                // case1) X's: None
                document.querySelector(".poly-res").innerHTML = "";
            } else {
                res += (" + " + String(cC)); 
            }
        }
        val.innerHTML = res;
    });
    Array.from(document.querySelector("#critical-value-table tbody").rows).forEach(function(tr, idx){
        if (idx > 0) {
            document.querySelector("#critical-value-table tbody").removeChild(tr);
        }
    });

    var c_max = -Infinity, fc_max = -Infinity, c_min = Infinity, fc_min = Infinity;
    criticalPoints.forEach(function(c, idx){
        var tr = document.createElement("tr");
        var td_cv = document.createElement("td");
        tr.appendChild(td_cv);
        td_cv.innerHTML = c;
        var td_fcv = document.createElement("td");
        td_fcv.innerHTML = func(c, cA, cB, cC, cD);
        tr.appendChild(td_fcv);
        var td_wiv = document.createElement("td");
        tr.appendChild(td_wiv);
        td_wiv.innerHTML = c >= A && c <= B;
        var td_extrema = document.createElement("td");
        td_extrema.id = "c" + idx;
        tr.appendChild(td_extrema);
        document.querySelector("#critical-value-table tbody").appendChild(tr);
        if (c >= A && c <= B) {
            var fc = func(c, cA, cB, cC, cD);
            if (fc > fc_max) {
                c_max = "c" + idx; fc_max = fc;
            } 
            if (fc < fc_min) {
                c_min = "c" + idx; fc_min = fc;
            } 
        }
    });
    document.getElementById(c_min).innerHTML = "Absolute Minimum";
    document.getElementById(c_max).innerHTML = "Absolute Maximum";
};
Array.from(document.querySelectorAll(".update-coeff")).concat(Array.from(document.querySelectorAll(".update-intv"))).forEach(function(inp){
    inp.onkeyup = coeff_keyup;
});



// 1) Chart Logic
// Hide legend: chart.js
// Chart.defaults.global.legend.display = false; 

// Helpers:
const linespace = (min, max, n, force_int = false) => {
    // min = lowest value in return array
    // Build the domain for some function
    const step = (max - min)/ n;
    var arr = [];
    for (let i = 0; i < n; ++i) {
        arr.push( force_int ? Math.floor(min + step * i) : min + step * i);
    }
    return arr;
}

// Figure 1:
var cnv = document.getElementById('figure1');
var ctx = cnv.getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "scatter",
    
    // The data for our dataset
    data: {
        
        datasets: [{
            // absolute maxima/ minima
            label: "Absolute",
            backgroundColor: 'rgb(255, 255, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                x: 3,
                y: 20
            }, {
                x: 5,
                y: -10
            }],
            fill: false,
            showLine: false
        },{
            // local maxima/ minima
            label: "Local",
            backgroundColor: 'rgb(0, 0, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                x: -5,
                y: -5
            }, {
                x: 0.75,
                y: 1.5
            }, {
                x: -2.8,
                y: 10
            }],
            fill: false,
            showLine: false
        },{
            label: "f",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{x:-5,y:-5}, {x: -3, y: 10}, {x: 1, y: 2}, {x: 3, y: 20}, {x: 5, y: -10}],
            fill: false,
            showLine: true,
            pointRadius: 0,
        }]
    },

    // Configuration options go here
    options: {

        hover: {
            mode: 'point'
        }
    }
});


// Figure 2:
var cnv = document.getElementById('figure2');
var ctx = cnv.getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "scatter",
    
    // The data for our dataset
    data: {
        
        datasets: [{
            // absolute maxima
            label: "Abs max",
            backgroundColor: 'rgb(255, 255, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [ {
                x: 2,
                y: 0
            }],
            fill: false,
            showLine: false
        },{
            // absolute minima
            label: "Abs Min",
            backgroundColor: 'rgb(0, 0, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                x: 0,
                y: -4
            }, {
                x: 4,
                y: -4
            }],
            fill: false,
            showLine: false
        },{
            label: "f",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{x:0,y:-4}, {x:2, y: 0}, {x:4, y: -4}],
            fill: false,
            showLine: true,
            pointRadius: 0,
        }]
    },

    // Configuration options go here
    options: {

        hover: {
            mode: 'point'
        }
    }
});

// Custom legend click behavior
var legendClick = Chart.defaults.global.legend.onClick;
Chart.defaults.global.legend.onClick = function(e, legendItem) {
    console.log(legendItem);
    legendClick.call(this, e, legendItem);
};
var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
var newLegendClickHandler = function (e, legendItem) {
    var index = legendItem.datasetIndex;
    alert(index)
    if (index < 2) {
        alert("if")
        // Do the original logic
        defaultLegendClickHandler(e, legendItem);
    } else {
        let ci = this.chart;
        [
            ci.getDatasetMeta(2),
            ci.getDatasetMeta(3)
        ].forEach(function(meta) {
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
        });
        ci.update();
    }
};

// Figure 3:
var cnv = document.getElementById('figure3');
var ctx = cnv.getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "scatter",
    
    // The data for our dataset
    data: {
        
        datasets: [{
            // holes
            label: "Holes",
            backgroundColor: '#fff',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                x: 0,
                y: 6
            }],
            fill: false,
            showLine: false
        },{
            // Minima
            label: "Minima",
            backgroundColor: 'rgb(0, 0, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                x: -2,
                y: -1
            }, {
                x: 4,
                y: 1.7
            }],
            fill: false,
            showLine: false
        },{
            label: "f",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{x:-2,y:-1}, {x: -1, y: 2}, {x: 0, y: 6}],
            fill: false,
            showLine: true,
            pointRadius: 0,
        },{
            label: "f*",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{x:0,y:5}, {x: 3, y: 3.5}, {x: 4, y: 1.7}],
            fill: false,
            showLine: true,
            pointRadius: 0,
        }]
    },

    
    // Configuration options go here
    options: {

        hover: {
            mode: 'point'
        },
        legend: {
            labels: {
                filter: function(item, chart) {
                    // Logic to remove a particular legend item goes here
                    return !item.text.includes('f*');
                }
            },
            onClick: newLegendClickHandler
        }
    }
});

// N) Stuff that happens when window loads
window.onload = () => {
    coeff_keyup(); // trigger this so closed interval algorithm starts.
}
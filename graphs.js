var lcid_colors = ["#242A33","#505F73","#283D3B","#197278","#EDDDD4","#D6BCB4","#AB5B24","#DE752F","#C44536","#772E25"]

// SUNBURST PLOT

d3.csv('sunburst_data_labelparentid.csv', 
function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }
    
    var data = [
        {
            type: "sunburst",
            maxdepth: 3,
            labels: unpack(rows, 'labels'),
            parents: unpack(rows, 'parents'),
            values: unpack(rows, 'values'),
            ids: unpack(rows, 'ids'),
            textposition: 'inside',
            insidetextorientation: 'radial',
            branchvalues: "total",
            hovertemplate: '<b>Label%{label} </b> <br> Parent: %{parent}<br> Measures: %{value}'
        }
    ];

    var layout = {
        margin: {l: 0, r: 0, b: 0, t:0},
        height: 500,
        sunburstcolorway:[
            "#636efa","#EF553B","#00cc96","#ab63fa","#19d3f3",
            "#e763fa", "#FECB52"
        ],
        extendsunburstcolorway: true
    };
    Plotly.newPlot('sunburst', data, layout, {showSendToCloud: true});
}
)

// SCATTER PLOTS

var short_names = {
    'social_competence': ["dictator","donating-money","donating-stickers","pcg","pcg-owl","pcg-stories","sally-ann","self","etch-tsi","fmri-pcg","fmri-self","ftq","icu","iri","mychild-emp","mychild-guilt","mychild-ic","obvq","sdq","seq","sev","srs"],
    'parenting': ["sbs","do","dodont","dont","etch","eveningmeal","familygame","fit","freeplay","alabama","dailyhassles","paq","ppq","pps","ps"],
    'neurobiological_and_physiological_measures': ["eeg","mri","eartemperature","hair-hormones","saliva-ch","saliva-p","sleep-act","zygosity-dna","hair-quest","pds","zygosity-quest","skin-conductance"],
    'family_background_measures': ["atq","bsi","demographics","ethnicity","fad","fam-bg","ims","lifeevents","pregnancy"],
    'environmental_factors': ["dsa","lena","chaos-obs","chaos","id","routine"],
    'differential_susceptibility_markers': ["music-task","gen-markers","bam","cbq-dfp","eatq-dfp","tmcq-dfp"],
    'behavioral_control': ["cheating-ball","cheating-dog","cheating-word","dd-candy","dd-marshmallow","dd-money","snat","snat-ec","snat-stories","stop-arrows","stop-cars","eeg-snat-ec","fmri-snat","bisbas","cbq-ec","cerq-short","drpi","eatq-ec","tmcq-ec"],
    'additional_measures': ["anthropometrics","reading","wisc","wppsi","as3cq","cbsa","cito","fne","hscs","online-acts","osa","pandemic","pss","sleep-quest","sm","socialcontact","socw","twin-diff-soc","vas","wildman"],
}



var categories = Object.keys(short_names);

categories.forEach(function (category) {
    createFig(category)
});

function createFig(category) {
d3.csv('measure_data/' + category + '.csv', 
function(err, rows){
    var N_shortnames = short_names[category].length;
    var data = [];
    for (var i=0; i<rows.length; i++) {
        var row = Object.values(rows[i]);
        row = row.map(function(val, i) {
            val = parseInt(val, 10); 
            return val === 0 ? null : val;
        });
        trace = {
            y: row,
            mode: 'lines+markers',
            type: 'scatter',
            line: {
                width: 3,
                color: lcid_colors[categories.indexOf(category)+1],
            },
            marker: {
                size: 12,
                linewidth: 0,
                symbol: 'square' 
            },
            connectgaps: true,
            showlegend: false,
            hovertemplate: '<b>%{x}<br>%{y}</b>' +
                            '<extra></extra>'
        }
        data.push(trace);
    }

    var layout = {
        margin: {l: 150, r: 0, b: 0, t:60},
        hovermode: 'closest',
        height: 500,
        xaxis: {
            showgrid: true,
            gridwidth: 1,
            gridcolor: lcid_colors[4],
            zeroline: false,
            range: [-0.5, 6.5],
            showline: false,
            side: 'top',
            showticklabels: true,
            tickvals:[0,1,2,3,4,5],
            ticktext:['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4', 'Wave 5', 'Wave 6'],
            tickangle: -45,
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showline: false,
            tickvals: Array.from({length: N_shortnames}, (_, j) => j + 1),
            ticktext: short_names[category].reverse(),
            range: [0, N_shortnames+1]
        },
    };
    Plotly.newPlot(category, data, layout, {showSendToCloud: true});
});
}




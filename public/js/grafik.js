



var myDataviz = document.getElementById('my_dataviz')
var datestart = document.getElementById("datestart")
var datefinis = document.getElementById("datefinis")
var btn = document.getElementById('btn')
let SEHİRnew = document.getElementById('SEHİRnew');
let ILCEnew = document.getElementById('ILCEnew');
let istasyonnew = document.getElementById('istasyonnew');

var en = document.getElementById('en');
var boy = document.getElementById('boy');

function showLoading() {
  d3.select("#loading").style("display", "block");
}

function hideLoading() {
  d3.select("#loading").style("display", "none");
}



let sehirarray = [];
let ilcearray = [];
let sonarray= [];
var usersRef = db.collection('İstasyon').get()
usersRef.then((snapshot) => {
  snapshot.docs.forEach(doc => {
  
      var x = doc.data().kod.split("_")
   

    if(!sehirarray.includes(x[0])) {
            
        var option = document.createElement('option');
        option.value = x[0];
        option.text = x[0];
        SEHİRnew.appendChild(option);
        sehirarray.push(x[0]);
        
    }
    SEHİRnew.addEventListener('change',()=>{
       sonarray = [];
        if(SEHİRnew.value==x[0]){
            if(!ilcearray.includes(x[1])) {
            var option = document.createElement('option');
            option.value = x[1];
            option.text = x[1];
            ILCEnew.appendChild(option);
            ilcearray.push(x[1]);
        }

        } 

   })

      ILCEnew.addEventListener('change',()=>{
      
       
        if(ILCEnew.value==x[1]){
            
            var option = document.createElement('option');
            option.value = x[2];
            option.text = x[2];
            istasyonnew.appendChild(option);
          
           
           
        }
        else if(ILCEnew.value == 'Hepsi'){
            if(SEHİRnew.value == x[0]){

                sonarray.push(x)

            }
        }

      }) 
       
    

    });


});


ILCEnew.addEventListener('change',()=>{
    istasyonnew.innerHTML=""


})
SEHİRnew.addEventListener('change',()=>{
    ilcearray = []
    ILCEnew.innerHTML=""
    istasyonnew.innerHTML=""
   
    var option = document.createElement('option');
    option.value = 'Hepsi';
    option.text = 'Hepsi';
    ILCEnew.appendChild(option);

})







btn.addEventListener('click', function (eventt) {
  eventt.preventDefault()
  myDataviz.innerHTML = "";
  var En = Number(en.value) || 1200;
  var Boy = Number(boy.value) || 500;
  var margin = { top: 50, right: 30, bottom: 40, left: 50 },
    width = En - margin.left - margin.right,
    height = Boy - margin.top - margin.bottom;


  var margin2 = { top: 10, right: 30, bottom: 50, left: 50 },
    width2 = En - margin2.left - margin2.right,
    height2 = 150 - margin2.top - margin2.bottom;



  var dateStart = datestart.value
  var dateFinis = datefinis.value

  var dateStart = dateStart.replace("T", "-").replace(":", "-");
  var dateFinis = dateFinis.replace("T", "-").replace(":", "-");









  if(ILCEnew.value != 'Hepsi'){
var hepsinot = `${SEHİRnew.value}_${ILCEnew.value}_${istasyonnew.value}_PROB`
    
 

    var svg = d3.select("#my_dataviz")
      .append("svg")

    const brush = d3.select("#my_dataviz")
      .append("svg")

    const g = svg.append('g')
    const g1 = brush.append('g')
    const yAxisGroup = g.append("g")
    const xAxisGroup = g.append("g")
    const yAxisGroup1 = g1.append("g");
    const xAxisGroup1 = g1.append("g")
    const lineGroup = g.append("path")
    const lineGroup1 = g1.append("path");
    const brushGroup = g1.append("g")


    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    brush
      .attr("width", width2 + margin2.left + margin2.right)
      .attr("height", height2 + margin2.top + margin2.bottom);


    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g1.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var x1 = d3.scaleTime().range([0, width2]);
    var y1 = d3.scaleLinear().range([height2, 0]);


    var x = d3.scaleTime().range([0, width])
    var y = d3.scaleLinear().range([height, 0]);


    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const xAxis1 = d3.axisBottom(x1);
    const yAxis1 = d3.axisLeft(y1);

    xAxisGroup.attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")

    xAxisGroup1.attr("class", "grid")
      .attr("transform", "translate(0," + height2 + ")");

    brushGroup.attr("class", "brush")

    const bisectDate = d3.bisector(d => d.gelenzaman).left

    const parseTime = d3.timeParse("%Y-%m-%d-%H-%M-%S");

    g.append("text")
      .text(hepsinot)
      .attr('class', 'baslikd3')
      .attr('x', 60)
      .attr('y', -30)

    db.collection(hepsinot).where('gelenzaman', '>', dateStart).where('gelenzaman', '<', dateFinis).get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        d.gelenzaman = parseTime(d.gelenzaman);
        d.propverisi = d.propverisi;
        return d;
      });

      brushGroup.call(d3.brushX()
        .extent([[0, 0], [width2, height2]])
        .on("brush", brushed));

      const line = d3.line()
        .curve(d3.curveNatural)
        .x(d => x1(d.gelenzaman))
        .y(d => y1(d.propverisi));

      x.domain(d3.extent(data, d => d.gelenzaman))
      y.domain([d3.min(data, d => d.propverisi) - 100, d3.max(data, d => d.propverisi) + 100])
      x1.domain(d3.extent(data, d => d.gelenzaman));
      y1.domain([d3.min(data, d => d.propverisi) - 100, d3.max(data, d => d.propverisi) + 100]);

      //         //!!Bold ====
      xAxisGroup.call(xAxis
        .ticks(13)
        .tickSize(-height))
        .selectAll("text")
        .attr('class', 'xlabel')
        .attr("y", "10")
        .attr("x", "-5")

      yAxisGroup.call(yAxis
        .ticks(14)
        .tickSize(-width)
      )
        .selectAll("text")
        .attr('class', 'yaxiss')

      lineGroup.datum(data)
        .attr("fill", "none")
        .attr("stroke", "dodgerblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .curve(d3.curveNatural)
          .x(d => x(d.gelenzaman))
          .y(d => y(d.propverisi)))


      xAxisGroup1.call(xAxis1
        .ticks(14)
        .tickSize(-height2))
        .selectAll("text")
        .attr('class', 'xlabel')
        .attr("y", "10")
        .attr("x", "-5");

      yAxisGroup1.call(yAxis1
        .ticks(3)
        .tickSize(-width2)
      )
        .selectAll("text")
        .attr('class', 'yaxis');

      lineGroup1.datum(data)
        .attr("fill", "none")
        .attr("stroke", "dodgerblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);


      const focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none")

      focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height)

      focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width)

      focus.append("circle")
        .attr("r", 7.5)

      const te = focus.append('foreignObject')
        .attr('width', 200)
        .attr('height', 200)

        .attr('y', -30)
      te
        .append('xhtml:div')
        .attr('class', 'simar')
      svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)

        .on("mouseover", function () {
          focus.style("display", null);
        })

        .on("mouseout", function () {
          focus.style("display", "none");
        })

        .on("mousemove", function () {
          const coords = d3.pointer(event, this);
          const x0 = x.invert(coords[0]);
          const i = bisectDate(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          const d = x0 - d0.gelenzaman > d1.gelenzaman - x0 ? d1 : d0;
          focus.attr("transform", `translate(${x(d.gelenzaman)}, ${y(d.propverisi)})`);
          var date = new Date(d.gelenzaman)
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hour = date.getHours();
          const minute = date.getMinutes();
          const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
          te.select('.simar')
            .html(`<span>Date</span><strong class="detayd">: ${formattedDate}</strong>  <br><span>Prop Data:</span> <strong class="detayp">${d.propverisi}</strong>`)
          if (coords[0] > width / 1.18) {
            te.attr('x', -215)
              .attr('y', 55)
              .style('text-align', 'right');
          } else {
            te.attr('x', 15)
              .attr('y', -30)
              .style('text-align', 'left');
          }

          focus.select(".x-hover-line").attr("y2", height - y(d.propverisi));
          focus.select(".y-hover-line").attr("x2", -x(d.gelenzaman));
});
      hideLoading();

      function brushed(event) {
        const selection = event.selection;
        if (selection) {

          const [x0, x1End] = event.selection;

          const selectedData = data.filter(d => {
            const x = x1(d.gelenzaman);
            return x >= selection[0] && x <= selection[1];
          });
          // console.log(selectedData);

          x.domain(d3.extent(selectedData, d => d.gelenzaman));
          y.domain([d3.min(selectedData, d => d.propverisi) - 100, d3.max(selectedData, d => d.propverisi) + 100])
          xAxisGroup.call(xAxis
            .ticks(13)
            .tickSize(-height))
            .selectAll("text")
            .attr('class', 'xlabel')
            .attr("y", "10")
            .attr("x", "-5")

          yAxisGroup.call(yAxis
            .ticks(14)
            .tickSize(-width)
          )
            .selectAll("text")
            .attr('class', 'yaxiss')
          lineGroup.datum(selectedData)
            .attr("fill", "none")
            .attr("stroke", "dodgerblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .curve(d3.curveNatural)
              .x(d => x(d.gelenzaman))
              .y(d => y(d.propverisi)))


        }
      }


    });
  }



  if(ILCEnew.value == 'Hepsi'){
    sonarray.forEach(e => {
        var hepsideger = `${e[0]}_${e[1]}_${e[2]}_PROB`;
   
  

   
  

        var svg = d3.select("#my_dataviz")
          .append("svg")

        const brush = d3.select("#my_dataviz")
          .append("svg")

        const g = svg.append('g')
        const g1 = brush.append('g')
        const yAxisGroup = g.append("g")
        const xAxisGroup = g.append("g")
        const yAxisGroup1 = g1.append("g");
        const xAxisGroup1 = g1.append("g")
        const lineGroup = g.append("path")
        const lineGroup1 = g1.append("path");
        const brushGroup = g1.append("g")


        svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)

        brush
          .attr("width", width2 + margin2.left + margin2.right)
          .attr("height", height2 + margin2.top + margin2.bottom);


        g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g1.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var x1 = d3.scaleTime().range([0, width2]);
        var y1 = d3.scaleLinear().range([height2, 0]);


        var x = d3.scaleTime().range([0, width])
        var y = d3.scaleLinear().range([height, 0]);


        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        const xAxis1 = d3.axisBottom(x1);
        const yAxis1 = d3.axisLeft(y1);

        xAxisGroup.attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")

        xAxisGroup1.attr("class", "grid")
          .attr("transform", "translate(0," + height2 + ")");

        brushGroup.attr("class", "brush")

        const bisectDate = d3.bisector(d => d.gelenzaman).left

        const parseTime = d3.timeParse("%Y-%m-%d-%H-%M-%S");

        g.append("text")
          .text(hepsideger)
          .attr('class', 'baslikd3')
          .attr('x', 60)
          .attr('y', -30)

        db.collection(hepsideger).where('gelenzaman', '>', dateStart).where('gelenzaman', '<', dateFinis).get().then((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const d = doc.data();
            d.gelenzaman = parseTime(d.gelenzaman);
            d.propverisi = d.propverisi;
            return d;
          });
          brushGroup.call(d3.brushX()
            .extent([[0, 0], [width2, height2]])
            .on("brush", brushed));

          const line = d3.line()
            .curve(d3.curveNatural)
            .x(d => x1(d.gelenzaman))
            .y(d => y1(d.propverisi));

          x.domain(d3.extent(data, d => d.gelenzaman))
          y.domain([d3.min(data, d => d.propverisi) - 100, d3.max(data, d => d.propverisi) + 100])
          x1.domain(d3.extent(data, d => d.gelenzaman));
          y1.domain([d3.min(data, d => d.propverisi) - 100, d3.max(data, d => d.propverisi) + 100]);

          //         //!!Bold ====
          xAxisGroup.call(xAxis
            .ticks(13)
            .tickSize(-height))
            .selectAll("text")
            .attr('class', 'xlabel')
            .attr("y", "10")
            .attr("x", "-5")

          yAxisGroup.call(yAxis
            .ticks(14)
            .tickSize(-width)
          )
            .selectAll("text")
            .attr('class', 'yaxiss')

          lineGroup.datum(data)
            .attr("fill", "none")
            .attr("stroke", "dodgerblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .curve(d3.curveNatural)
              .x(d => x(d.gelenzaman))
              .y(d => y(d.propverisi)))


          xAxisGroup1.call(xAxis1
            .ticks(14)
            .tickSize(-height2))
            .selectAll("text")
            .attr('class', 'xlabel')
            .attr("y", "10")
            .attr("x", "-5");

          yAxisGroup1.call(yAxis1
            .ticks(3)
            .tickSize(-width2)
          )
            .selectAll("text")
            .attr('class', 'yaxis');

          lineGroup1.datum(data)
            .attr("fill", "none")
            .attr("stroke", "dodgerblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);


          const focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none")

          focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height)

          focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0)
            .attr("x2", width)

          focus.append("circle")
            .attr("r", 7.5)

          const te = focus.append('foreignObject')
            .attr('width', 200)
            .attr('height', 200)

            .attr('y', -30)
          te
            .append('xhtml:div')
            .attr('class', 'simar')
          svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)

            .on("mouseover", function () {
              focus.style("display", null);
            })

            .on("mouseout", function () {
              focus.style("display", "none");
            })

            .on("mousemove", function () {
              const coords = d3.pointer(event, this);
              const x0 = x.invert(coords[0]);
              const i = bisectDate(data, x0, 1);
              const d0 = data[i - 1];
              const d1 = data[i];
              const d = x0 - d0.gelenzaman > d1.gelenzaman - x0 ? d1 : d0;
              focus.attr("transform", `translate(${x(d.gelenzaman)}, ${y(d.propverisi)})`);
              var date = new Date(d.gelenzaman)
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const hour = date.getHours();
              const minute = date.getMinutes();
              const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
              te.select('.simar')
                .html(`<span>Date</span><strong class="detayd">: ${formattedDate}</strong>  <br><span>Prop Data:</span> <strong class="detayp">${d.propverisi}</strong>`)
              if (coords[0] > width / 1.18) {
                te.attr('x', -215)
                  .attr('y', 55)
                  .style('text-align', 'right');
              } else {
                te.attr('x', 15)
                  .attr('y', -30)
                  .style('text-align', 'left');
              }

              focus.select(".x-hover-line").attr("y2", height - y(d.propverisi));
              focus.select(".y-hover-line").attr("x2", -x(d.gelenzaman));




            });
          hideLoading();

          function brushed(event) {
            const selection = event.selection;
            if (selection) {

              const [x0, x1End] = event.selection;

              const selectedData = data.filter(d => {
                const x = x1(d.gelenzaman);
                return x >= selection[0] && x <= selection[1];
              });
              // console.log(selectedData);

              x.domain(d3.extent(selectedData, d => d.gelenzaman));
              y.domain([d3.min(selectedData, d => d.propverisi) - 100, d3.max(selectedData, d => d.propverisi) + 100])
              xAxisGroup.call(xAxis
                .ticks(13)
                .tickSize(-height))
                .selectAll("text")
                .attr('class', 'xlabel')
                .attr("y", "10")
                .attr("x", "-5")

              yAxisGroup.call(yAxis
                .ticks(14)
                .tickSize(-width)
              )
                .selectAll("text")
                .attr('class', 'yaxiss')
              lineGroup.datum(selectedData)
                .attr("fill", "none")
                .attr("stroke", "dodgerblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                  .curve(d3.curveNatural)
                  .x(d => x(d.gelenzaman))
                  .y(d => y(d.propverisi)))


            }
          }


      



    })
  });
  }
  showLoading();
})
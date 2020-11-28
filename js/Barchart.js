function drawBarChart(data) {
    let div = d3.select('#right_panel')
    let svgWidth = $('#right_panel').width()
    let svgHeight = $('#right_panel').height()
    let padding = {
        'left': 0.1 * svgWidth,
        'right': 0.1 * svgWidth,
        'top': 0.1 * svgHeight,
        'bottom': 0.1 * svgHeight
    }
    let svg = div.append('svg')
        .attr('id', 'barSvg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')

    let x_attr = "district"
    let y_attr = "popularity"

    x_array = get_array(data, x_attr)
    y_array = buildData(data, x_attr, x_array, y_attr);

    let x = d3.scaleBand()
        .domain(x_array)
        .range([padding.left, svgWidth - padding.right]);
    let axis_x = d3.axisBottom()
        .scale(x)
        .ticks(x_array.length)
        .tickFormat(d => d);

    let y = d3.scaleLinear()
        .domain([0, d3.max(y_array)])
        .range([svgHeight - padding.bottom, padding.top]);
    let axis_y = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(d => d);

    svg.append('g')
        .attr('transform', `translate(${0}, ${svgHeight-padding.bottom})`)
        .call(axis_x)
        .attr('font-size', '0.5rem')

    svg.append('g')
        .attr('transform', `translate(${padding.left+(svgWidth-padding.left-padding.right)/2}, ${svgHeight-padding.bottom})`)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dx', '-0.4rem')
        .attr('dy', 0.08 * svgHeight)
        .text(x_attr);

    svg.append('g')
        .attr('transform', `translate(${padding.left}, ${0})`)
        .call(axis_y)
        .attr('font-size', '0.5rem')
    svg.append('g')
        .attr('transform', `
            translate(${padding.left}, ${svgHeight/2})
            rotate(-90)    
        `)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dy', -svgHeight * 0.07)
        .text(y_attr + " (10,000 people)");

    // svg.on('click', function() {
    //     d3.selectAll('.rect')
    //         .classed('active', true)
    //         .classed('hidden', false)
    //    	linkingSelect();
    // })

    svg.append('g')
        .selectAll('rect')
        .data(y_array)
        .enter()
        .append('rect')
        .attr('class', function(d, i) {
            return x_array[i] + ' rect ' + 'basepart'
        })
        .classed('active', true)
        .attr('x', function(d, i) {
            return x(x_array[i]) + x.bandwidth() / 4
        })
        .attr('y', function(d, i) {
            return y(d)
        })
        .attr('width', x.bandwidth() / 2)
        .attr('height', d => (y(0) - y(d)))
        .attr('fill', '#B1BDC5')
        .attr('stroke', 'none')
        .attr('stroke-width', 2)
        .on('mouseover', function(d, i) {
            // d3.select(this)
            //     .attr('stroke', '#ff6a33')
            linkingHover('.point', '.' + x_array[i])
        })
        .on('mouseout', function(d, i) {
            // d3.select(this)
            //     .attr('stroke', 'none')
            Renew();
        })
        .on('click', function(d, i) {
            // if(d3.select(this).classed('active')){
            // 	d3.selectAll('.rect.'+x_array[i])
            // 		.classed('active', false)
            // 		.classed('hidden', true)
            // } else {
            // 	d3.selectAll('.rect.'+x_array[i])
            // 		.classed('active', true)
            // 		.classed('hidden', false)
            // }
            if (d3.selectAll('.rect.active')._groups[0].length == 1 && d3.select(this).classed('active')) {
                d3.selectAll('.rect.basepart')
                    .classed('active', true)
            } else {
                d3.selectAll('.rect.basepart')
                    .classed('active', false)
                d3.select('.rect.' + x_array[i] +'.basepart')
                    .classed('active', true)
            }
            linkingSelect('rect')
        })

    svg.append('g')
        .selectAll('rect')
        .data(y_array)
        .enter()
        .append('rect')
        .attr('class', function(d, i) {
            return x_array[i] + ' rect ' + 'highpart'
        })
        .attr('x', function(d, i) {
            return x(x_array[i]) + x.bandwidth() / 4
        })
        .attr('y', function(d, i) {
            return y(d)
        })
        .attr('width', x.bandwidth() / 2)
        // .attr('height', d => (y(0) - y(d)))
        .attr('height', 0)
        .attr('fill', '#B1BDC5')
        .attr('stroke', 'none')
        // .attr('stroke-width', 1)
        .on('mouseover', function(d, i) {
            // d3.select('.rect.' + x_array[i] + '.basepart')
            //     .attr('stroke', '#ff6a33')
            linkingHover('.point', '.' + x_array[i])
        })
        .on('mouseout', function(d, i) {
            // d3.select('.rect.' + x_array[i] + '.basepart')
            //     .attr('stroke', 'none')
            Renew();
        })
        .on('click', function(d, i) {
            // if (d3.select('.rect.' + x_array[i]).classed('active')) {
            //     d3.selectAll('.rect.' + x_array[i])
            //         .classed('active', false)
            //         .classed('hidden', true)
            // } else {
            //     d3.selectAll('.rect.' + x_array[i])
            //         .classed('active', true)
            //         .classed('hidden', false)
            // }
            if (d3.selectAll('.rect.active')._groups[0].length == 1 && d3.select('.rect.'+x_array[i]+'.basepart').classed('active')) {
                d3.selectAll('.rect.basepart')
                    .classed('active', true)
            } else {
                d3.selectAll('.basepart')
                    .classed('active', false)
                d3.select('.' + x_array[i]+'.basepart')
                    .classed('active', true)
            }
            linkingSelect('rect')
        })

    svg.append('rect')
        .attr('class', 'hoverpart')
        .attr('fill', 'transparent')
        .attr('stroke', '#ff6a33')
        .attr('stroke-width', 2)
        .style('opacity', 1)

}

function get_array(data, attr) {
    let ret = {};
    data.forEach(d => {
        let temp = d[attr]
        if (ret[temp])
            ret[temp] += 1
        ret[temp] = 1
    })
    return Object.keys(ret);
}

function buildData(data, x_attr, x_array, y_attr) {
    let ret = [];
    let temp = 0;
    for (let i = 0; i < x_array.length; i++) {
        temp = 0;
        data.forEach(d => {
            if (d[x_attr] == x_array[i]) {
                temp += parseFloat(d[y_attr])
            }
        })
        ret.push(temp)
    }
    return ret;
}

function checkrule() {
    let ret = 1;

    return ret;
}
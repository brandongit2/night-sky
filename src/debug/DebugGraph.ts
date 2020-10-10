import { DebugItem } from './DebugItem';

import * as d3 from 'd3';

export class DebugGraph<T> extends DebugItem {
    svg = d3.create('svg')
        .attr('width', '512')
        .attr('height', '512');
    xAxis: d3.ScaleLinear<number, number>;
    yAxis: d3.ScaleLinear<number, number>;

    constructor(
        key: string,
        xAxisLabel: string, yAxisLabel: string,
        xMin: number, xMax: number,
        yMin: number, yMax: number,
        data: T[],
        xMap: (f: T) => number,
        yMap: (f: T) => number
    ) {
        super(key, 'div');

        let margin = {
            top: 10,
            left: 30,
            right: 10,
            bottom: 30
        };

        this.xAxis = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([margin.left, 512 - margin.right]);
        this.yAxis = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([512 - margin.bottom, margin.top]);

        this.update(data, xMap, yMap);

        this.svg.append('g')
            .attr('class', 'debug-axis x')
            .attr('transform', `translate(0, ${512 - margin.bottom})`)
            .call(d3.axisBottom(this.xAxis).ticks(10).tickSizeOuter(0));
        this.svg.append('g')
            .attr('class', 'debug-axis y')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(this.yAxis).ticks(10).tickSizeOuter(0));

        this.domEl.append(this.svg.node());
    }

    update<T>(data: T[], xMap: (f: T) => number, yMap: (f: T) => number) {
        this.svg.selectAll('path.line').data([data])
            .join('path')
            .attr('class', 'line')
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d3.line<T>()
                .x(d => this.xAxis(xMap(d)))
                .y(d => this.yAxis(yMap(d)))
            );
    }

    updateDomainX(x: [number, number]) {
        this.xAxis.domain(x);
        d3.selectAll('g.debug-axis.x').call(d3.axisBottom(this.xAxis).ticks(5).tickSizeOuter(0));
    }

    updateDomainY(y: [number, number]) {
        this.yAxis.domain(y);
        d3.selectAll('g.debug-axis.y').call(d3.axisLeft(this.yAxis).ticks(5).tickSizeOuter(0));
    }
}

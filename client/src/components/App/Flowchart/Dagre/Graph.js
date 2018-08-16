const d3 = window.d3;
const dagre = window.dagreD3;

export default class Graph {
  constructor(svg, gToSelect) {
    this.graph = new dagre.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(() => { return {}; });
    this.renderer = new dagre.render();
    this.elements = {
      svg: undefined,
      g: undefined,
    }
    this.selections = {
      svg: undefined,
      g: undefined,
    }
    this.constructElements(svg, gToSelect);
  }
  constructElements(svg, gToSelect) {
    this.elements.svg = svg;
    this.selections.svg = d3.select(this.elements.svg);
    this.elements.g = this.selections.svg.append('g');
    // Dagre requires two <g> elements inside of the <svg>
    // It needs the selection of a pre-existing <g> element
    // And also the element of a newly created <g> element
    this.selections.g = d3.select(gToSelect);
  }
  render() {
    this.renderer(this.selections.g, this.graph);
    // Center the graph
    var xCenterOffset = (this.selections.svg.attr("width") - this.graph.graph().width) / 2;
    this.elements.g.attr("transform", "translate(" + xCenterOffset + ", 20)");
    this.selections.svg.attr("height", this.graph.graph().height + 40);
    // Fit
    const dimensions = {
      current: this.graph.graph(),
      desired: this.elements.svg.getBBox(),
    }
    const transform = {
      x: dimensions.desired.width - dimensions.current.width,
      y: dimensions.desired.height - dimensions.current.height,
    }
    this.selections.svg.attr('height', dimensions.desired.height);
    this.selections.svg.attr('width', dimensions.desired.width);
    this.selections.g.attr('transform', d3.zoomIdentity.translate(transform.x, transform.y));
  }
}
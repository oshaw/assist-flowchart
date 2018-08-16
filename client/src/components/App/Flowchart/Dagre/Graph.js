const d3 = window.d3;
const dagre = window.dagreD3;

export default class Graph {
  constructor(svg, g, draw) {
    this.graph = new dagre.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(() => {});
    this.renderer = new dagre.render();
    // Dagre requires access to <svg> and <g> in DOM (this.svg, this.svg)
    this.elements = {
      svg,
      g,
    }
    // Dagre also requires those elements be selections by D3 too (this.selections.svg, this.selections.g)
    this.selections = {
      svg: d3.select(svg),
      g: d3.select(g),
    }
  }
  render() {
    // Do the actual rendering
    this.renderer(this.selections.g, this.graph);
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
const d3 = window.d3;
const dagre = window.dagreD3;

export default class Graph {
  constructor() {
    this.graph = new dagre.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => { return {}; });
  }
  render() {
    const render = new dagre.render();
    const svg = d3.select("svg");
    const svgGroup = svg.append("g");
    render(d3.select("svg g"), this.graph);
    // Center the graph
    var xCenterOffset = (svg.attr("width") - this.graph.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", this.graph.graph().height + 40);
    // const svg = d3.select('svg');
    // const g = svg.append('g');
    // // Do the actual rendering
    // const renderer = new dagre.render();
    // renderer(d3.select("svg g"), graph);
    // Fit
    // const dimensions = {
    //   current: graph.graph(),
    //   desired: this.elements.svg.getBBox(),
    // }
    // const transform = {
    //   x: dimensions.desired.width - dimensions.current.width,
    //   y: dimensions.desired.height - dimensions.current.height,
    // }
    // this.selections.svg.attr('height', dimensions.desired.height);
    // this.selections.svg.attr('width', dimensions.desired.width);
    // this.selections.g.attr('transform', d3.zoomIdentity.translate(transform.x, transform.y));
  }
}
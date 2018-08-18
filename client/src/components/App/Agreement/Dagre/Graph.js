const d3 = window.d3;
const dagre = window.dagreD3;

const createClassesString = (classes) => {
  if (Array.isArray(classes)) {
    return classes.join(' ');
  }
  else if (typeof classes === 'string') {
    return classes;
  }
}

export default class Graph {
  constructor(svg, gToSelect) {
    this.graph = this.createGraph();
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
  createGraph() {
    return new dagre.graphlib.Graph()
      .setGraph({
        align: 'UL',
        rankdir: 'LR',
        edgesep: 10,
        ranksep: 30,
        nodesep: 10
      })
      .setDefaultEdgeLabel(() => { return {}; });
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
  createEdge(labelFrom, labelTo, classes) {
    if (labelFrom.trim() !== '' && labelTo.trim() !== '') {
      let nodeFromId = this.getNodeId(labelFrom);
      let nodeToId = this.getNodeId(labelTo);
      if (nodeFromId === -1) {
        this.createNode(labelFrom, classes);
        nodeFromId = this.getNodeId(labelFrom);
      }
      if (nodeToId === -1) {
        this.createNode(labelTo, classes);
        nodeToId = this.getNodeId(labelTo);
      }
      const options = {}
      if (classes != undefined) {
        options.class = createClassesString(classes);
      }
      this.graph.setEdge(nodeFromId, nodeToId, options);
    }
  }
  createNode(label, classes) {
    if (label !== '' && this.getNodeId(label) === -1) {
      const options = {
        label,
      }
      if (classes != undefined) {
        options.class = createClassesString(classes);
      }
      this.graph.setNode(this.graph._nodeCount, options);
    }
  }
  getNodeId(label) {
    return Object.values(this.graph._nodes).findIndex((node) => node && node.label === label);
  }
  render() {
    // this.removeMalformedNodes();
    this.roundNodeCorners();
    this.renderer(this.selections.g, this.graph);
    this.center();
    this.fit();
  }
  center() {
    const offset = {
      x: (this.selections.svg.attr("width") - this.graph.graph().width) / 2,
    }
    this.elements.g.attr("transform", "translate(" + offset.x + ", 20)");
    this.selections.svg.attr("height", this.graph.graph().height + 40);
  }
  fit() {
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
  roundNodeCorners() {
    this.graph.nodes().forEach((nodeId) => {
      const node = this.graph.node(nodeId);
      node.rx = node.ry = 2;
    });
  }
  removeMalformedNodes() {
    // Dagre has a bug where a node with a -1 index and an undefined body is added
    // Remove this node to prevent render errors
    Object.entries(this.graph._nodes).forEach((entry) => {
      const index = entry[0];
      const node = entry[1];
      if (node == undefined || index === -1) {
        delete this.graph._nodes[index];
      }
    });
  }
}
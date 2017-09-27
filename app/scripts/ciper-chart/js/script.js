// Global vars
var svg;
var circle_mary_location;
var circle_mary_translate;

// Wrap all of this in a function so we can recall it later
function createChart() {
	// Generate tree diagram
	// More info: https://github.com/mbostock/d3/wiki/Tree-Layout
	var margin = {
			top: 0,
			right: 120,
			bottom: 20,
			left: 120
		},
		width = $(window).width() - margin.right - margin.left,
		height = 600 - margin.top - margin.bottom;

	// Set the width of the lines between circles
	// Based on window width
	var line_width = Math.round($(window).width() / 3) - 90;

	// Radius of every circle
	if ($(window).width() > 700) {
		var circle_radius = 25;
	} else {
		var circle_radius = 15;
	}

	// Sets horizontal location of center circle
	circle_mary_location = Math.round($(window).width() / 2.25) + (line_width / 4.5);
	// Sets vertical location of center circle
	circle_mary_translate = 245;

	var i = 0,
		duration = 750,
		root;

	// The entire tree layout
	var tree = d3.layout.tree()
		.size([height, width]);

	// The lines that connect the node
	var diagonal = d3.svg.diagonal()
		.projection(function (d) {
			return [d.y, d.x];
		});

	// Create an svg
	svg = d3.select("svg")
		// .attr("width", width + margin.right + margin.left)
		.attr("style", "width: 100%; min-width: 500px;")
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		// .attr("transform", "translate(" + (margin.left - line_width) + "," + margin.top + ")");
		.attr("style", "width: 100%; min-width: 500px;");

	root = tree_data[0];
	root.x0 = height / 2;
	root.y0 = 0;

	// The nodes
	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(),
		links = tree.links(nodes);

	// Used so we only have one node for Mary
	var count_mary = 0;
	var count_mary_two = 0;

	// Normalize for fixed-depth.
	nodes.forEach(function (d) {
		d.y = d.depth * line_width;
	});

	// Update the nodes
	var node = svg.selectAll("g.node")
		.data(nodes, function (d) {
			return d.id || (d.id = ++i);

		})

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("g")
		// Set location of nodes
		.attr("transform", function (d) {
			if (d['type'] === 'head' && d['depth'] === 2) {
				return "translate(" + circle_mary_location + "," + circle_mary_translate + ")";
			} else {
				return "translate(" + d.y + "," + d.x + ")";
			}
		})
		.attr("class", function (d) {
			if (d['type'] === 'head') {
				return 'node-mary';
			} else if (d['name'] === 'Top level') {
				return 'node-top';
			} else {
				return 'node'
			}
		});

	// Create the outer circle
	nodeEnter.append("circle")
		.attr("id", "circle-outer")
		// Make radius smaller than inner circle
		.attr("r", function (d) {
			if (d['type'] === 'head') {
				if ($(window).width() > 700) {
					return circle_radius + 7;
				} else {
					return circle_radius + 17;
				}
			} else {
				return circle_radius + 2;
			}
		})
		// Color code the border around the circle
		.style('stroke', function (d) {
			// Color Ciper
			return "#092334";
		});

	// Create the inner circle
	nodeEnter.append("circle")
		.attr("id", "circle-inner")
		// Radius
		.attr("r", function (d) {
			if (d['type'] === 'head') {
				if ($(window).width() > 700) {
					return circle_radius + 5;
				} else {
					return circle_radius + 15;
				}
			} else {
				return circle_radius;
			}
		})
		.style("fill", function (d) {
			if ($(window).width() > 700) {
				return "url(#" + d['name'].replace(' ', '') + ")"
			} else if (d['type'] === 'head') {
				return "url(#" + d['name'].replace(' ', '') + ")"
			}
		});

	// Add the names of the people
	// nodeEnter.append("text")
	// 	.attr("class", function (d) {
	// 		if (d['type'] === 'head') {
	// 			return 'circle-mary';
	// 		} else {
	// 			return 'circle';
	// 		}
	// 	})
	// 	.attr("text-anchor", function (d) {
	// 		return d.children || d._children ? "end" : "start";
	// 	})
	// 	.text(function (d) {
	// 		return d.name;
	// 	})
	// 	.attr("x", function (d) {
	// 		if (d['type'] === 'head') {
	// 			return 60;
	// 		} else if (d['name'] === 'Hannah Altman' && $(window).width() < 851) {
	// 			return 75;
	// 		} else {
	// 			return d.children || d._children ? -35 : 35;
	// 		}
	// 	})
	// 	.attr("dy", function (d) {
	// 		if (d['type'] === 'head') {
	// 			return "-2.5em";
	// 		} else if (d['name'] === 'Hannah Altman' && $(window).width() < 851) {
	// 			return '2.99em';
	// 		} else {
	// 			return "-.99em";
	// 		}
	// 	});

	// Remove extra Mary nodes so we only have one
	node
		// Show only one circle for Mary
		.style('display', function (d) {
			if (d['type'] === 'head' && d['depth'] === 2) {
				count_mary += 1;

				if (count_mary > 1) {
					return 'none'
				}
			} else if (d['type'] === 'head' && d['depth'] === 4) {
				count_mary_two += 1;

				if (count_mary_two > 1) {
					return 'none'
				}
			}
		});

	// Update the links…
	var link = svg.selectAll("path.link")
		.data(links, function (d) {
			// Have the links go to the one Mary circle
			// And not the default location of the hidden Mary circle
			if (d.target['type'] === 'head' && d.target['depth'] === 2) {
				d.target['x'] = (circle_mary_translate - 2.5);
				d.target['y'] = circle_mary_location;
				return d.target.id;
			} else {
				return d.target.id;
			}
		});

	// Lines between nodes
	// Enter any new links at the parent's previous position.
	link.enter().insert("path", "g")
		.attr("class", "link")
		.attr("d", function (d) {
			var o = {
				x: root.x0,
				y: root.y0
			};
			return diagonal({
				source: o,
				target: o
			});
		})
		// Hide top level lines
		.style('display', function (d) {
			if (d['source']['name'] === 'Top level') {
				return 'none'
			}
		})
		.style('stroke', function (d) {
			return "#092334";
		})
		//  Set position
		.attr("d", diagonal)

	$('svg').show();

	createTooltips();
	createNameBoxes();
	// Close create chart
}

createChart();

$(window).resize(function () {
	d3.select("svg g").remove();
	createChart();
});
/*
 * Name:	James Tremper
 * Date:	2015-01-22
 * Desc:	.js file for my Lab 1 solution
 */
var gl;
var points;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;

var colors = [
	vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
	vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
	vec4( 0.0, 1.0, 1.0, 1.0 ), // cyan
];

var points = [
	[ vec2(-0.75,-0.75), vec2(  0.0, 0.75), vec2( 0.75,-0.75) ],
	[ vec2(-0.75,-0.75), vec2(-0.75, 0.75), vec2( 0.75, 0.75), vec2( 0.75,-0.75) ],
	[ vec2(  1.0,  0.0), vec2(  0.5, 0.85), vec2( -0.5, 0.85),
	  vec2( -1.0,  0.0), vec2( -0.5,-0.85), vec2(  0.5,-0.85) ]
];

var lengths = [
	3, 4, 6
];

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");

	canvas.addEventListener("mousedown", function(event) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points[index%3]));

		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		t = [
			vec4(colors[(index)%3]),
			vec4(colors[(index)%3]),
			vec4(colors[(index)%3]),
			vec4(colors[(index)%3]),
			vec4(colors[(index)%3]),
			vec4(colors[(index)%3]),
		];
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(t));
		index++;
	} );

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available."); }

	/* Configure WebGL */
	gl.viewport( 0, 0, canvas.width, canvas.height);
	gl.clearColor( 1.0, 1.0, 1.0, 1.0);

	/* Load shaders and initialize attribute buffers */
	var program = initShaders( gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	/* Load the data into the GPU and do plumbing */
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	/* Load initial triangle */
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points[index%3]));

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	t = [
		vec4(colors[(index)%3]),
		vec4(colors[(index)%3]),
		vec4(colors[(index)%3]),
	];
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(t));
	index++;

	/* Render the image */
	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, lengths[(index-1)%3]);

	window.requestAnimFrame(render);
}


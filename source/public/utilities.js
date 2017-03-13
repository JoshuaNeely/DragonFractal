
function random(min, max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

function gen_2d_matrix(rows, columns, initial_data) {
  var matrix = [];
  for (var x=0; x<columns; x++) {
    matrix.push( [] );
    for (var y=0; y<rows; y++) {
      matrix[x].push( object_deep_copy(initial_data) );
    }
  }
  return matrix;
}

function object_deep_copy(old_object) {
  var new_object = {};
  for (key in old_object) {
    new_object[key] = old_object[key];
  }
  return new_object;
}

function angle_radians(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
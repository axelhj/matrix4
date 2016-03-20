var mat = (function mat() {

function create(matrix) {
  if (typeof(matrix) === "undefined" ||
      matrix === null ||
      matrix.length !== 16) {
    return identity([]);
  } else {
    return copy(matrix);
  }
}

function transpose(matrix) {
  var m = matrix;
/*m[0]  = m[0];*/ m[1]  = m[4];   m[2]  = m[8];    m[3]  = m[12];
  m[4]  = m[1]; /*m[5]  = m[5];*/ m[6]  = m[9];    m[7]  = m[13];
  m[8]  = m[2];   m[9]  = m[6]; /*m[10] = m[10];*/ m[11] = m[14];
  m[12] = m[3];   m[13] = m[7];   m[14] = m[11]; /*m[15] = m[15];*/
  return m;
}

function identity(matrix) {
  var m = matrix;
  m[0]  = 1.0; m[1]  = 0.0; m[2]  = 0.0; m[3]  = 0.0;
  m[4]  = 0.0; m[5]  = 1.0; m[6]  = 0.0; m[7]  = 0.0;
  m[8]  = 0.0; m[9]  = 0.0; m[10] = 1.0; m[11] = 0.0;
  m[12] = 0.0; m[13] = 0.0; m[14] = 0.0; m[15] = 1.0;
  return m;
}

function scale(matrix, x, y, z) {
  var m = matrix;
  m[0]  = x;    m[1]  = 0.0; m[2]  = 0.0; m[3]  = 0.0;
  m[4]  = 0.0; m[5]  = y;    m[6]  = 0.0; m[7]  = 0.0;
  m[8]  = 0.0; m[9]  = 0.0; m[10] = z;    m[11] = 0.0;
  m[12] = 0.0; m[13] = 0.0; m[14] = 0.0; m[15] = 1.0;
  return m;
}

function rotateX(matrix, value) {
  var m = matrix,
      t = value;
  m[0]  = 1.0; m[1]  = 0.0;   m[2]  = 0.0;   m[3]  = 0.0;
  m[4]  = 0.0; m[5]  = Math.cos(t); m[6]  =-Math.sin(t); m[7]  = 0.0;
  m[8]  = 0.0; m[9]  = Math.sin(t); m[10] = Math.cos(t); m[11] = 0.0;
  m[12] = 0.0; m[13] = 0.0;   m[14] = 0.0;   m[15] = 1.0;
  return m;
}

function rotateY(matrix, value) {
  var m = matrix,
      t = value;
  m[0]  = Math.cos(t); m[1]  = 0.0; m[2]  = -Math.sin(t); m[3]  = 0.0;
  m[4]  = 0.0;   m[5]  = 1.0; m[6]  = 0.0;   m[7]  = 0.0;
  m[8]  = Math.sin(t); m[9]  = 0.0; m[10] = Math.cos(t); m[11] = 0.0;
  m[12] = 0.0;   m[13] = 0.0; m[14] = 0.0;   m[15] = 1.0;
  return m;
}

function rotateZ(matrix, value) {
  var m = matrix,
      t = value;
  m[0]  = Math.cos(t); m[1]  =-Math.sin(t); m[2]  = 0.0; m[3]  = 0.0;
  m[4]  = Math.sin(t); m[5]  = Math.cos(t); m[6]  = 0.0; m[7]  = 0.0;
  m[8]  = 0.0;   m[9]  = 0.0;   m[10] = 1.0; m[11] = 0.0;
  m[12] = 0.0;   m[13] = 0.0;   m[14] = 0.0; m[15] = 1.0;
  return m;
}

function rotateAbout(matrix, t, x, y, z) {
  var d = matrix,
      s = Math.sin(t), c = Math.cos(t), xx = x*x,
      xy = x*y, sz = s*z, xz = x*z, sy = s*y,
      yy = y*y, yz = y*z, sx = s*x, zz = z*z;
  d[0]=c+(1.0-c)*xx;  d[1]=(1.0-c)*xy+sz; d[2]=(1.0-c)*xz-sy; d[3]= 0;
  d[4]=(1.0-c)*xy-sz; d[5]=c+(1.0-c)*yy;  d[6]=(1.0-c)*yz+sx; d[7]= 0;
  d[8]=(1.0-c)*xz+sy; d[9]=(1.0-c)*yz-sx; d[10]=c+(1.0-c)*zz; d[11]=0;
  d[12]=0;             d[13]=0;             d[14]=0;             d[15]=1;
  return d;
}

function translate(matrix, x, y, z) {
    var m = matrix;
    m[0]  = 1.0; m[1]  = 0.0; m[2]  = 0.0; m[3]  = x;
    m[4]  = 0.0; m[5]  = 1.0; m[6]  = 0.0; m[7]  = y;
    m[8]  = 0.0; m[9]  = 0.0; m[10] = 1.0; m[11] = z;
    m[12] = 0.0; m[13] = 0.0; m[14] = 0.0; m[15] = 1.0;
    return m;
}

function multiplicate(left, right, result) {
  var l = left,
      r = right,
      i, j, k, sum;
  for (i = 0 ; i < 4; ++i) { //row
    for (j = 0; j < 4; ++j) { //column
      sum = 0.0;
      for (k = 0; k < 4; ++k) { //current matrix index
        sum += l[i + k * 4] * r[k + j * 4];
      }
      result[i + j * 4] = sum;
    }
  }
  return result;
}

function copy(from, to) {
  if (typeof(to) === "undefined") {
    to = [];
  } else {
    to.splice(0, to.length);
  }
  from.some(function(item, index) {
    if (index >= 16) {
      return true;
    }
    to.push(item);
  });
  return to;
}

function execute(matrix, operations, clear) {
  if (typeof(clear) !== "undefined" && clear === true) {
    identity(matrix);
  }
  var result = create(matrix),
      transfer = create();
  operations.forEach(function(item) {
    copy(result, matrix);
    _mat[item[0]](transfer, item[1], item[2], item[3], item[4]);
    multiplicate(matrix, transfer, result);
  });
  return copy(result, matrix);
};

function perspective(matrix, fov, near, far, aspectRatio) {
  var ratio = 1.0 / aspectRatio,
      projX = Math.tan(fov / 2.0),
      projY = 1.0 / ratio * Math.tan(fov / 2.0),
      m = matrix;
  m[0] = projX; m[1]  = 0;     m[2]  = 0;            m[3] = 0;
  m[4] = 0;     m[5]  = projY; m[6]  = 0;            m[7] = 0;
  m[8] = 0;     m[9]  = 0;     m[10] = -(far + near) / (near - far); m[11] = (2.0 * far * near) / (near - far);
  m[12] = 0;    m[13] = 0;     m[14] = 1.0;         m[15] = 0;
  return m;
}

var _mat = {
  "create": create,
  "transpose": transpose,
  "identity": identity,
  "scale": scale,
  "rotateX": rotateX,
  "rotateY": rotateY,
  "rotateZ": rotateZ,
  "rotateAbout": rotateAbout,
  "translate": translate,
  "multiplicate": multiplicate,
  "copy": copy,
  "execute": execute,
  "perspective": perspective
};
return _mat;
})();

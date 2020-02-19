function createLib (execlib) {
  'use strict';
  var lib = execlib.lib,
    ret = {};

  require('./bufferablehookcollectioncreator')(lib, ret);
  require('./bufferablehookcollectioncontainermixincreator')(lib, ret);

  return ret;
}
module.exports = createLib;

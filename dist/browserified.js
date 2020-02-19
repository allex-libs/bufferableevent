(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_bufferableeventlib', require('./index')(ALLEX));

},{"./index":4}],2:[function(require,module,exports){
function createBufferableHookCollectionContainerMixin (lib, mylib) {
  'use strict';

  var BufferableHookCollection = mylib.BufferableHookCollection;

  function BufferableHookCollectionContainerMixin () {
  }
  BufferableHookCollectionContainerMixin.prototype.destroy = function () {
  };
  BufferableHookCollectionContainerMixin.prototype.bufferAllBufferableHookCollections = function () {
    lib.traverse(this, buffer);
  };
  BufferableHookCollectionContainerMixin.prototype.unbufferAllBufferableHookCollections = function () {
    lib.traverse(this, unbuffer);
  };

  function buffer (thingy) {
    if (thingy instanceof BufferableHookCollection) {
      thingy.buffer();
    }
  }

  function unbuffer (thingy) {
    if (thingy instanceof BufferableHookCollection) {
      thingy.unbuffer();
    }
  }

  BufferableHookCollectionContainerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, BufferableHookCollectionContainerMixin
      ,'bufferAllBufferableHookCollections'
      ,'unbufferAllBufferableHookCollections'
    );
  };

  mylib.BufferableHookCollectionContainerMixin = BufferableHookCollectionContainerMixin;
}
module.exports = createBufferableHookCollectionContainerMixin;

},{}],3:[function(require,module,exports){
function createBufferableHookCollection (lib, mylib) {
  'use strict';

  var HookCollection = lib.HookCollection;

  function BufferableHookCollection (buffered) {
    HookCollection.call(this);
    this._buffer = null;
    if (buffered) {
      this.buffer();
    }
  }
  lib.inherit(BufferableHookCollection, HookCollection);
  BufferableHookCollection.prototype.destroy = function () {
    this.unbuffer();
    HookCollection.prototype.destroy.call(this);
  };
  BufferableHookCollection.prototype.fire = function () {
    if (this._buffer) {
      this._buffer.push(Array.prototype.slice.call(arguments));
      return;
    }
    return HookCollection.prototype.fire.apply(this, arguments);
  };
  BufferableHookCollection.prototype.buffer = function () {
    if (!this._buffer) {
      this._buffer = new lib.Fifo();
    }
  };
  BufferableHookCollection.prototype.unbuffer = function () {
    var _buffer = this._buffer;
    this._buffer = null;
    if (_buffer) {
      _buffer.drain(this.fireBuffered.bind(this));
      _buffer.destroy();
    }
  };
  BufferableHookCollection.prototype.fireBuffered = function (args) {
    this.fire.apply(this, args);
  };


  mylib.BufferableHookCollection = BufferableHookCollection;
}
module.exports = createBufferableHookCollection;

},{}],4:[function(require,module,exports){
function createLib (execlib) {
  'use strict';
  var lib = execlib.lib,
    ret = {};

  require('./bufferablehookcollectioncreator')(lib, ret);
  require('./bufferablehookcollectioncontainermixincreator')(lib, ret);

  return ret;
}
module.exports = createLib;

},{"./bufferablehookcollectioncontainermixincreator":2,"./bufferablehookcollectioncreator":3}]},{},[1]);

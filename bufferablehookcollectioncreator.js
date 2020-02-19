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

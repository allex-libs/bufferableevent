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

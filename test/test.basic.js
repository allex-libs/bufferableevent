var evntcounts = {
  basic: 0,
  special: 0
};

function incer (name) {
  evntcounts[name] ++;
}
function attachCount (container, name) {
  return container[name].attach(incer.bind(null, name));
}
function BasicKlass () {
  this.basic = new Lib.BufferableHookCollection();
  Lib.BufferableHookCollectionContainerMixin.call(this);
}
BasicKlass.prototype.destroy = function () {
  if (this.basic) {
    this.basic.destroy();
  }
  this.basic = null;
  Lib.BufferableHookCollectionContainerMixin.destroy.call(this);
}

function SpecialKlass () {
  BasicKlass.call(this);
  this.special = new Lib.BufferableHookCollection();
}
SpecialKlass.prototype.destroy = function () {
  if (this.special) {
    this.special.destroy();
  }
  this.special = null;
  BasicKlass.prototype.destroy.call(this);
};

describe('Basic Tests', function () {
  it('Load lib', function () {
    return setGlobal('Lib', require('../')(execlib));
  });
  it('Use the Lib', function () {
    Lib.BufferableHookCollectionContainerMixin.addMethods(BasicKlass);
    lib.inherit(SpecialKlass, BasicKlass);
  });
  it('Create Buffered Container', function () {
    return setGlobal('Special', new SpecialKlass());
  });
  it('Attach counts', function () {
    attachCount(Special, 'basic');
    attachCount(Special, 'special');
    return expect(evntcounts).to.include({basic: 0, special: 0});
  });
  it('Buffer the container', function () {
    Special.bufferAllBufferableHookCollections();
  });
  it('Fire events, and expect no counters to inc', function () {
    Special.basic.fire(true);
    Special.special.fire(true);
    return expect(evntcounts).to.include({basic: 0, special: 0});
  });
  it('Unbuffer all events, and expect counters to inc', function () {
    Special.unbufferAllBufferableHookCollections();
    return expect(evntcounts).to.include({basic: 1, special: 1});
  });
});

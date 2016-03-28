var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    Constants = require('../constants/Constants'),
    Base = require('../common/Base.js')
  ;

var CHANGE_EVENT = 'change';

var _stores = {};

/**
 * Create a item.
 * @param  {string} text The content of the app
 */
function create(text) {
  var _id = Base.id();
  _stores[_id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * 更新指定id
 */
function update(id, update) {
 _stores[id] = Base.extend(_stores[id],update);
}

/**
 * 更新所有
 */
function updateAll(updates) {
  for (var id in _stores) {
    update(id,updates)
  }
}

/**
 * 销毁指定ID
 */
function destroy(id) {
  delete _stores[id];
}

/**
 * 销毁所有完成的ID
 */
function destroyCompleted() {
  for (var id in _stores) {
    if (_stores[id].complete){
      destroy(id);
    }
  }
}

var AppStore = Base.extend( EventEmitter.prototype , {

  getAll: function() {
    return _stores;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT,callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT,callback);
  }
});

AppDispatcher.register(function(action){
  var text;
  console.log('action type:'+action.actionType);
  switch(action.actionType) {
    case Constants.CREATE:
      AppStore.emitChange();
      break;
    case Constants.UPDATE:
      AppStore.emitChange();
      break;
    case Constants.DESTROY:
      AppStore.emitChange();
      break;
    case Constants.DESTROY_COMPLETED:
      AppStore.emitChange();
      break;
    default:
  }
});

module.exports = AppStore;

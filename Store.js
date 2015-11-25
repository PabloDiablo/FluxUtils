'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var Store = assign({}, EventEmitter.prototype, {


  /**
   * emitChange - emits a change event
   *
   * @return {void}
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },


  /**
   * addChangeListener - adds a listener for the change event
   *
   * @param  {function} callback callback to execute when event is emitted
   * @return {void}
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },


  /**
   * removeChangeListener - removes a listener
   *
   * @param  {function} callback callback to remove
   * @return {void}
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

module.exports = {
  create: function (obj) {
    return assign({}, Store, obj);
  }
};

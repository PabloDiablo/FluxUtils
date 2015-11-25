'use strict';

var LocationActions = require('react-router/lib/actions/LocationActions');
var History = require('react-router/lib/History');

var _listeners = [];
var _isListening = false;
var _currentRoute = '';

function notifyChange(type) {
    var change = {
        path: ExternalLocation.getCurrentPath(),
        type: type
    };

    _listeners.forEach(function (listener) {
        listener.call(ExternalLocation, change);
    });
}

function onPopState(event) {
    if (event.state === undefined) {
        return;
    } // Ignore extraneous popstate events in WebKit.

    notifyChange(LocationActions.POP);
}

/**
 * A Location that uses an external history provider.
 */
var ExternalLocation = {

    addChangeListener: function addChangeListener(listener) {
        _listeners.push(listener);
    },

    removeChangeListener: function removeChangeListener(listener) {
        _listeners = _listeners.filter(function (l) {
            return l !== listener;
        });
    },

    push: function push(path) {
       _currentRoute = path;
        notifyChange(LocationActions.PUSH);
    },

    replace: function replace(path) {
        _currentRoute = path;
        notifyChange(LocationActions.REPLACE);
    },

    pop: History.back,

    getCurrentPath: function getCurrentPath() {
        return _currentRoute;
    },

    toString: function toString() {
        return '<ExternalLocation>';
    }

};

module.exports = ExternalLocation;

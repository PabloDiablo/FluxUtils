'use strict';

var when = require('when');
var assign = require('object-assign');

var Service = assign({}, {

  _timeout: 30000,

  _pendingRequests: {},


  /**
   * request - send an XHR
   *
   * @param  {string} key unique key to identify this request
   * @param  {object} obj options
   * @return {promise}    promise for XHR resolution
   */
  request: function (key, obj) {

    // Abort request if there's one in progress
    this.abortRequests(key);

    return when.promise((resolve, reject) => {
      if (!obj.url) {
        reject(new Error("No URL was specified."));
      }

      // Maybe refactor to use another library such as Request

      obj.type = obj.type || "GET";

      // Create XHR object
      var req = new XMLHttpRequest();

      // Open connection
      req.open(obj.type, obj.url);

      // Set default timeout
      // This needs to be set after 'open' is called
      // or IE throws a DOMException
      req.timeout = this._timeout;

      // Set load handler
      req.onload = () => {
        this._pendingRequests[key] = null;

        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      };

      // Set timeout handler
      req.ontimeout = () => {
        this._pendingRequests[key] = null;
        reject(new Error("Connection Timeout"));
      };

      // Set error handler
      req.onerror = () => {
        this._pendingRequests[key] = null;
        reject(new Error("Network Error"));
      };

      // Set abort handler
      req.onabort = () => {
        this._pendingRequests[key] = null;
        reject(new Error("Request was aborted."));
      };

      this._pendingRequests[key] = req;

      // Set the content type to JSON
      req.setRequestHeader('Content-Type', 'application/json');

      // Ensure the data is a string
      if (typeof obj.data !== 'string') {
        obj.data = JSON.stringify(obj.data);
      }

      // Send request
      req.send(obj.data);
    });
  },


  /**
   * abortRequests - abort a request
   *
   * @param  {string} key key of request to abort
   * @return {void}
   */
  abortRequests: function (key) {
    if (this._pendingRequests[key]) {
      this._pendingRequests[key].abort();
      this._pendingRequests[key] = null;
    }
  },

});

module.exports = {
  create: function (obj) {
    return assign({}, Service, obj);
  }
};

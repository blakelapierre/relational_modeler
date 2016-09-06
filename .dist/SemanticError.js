"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export default function(match) { this.match = match; }

var SemanticError = function SemanticError(message) {
  _classCallCheck(this, SemanticError);

  this.message = message;
};

exports.default = SemanticError;
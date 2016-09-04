"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export default function(match) { this.match = match; }

var GrammarError = function GrammarError(match) {
  _classCallCheck(this, GrammarError);

  this.match = match;
};

exports.default = GrammarError;
/**
 * MIT License
 * Copyright (c) 2020 JSXGraph
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

"use strict";
/**
 *
 * @param {String} elID ID of the HTML element containing JSXGraph
 * @param {Function} jsxCode JavaScript function containing the construction
 * @param {Boolean} debug  Debug flag. If false the input elements of the formulas question are hidden.
 */
var JSXQuestion = function (elID, jsxCode, debug) {
    var that = this;

    /**
     * HTML element containing the board
     */
    this.elm = document.getElementById(elID);

    // Get the first ancestor of the board having class ".formulaspart" (should be a div)
    // and get all input elements there in.
    that.inputs = $(that.elm).closest(".formulaspart").find("input");
    // Hide the outcome div and the input elements
    $(that.elm).closest(".formulaspart").children("formulaspartoutcome").hide();
    if (debug !== true) {
        that.inputs.hide();
    }
    that.solved = $(that.inputs[0]).prop('readonly');
    // Function to fill formulas input form of index idx with a value.
    that.set = function (idx, val) {
        if (!that.solved && that.inputs && that.inputs[idx]) {
            that.inputs[idx].value = Math.round(val * 100) / 100;
        }
    };
    // Function to get the content of formulas input form of index idx.
    that.get = function (idx) {
        if (that.inputs && that.inputs[idx]) {
            var n = parseFloat(that.inputs[idx].value);
            if (isNaN(n)) {
                return null;
            }
            return n;
        }
        return null;
    };
    // Execute the JSXGraph / JavaScript code
    that.brd = null;
    jsxCode(that);
    that.reload = function () {
        jsxCode(that);
    };
};

// Polyfill for element.closest:
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}
/*!
 * Name: tagselector.js
 * Author: Ryan Fitzgerald
 * Version: 0.0.3
 * Repo: https://github.com/RyanFitzgerald/tagselector
 * Issues: https://github.com/RyanFitzgerald/tagselector/issues
 * License: MIT
 */
(function(root, TagSelector) {
    "use strict";
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = TagSelector();
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return TagSelector();
        });
    } else {
        root.TagSelector = TagSelector();
    }
})(this, function() {
    "use strict";
    var defaults = {
        max: false,
        onInit: false,
        onDestroy: false,
        onSelect: false,
        onDeselect: false
    };
    var extend = function(target, userSettings) {
        if (typeof userSettings !== "object") {
            return;
        }
        var updated = {};
        Object.keys(target).forEach(function(key) {
            if (userSettings[key]) {
                updated[key] = userSettings[key];
            } else {
                updated[key] = target[key];
            }
        });
        return updated;
    };
    var insertAfter = function(ele, ref) {
        ref.parentNode.insertBefore(ele, ref.nextSibling);
    };
    var hasClass = function(ele, cls) {
        return ("" + ele.className + "").indexOf(" " + cls + "") > -1;
    };
    var removeClass = function(ele, cls) {
        ele.className = ele.className.replace(cls, "");
    };
    var getOptions = function(target) {
        var optionList = target.options;
        var optionObj = {};
        for (var i = 0; i < optionList.length; i++) {
            optionObj[optionList[i].value] = {
                text: optionList[i].text,
                index: i,
                selected: optionList[i].selected
            };
        }
        return optionObj;
    };
    function TagSelector(ele, userSettings) {
        var settingsObj = userSettings || {};
        this.target = ele || false;
        if (!this.target || this.target === null || this.target.tagName !== "SELECT") {
            console.error("Error: Must provide a valid ID for select field");
            return;
        }
        this.selected = [];
        this.options = getOptions(this.target);
        this.wrapper = document.createElement("div");
        this.wrapper.className = "tagselector-wrap";
        this.settings = extend(defaults, settingsObj);
        this.init();
    }
    TagSelector.prototype.init = function() {
        var _options = this.options;
        var _selected = this.selected;
        var _wrapper = this.wrapper;
        var _tagListener = this.tagListener.bind(this);
        this.target.setAttribute("multiple", true);
        this.target.style.display = "none";
        insertAfter(this.wrapper, this.target);
        Object.keys(_options).forEach(function(key, i) {
            var tag = document.createElement("span");
            tag.className = "tagselector-tag";
            tag.innerHTML = _options[key].text;
            tag.dataset.tagkey = key;
            tag.dataset.tag = i;
            if (_options[key].selected) {
                tag.className += " active";
                _selected.push(key);
            }
            _tagListener(tag);
            _wrapper.appendChild(tag);
        });
        if (this.settings.onInit && typeof this.settings.onInit === "function") {
            this.settings.onInit();
        }
    };
    TagSelector.prototype.tagListener = function(tag) {
        var _target = this.target;
        var _options = this.options;
        var _selected = this.selected;
        var _settings = this.settings;
        var _wrapper = this.wrapper;
        tag.addEventListener("click", function() {
            var key = this.dataset.tagkey;
            var index = _options[key].index;
            if (hasClass(this, "active")) {
                removeClass(this, " active");
                var keyIndex = _selected.indexOf(key);
                if (keyIndex > -1) {
                    _selected.splice(keyIndex, 1);
                }
                _target.options[index].selected = false;
                if (_settings.onDeselect && typeof _settings.onDeselect === "function") {
                    _settings.onDeselect(key, _options[key].text);
                }
            } else {
                this.className += " active";
                _selected.push(key);
                _target.options[index].selected = true;
                if (_settings.onSelect && typeof _settings.onSelect === "function") {
                    _settings.onSelect(key, _options[key].text);
                }
                if (_settings.max && _selected.length > _settings.max) {
                    var removeIndex = _options[_selected[0]].index;
                    _target.options[removeIndex].selected = false;
                    removeClass(_wrapper.querySelector('.active[data-tagkey="' + _selected[0] + '"]'), " active");
                    _selected.shift();
                    if (_settings.onDeselect && typeof _settings.onDeselect === "function") {
                        _settings.onDeselect(_selected[0], _options[_selected[0]].text);
                    }
                }
            }
        });
    };
    TagSelector.prototype.destroy = function() {
        this.options = null;
        this.selected = null;
        this.wrapper.parentNode.removeChild(this.wrapper);
        this.wrapper = null;
        this.target.style.display = "initial";
        this.target = null;
        if (this.settings.onDestroy && typeof this.settings.onDestroy === "function") {
            this.settings.onDestroy();
        }
        this.settings = null;
    };
    TagSelector.prototype.reload = function() {
        this.options = null;
        this.selected = [];
        this.wrapper.parentNode.removeChild(this.wrapper);
        this.options = getOptions(this.target);
        this.wrapper = document.createElement("div");
        this.wrapper.className = "tagselector-wrap";
        this.init();
    };
    return TagSelector;
});
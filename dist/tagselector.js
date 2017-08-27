/*!
 * Name: tagselector.js
 * Author: Ryan Fitzgerald
 * Version: 0.0.1
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
    var settings;
    var target;
    var options;
    var selected = [];
    var wrapper;
    var defaults = {
        max: false,
        onInit: false,
        onDestroy: false,
        onSelect: false,
        onDeselect: false
    };
    function getSettings(userSettings) {
        if (typeof userSettings !== "object") {
            return;
        }
        var updated = {};
        Object.keys(defaults).forEach(function(key) {
            if (userSettings[key]) {
                updated[key] = userSettings[key];
            } else {
                updated[key] = defaults[key];
            }
        });
        return updated;
    }
    function insertAfter(ele, ref) {
        ref.parentNode.insertBefore(ele, ref.nextSibling);
    }
    function getOptions() {
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
    }
    function hasClass(ele, cls) {
        return ("" + ele.className + "").indexOf(" " + cls + "") > -1;
    }
    function removeClass(ele, cls) {
        ele.className = ele.className.replace(cls, "");
    }
    function clickHandler() {
        var key = this.dataset.tagkey;
        var index = options[key].index;
        if (hasClass(this, "active")) {
            removeClass(this, " active");
            var keyIndex = selected.indexOf(key);
            if (keyIndex > -1) {
                selected.splice(keyIndex, 1);
            }
            target.options[index].selected = false;
            if (settings.onDeselect && typeof settings.onDeselect === "function") {
                settings.onDeselect(key, options[key].text);
            }
        } else {
            this.className += " active";
            selected.push(key);
            target.options[index].selected = true;
            if (settings.onSelect && typeof settings.onSelect === "function") {
                settings.onSelect(key, options[key].text);
            }
            if (settings.max && selected.length > settings.max) {
                var removeIndex = options[selected[0]].index;
                target.options[removeIndex].selected = false;
                removeClass(wrapper.querySelector('.active[data-tagkey="' + selected[0] + '"]'), " active");
                selected.shift();
                if (settings.onDeselect && typeof settings.onDeselect === "function") {
                    settings.onDeselect(selected[0], options[selected[0]].text);
                }
            }
        }
    }
    function setup() {
        target.setAttribute("multiple", true);
        options = getOptions();
        wrapper = document.createElement("div");
        wrapper.className = "tagselector-wrap";
        target.style.display = "none";
        insertAfter(wrapper, target);
        Object.keys(options).forEach(function(key, i) {
            var tag = document.createElement("span");
            tag.className = "tagselector-tag";
            tag.innerHTML = options[key].text;
            tag.dataset.tagkey = key;
            tag.dataset.tag = i;
            if (options[key].selected) {
                tag.className += " active";
                selected.push(key);
            }
            tag.addEventListener("click", clickHandler);
            wrapper.appendChild(tag);
        });
    }
    function TagSelector(ele, userSettings) {
        target = document.getElementById(ele) || false;
        if (!target || target.tagName !== "SELECT") {
            console.error("Error: Must provide a valid ID for select field");
            return;
        }
        if (typeof userSettings !== "undefined") {
            settings = getSettings(userSettings);
        } else {
            settings = defaults;
        }
        setup();
        if (settings.onInit && typeof settings.onInit === "function") {
            settings.onInit();
        }
    }
    TagSelector.prototype.destroy = function() {
        target.style.display = "initial";
        wrapper.parentNode.removeChild(wrapper);
        settings = false;
        target = false;
        options = false;
        selected = [];
        if (settings.onDestroy && typeof settings.onDestroy === "function") {
            settings.onDestroy();
        }
    };
    return TagSelector;
});
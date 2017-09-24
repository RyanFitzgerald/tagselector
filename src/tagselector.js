/*!
 * Name: tagselector.js
 * Author: Ryan Fitzgerald
 * Version: 0.0.3
 * Repo: https://github.com/RyanFitzgerald/tagselector
 * Issues: https://github.com/RyanFitzgerald/tagselector/issues
 * License: MIT
 */ 

(function (root, TagSelector) {
  'use strict';
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node
    module.exports = TagSelector();
  } else if (typeof define === 'function' && define.amd) {
    // Amd
    define(function() {
      return TagSelector();
    });
  } else {
    // Browser (root = window)
    root.TagSelector = TagSelector();
  }
})(this, function() {
  'use strict';

  // Store defaults
  var defaults = {
    max: false,
    onInit: false,
    onDestroy: false,
    onSelect: false,
    onDeselect: false
  };

  /*
   * Overwrite defualts with user settings
   * @private
   */
  var extend = function(target, userSettings) {
    if (typeof userSettings !== 'object') {
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

  /*
   * Inserts an element after a given element
   * @private
   */
  var insertAfter = function(ele, ref) {
    ref.parentNode.insertBefore(ele, ref.nextSibling);
  };

  /*
   * Check if an element has a class
   * @private
   */
  var hasClass = function(ele, cls) {
    return ('' + ele.className + '').indexOf(' ' + cls + '') > -1;
  };

  /*
   * Remove a class from an object
   * @private
   */
  var removeClass = function(ele, cls) {
    ele.className = ele.className.replace(cls, '');
  };

  var getOptions = function(target) {
    var optionList = target.options;
    var optionObj = {};

    for (var i = 0; i < optionList.length; i++) {
      optionObj[optionList[i].value] = {
        'text': optionList[i].text,
        'index': i,
        'selected': optionList[i].selected
      };
    }

    return optionObj;
  };

  function TagSelector(ele, userSettings) {
    // Get user settings object
    var settingsObj = userSettings || {};

    // Get element
    this.target = ele || false;

    // Ensure target was a valid select field
    if (!this.target || this.target === null || this.target.tagName !== 'SELECT') {
      console.error('Error: Must provide a valid ID for select field');
      return;
    }

    // Create empty selected array
    this.selected = [];

    // Get select options
    this.options = getOptions(this.target);

    // Create wrapper element and apply class
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'tagselector-wrap';

    // Extend defaults with user settings
    this.settings = extend(defaults, settingsObj);

    // Initialize
    this.init();
  }

  TagSelector.prototype.init = function() {
    // Store necessary variables
    var _options = this.options;
    var _selected = this.selected;
    var _wrapper = this.wrapper;
    var _tagListener = this.tagListener.bind(this);

    // Ensure multiple attribute is set
    this.target.setAttribute('multiple', true);

    // Hide target
    this.target.style.display = 'none';

    // Insert wrapper after target
    insertAfter(this.wrapper, this.target);

    // Add tags to wrapper
    Object.keys(_options).forEach(function(key, i) {
      // Create tag and add required information
      var tag = document.createElement('span');
      tag.className = 'tagselector-tag';
      tag.innerHTML = _options[key].text;
      tag.dataset.tagkey = key;
      tag.dataset.tag = i;

      // Check if active
      if (_options[key].selected) {
        // Add class
        tag.className += ' active';
  
        // Push key to selected array
        _selected.push(key);
      }

      // Add event listener
      _tagListener(tag);

      // Add to wrapper
      _wrapper.appendChild(tag);
    });

    // Call init function if provided
    if (this.settings.onInit && typeof(this.settings.onInit) === 'function') {
      this.settings.onInit();
    }
  };

  TagSelector.prototype.tagListener = function(tag) {
    // Store needed variables from instance
    var _target = this.target;
    var _options = this.options;
    var _selected = this.selected;
    var _settings = this.settings;
    var _wrapper = this.wrapper;

    // Add event listener
    tag.addEventListener('click', function() {
      var key = this.dataset.tagkey;
      var index = _options[key].index;

      if (hasClass(this, 'active')) {
        // Remove class
        removeClass(this, ' active');
  
        // Remove key from selected array
        var keyIndex = _selected.indexOf(key);
        if (keyIndex > -1) {
          _selected.splice(keyIndex, 1);
        }
  
        // Remove selection from target
        _target.options[index].selected = false;
  
        // Call deselect function if provided
        if (_settings.onDeselect && typeof(_settings.onDeselect) === 'function') {
          _settings.onDeselect(key, _options[key].text);
        }
      } else {
        // Add class
        this.className += ' active';
  
        // Push key to selected array
        _selected.push(key);
  
        // Select it
        _target.options[index].selected = true;
  
        // Call select function if provided
        if (_settings.onSelect && typeof(_settings.onSelect) === 'function') {
          _settings.onSelect(key, _options[key].text);
        }
  
        // Check if greater than max setting
        if (_settings.max && _selected.length > _settings.max) {
          // Get index
          var removeIndex = _options[_selected[0]].index;
  
          // Unselect first element in selected array
          _target.options[removeIndex].selected = false;
  
          // Remove class from first element
          removeClass(_wrapper.querySelector('.active[data-tagkey="'+ _selected[0] +'"]'), ' active');
  
          // Pop first element in array
          _selected.shift();
  
          // Call deselect function if provided
          if (_settings.onDeselect && typeof(_settings.onDeselect) === 'function') {
            _settings.onDeselect(_selected[0], _options[_selected[0]].text);
          }
        }
      }
    });
  };

  TagSelector.prototype.destroy = function() {
    // Clear instance variables
    this.options = null;
    this.selected = null;

    // Delete wrapper
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.wrapper = null;
    
    // Show target and delete
    this.target.style.display = 'initial';
    this.target = null;

    // Call init function if provided
    if (this.settings.onDestroy && typeof(this.settings.onDestroy) === 'function') {
      this.settings.onDestroy();
    }

    // Delete settings
    this.settings = null;
  };

  TagSelector.prototype.reload = function() {
    // Clear instance variables
    this.options = null;
    this.selected = [];

    // Delete wrapper
    this.wrapper.parentNode.removeChild(this.wrapper);

    // Get select options
    this.options = getOptions(this.target);
  
    // Create wrapper element and apply class
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'tagselector-wrap';

    // Initialize
    this.init();
  };

  // --- Public API ---
  return TagSelector;
});
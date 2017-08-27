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

  // --- Variable Definitions ---
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

  /*
   * Overwrite defualts with user settings
   */
  function getSettings(userSettings) {
    if (typeof userSettings !== 'object') {
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

  /*
   * Inserts an element after a given element
   */
  function insertAfter(ele, ref) {
    ref.parentNode.insertBefore(ele, ref.nextSibling);
  }

  /*
   * Get all the select options and text
   */ 
  function getOptions() {
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
  }

  /*
   * Check if an element has a class
   */
  function hasClass(ele, cls) {
    return ('' + ele.className + '').indexOf(' ' + cls + '') > -1;
  }

  /*
   * Remove a class from an object
   */
  function removeClass(ele, cls) {
    ele.className = ele.className.replace(cls, '');
  }

  /*
   * Handle click events for tags
   */ 
  function clickHandler() {
    var key = this.dataset.tagkey;
    var index = options[key].index;

    if (hasClass(this, 'active')) {
      // Remove class
      removeClass(this, ' active');

      // Remove key from selected array
      var keyIndex = selected.indexOf(key);
      if (keyIndex > -1) {
        selected.splice(keyIndex, 1);
      }

      // Remove selection from target
      target.options[index].selected = false;

      // Call deselect function if provided
      if (settings.onDeselect && typeof(settings.onDeselect) === 'function') {
        settings.onDeselect(key, options[key].text);
      }
    } else {
      // Add class
      this.className += ' active';

      // Push key to selected array
      selected.push(key);

      // Select it
      target.options[index].selected = true;

      // Call select function if provided
      if (settings.onSelect && typeof(settings.onSelect) === 'function') {
        settings.onSelect(key, options[key].text);
      }

      // Check if greater than max setting
      if (settings.max && selected.length > settings.max) {
        // Get index
        var removeIndex = options[selected[0]].index;

        // Unselect first element in selected array
        target.options[removeIndex].selected = false;

        // Remove class from first element
        removeClass(wrapper.querySelector('.active[data-tagkey="'+ selected[0] +'"]'), ' active');

        // Pop first element in array
        selected.shift();

        // Call deselect function if provided
        if (settings.onDeselect && typeof(settings.onDeselect) === 'function') {
          settings.onDeselect(selected[0], options[selected[0]].text);
        }
      }
    }
  }

  /*
   * Sets up the styleable tag cloud
   */
  function setup() {
    // Ensure multiple attribute is set
    target.setAttribute('multiple', true);

    // Get and store options
    options = getOptions();

    // Create wrapper element
    wrapper = document.createElement('div');
    wrapper.className = 'tagselector-wrap';

    // Hide target
    target.style.display = 'none';

    // Insert wrapper after target
    insertAfter(wrapper, target);

    // Add tags to wrapper
    Object.keys(options).forEach(function(key, i) {
      // Create tag and add required information
      var tag = document.createElement('span');
      tag.className = 'tagselector-tag';
      tag.innerHTML = options[key].text;
      tag.dataset.tagkey = key;
      tag.dataset.tag = i;

      // Check if active
      if (options[key].selected) {
        // Add class
        tag.className += ' active';
  
        // Push key to selected array
        selected.push(key);
      }

      // Add event listener
      tag.addEventListener('click', clickHandler);

      // Add to wrapper
      wrapper.appendChild(tag);
    });
  } 

  /*
   * Initializes tagselector with given element and user settings
   * 
   * @param {Object} ele - references 
   */
  function TagSelector(ele, userSettings) {
    // Attempt to get target
    target = document.getElementById(ele) || false;

    // Ensure target was a valid select field
    if (!target || target.tagName !== 'SELECT') {
      console.error('Error: Must provide a valid ID for select field');
      return;
    }

    // Set settings based on user settings if provided
    if (typeof userSettings !== 'undefined') {
      settings = getSettings(userSettings);
    } else {
      settings = defaults;
    }

    // Run setup
    setup();

    // Call init function if provided
    if (settings.onInit && typeof(settings.onInit) === 'function') {
      settings.onInit();
    }
  }

  /*
   * Destroys the current instance of tagselector
   */
  TagSelector.prototype.destroy = function() {
    // Show select again
    target.style.display = 'initial';

    // Delete wrapper
    wrapper.parentNode.removeChild(wrapper);

    // Clear all arrays and objects
    settings = false;
    target = false;
    options = false;
    selected = [];

    // Call destroy function if provided
    if (settings.onDestroy && typeof(settings.onDestroy) === 'function') {
      settings.onDestroy();
    }
  };

  // --- Public API ---
  return TagSelector;
});
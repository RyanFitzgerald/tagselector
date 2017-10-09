/*!
 * TagSelector
 * 
 * @author Ryan Fitzgerald
 * @version 0.2.0
 * @license MIT
 * 
 * Repo: https://github.com/RyanFitzgerald/tagselector
 * Issues: https://github.com/RyanFitzgerald/tagselector/issues
 */ 
const defaults = {
  max: false,
  onInit: false,
  onDestroy: false,
  onSelect: false,
  onDeselect: false
};

const getSettings = userSettings => {
  const updated = {};
  Object.keys(defaults).forEach(key => {
    if (userSettings[key]) {
      updated[key] = userSettings[key];
    } else {
      updated[key] = defaults[key];
    }
  });
  return updated;
};

const getOptions = ele => {
  const optionList = ele.options;
  const optionObj = {};

  for (let i = 0; i < optionList.length; i++) {
    optionObj[optionList[i].value] = {
      'text': optionList[i].text,
      'index': i,
      'selected': optionList[i].selected
    };
  }

  return optionObj;
};

const insertAfter = (ele, ref) => {
  ref.parentNode.insertBefore(ele, ref.nextSibling);
};

class TagSelector {
  constructor(ele, userSettings) {
    // Create required properties
    this.ele = ele;
    this.userSettings = userSettings || {};
    this.isMultiple = this.ele.multiple;
    this.selected = [];
    this.options = {};
    this.settings = {};
    this.wrapper = null;

    // Ensure ele was a valid select field
    if (!this.ele || this.ele === null || this.ele.tagName !== 'SELECT') {
      console.error('Error: Must provide a valid ID for select field');
      return;
    }

    // Initialize
    this.init();
  }

  init() {
    // Get options and settings
    this.options = getOptions(this.ele);
    this.settings = getSettings(this.userSettings);

    // Hide select
    this.ele.style.display = 'none';

    // Create wrapper element
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'tagselector-wrapper';
    insertAfter(this.wrapper, this.ele);

    // Add tags within wrapper
    Object.keys(this.options).forEach((key, i) => {
      // Create tag with necessary properties
      const tag = document.createElement('span');
      tag.className = 'tagselector-tag';
      tag.innerHTML = this.options[key].text;
      tag.dataset.tagvalue = key;
      tag.dataset.tagindex = this.options[key].index;

      // Add active class if selected
      if (this.options[key].selected) {
        tag.classList.add('active');
        this.selected.push(key);
      }

      // Add listener
      this.addTagListener(tag);

      // Add tag to wrapper
      this.wrapper.appendChild(tag);
    });

    // Call init function if provided
    if (this.settings.onInit && typeof(this.settings.onInit) === 'function') {
      this.settings.onInit();
    }
  }

  addTagListener(tag) {
    // Save copies of needed properties
    const selected = this.selected;
    const ele = this.ele;
    const wrapper = this.wrapper;
    const isMultiple = this.isMultiple;
    const settings = this.settings;
    const options = this.options;

    tag.addEventListener('click', function() {
      const value = this.dataset.tagvalue;
      const index = this.dataset.tagindex;

      if (this.classList.contains('active')) {
        // Do nothing if regular select
        if (!isMultiple) {
          return;
        }

        // Remove active class
        this.classList.remove('active');

        // Remove key from selected array
        const keyIndex = selected.findIndex(x => x.value === value && x.index === index);
        if (keyIndex > -1) {
          selected.splice(keyIndex, 1);
        }

        // Deselect it
        ele.options[index].selected = false;

        // Call deselect function if provided
        if (settings.onDeselect && typeof(settings.onDeselect) === 'function') {
          settings.onDeselect(value, options[value].text);
        }
      } else {        
        // Handle based on type of select
        if (isMultiple) {
          // Push to selected array
          selected.push({value, index});

          // Check if greater than max
          if (settings.max && selected.length > settings.max) {
            // Get index to remove
            const removeValue = selected[0].value;
            const removeIndex = options[removeValue].index;

            // Deselect it
            ele.options[removeIndex].selected = false;

            // Remove active class from first element
            wrapper.querySelector(`.tagselector-tag.active[data-tagvalue="${removeValue}"]`).classList.remove('active');

            // Call deselect function if provided
            if (settings.onDeselect && typeof(settings.onDeselect) === 'function') {
              settings.onDeselect(selected[0].value, options[selected[0].value].text);
            }

            // Pop first member of array
            selected.shift();
          }
        } else {
          // Remove all active classes
          wrapper.querySelector('.tagselector-tag.active').classList.remove('active');
        }

        // Select it
        ele.options[index].selected = true;

        // Call select function if provided
        if (settings.onSelect && typeof(settings.onSelect) === 'function') {
          settings.onSelect(value, options[value].text);
        }

        // Add active class
        this.classList.add('active');
      }
    });
  }

  destroy() {
    // Clear properties
    this.selected = [];
    this.options = {};

    // Delete wrapper
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.wrapper = null;

    // Show ele and delete reference
    this.ele.style.display = 'initial';

    // Call destroy function if provided
    if (this.settings.onDestroy && typeof(this.settings.onDestroy) === 'function') {
      this.settings.onDestroy();
    }

    // Delete settings
    this.settings = {};
  }

  reload() {
    // Clear properties
    this.selected = [];
    this.options = {};

    // Delete wrapper
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.wrapper = null;

    // Call init
    this.init();
  }
}

module.exports = TagSelector;
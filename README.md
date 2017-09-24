# Tag Selector

Tag Selector is a lightweight JavaScript plugin that converts Select Fields with the multiple attribute to a series of selectable and styleable spans. Using this, you can still have the default functionality of a multiple select field, but the ability to style them in a better way. It also works fully on mobile devices.

![Tag selector demo](http://i66.tinypic.com/2pt5bae.jpg)

### See demo [here](http://ryanfitzgerald.github.io/tagselector/)

## Installation

Via NPM:

```
npm install --save tagselector
```

Via Script Tag:

```html
<script src="path/to/tagselector.js"></script>
```

## Usage

To use, simply create a select field with the ``multiple`` attribute and an ID, as well as some options with values and text:

```html
<select id="someSelect">
  <option value="orange">Orange</option>
  <option value="apple">Apple</option>
</select>
```

Next, create a new instance of tagselector and pass in the Javascript Object:

```javascript
var selectField = document.getElementById('someSelect');
var tagSelector = new TagSelector(selectField);
```

To reload a current instance, simply do the following:

```javascript
var selectField = document.getElementById('someSelect');
var tagSelector = new TagSelector(selectField);
tagSelector.reload();
```

You can also destroy the instance as follows:

```javascript
var selectField = document.getElementById('someSelect');
var tagSelector = new TagSelector(selectField);
tagSelector.destroy();
```
### Customization

Tag selector comes with a number of customizations that can be passed as an optional parameter:

```javascript
var selectField = document.getElementById('someSelect');
var tagSelector = new TagSelector(selectField, {
  max: 2,
  onInit: function() {
    console.log('inited!')
  },
  onDestroy: function() {
    console.log('destroyed!')
  },
  onSelect: function(value, text) {
    console.log(`Selected item with value: '${value}' and text: '${text}'`)
  },
  onDeselect: function(value, text) {
    console.log(`Deselected item with value: '${value}' and text: '${text}'`)
  }
});
```

| Setting | Description | Default |
| ------- | ----------- | ------- |
| max | Sets a maximum number of selects at a given time | false |
| onInit | Callback function after new instance of tag selector is created | false |
| onDestroy | Callback function after instance of tag selector is destroyed | false |
| onSelect | Callback function after a new tag is selected. Params received are option value and text | false |
| onDeselect | Callback function after a tag is deselected. Params received are option value and text | false |

## Styles

By default, the wrapper and tags don't come with any styling, leaving the look and feel completely up to you. The classes available to style are as follows:

| Class Name | Description |
| ---------- | ----------- |
| .tagselector-wrap | The wrapper div surrounding all tags |
| .tagselector-tag | Each individiual tag span |
| .active | Class applied to any actively selected tag |

If you would also like some basic styling out of the box, include ``dist/tagselector.css``.

## License

MIT License. See LICENSE.MD

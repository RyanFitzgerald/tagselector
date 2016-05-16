# TagCloud

TagCloud is a jQuery tag cloud generator. It uses the HTML mutiple select field to generate the tags and can be used in forms and anything else a normal HTML select field would be used in.

## Installation & Setup

All the installation that is required is simply including the compiled CSS and JS files in your document:

```html
<link rel="stylesheet" type="text/css" href="path/to/tagcloud.css">
...
<script src="text/css" href="path/to/tagcloud.js"></script>
```

TagCloud will now be available on every page it is included on.

## Demo

A demo can be found [here](http://ryanfitzgerald.github.io/tagcloud/demo.html).

## Configuration

The follow properties are available for TagCloud upon initialization:

 Property | Description | Default
 -------- | ----------- | -------
 Max | The Maximum Number of tags that can be selected | Infinite (No max)

Example usage:

```HTML
<select id="tagcloud" multiple>
	<option value="volvo">Volvo</option>
	<option value="saab">Saab</option>
	<option value="opel">Opel</option>
	<option value="audi">Audi</option>
	<option value="ford">Ford</option>
</select>
```

```js
<script>
$('#tagcloud').tagcloud({
	max: 3
});
</script>
```

## Customization

The base styling that comes with the tag cloud can be easily customized.

The followed classes are available (as well as what they are):

 Class Name | Description
 ---------- | -----------
 .tc-wrapper | Wraps the entire tag cloud (including hidden select)
 .tc-cloud | Wraps the tags
 .tc-tag | Individual Tags
 .tc-selected | Any currently selected tags

## License

MIT License (see LICENSE.md)

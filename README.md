# bleach
An awesome html image loader inspired by whatsapp image loader.

![Bleach Screenshot](http://i.imgur.com/uhaLVLo.png)

#### Dependencies
- jquery: >=1.10.2
- PHP: >= 5.2.6

#### Bower Package Managers

```sh
# Bower
bower install --save bleach

```

#### Usage

HTML Head Tag

```html
<link href='bleach/dist/css/bleach.css' rel='stylesheet'>
<script type="text/javascript" src='jquery/dist/jquery.js' ></script>
<script type="text/javascript" src='bleach/js/bleach.js' ></script>
```

Inserting Image to your HTML

```html
<div class='bleach' bl-width='400' bl-height='400' bl-src='demo/dog_1.jpg' id='1'></div>
```

Javascript

```html
<script>
$(function(){
	$.bleach({
		loaderColor:'#2ecff7',
		resizer:'./' //location of the resize.php file
	});
});
</script>
```

#### License

Copyright (c) 2016 Ryvan Prabhu

Licensed under the MIT license.

# endnotes

A tiny, vanilla JavaScript popup footnotes library.

* 0 dependencies
* 'Intelligent' popup placing
* before/after hooks
* ~4KB unminified and < 1 KB minified+gzipped

Demo: https://gromnitsky.users.sourceforge.net/js/examples/endnotes/example.html

![](example.png)

## Usage

    $ npm i endnotes

html:

~~~
<p>
  this requires an explanation <a class="footnote" href="#foo">1</a>
</p>

<p id="foo">
  hello
</p>
~~~

js:

~~~
<script type="module">
  import footnotes from './endnotes.js'
  footnotes('a.footnote')
</script>
~~~

This adds event listeners to everything that matches `a.footnote`
selector. When a user hovers over a link, it extracts inner html from
the place to which the link's href points & displays a popup.

The latter implies a local source of data, but you can provide your own
function for the data extraction:

    footnotes('a.footnote', {ref: myfunc})

`myfunc` will get 1 argument: a value of `href` attribute of an
hovered element.

Other possible options:

* `width` & `height` for the popup window;
* `before_hook` & `after_hook` functions; both get target element as
  an argument.

## Styling

The content of a footnote goes into
`#footnotes_dialog_12c1b560_content` div.

Some its properties (like `background` & `color`) are inlined by the
library, thus have the highest specificity. You'll need to use
`!important` flag to override such values:

~~~
#footnotes_dialog_12c1b560_content {
  background: floralwhite !important;
}
~~~

## License

MIT

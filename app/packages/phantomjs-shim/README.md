# PhantomJS Shim

[PhantomJS][phantomjs] 1.x is missing some core ECMAScript 5 functions, including the useful
`Function.bind()` method ([GitHub issue #10522][issue]). This package inserts a polyfill for `bind`
into the prototype of the `Function` object, making it available within PhantomJS tests.

Make sure to include this package in `.meteor/packages` or in your own package's list of
dependencies before any other packages that use `bind`.

[phantomjs]: http://phantomjs.org/
[issue]: https://github.com/ariya/phantomjs/issues/10522

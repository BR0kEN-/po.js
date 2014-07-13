po.js
=====

i10n for text in JS code. Based on pure JS.

Advantages
=====
1. Lightweight: ~0.5 kB
2. Caching the JSON into localStorage.

Usage
=====
- Create JSON file from PO and store it on your server in public folder. I suggest you to use this converter - https://localise.biz/free/converter/po-to-json
- Include po.js into your project. Better, if you include the script and set locale for it at the "head" section of document.
```html
<script src="po.js"></script>
```
- Initialize your translation by calling `locale()` method and pass link to your converted JSON file. Don't pass a link for default language. Extension of the file must be `.json`.
```javascript
pojs.locale('ru-RU');
```
- In all your JS files replace all untranslated messages.
```javascript
pojs('Hello world');
```
- Simple sprintf emulation:
```javascript
pojs('My name is %s, and I am %s years old', ['John', 99]);
```
- If JSON is not cached it can take some time for JSON loading. So you should wrap all your code:
```javascript
pojs.ready(function() {
    pojs('Hello world');
});
```

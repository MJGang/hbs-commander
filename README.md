[中文文档](README_ZH.md)

# hbs-commander

A tool to simplify Handlebars template operations

## Features

- Comment mode (default mode): Inject syntax rules by parsing Handlebars comments; Config mode: Implement functionality by parsing config type and attrs fields

  - Comment mode (default mode) -- Template syntax
  
    1. Basic structure

    ```hbs
    {{!-- OperationType :paramName="paramValue" --}}
    Operation content
    {{!-- /OperationType --}}
    ```

    2. Operation types

    Supported operation types: append, appendLeft, appendRight, update, prepend, prependLeft, prependRight, replace, replaceAll, overwrite, new, cover

    3. Parameter description

    Similar to Vue template attribute passing

    - Parameter format: `:paramName="paramValue"`
    - Parameter name: Refer to magic-string's corresponding parameters, [magic-string](https://github.com/Rich-Harris/magic-string?tab=readme-ov-file#methods)
    - Supported parameter value types:
      - String: `:str="'string content'"`
      - Boolean: `:isShow="true"`
      - Number: `:num="123"`
      - Object: `:obj="{a: 1, b: '2'}"`
      - Array: `:arr="[1, 2, 3]"`

- attrs supports append, appendLeft, appendRight, update, prepend, prependLeft, prependRight, replace, replaceAll, overwrite, new, cover operations
  - Attribute parameter passing, parameter types include string, boolean, object, array, etc.
- Supports two target insertion methods: Read from hbs file comments (default) or directly from config options

### Usage Examples

***append example***

**comment mode**

```hbs
// hbs file
{{!-- append --}}
<div class='new-content'>
  <p>append content</p>
</div>
{{!-- /append --}}
```

```js
import hbscmd from 'hsb-commander'

hbscmd({
  template: './example/template.hbs',
  target: './target/file.vue',
})
```

**config mode**

```hbs
// hbs file
<div class='new-content'>
  <p>append content</p>
</div>
```

```js
import hbscmd from 'hsb-commander'

hbscmd({
  template: './example/template.hbs',
  target: './target/file.vue',
  mode: 'config',
  type: 'append'
})
```

***new example***

**comment mode**

```hbs
// hbs file
{{!-- new --}}
<div>
  <p>new</p>
</div>
{{!-- /new --}}
```

```js
import hbscmd from 'hsb-commander'

hbscmd({
  template: './example/template.hbs',
  target: './target/file.vue',
})
```

**config mode**

```hbs
// hbs file
<div>
  <p>new</p>
</div>
```

```js
import hbscmd from 'hsb-commander'

hbscmd({
  template: './example/template.hbs',
  target: './target/file.vue',
  mode: 'config',
  type: 'new'
})

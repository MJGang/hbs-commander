[![npm version](https://img.shields.io/npm/v/hbs-commander.svg?style=flat-square)](https://www.npmjs.com/package/hbs-commander)
[![npm downloads](https://img.shields.io/npm/dm/hbs-commander.svg?style=flat-square)](https://npm-stat.com/charts.html?package=hbs-commander)
[![License](https://img.shields.io/npm/l/hbs-commander.svg?style=flat-square)](https://github.com/MJGang/hbs-commander/blob/main/LICENSE)

[中文文档](README_ZH.md)

# 🛠️ hbs-commander

A tool to simplify Handlebars template operations with precise control over content placement.

## ✨ Features

- **📝 Comment Mode**: Inject syntax rules by parsing Handlebars comments
- **⚙️ Config Mode**: Implement functionality through configuration options
- **🔧 Multiple Operations**: Supports append, prepend, replace, new, cover and more
- **🎯 Parameter Support**: Flexible parameter passing similar to Vue template syntax
- **🧙 Magic-string Integration**: Precise content manipulation with magic-string library
- **📁 Directory Processing**: Recursive directory handling
- **🔄 Auto Extension Handling**: Automatically remove .hbs extension
- **🚫 File Filtering**: Only process .hbs template files
- **📂 Auto Directory Creation**: Create missing target directories
- **⏱️ Deferred Write**: Prevent race conditions by deferring file writes

## 📦 Installation

```bash
# Using npm
npm install hbs-commander

# Using yarn 
yarn add hbs-commander

# Using pnpm
pnpm add hbs-commander
```

## 🚀 Usage

### Comment Mode (Default)

```hbs
{{!-- append --}}
<div class='new-content'>
  <p>append content</p>
</div>
{{!-- /append --}}
```

```javascript
import hbscmd from 'hbs-commander';

hbscmd({
  template: './template.hbs',
  target: './target/file.vue'
});
```

### Config Mode

```javascript
import hbscmd from 'hbs-commander';

hbscmd({
  template: './template.hbs',
  target: './target/file.vue',
  mode: 'config',
  type: 'append'
});
```

### Directory Processing Example

```javascript
// Process entire directory
hbscmd({
  template: './templates',  // Template directory
  target: './src',          // Target directory
  mode: 'comment'           // or 'config'
})
```

### Deferred Write Mode

Use deferred write to prevent race conditions when multiple operations modify the same file:

```javascript
// Multiple operations on the same file
await Promise.all([
  hbscmd({
    template: './template1.hbs',
    target: './target/file.vue',
    deferWrite: true  // Enable deferred write
  }),
  hbscmd({
    template: './template2.hbs',
    target: './target/file.vue',
    deferWrite: true  // Enable deferred write
  })
]);

// Flush all changes to disk after all operations are complete
await hbscmd.flushFileCache();
```

### Extension Handling Rules

Template naming convention:

- `filename.ext.hbs` → `filename.ext`
- `filename.hbs` → `filename`

Examples:

- `button.html.hbs` → `button.html`
- `main.js.hbs` → `main.js`
- `config.hbs` → `config`

## 📋 Supported Operations

| Operation | Description | Attrs |
|-----------|-------------|--------|
| ➕ append    | Append content to target | `newLine` |
| ⬅️ appendLeft | Append content to the left | `newLine`,`index`, `row`, `col` |
| ➡️ appendRight | Append content to the right | `newLine`,`index`, `row`, `col` |
| ⬆️ prepend   | Prepend content to target | `newLine` |
| ⏴ prependLeft | Prepend content to the left | `newLine`,`index` |
| ⏵ prependRight | Prepend content to the right | `newLine`,`index` |
| 🔄 replace   | Replace content in target | `regexpOrString` |
| 🆕 new       | Create new file with content |  |
| 🖊️ cover     | Overwrite target file with content |  |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Create a new Pull Request

## 📜 License

MIT © [MJGang](https://github.com/MJGang)

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

## 📋 Supported Operations

| Operation | Description |
|-----------|-------------|
| ➕ append    | Append content to target |
| ⬆️ prepend   | Prepend content to target |
| 🔄 replace   | Replace content in target |
| 🆕 new       | Create new file with content |
| 🖊️ cover     | Overwrite target file with content |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Create a new Pull Request

## 📜 License

MIT © [MJGang](https://github.com/MJGang)

# 🛠️ hbs-commander

一个简化 Handlebars 模板操作，精确控制内容放置的工具。

## ✨ 功能特性

- **📝 注释模式**：通过解析 Handlebars 注释来注入语法规则
- **⚙️ 配置模式**：通过配置选项实现功能
- **🔧 多种操作**：支持 append、prepend、replace、new、cover 等
- **🎯 参数支持**：灵活的参数传递，类似于 Vue 模板语法
- **🧙 Magic-string 集成**：使用 magic-string 库进行精确的内容操作
- **📁 目录处理**：支持递归处理整个目录结构
- **🔄 自动扩展名处理**：自动去除.hbs扩展名生成目标文件
- **🚫 文件过滤**：仅处理.hbs模板文件，忽略其他文件
- **📂 目录自动创建**：自动创建不存在的目标目录结构

## 📦 安装

```bash
# 使用 npm
npm install hbs-commander

# 使用 yarn
yarn add hbs-commander

# 使用 pnpm
pnpm add hbs-commander
```

## 🚀 使用

### 注释模式 (默认)

```hbs
{{!-- append --}}
<div class='new-content'>
  <p>append 内容</p>
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

### 配置模式

```javascript
import hbscmd from 'hbs-commander';

hbscmd({
  template: './template.hbs',
  target: './target/file.vue',
  mode: 'config',
  type: 'append'
});
```

### 目录处理示例

```javascript
// 处理整个目录
hbscmd({
  template: './templates',  // 模板目录
  target: './src',          // 目标目录
  mode: 'comment'           // 或 'config'
})
```

### 扩展名处理规则

模板文件命名规则：
- `文件名.扩展名.hbs` → 生成 `文件名.扩展名`
- `文件名.hbs` → 生成 `文件名`

示例：
- `button.html.hbs` → `button.html`
- `main.js.hbs` → `main.js`
- `config.hbs` → `config`

## 📋 支持的操作

| 操作 | 描述 | 属性 |
|---|---|---|
| ➕ append | 向目标追加内容 | `newLine` |
| ⬅️ appendLeft | 向左侧追加内容 | `newLine`,`index`, `row`, `col` |
| ➡️ appendRight | 向右侧追加内容 | `newLine`,`index`, `row`, `col` |
| ⬆️ prepend | 向目标前置内容 | `newLine` |
| ⏴ prependLeft | 向左侧前置内容 | `newLine`,`index` |
| ⏵ prependRight | 向右侧前置内容 | `newLine`,`index` |
| 🔄 replace | 替换目标中的内容 | `regexpOrString` |
| 🆕 new | 创建包含内容的新文件 |  |
| 🖊️ cover | 使用内容覆盖目标文件 |  |

## 🤝 贡献

欢迎贡献！请按照以下步骤进行：

1.  Fork 仓库
2.  创建一个新分支 (git checkout -b feature/your-feature)
3.  提交您的更改 (git commit -am 'Add some feature')
4.  推送到该分支 (git push origin feature/your-feature)
5.  创建一个新的 Pull Request

## 📜 许可证

MIT © [MJGang](https://github.com/MJGang)

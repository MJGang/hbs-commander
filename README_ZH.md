# 🛠️ hbs-commander

一个简化用户操作Handlebars模板的工具

## ✨ 功能描述

- **📝 comment模式（默认模式）**：通过解析Handlebars注释来注入语法规则
- **⚙️ config模式**：通过解析配置type和attrs字段来实现功能
- **🔧 多种操作**：支持append、prepend、replace、new、cover等操作
- **🎯 参数支持**：类似Vue模板的属性传参方式
- **🧙 magic-string集成**：使用magic-string库进行精确的内容操作

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

### comment模式（默认）

```hbs
{{!-- append --}}
<div class='new-content'>
  <p>append内容</p>
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

### config模式

```javascript
import hbscmd from 'hbs-commander';

hbscmd({
  template: './template.hbs',
  target: './target/file.vue',
  mode: 'config',
  type: 'append'
});
```

## 📋 支持的操作

| 操作 | 描述 |
|-----------|-------------|
| ➕ append    | 向目标追加内容 |
| ⬆️ prepend   | 向目标前置内容 |
| 🔄 replace   | 替换目标内容 |
| 🆕 new       | 创建新文件 |
| 🖊️ cover     | 覆盖目标文件 |

## 🤝 贡献指南

欢迎贡献！请按照以下步骤进行：

1. Fork 仓库
2. 创建新分支 (git checkout -b feature/你的功能)
3. 提交更改 (git commit -am '添加新功能')
4. 推送分支 (git push origin feature/你的功能)
5. 创建Pull Request

## 📜 许可证

MIT © [MJGang](https://github.com/MJGang)

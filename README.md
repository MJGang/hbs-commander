# hbs-commander

一个简化用户操作Handlebars模板的工具

## 功能

- 通过解析Handlebars注释来注入语法规则
- 支持insert和replace操作
- 支持属性传参，参数类型包括字符串、布尔值、对象、数组等

## 使用说明

### 模板语法

1. 基本结构
```hbs
{{!-- 操作类型 :参数名="参数值" --}}
操作内容
{{!-- /操作类型 --}}
```

2. 操作类型
- `insert`: 在指定位置插入内容
- `replace`: 替换指定范围的内容

3. 参数说明
- 参数格式：`:参数名="参数值"`
- 参数值支持类型：
  - 字符串：`:str="'字符串内容'"`
  - 布尔值：`:isShow="true"`
  - 数字：`:num="123"`
  - 对象：`:obj="{a: 1, b: '2'}"`
  - 数组：`:arr="[1, 2, 3]"`

### 使用案例

1. 插入操作
```hbs
{{!-- insert :startRow="10" :startCol="5" --}}
<div class="new-content">
  <p>这是新插入的内容</p>
</div>
{{!-- /insert --}}
```

2. 替换操作
```hbs
{{!-- replace :startRow="5" :startCol="1" :endRow="8" :endCol="10" --}}
<div class="replaced-content">
  <p>这是替换后的内容</p>
</div>
{{!-- /replace --}}
```

3. 复杂参数示例
```hbs
{{!-- insert :startRow="1" :startCol="0" --}}
<MyComponent :title="config.props.title" />
{{!-- /insert --}}

{{!-- replace :startRow="5" :startCol="1" :endRow="8" :endCol="10" --}}
<div class="replaced-content">
  <p>这是替换后的内容</p>
</div>
{{!-- /replace --}}
```

## 开发指南

1. 安装依赖
```bash
pnpm install
```

2. 运行测试
```bash
pnpm test
```

3. 代码格式化
```bash
pnpm format
```

## 测试说明

测试用例位于`test/`目录下，包含：
- insert操作测试
- replace操作测试

每个测试包含：
- 模板文件(.hbs)
- 目标文件(.vue)
- 测试脚本(.test.js)

# hbs-commander

一个简化用户操作Handlebars模板的工具

## 功能描述

- comment模式（默认模式）：通过解析Handlebars注释来注入语法规则；config模式：通过解析配置type和attrs字段来实现功能
  - comment模式（默认模式） -- 模板语法
    1. 基本结构

    ```hbs
    {{!-- 操作类型 :参数名="参数值" --}}
    操作内容
    {{!-- /操作类型 --}}
    ```

    2. 操作类型

    操作类型支持：append、appendLeft、appendRight、update、prepend、prependLeft 、prependRight 、replace、replaceAll、overwrite、new、cover

    3. 参数说明

    类似vue模板的属性传参方式

    - 参数格式：`:参数名="参数值"`
    - 参数名：参考magic-string的对应入参，[magic-string](https://github.com/Rich-Harris/magic-string?tab=readme-ov-file#methods)
    - 参数值支持类型：
      - 字符串：`:str="'字符串内容'"`
      - 布尔值：`:isShow="true"`
      - 数字：`:num="123"`
      - 对象：`:obj="{a: 1, b: '2'}"`
      - 数组：`:arr="[1, 2, 3]"`

- attrs支持append、appendLeft、appendRight、update、prepend、prependLeft 、prependRight 、replace、replaceAll、overwrite、new、cover操作
  - 属性传参，参数类型包括字符串、布尔值、对象、数组等
- 支持两种目标插入方式：从hbs文件注释内读取（默认）或直接从配置选项中读取

### 使用案例

***append 示例***

**comment 模式**

```hbs
// hbs文件
{{!-- append --}}
<div class='new-content'>
  <p>append内容</p>
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

**config模式**

```hbs
// hbs文件
<div class='new-content'>
  <p>append内容</p>
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

***new 示例***

**comment 模式**

```hbs
// hbs文件
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

**config模式**

```hbs
// hbs文件
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
```

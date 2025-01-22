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

操作类型支持：append、appendLeft、appendRight、update、prepend、prependLeft 、prependRight 、replace、replaceAll、overwrite

3. 参数说明

- 参数格式：`:参数名="参数值"`
- 参数名：参考magic-string的对应入参，[magic-string](https://github.com/Rich-Harris/magic-string?tab=readme-ov-file#methods)
- 参数值支持类型：
  - 字符串：`:str="'字符串内容'"`
  - 布尔值：`:isShow="true"`
  - 数字：`:num="123"`
  - 对象：`:obj="{a: 1, b: '2'}"`
  - 数组：`:arr="[1, 2, 3]"`

### 使用案例

#### 模板语法

1. append

```hbs
{{!-- append --}}
<div class='new-content'>
  <p>append内容</p>
</div>
{{!-- /append --}}
```

2. appendLeft

```hbs
{{!-- appendLeft :index="2" --}}
<div class='new-content'>
  <p>appendLeft内容</p>
</div>
{{!-- /appendLeft --}}
```

3. appendRight

```hbs
{{!-- appendRight :index="2" --}}
<div class='new-content'>
  <p>appendRight内容</p>
</div>
{{!-- /appendRight --}}
```

4. update

```hbs
{{!-- update :start="2" :end="4" --}}
<div class='new-content'>
  <p>update内容</p>
</div>
{{!-- /update --}}
```

5. prepend

```hbs
{{!-- prepend --}}
<div class='new-content'>
  <p>prepend内容</p>
</div>
{{!-- /prepend --}}
```

6. prependLeft 

```hbs
{{!-- prependLeft :index="3" --}}
<div class='new-content'>
  <p>prependLeft  内容</p>
</div>
{{!-- /prependLeft --}}
```

7. prependRight

```hbs
{{!-- prependRight :index="3" --}}
<div class='new-content'>
  <p>prependRight  内容</p>
</div>
{{!-- /prependRight --}}
```

8. replace

```hbs
{{!-- replace :regexpOrString="'old内容'" --}}
<div class='new-content'>
  <p>replace 内容</p>
</div>
{{!-- /replace --}}
```

9. replaceAll

```hbs
{{!-- replaceAll :regexpOrString="'old内容'" --}}
<div class='new-content'>
  <p>replaceAll 内容</p>
</div>
{{!-- /replaceAll --}}
```

10. overwrite

```hbs
{{!-- overwrite :start="2" :end="4" --}}
<div class='new-content'>
  <p>overwrite 内容</p>
</div>
{{!-- /overwrite --}}
```

11. new

```hbs
{{!-- new --}}
<div class='new-content'>
  <p>new 内容</p>
</div>
{{!-- /new --}}
```

10. cover

```hbs
{{!-- cover --}}
<div class='new-content'>
  <p>cover 内容</p>
</div>
{{!-- /cover --}}
```

#### js调用

```js
import hbscmd from 'hsb-commander'

hbscmd({
  template: './example/template.hbs',
  target: './target/file.vue',
})
```

# Cú pháp Template {#template-syntax}

<ScrimbaLink href="https://scrimba.com/links/vue-template-syntax" title="Free Vue.js Template Syntax Lesson" type="scrimba">
  Xem bài học video tương tác trên Scrimba
</ScrimbaLink>

Vue sử dụng cú pháp template dựa trên HTML cho phép bạn khai báo liên kết DOM được render với dữ liệu của instance component bên dưới. Tất cả template của Vue đều là HTML hợp lệ về mặt cú pháp và có thể được phân tích bởi các trình duyệt và trình phân tích HTML tuân thủ tiêu chuẩn.

Dưới bề mặt, Vue biên dịch các template thành mã JavaScript được tối ưu hóa cao. Kết hợp với hệ thống reactivity, Vue có thể thông minh xác định số lượng component tối thiểu cần render lại và áp dụng số lượng thao tác DOM tối thiểu khi trạng thái ứng dụng thay đổi.

Nếu bạn quen thuộc với các khái niệm Virtual DOM và thích sức mạnh thô của JavaScript, bạn cũng có thể [viết trực tiếp các hàm render](/guide/extras/render-function) thay vì template, với hỗ trợ JSX tùy chọn. Tuy nhiên, hãy lưu ý rằng chúng không được hưởng cùng mức độ tối ưu hóa tại thời điểm biên dịch như template.

## Nội suy Văn bản {#text-interpolation}

Hình thức cơ bản nhất của ràng buộc dữ liệu là nội suy văn bản sử dụng cú pháp "Mustache" (dấu ngoặc nhọn kép):

```vue-html
<span>Message: {{ msg }}</span>
```

Thẻ mustache sẽ được thay thế bằng giá trị của thuộc tính `msg` [từ instance component tương ứng](/guide/essentials/reactivity-fundamentals#declaring-reactive-state). Nó cũng sẽ được cập nhật bất cứ khi nào thuộc tính `msg` thay đổi.

## HTML Thô {#raw-html}

Dấu ngoặc nhọn kép diễn giải dữ liệu là văn bản thuần túy, không phải HTML. Để xuất HTML thực tế, bạn sẽ cần sử dụng [directive `v-html`](/api/built-in-directives#v-html):

```vue-html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">This should be red.</span>'
</script>

<div class="demo">
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</div>

Ở đây chúng ta đang gặp một cái mới. Thuộc tính `v-html` mà bạn đang thấy được gọi là một **directive**. Các directive có tiền tố `v-` để chỉ ra rằng chúng là các thuộc tính đặc biệt được cung cấp bởi Vue, và như bạn có thể đoán, chúng áp dụng hành vi reactive đặc biệt cho DOM được render. Ở đây, chúng ta cơ bản đang nói "giữ inner HTML của phần tử này được cập nhật với thuộc tính `rawHtml` trên instance đang hoạt động."

Nội dung của `span` sẽ được thay thế bằng giá trị của thuộc tính `rawHtml`, được diễn giải là HTML thuần túy - các ràng buộc dữ liệu bị bỏ qua. Lưu ý rằng bạn không thể sử dụng `v-html` để soạn các phần template, vì Vue không phải là một engine template dựa trên chuỗi. Thay vào đó, các component được ưu tiên làm đơn vị cơ bản cho việc tái sử dụng và kết hợp UI.

:::warning Cảnh báo Bảo mật
Render động HTML tùy ý trên trang web của bạn có thể rất nguy hiểm vì nó có thể dễ dàng dẫn đến [lỗ hổng XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Chỉ sử dụng `v-html` trên nội dung tin cậy và **không bao giờ** trên nội dung do người dùng cung cấp.
:::

## Attribute Bindings {#attribute-bindings}

Mustaches cannot be used inside HTML attributes. Instead, use a [`v-bind` directive](/api/built-in-directives#v-bind):

```vue-html
<div v-bind:id="dynamicId"></div>
```

Directive `v-bind` chỉ thị Vue giữ thuộc tính `id` của phần tử đồng bộ với thuộc tính `dynamicId` của component. Nếu giá trị được liên kết là `null` hoặc `undefined`, thì thuộc tính sẽ bị xóa khỏi phần tử được render.

### Shorthand {#shorthand}

Vì `v-bind` được sử dụng rất phổ biến, nó có một cú pháp viết tắt chuyên dụng:

```vue-html
<div :id="dynamicId"></div>
```

Các thuộc tính bắt đầu bằng `:` có thể trông hơi khác so với HTML bình thường, nhưng thực tế đó là một ký tự hợp lệ cho tên thuộc tính và tất cả các trình duyệt được Vue hỗ trợ có thể phân tích nó chính xác. Ngoài ra, chúng không xuất hiện trong markup được render cuối cùng. Cú pháp viết tắt là tùy chọn, nhưng bạn có thể sẽ đánh giá cao nó khi bạn tìm hiểu thêm về cách sử dụng của nó sau này.

> For the rest of the guide, we will be using the shorthand syntax in code examples, as that's the most common usage for Vue developers.

### Same-name Shorthand {#same-name-shorthand}

- Only supported in 3.4+

If the attribute has the same name as the variable name of the JavaScript value being bound, the syntax can be further shortened to omit the attribute value:

```vue-html
<!-- same as :id="id" -->
<div :id></div>

<!-- this also works -->
<div v-bind:id></div>
```

This is similar to the property shorthand syntax when declaring objects in JavaScript. Note this is a feature that is only available in Vue 3.4 and above.

### Boolean Attributes {#boolean-attributes}

[Boolean attributes](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) are attributes that can indicate true / false values by their presence on an element. For example, [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) is one of the most commonly used boolean attributes.

`v-bind` works a bit differently in this case:

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

The `disabled` attribute will be included if `isButtonDisabled` has a [truthy value](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). It will also be included if the value is an empty string, maintaining consistency with `<button disabled="">`. For other [falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) the attribute will be omitted.

### Dynamically Binding Multiple Attributes {#dynamically-binding-multiple-attributes}

If you have a JavaScript object representing multiple attributes that looks like this:

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

You can bind them to a single element by using `v-bind` without an argument:

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## Using JavaScript Expressions {#using-javascript-expressions}

So far we've only been binding to simple property keys in our templates. But Vue actually supports the full power of JavaScript expressions inside all data bindings:

```vue-html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

These expressions will be evaluated as JavaScript in the data scope of the current component instance.

In Vue templates, JavaScript expressions can be used in the following positions:

- Inside text interpolations (mustaches)
- In the attribute value of any Vue directives (special attributes that start with `v-`)

### Expressions Only {#expressions-only}

Each binding can only contain **one single expression**. An expression is a piece of code that can be evaluated to a value. A simple check is whether it can be used after `return`.

Therefore, the following will **NOT** work:

```vue-html
<!-- this is a statement, not an expression: -->
{{ var a = 1 }}

<!-- flow control won't work either, use ternary expressions -->
{{ if (ok) { return message } }}
```

### Calling Functions {#calling-functions}

It is possible to call a component-exposed method inside a binding expression:

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
Functions called inside binding expressions will be called every time the component updates, so they should **not** have any side effects, such as changing data or triggering asynchronous operations.
:::

### Restricted Globals Access {#restricted-globals-access}

Template expressions are sandboxed and only have access to a [restricted list of globals](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3). The list exposes commonly used built-in globals such as `Math` and `Date`.

Globals not explicitly included in the list, for example user-attached properties on `window`, will not be accessible in template expressions. You can, however, explicitly define additional globals for all Vue expressions by adding them to [`app.config.globalProperties`](/api/application#app-config-globalproperties).

## Directives {#directives}

Directives are special attributes with the `v-` prefix. Vue provides a number of [built-in directives](/api/built-in-directives), including `v-html` and `v-bind` which we have introduced above.

Directive attribute values are expected to be single JavaScript expressions (with the exception of `v-for`, `v-on` and `v-slot`, which will be discussed in their respective sections later). A directive's job is to reactively apply updates to the DOM when the value of its expression changes. Take [`v-if`](/api/built-in-directives#v-if) as an example:

```vue-html
<p v-if="seen">Now you see me</p>
```

Here, the `v-if` directive would remove or insert the `<p>` element based on the truthiness of the value of the expression `seen`.

### Arguments {#arguments}

Some directives can take an "argument", denoted by a colon after the directive name. For example, the `v-bind` directive is used to reactively update an HTML attribute:

```vue-html
<a v-bind:href="url"> ... </a>

<!-- shorthand -->
<a :href="url"> ... </a>
```

Here, `href` is the argument, which tells the `v-bind` directive to bind the element's `href` attribute to the value of the expression `url`. In the shorthand, everything before the argument (i.e., `v-bind:`) is condensed into a single character, `:`.

Another example is the `v-on` directive, which listens to DOM events:

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- shorthand -->
<a @click="doSomething"> ... </a>
```

Here, the argument is the event name to listen to: `click`. `v-on` has a corresponding shorthand, namely the `@` character. We will talk about event handling in more detail too.

### Dynamic Arguments {#dynamic-arguments}

It is also possible to use a JavaScript expression in a directive argument by wrapping it with square brackets:

```vue-html
<!--
Note that there are some constraints to the argument expression,
as explained in the "Dynamic Argument Value Constraints" and "Dynamic Argument Syntax Constraints" sections below.
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- shorthand -->
<a :[attributeName]="url"> ... </a>
```

Here, `attributeName` will be dynamically evaluated as a JavaScript expression, and its evaluated value will be used as the final value for the argument. For example, if your component instance has a data property, `attributeName`, whose value is `"href"`, then this binding will be equivalent to `v-bind:href`.

Similarly, you can use dynamic arguments to bind a handler to a dynamic event name:

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- shorthand -->
<a @[eventName]="doSomething"> ... </a>
```

In this example, when `eventName`'s value is `"focus"`, `v-on:[eventName]` will be equivalent to `v-on:focus`.

#### Dynamic Argument Value Constraints {#dynamic-argument-value-constraints}

Dynamic arguments are expected to evaluate to a string, with the exception of `null`. The special value `null` can be used to explicitly remove the binding. Any other non-string value will trigger a warning.

#### Dynamic Argument Syntax Constraints {#dynamic-argument-syntax-constraints}

Dynamic argument expressions have some syntax constraints because certain characters, such as spaces and quotes, are invalid inside HTML attribute names. For example, the following is invalid:

```vue-html
<!-- This will trigger a compiler warning. -->
<a :['foo' + bar]="value"> ... </a>
```

If you need to pass a complex dynamic argument, it's probably better to use a [computed property](./computed), which we will cover shortly.

When using in-DOM templates (templates directly written in an HTML file), you should also avoid naming keys with uppercase characters, as browsers will coerce attribute names into lowercase:

```vue-html
<a :[someAttr]="value"> ... </a>
```

The above will be converted to `:[someattr]` in in-DOM templates. If your component has a `someAttr` property instead of `someattr`, your code won't work. Templates inside Single-File Components are **not** subject to this constraint.

### Modifiers {#modifiers}

Modifiers are special postfixes denoted by a dot, which indicate that a directive should be bound in some special way. For example, the `.prevent` modifier tells the `v-on` directive to call `event.preventDefault()` on the triggered event:

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

You'll see other examples of modifiers later, [for `v-on`](./event-handling#event-modifiers) and [for `v-model`](./forms#modifiers), when we explore those features.

And finally, here's the full directive syntax visualized:

![directive syntax graph](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->

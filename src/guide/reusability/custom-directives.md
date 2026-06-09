# Custom Directives {#custom-directives}

<script setup>
const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}
</script>

<style>
.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}
</style>

## Giới thiệu {#introduction}

Ngoài bộ directive mặc định được tích hợp sẵn trong core (như `v-model` hoặc `v-show`), Vue cũng cho phép bạn đăng ký custom directive của riêng mình.

Chúng ta đã giới thiệu hai hình thức tái sử dụng code trong Vue: [component](/guide/essentials/component-basics) và [composable](./composables). Component là các khối xây dựng chính, trong khi composable tập trung vào việc tái sử dụng logic có trạng thái. Custom directive, mặt khác, chủ yếu dành cho việc tái sử dụng logic liên quan đến việc truy cập DOM ở mức thấp trên các phần tử thuần túy.

Một custom directive được định nghĩa là một object chứa các lifecycle hook tương tự như của một component. Các hook nhận phần tử mà directive được gắn vào. Dưới đây là ví dụ về một directive thêm class vào một phần tử khi nó được chèn vào DOM bởi Vue:

<div class="composition-api">

```vue
<script setup>
// cho phép sử dụng v-highlight trong template
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

</div>

<div class="options-api">

```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // cho phép sử dụng v-highlight trong template
    highlight
  }
}
```

```vue-html
<p v-highlight>This sentence is important!</p>
```

</div>

<div class="demo">
  <p v-highlight>This sentence is important!</p>
</div>

<div class="composition-api">

Trong `<script setup>`, bất kỳ biến camelCase nào bắt đầu bằng tiền tố `v` đều có thể được sử dụng như một custom directive. Trong ví dụ trên, `vHighlight` có thể được sử dụng trong template như `v-highlight`.

Nếu bạn không sử dụng `<script setup>`, custom directive có thể được đăng ký bằng option `directives`:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // cho phép sử dụng v-highlight trong template
    highlight: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Tương tự như component, custom directive phải được đăng ký để có thể được sử dụng trong template. Trong ví dụ trên, chúng ta đang sử dụng đăng ký cục bộ thông qua option `directives`.

</div>

Việc đăng ký global custom directive ở cấp app cũng rất phổ biến:

```js
const app = createApp({})

// cho phép sử dụng v-highlight trong tất cả component
app.directive('highlight', {
  /* ... */
})
```

Có thể gõ type cho global custom directive bằng cách mở rộng interface `GlobalDirectives` từ `vue`

Chi tiết thêm: [Typing Custom Global Directives](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

## Khi nào nên sử dụng custom directive {#when-to-use}

Custom directive chỉ nên được sử dụng khi chức năng mong muốn chỉ có thể đạt được thông qua thao tác trực tiếp với DOM.

Một ví dụ phổ biến là custom directive `v-focus` giúp đưa một phần tử vào trạng thái focus.

<div class="composition-api">

```vue
<script setup>
// cho phép sử dụng v-focus trong template
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // cho phép sử dụng v-focus trong template
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

Directive này hữu ích hơn thuộc tính `autofocus` vì nó không chỉ hoạt động khi tải trang - nó cũng hoạt động khi phần tử được chèn động bởi Vue!

Khuyến nghị sử dụng template declarative với các directive tích hợp sẵn như `v-bind` khi có thể vì chúng hiệu quả hơn và thân thiện với server-rendering.

## Directive Hooks {#directive-hooks}

Một object định nghĩa directive có thể cung cấp một số hook function (tất cả đều tùy chọn):

```js
const myDirective = {
  // được gọi trước khi thuộc tính của phần tử được gắn
  // hoặc event listener được áp dụng
  created(el, binding, vnode) {
    // xem bên dưới để biết chi tiết về các tham số
  },
  // được gọi ngay trước khi phần tử được chèn vào DOM.
  beforeMount(el, binding, vnode) {},
  // được gọi khi component cha của phần tử được gắn
  // và tất cả con của nó đã được mount.
  mounted(el, binding, vnode) {},
  // được gọi trước khi component cha được cập nhật
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // được gọi sau khi component cha và
  // tất cả con của nó đã được cập nhật
  updated(el, binding, vnode, prevVnode) {},
  // được gọi trước khi component cha được unmount
  beforeUnmount(el, binding, vnode) {},
  // được gọi khi component cha được unmount
  unmounted(el, binding, vnode) {}
}
```

### Hook Arguments {#hook-arguments}

Directive hooks nhận các tham số sau:

- `el`: phần tử mà directive được gắn vào. Điều này có thể được sử dụng để thao tác trực tiếp với DOM.

- `binding`: một object chứa các thuộc tính sau.

  - `value`: Giá trị được truyền cho directive. Ví dụ trong `v-my-directive="1 + 1"`, giá trị sẽ là `2`.
  - `oldValue`: Giá trị trước đó, chỉ có sẵn trong `beforeUpdate` và `updated`. Nó có sẵn bất kể giá trị có thay đổi hay không.
  - `arg`: Tham số được truyền cho directive, nếu có. Ví dụ trong `v-my-directive:foo`, arg sẽ là `"foo"`.
  - `modifiers`: Một object chứa các modifier, nếu có. Ví dụ trong `v-my-directive.foo.bar`, object modifiers sẽ là `{ foo: true, bar: true }`.
  - `instance`: Instance của component nơi directive được sử dụng.
  - `dir`: object định nghĩa directive.

- `vnode`: VNode bên dưới đại diện cho phần tử được gắn.
- `prevVnode`: VNode đại diện cho phần tử được gắn từ lần render trước. Chỉ có sẵn trong các hook `beforeUpdate` và `updated`.

Làm ví dụ, hãy xem cách sử dụng directive sau:

```vue-html
<div v-example:foo.bar="baz">
```

Tham số `binding` sẽ là một object có dạng:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* giá trị của `baz` */,
  oldValue: /* giá trị của `baz` từ lần cập nhật trước */
}
```

Tương tự như các directive tích hợp sẵn, tham số custom directive có thể là động. Ví dụ:

```vue-html
<div v-example:[arg]="value"></div>
```

Ở đây tham số directive sẽ được cập nhật reactively dựa trên thuộc tính `arg` trong trạng thái component của chúng ta.

:::tip Lưu ý
Ngoài `el`, bạn nên coi các tham số này là read-only và không bao giờ sửa đổi chúng. Nếu bạn cần chia sẻ thông tin giữa các hook, khuyến nghị làm như vậy thông qua [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) của phần tử.
:::

## Function Shorthand {#function-shorthand}

Rất phổ biến khi một custom directive có cùng hành vi cho `mounted` và `updated`, không cần các hook khác. Trong những trường hợp như vậy, chúng ta có thể định nghĩa directive như một function:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // điều này sẽ được gọi cho cả `mounted` và `updated`
  el.style.color = binding.value
})
```

## Object Literals {#object-literals}

Nếu directive của bạn cần nhiều giá trị, bạn cũng có thể truyền vào một object literal của JavaScript. Hãy nhớ rằng, directive có thể nhận bất kỳ biểu thức JavaScript hợp lệ nào.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Sử dụng trên Component {#usage-on-components}

:::warning Không khuyến nghị
Sử dụng custom directive trên component không được khuyến nghị. Hành vi không mong muốn có thể xảy ra khi một component có nhiều root node.
:::

Khi được sử dụng trên component, custom directive sẽ luôn áp dụng cho root node của component, tương tự như [Fallthrough Attributes](/guide/components/attrs).

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- template của MyComponent -->

<div> <!-- directive v-demo sẽ được áp dụng ở đây -->
  <span>My component content</span>
</div>
```

Lưu ý rằng component có thể có nhiều hơn một root node. Khi được áp dụng cho một component multi-root, directive sẽ bị bỏ qua và một cảnh báo sẽ được ném ra. Khác với thuộc tính, directive không thể được truyền cho một phần tử khác với `v-bind="$attrs"`.

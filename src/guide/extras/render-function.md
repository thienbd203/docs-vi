---
outline: deep
---

# Hàm Render & JSX {#render-functions-jsx}

Vue khuyến nghị sử dụng template để xây dựng ứng dụng trong phần lớn các trường hợp. Tuy nhiên, có những tình huống chúng ta cần toàn bộ sức mạnh lập trình của JavaScript. Đó là lúc chúng ta có thể sử dụng **hàm render**.

> Nếu bạn mới làm quen với khái niệm virtual DOM và hàm render, hãy đảm bảo đọc chương [Cơ chế Render](/guide/extras/rendering-mechanism) trước.

## Cách Sử Dụng Cơ Bản {#basic-usage}

### Tạo Vnodes {#creating-vnodes}

Vue cung cấp hàm `h()` để tạo vnodes:

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

`h()` là viết tắt của **hyperscript** - có nghĩa là "JavaScript tạo ra HTML (hypertext markup language)". Tên này được kế thừa từ các quy ước chung của nhiều triển khai virtual DOM. Một cái tên mô tả hơn có thể là `createVNode()`, nhưng tên ngắn hơn sẽ hữu ích khi bạn phải gọi hàm này nhiều lần trong một hàm render.

Hàm `h()` được thiết kế để rất linh hoạt:

```js
// tất cả các tham số ngoại trừ type là tùy chọn
h('div')
h('div', { id: 'foo' })

// cả attributes và properties đều có thể được sử dụng trong props
// Vue tự động chọn cách gán phù hợp
h('div', { class: 'bar', innerHTML: 'hello' })

// các modifier của props như `.prop` và `.attr` có thể được thêm
// với tiền tố `.` và `^` tương ứng
h('div', { '.name': 'some-name', '^width': '100' })

// class và style có cùng hỗ trợ giá trị object / array
// như trong template
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// event listeners nên được truyền dưới dạng onXxx
h('div', { onClick: () => {} })

// children có thể là một chuỗi
h('div', { id: 'foo' }, 'hello')

// props có thể được bỏ qua khi không có props
h('div', 'hello')
h('div', [h('span', 'hello')])

// mảng children có thể chứa vnode và chuỗi trộn lẫn
h('div', ['hello', h('span', 'hello')])
```

Vnode kết quả có cấu trúc như sau:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Lưu ý
Interface `VNode` đầy đủ chứa nhiều thuộc tính nội bộ khác, nhưng được khuyến nghị mạnh mẽ là tránh phụ thuộc vào bất kỳ thuộc tính nào khác ngoài những thuộc tính được liệt kê ở đây. Điều này giúp tránh các lỗi không mong muốn trong trường hợp các thuộc tính nội bộ bị thay đổi.
:::

### Khai Báo Hàm Render {#declaring-render-functions}

<div class="composition-api">

Khi sử dụng template với Composition API, giá trị trả về của hook `setup()` được sử dụng để expose dữ liệu cho template. Tuy nhiên, khi sử dụng hàm render, chúng ta có thể trả về trực tiếp hàm render thay vì:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // trả về hàm render
    return () => h('div', props.msg + count.value)
  }
}
```

Hàm render được khai báo bên trong `setup()` nên nó tự nhiên có quyền truy cập vào props và bất kỳ trạng thái phản ứng nào được khai báo trong cùng phạm vi.

Ngoài việc trả về một vnode duy nhất, bạn cũng có thể trả về chuỗi hoặc mảng:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // sử dụng mảng để trả về nhiều node gốc
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Đảm bảo trả về một hàm thay vì trả về trực tiếp các giá trị! Hàm `setup()` chỉ được gọi một lần cho mỗi component, trong khi hàm render được trả về sẽ được gọi nhiều lần.
:::

</div>
<div class="options-api">

Chúng ta có thể khai báo hàm render bằng cách sử dụng tùy chọn `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Hàm `render()` có quyền truy cập vào instance của component thông qua `this`.

Ngoài việc trả về một vnode duy nhất, bạn cũng có thể trả về chuỗi hoặc mảng:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // sử dụng mảng để trả về nhiều node gốc
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Nếu một component hàm render không cần bất kỳ trạng thái instance nào, chúng cũng có thể được khai báo trực tiếp dưới dạng một hàm để ngắn gọn hơn:

```js
function Hello() {
  return 'hello world!'
}
```

Đúng vậy, đây là một component Vue hợp lệ! Xem [Functional Components](#functional-components) để biết thêm chi tiết về cú pháp này.

### Vnodes Phải Là Duy Nhất {#vnodes-must-be-unique}

Tất cả các vnode trong cây component phải là duy nhất. Điều này có nghĩa là hàm render sau đây không hợp lệ:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Rất tệ - vnode trùng lặp!
    p,
    p
  ])
}
```

Nếu bạn thực sự muốn nhân bản cùng một element/component nhiều lần, bạn có thể làm điều đó với một hàm factory. Ví dụ, hàm render sau đây là một cách hoàn toàn hợp lệ để render 20 đoạn văn bản giống hệt nhau:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

### Sử Dụng Vnodes trong `<template>` {#using-vnodes-in-template}

```vue
<script setup>
import { h } from 'vue'

const vnode = h('button', ['Hello'])
</script>

<template>
  <!-- Thông qua <component /> -->
  <component :is="vnode">Hi</component>

  <!-- Hoặc trực tiếp như một element -->
  <vnode />
  <vnode>Hi</vnode>
</template>
```

Một đối tượng vnode đã được khai báo trong `setup()`, bạn có thể sử dụng nó như một component bình thường để render.

:::warning
Một vnode đại diện cho một đầu ra render đã được tạo, không phải là định nghĩa component. Sử dụng vnode trong `<template>` không tạo ra một instance component mới, và vnode sẽ được render như hiện có.

Mẫu này nên được sử dụng cẩn thận và không phải là thay thế cho các component bình thường.
:::

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) là một phần mở rộng giống XML của JavaScript cho phép chúng ta viết mã như sau:

```jsx
const vnode = <div>hello</div>
```

Bên trong các biểu thức JSX, sử dụng dấu ngoặc nhọn để nhúng các giá trị động:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

Cả `create-vue` và Vue CLI đều có các tùy chọn để scaffold dự án với hỗ trợ JSX được cấu hình sẵn. Nếu bạn đang cấu hình JSX thủ công, vui lòng tham khảo tài liệu của [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) để biết chi tiết.

Mặc dù được giới thiệu lần đầu bởi React, JSX thực sự không có ngữ nghĩa runtime được định nghĩa và có thể được biên dịch thành nhiều đầu ra khác nhau. Nếu bạn đã làm việc với JSX trước đây, hãy lưu ý rằng **Vue JSX transform khác với React JSX transform**, vì vậy bạn không thể sử dụng React JSX transform trong các ứng dụng Vue. Một số khác biệt đáng chú ý so với React JSX bao gồm:

- Bạn có thể sử dụng các HTML attributes như `class` và `for` như props - không cần sử dụng `className` hoặc `htmlFor`.
- Truyền children cho các component (tức là slots) [hoạt động khác nhau](#passing-slots).

Định nghĩa kiểu của Vue cũng cung cấp suy luận kiểu cho việc sử dụng TSX. Khi sử dụng TSX, hãy đảm bảo chỉ định `"jsx": "preserve"` trong `tsconfig.json` để TypeScript giữ nguyên cú pháp JSX để Vue JSX transform xử lý.

### Suy Luận Kiểu JSX {#jsx-type-inference}

Tương tự như transform, JSX của Vue cũng cần các định nghĩa kiểu khác nhau.

Bắt đầu từ Vue 3.4, Vue không còn đăng ký ngầm namespace `JSX` toàn cầu. Để hướng dẫn TypeScript sử dụng định nghĩa kiểu JSX của Vue, hãy đảm bảo bao gồm những điều sau trong `tsconfig.json` của bạn:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Bạn cũng có thể chọn tham gia cho từng file bằng cách thêm một comment `/* @jsxImportSource vue */` ở đầu file.

Nếu có mã phụ thuộc vào sự hiện diện của namespace `JSX` toàn cầu, bạn có thể giữ lại hành vi toàn cầu trước 3.4 chính xác bằng cách nhập hoặc tham chiếu rõ ràng `vue/jsx` trong dự án của bạn, điều này đăng ký namespace `JSX` toàn cầu.

## Công Thức Hàm Render {#render-function-recipes}

Dưới đây chúng ta sẽ cung cấp một số công thức phổ biến để triển khai các tính năng template dưới dạng hàm render / JSX tương đương.

### `v-if` {#v-if}

Template:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Hàm render / JSX tương đương:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Template:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Hàm render / JSX tương đương:

<div class="composition-api">

```js
h(
  'ul',
  // giả sử `items` là một ref với giá trị mảng
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Các props có tên bắt đầu bằng `on` theo sau là một chữ cái viết hoa được coi là event listeners. Ví dụ, `onClick` tương đương với `@click` trong template.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Click Me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Click Me
</button>
```

#### Event Modifiers {#event-modifiers}

Đối với các event modifier `.passive`, `.capture`, và `.once`, chúng có thể được nối sau tên sự kiện bằng cách sử dụng camelCase.

Ví dụ:

```js
h('input', {
  onClickCapture() {
    /* listener ở chế độ capture */
  },
  onKeyupOnce() {
    /* chỉ kích hoạt một lần */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Đối với các event và key modifier khác, helper [`withModifiers`](/api/render-function#withmodifiers) có thể được sử dụng:

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Components {#components}

Để tạo một vnode cho một component, tham số đầu tiên được truyền cho `h()` nên là định nghĩa component. Điều này có nghĩa là khi sử dụng hàm render, không cần đăng ký component - bạn có thể sử dụng trực tiếp các component đã nhập:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Như chúng ta có thể thấy, `h` có thể hoạt động với các component được nhập từ bất kỳ định dạng file nào miễn là nó là một component Vue hợp lệ.

Các component động rất đơn giản với hàm render:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Nếu một component được đăng ký theo tên và không thể nhập trực tiếp (ví dụ, được đăng ký toàn cầu bởi một thư viện), nó có thể được giải quyết theo chương trình bằng cách sử dụng helper [`resolveComponent()`](/api/render-function#resolvecomponent).

### Render Slots {#rendering-slots}

<div class="composition-api">

Trong hàm render, slots có thể được truy cập từ ngữ cảnh `setup()`. Mỗi slot trên đối tượng `slots` là một **hàm trả về một mảng vnodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // default slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // named slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX tương đương:

```jsx
// default
<div>{slots.default()}</div>

// named
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

Trong hàm render, slots có thể được truy cập từ [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX tương đương:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Truyền Slots {#passing-slots}

Truyền children cho các component hoạt động hơi khác so với truyền children cho các element. Thay vì một mảng, chúng ta cần truyền một hàm slot, hoặc một đối tượng của các hàm slot. Các hàm slot có thể trả về bất kỳ thứ gì mà một hàm render bình thường có thể trả về - điều này sẽ luôn được chuẩn hóa thành các mảng vnodes khi được truy cập trong component con.

```js
// single default slot
h(MyComponent, () => 'hello')

// named slots
// lưu ý `null` là cần thiết để tránh
// đối tượng slots được coi là props
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

JSX tương đương:

```jsx
// default
<MyComponent>{() => 'hello'}</MyComponent>

// named
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Truyền slots dưới dạng hàm cho phép chúng được gọi lazy bởi component con. Điều này dẫn đến việc các dependency của slot được theo dõi bởi component con thay vì component cha, dẫn đến các cập nhật chính xác và hiệu quả hơn.

### Scoped Slots {#scoped-slots}

Để render một scoped slot trong component cha, một slot được truyền cho component con. Lưu ý cách slot bây giờ có một tham số `text`. Slot sẽ được gọi trong component con và dữ liệu từ component con sẽ được truyền lên component cha.

```js
// parent component
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Hãy nhớ truyền `null` để slots không được coi là props.

```js
// child component
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX tương đương:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>
}}</MyComponent>
```

### Built-in Components {#built-in-components}

Các [component tích hợp sẵn](/api/built-in-components) như `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` và `<Suspense>` phải được nhập để sử dụng trong hàm render:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

Directive `v-model` được mở rộng thành props `modelValue` và `onUpdate:modelValue` trong quá trình biên dịch template — chúng ta sẽ phải cung cấp các props này:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Custom Directives {#custom-directives}

Các directive tùy chỉnh có thể được áp dụng cho một vnode bằng cách sử dụng [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// một directive tùy chỉnh
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Nếu directive được đăng ký theo tên và không thể nhập trực tiếp, nó có thể được giải quyết bằng cách sử dụng helper [`resolveDirective`](/api/render-function#resolvedirective).

### Template Refs {#template-refs}

<div class="composition-api">

Với Composition API, khi sử dụng [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />  template refs được tạo bằng cách truyền giá trị chuỗi như prop cho vnode:

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="my-div">
    return () => h('div', { ref: 'my-div' })
  }
}
```

<details>
<summary>Sử dụng trước 3.5</summary>

Trong các phiên bản trước 3.5 nơi useTemplateRef() chưa được giới thiệu, template refs được tạo bằng cách truyền chính ref() như một prop cho vnode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```
</details>
</div>
<div class="options-api">

Với Options API, template refs được tạo bằng cách truyền tên ref như một chuỗi trong props của vnode:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Functional Components {#functional-components}

Functional components là một dạng thay thế của component không có bất kỳ trạng thái nào của riêng chúng. Chúng hoạt động như các hàm thuần túy: props vào, vnodes ra. Chúng được render mà không tạo ra một instance component (tức là không có `this`), và không có các hook lifecycle component thông thường.

Để tạo một functional component, chúng ta sử dụng một hàm đơn giản, thay vì một đối tượng tùy chọn. Hàm này thực chất là hàm `render` cho component.

<div class="composition-api">

Chữ ký của một functional component giống như hook `setup()`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Vì không có tham chiếu `this` cho một functional component, Vue sẽ truyền `props` làm tham số đầu tiên:

```js
function MyComponent(props, context) {
  // ...
}
```

Tham số thứ hai, `context`, chứa ba thuộc tính: `attrs`, `emit`, và `slots`. Các này tương đương với các thuộc tính instance [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit), và [`$slots`](/api/component-instance#slots) tương ứng.

</div>

Hầu hết các tùy chọn cấu hình thông thường cho component không có sẵn cho functional components. Tuy nhiên, có thể định nghĩa [`props`](/api/options-state#props) và [`emits`](/api/options-state#emits) bằng cách thêm chúng như các thuộc tính:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Nếu tùy chọn `props` không được chỉ định, thì đối tượng `props` được truyền cho hàm sẽ chứa tất cả các thuộc tính, giống như `attrs`. Tên prop sẽ không được chuẩn hóa thành camelCase trừ khi tùy chọn `props` được chỉ định.

Đối với functional components có `props` rõ ràng, [attribute fallthrough](/guide/components/attrs) hoạt động giống như với các component bình thường. Tuy nhiên, đối với functional components không chỉ định rõ `props` của chúng, chỉ `class`, `style`, và các event listener `onXxx` sẽ được kế thừa từ `attrs` theo mặc định. Trong cả hai trường hợp, `inheritAttrs` có thể được đặt thành `false` để vô hiệu hóa kế thừa thuộc tính:

```js
MyComponent.inheritAttrs = false
```

Functional components có thể được đăng ký và sử dụng giống như các component bình thường. Nếu bạn truyền một hàm làm tham số đầu tiên cho `h()`, nó sẽ được coi là một functional component.

### Kiểu Functional Components<sup class="vt-badge ts" /> {#typing-functional-components}

Functional Components có thể được định kiểu dựa trên việc chúng có tên hay ẩn danh. [Extension Vue - Official](https://github.com/vuejs/language-tools) cũng hỗ trợ kiểm tra kiểu cho các functional components được định kiểu đúng khi sử dụng chúng trong các template SFC.

**Functional Component Có Tên**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Functional Component Ẩn Danh**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```

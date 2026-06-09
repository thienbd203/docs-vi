# Vue và Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) là một thuật ngữ chung cho một tập hợp các API web gốc cho phép các nhà phát triển tạo ra các phần tử tùy chỉnh có thể tái sử dụng.

Chúng tôi coi Vue và Web Components là các công nghệ chủ yếu bổ sung cho nhau. Vue có hỗ trợ tuyệt vời cho cả việc sử dụng và tạo ra các custom element. Cho dù bạn đang tích hợp custom element vào một ứng dụng Vue hiện có, hay sử dụng Vue để xây dựng và phân phối custom element, bạn đang ở đúng nơi.

## Sử dụng Custom Elements trong Vue {#using-custom-elements-in-vue}

Vue [đạt điểm hoàn hảo 100% trong các bài kiểm tra Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Việc sử dụng custom element trong một ứng dụng Vue hoạt động phần lớn giống như sử dụng các phần tử HTML gốc, với một số điều cần lưu ý:

### Bỏ Qua Phân Giải Component {#skipping-component-resolution}

Theo mặc định, Vue sẽ cố gắng phân giải một thẻ HTML không phải gốc như một Vue component đã đăng ký trước khi quay lại render nó như một custom element. Điều này sẽ khiến Vue phát ra một cảnh báo "failed to resolve component" trong quá trình phát triển. Để cho Vue biết rằng một số phần tử nhất định nên được coi là custom element và bỏ qua phân giải component, chúng ta có thể chỉ định tùy chọn [`compilerOptions.isCustomElement`](/api/application#app-config-compileroptions).

Nếu bạn đang sử dụng Vue với một thiết lập build, tùy chọn nên được truyền qua cấu hình build vì đây là một tùy chọn thời gian biên dịch.

#### Ví dụ Cấu Hình Trong Trình Duyệt {#example-in-browser-config}

```js
// Chỉ hoạt động nếu sử dụng biên dịch trong trình duyệt.
// Nếu sử dụng công cụ build, xem ví dụ cấu hình bên dưới.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Ví dụ Cấu Hình Vite {#example-vite-config}

```js [vite.config.js]
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // coi tất cả các thẻ có dấu gạch ngang là custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Ví dụ Cấu Hình Vue CLI {#example-vue-cli-config}

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // coi bất kỳ thẻ nào bắt đầu bằng ion- là custom elements
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Truyền DOM Properties {#passing-dom-properties}

Vì DOM attributes chỉ có thể là chuỗi, chúng ta cần truyền dữ liệu phức tạp cho custom elements như DOM properties. Khi đặt props trên một custom element, Vue 3 tự động kiểm tra sự hiện diện của DOM-property bằng toán tử `in` và sẽ ưu tiên đặt giá trị như một DOM property nếu key có mặt. Điều này có nghĩa là, trong hầu hết các trường hợp, bạn sẽ không cần phải lo lắng về điều này nếu custom element tuân theo [các thực hành tốt nhất được khuyến nghị](https://web.dev/custom-elements-best-practices/).

Tuy nhiên, có thể có những trường hợp hiếm khi dữ liệu phải được truyền như một DOM property, nhưng custom element không định nghĩa/phản ánh property đúng cách (gây cho việc kiểm tra `in` thất bại). Trong trường hợp này, bạn có thể ép buộc một binding `v-bind` được đặt như một DOM property bằng modifier `.prop`:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- viết tắt tương đương -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Xây Dựng Custom Elements với Vue {#building-custom-elements-with-vue}

Lợi ích chính của custom elements là chúng có thể được sử dụng với bất kỳ framework nào, hoặc thậm chí không cần framework. Điều này làm cho chúng lý tưởng để phân phối các component trong đó người dùng cuối có thể không sử dụng cùng một stack frontend, hoặc khi bạn muốn cô lập ứng dụng cuối khỏi các chi tiết triển khai của các component mà nó sử dụng.

### defineCustomElement {#definecustomelement}

Vue hỗ trợ tạo custom elements bằng cách sử dụng chính các API component Vue thông qua phương thức [`defineCustomElement`](/api/custom-elements#definecustomelement). Phương thức này chấp nhận cùng một đối số như [`defineComponent`](/api/general#definecomponent), nhưng thay vào đó trả về một custom element constructor mở rộng `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // các tùy chọn component Vue bình thường ở đây
  props: {},
  emits: {},
  template: `...`,

  // chỉ dành cho defineCustomElement: CSS sẽ được inject vào shadow root
  styles: [`/* inlined css */`]
})

// Đăng ký custom element.
// Sau khi đăng ký, tất cả các thẻ `<my-vue-element>`
// trên trang sẽ được nâng cấp.
customElements.define('my-vue-element', MyVueElement)

// Bạn cũng có thể khởi tạo phần tử theo cách lập trình:
// (chỉ có thể thực hiện sau khi đăng ký)
document.body.appendChild(
  new MyVueElement({
    // props ban đầu (tùy chọn)
  })
)
```

#### Vòng Đời {#lifecycle}

- Một Vue custom element sẽ mount một instance component Vue bên trong shadow root của nó khi [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) của phần tử được gọi lần đầu tiên.

- Khi `disconnectedCallback` của phần tử được gọi, Vue sẽ kiểm tra xem phần tử có bị tách khỏi tài liệu sau một microtask tick hay không.

  - Nếu phần tử vẫn còn trong tài liệu, đó là một di chuyển và instance component sẽ được bảo tồn;

  - Nếu phần tử bị tách khỏi tài liệu, đó là một xóa bỏ và instance component sẽ được unmount.

#### Props {#props}

- Tất cả props được khai báo bằng tùy chọn `props` sẽ được định nghĩa trên custom element như properties. Vue sẽ tự động xử lý sự phản ánh giữa attributes / properties khi phù hợp.

  - Attributes luôn được phản ánh sang các properties tương ứng.

  - Properties với các giá trị nguyên thủy (`string`, `boolean` hoặc `number`) được phản ánh như attributes.

- Vue cũng tự động ép kiểu các props được khai báo với kiểu `Boolean` hoặc `Number` thành kiểu mong muốn khi chúng được đặt như attributes (vốn luôn là chuỗi). Ví dụ, với khai báo props sau:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Và việc sử dụng custom element:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  Trong component, `selected` sẽ được ép kiểu thành `true` (boolean) và `index` sẽ được ép kiểu thành `1` (number).

#### Events {#events}

Các sự kiện được emit thông qua `this.$emit` hoặc setup `emit` được dispatch như [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) gốc trên custom element. Các đối số sự kiện bổ sung (payload) sẽ được expose như một mảng trên đối tượng CustomEvent như property `detail` của nó.

#### Slots {#slots}

Bên trong component, slots có thể được render bằng phần tử `<slot/>` như bình thường. Tuy nhiên, khi sử dụng phần tử kết quả, nó chỉ chấp nhận [cú pháp slots gốc](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped slots](/guide/components/slots#scoped-slots) không được hỗ trợ.

- Khi truyền named slots, sử dụng thuộc tính `slot` thay vì directive `v-slot`:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) và [tương đương Composition API](/api/composition-api-dependency-injection#provide) của nó cũng hoạt động giữa các custom element được định nghĩa bởi Vue. Tuy nhiên, lưu ý rằng điều này chỉ hoạt động **chỉ giữa các custom element**. Tức là một custom element được định nghĩa bởi Vue sẽ không thể inject các properties được cung cấp bởi một Vue component không phải custom element.

#### App Level Config <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

You can configure the app instance of a Vue custom element using the `configureApp` option:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### SFC như Custom Element {#sfc-as-custom-element}

`defineCustomElement` cũng hoạt động với Vue Single-File Components (SFCs). Tuy nhiên, với thiết lập tooling mặc định, `<style>` bên trong SFCs vẫn sẽ được trích xuất và gộp vào một file CSS duy nhất trong quá trình build production. Khi sử dụng một SFC như một custom element, thường mong muốn inject các thẻ `<style>` vào shadow root của custom element thay thế.

Các tooling SFC chính thức hỗ trợ importing SFCs trong "custom element mode" (yêu cầu `@vitejs/plugin-vue@^1.4.0` hoặc `vue-loader@^16.5.0`). Một SFC được tải trong custom element mode inline các thẻ `<style>` của nó như chuỗi CSS và expose chúng dưới tùy chọn `styles` của component. Điều này sẽ được `defineCustomElement` nhận và inject vào shadow root của phần tử khi được khởi tạo.

Để opt-in vào chế độ này, chỉ cần kết thúc tên file component của bạn bằng `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// convert into custom element constructor
const ExampleElement = defineCustomElement(Example)

// register
customElements.define('my-example', ExampleElement)
```

Nếu bạn muốn tùy chỉnh những file nào nên được import trong custom element mode (ví dụ, coi _tất cả_ SFCs như custom elements), bạn có thể truyền tùy chọn `customElement` cho các build plugin tương ứng:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Mẹo cho một Thư viện Vue Custom Elements {#tips-for-a-vue-custom-elements-library}

Khi xây dựng custom elements với Vue, các phần tử sẽ phụ thuộc vào runtime của Vue. Có chi phí kích thước baseline ~16kb tùy thuộc vào bao nhiêu tính năng đang được sử dụng. Điều này có nghĩa là không lý tưởng để sử dụng Vue nếu bạn đang ship một custom element đơn lẻ - bạn có thể muốn sử dụng vanilla JavaScript, [petite-vue](https://github.com/vuejs/petite-vue), hoặc các framework chuyên về kích thước runtime nhỏ. Tuy nhiên, kích thước cơ sở là hoàn toàn hợp lý nếu bạn đang ship một collection của custom elements với logic phức tạp, vì Vue sẽ cho phép mỗi component được viết với ít code hơn nhiều. Càng nhiều phần tử bạn ship cùng nhau, càng tốt sự đánh đổi.

Nếu các custom elements sẽ được sử dụng trong một ứng dụng cũng đang sử dụng Vue, bạn có thể chọn externalize Vue từ bundle được xây dựng để các phần tử sẽ sử dụng cùng bản sao của Vue từ ứng dụng host.

Được khuyến nghị export các constructor phần tử riêng lẻ để cung cấp cho người dùng của bạn sự linh hoạt để import chúng theo yêu cầu và đăng ký chúng với tên thẻ mong muốn. Bạn cũng có thể export một hàm tiện lợi để tự động đăng ký tất cả các phần tử. Đây là một ví dụ entry point của một thư viện Vue custom element:

```js [elements.js]

import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// export individual elements
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Một người tiêu dùng có thể sử dụng các phần tử trong một file Vue:

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

Or in any other framework such as one with JSX, and with custom names:

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ... >
      <some-bar ... ></some-bar>
    </some-foo>
  </>
}
```

### Vue-based Web Components and TypeScript {#web-components-and-typescript}

Khi viết template Vue SFC, bạn có thể muốn [type check](/guide/scaling-up/tooling.html#typescript) các component Vue của bạn, bao gồm cả những được định nghĩa như custom elements.

Custom elements được đăng ký toàn cục trong trình duyệt sử dụng các API tích hợp sẵn của chúng, và theo mặc định chúng sẽ không có suy luận kiểu khi được sử dụng trong template Vue. Để cung cấp hỗ trợ kiểu cho các component Vue được đăng ký như custom elements, chúng ta có thể đăng ký typings component toàn cục bằng cách augment interface [`GlobalComponents`](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) để type checking trong template Vue (người dùng JSX có thể augment type [JSX.IntrinsicElements](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) thay thế, điều này không được hiển thị ở đây).

Đây là cách định nghĩa kiểu cho một custom element được tạo với Vue:

```typescript
import { defineCustomElement } from 'vue'

// Import the Vue component.
import SomeComponent from './src/components/SomeComponent.ce.vue'

// Turn the Vue component into a Custom Element class.
export const SomeElement = defineCustomElement(SomeComponent)

// Remember to register the element class with the browser.
customElements.define('some-element', SomeElement)

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    // Be sure to pass in the Vue component type here 
    // (SomeComponent, *not* SomeElement).
    // Custom Elements require a hyphen in their name, 
    // so use the hyphenated element name here.
    'some-element': typeof SomeComponent
  }
}
```

## Non-Vue Web Components and TypeScript {#non-vue-web-components-and-typescript}

Here is the recommended way to enable type checking in SFC templates of Custom Elements that are not built with Vue.

:::tip Lưu ý
Cách tiếp cận này là một cách có thể để làm điều đó, nhưng nó có thể thay đổi tùy thuộc vào framework đang được sử dụng để tạo custom elements.
:::

Suppose we have a custom element with some JS properties and events defined, and it is shipped in a library called `some-lib`:

```ts [some-lib/src/SomeElement.ts]
// Define a class with typed JS properties.
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // This method should not be exposed to template types.
  someMethod() {
    /* ... */
  }

  // ... implementation details omitted ...
  // ... assume the element dispatches events named "apple-fell" ...
}

customElements.define('some-element', SomeElement)

// This is a list of properties of SomeElement that will be selected for type
// checking in framework templates (f.e. Vue SFC templates). Any other
// properties will not be exposed.
export type SomeElementAttributes = 'foo' | 'bar'

// Define the event types that SomeElement dispatches.
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... details omitted ... */
}
```

Chi tiết implementation đã được bỏ qua, nhưng phần quan trọng là chúng ta có định nghĩa kiểu cho hai thứ: kiểu prop và kiểu event.

Hãy tạo một type helper để dễ dàng đăng ký định nghĩa kiểu custom element trong Vue:

```ts [some-lib/src/DefineCustomElement.ts]
// We can re-use this type helper per each element we need to define.
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // Use $props to define the properties exposed to template type checking. Vue
  // specifically reads prop definitions from the `$props` type. Note that we
  // combine the element's props with the global HTML props and Vue's special
  // props.
  /** @deprecated Do not use the $props property on a Custom Element ref, 
    this is for template prop types only. */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // Use $emit to specifically define event types. Vue specifically reads event
  // types from the `$emit` type. Note that `$emit` expects a particular format
  // that we map `Events` to.
  /** @deprecated Do not use the $emit property on a Custom Element ref, 
    this is for template prop types only. */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// This maps an EventMap to the format that Vue's $emit type expects.
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

:::tip Note
We marked `$props` and `$emit` as deprecated so that when we get a `ref` to a custom element we will not be tempted to use these properties, as these properties are for type checking purposes only when it comes to custom elements. These properties do not actually exist on the custom element instances.
:::

Using the type helper we can now select the JS properties that should be exposed for type checking in Vue templates:

```ts [some-lib/src/SomeElement.vue.ts]
import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

Suppose that `some-lib` builds its source TypeScript files into a `dist/` folder. A user of `some-lib` can then import `SomeElement` and use it in a Vue SFC like so:

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// This will create and register the element with the browser.
import 'some-lib/dist/SomeElement.js'

// A user that is using TypeScript and Vue should additionally import the
// Vue-specific type definition (users of other frameworks may import other
// framework-specific type definitions).
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // Do not use these props, they are `undefined`
  // IDE will show them crossed out
  el.$props
  el.$emit
})
</script>

<template>
  <!-- Now we can use the element, with type checking: -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // The type of `event` is inferred here to be `AppleFellEvent`
      }
    "
  ></some-element>
</template>
```

Nếu một phần tử không có định nghĩa kiểu, các kiểu của properties và events có thể được định nghĩa theo cách thủ công hơn:

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// Suppose that `some-lib` is plain JS without type definitions, and TypeScript
// cannot infer the types:
import { SomeElement } from 'some-lib'

// We'll use the same type helper as before.
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... same as before, use a reference to the element ...
</script>

<template>
  <!-- ... same as before, use the element in the template ... -->
</template>
```

Custom Element authors should not automatically export framework-specific custom element type definitions from their libraries, for example they should not export them from an `index.ts` file that also exports the rest of the library, otherwise users will have unexpected module augmentation errors. Users should import the framework-specific type definition file that they need.

## Web Components vs. Vue Components {#web-components-vs-vue-components}

Some developers believe that framework-proprietary component models should be avoided, and that exclusively using Custom Elements makes an application "future-proof". Here we will try to explain why we believe that this is an overly simplistic take on the problem.

Thực sự có một mức độ nhất định của sự trùng lặp tính năng giữa Custom Elements và Vue Components: cả hai đều cho phép chúng ta định nghĩa các component có thể tái sử dụng với truyền dữ liệu, emit event, và quản lý lifecycle. Tuy nhiên, Web Components APIs tương đối cấp thấp và cơ bản. Để xây dựng một ứng dụng thực tế, chúng ta cần khá nhiều khả năng bổ sung mà nền tảng không bao gồm:

- Một hệ thống template khai báo và hiệu quả;

- Một hệ thống quản lý trạng thái phản ứng tạo điều kiện cho việc trích xuất và tái sử dụng logic cross-component;

- Một cách hiệu quả để render các component trên server và hydrate chúng trên client (SSR), điều này quan trọng cho SEO và [Web Vitals metrics như LCP](https://web.dev/vitals/). Custom elements SSR gốc thường liên quan đến việc mô phỏng DOM trong Node.js và sau đó serialize DOM đã thay đổi, trong khi Vue SSR biên dịch thành nối chuỗi string bất cứ khi nào có thể, điều này hiệu quả hơn nhiều.

Mô hình component của Vue được thiết kế với các nhu cầu này trong tâm như một hệ thống gắn kết.

Với một đội ngũ kỹ thuật có năng lực, bạn có thể có thể xây dựng tương đương trên Custom Elements gốc - nhưng điều này cũng có nghĩa là bạn đang gánh vác gánh nặng bảo trì dài hạn của một framework nội bộ, trong khi mất đi lợi ích hệ sinh thái và cộng đồng của một framework trưởng thành như Vue.

Cũng có các framework được xây dựng sử dụng Custom Elements làm cơ sở cho mô hình component của chúng, nhưng tất cả chúng đều phải giới thiệu các giải pháp độc quyền của họ cho các vấn đề được liệt kê ở trên. Sử dụng các framework này có nghĩa là chấp nhận các quyết định kỹ thuật của họ về cách giải quyết các vấn đề này - điều này, bất kể những gì có thể được quảng cáo, không tự động bảo vệ bạn khỏi các sự thay đổi tiềm ẩn trong tương lai.

Cũng có một số lĩnh vực mà chúng ta thấy custom elements là hạn chế:

- Đánh giá slot eager cản trở composition component. [Scoped slots](/guide/components/slots#scoped-slots) của Vue là một cơ chế mạnh mẽ cho composition component, không thể được hỗ trợ bởi custom elements do bản chất eager của các slot gốc. Eager slots cũng có nghĩa là component nhận không thể kiểm soát khi hoặc có hay không render một mảnh nội dung slot.

- Shipping custom elements với CSS scoped shadow DOM ngày nay yêu cầu nhúng CSS bên trong JavaScript để chúng có thể được inject vào shadow roots tại runtime. Chúng cũng dẫn đến các style trùng lặp trong markup trong các kịch bản SSR. Có [tính năng nền tảng](https://github.com/whatwg/html/pull/4898/) đang được làm việc trong lĩnh vực này - nhưng hiện tại chúng chưa được hỗ trợ phổ biến, và vẫn có những lo ngại hiệu suất production / SSR cần được giải quyết. Trong khi đó, Vue SFCs cung cấp [cơ chế scoping CSS](/api/sfc-css-features) hỗ trợ trích xuất các style thành các file CSS đơn giản.

Vue will always stay up to date with the latest standards in the web platform, and we will happily leverage whatever the platform provides if it makes our job easier. However, our goal is to provide solutions that work well and work today. That means we have to incorporate new platform features with a critical mindset - and that involves filling the gaps where the standards fall short while that is still the case.

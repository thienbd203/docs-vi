# Render Function APIs {#render-function-apis}

## h() {#h}

Tạo các node DOM ảo (vnodes).

- **Type**

  ```ts
  // full signature
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // omitting props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Types are simplified for readability.

- **Details**

  Tham số đầu tiên có thể là một chuỗi (cho các phần tử gốc) hoặc một định nghĩa component Vue. Tham số thứ hai là các props sẽ được truyền, và tham số thứ ba là các phần tử con.

  Khi tạo một vnode component, các phần tử con phải được truyền dưới dạng các hàm slot. Một hàm slot đơn có thể được truyền nếu component chỉ mong đợi slot mặc định. Nếu không, các slot phải được truyền dưới dạng một đối tượng của các hàm slot.

  Để thuận tiện, tham số props có thể được bỏ qua khi phần tử con không phải là một đối tượng slots.

- **Example**

  Creating native elements:

  ```js
  import { h } from 'vue'

  // all arguments except the type are optional
  h('div')
  h('div', { id: 'foo' })

  // both attributes and properties can be used in props
  // Vue automatically picks the right way to assign it
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class and style have the same object / array
  // value support like in templates
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // event listeners should be passed as onXxx
  h('div', { onClick: () => {} })

  // children can be a string
  h('div', { id: 'foo' }, 'hello')

  // props can be omitted when there are no props
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children array can contain mixed vnodes and strings
  h('div', ['hello', h('span', 'hello')])
  ```

  Creating components:

  ```js
  import Foo from './Foo.vue'

  // passing props
  h(Foo, {
    // equivalent of some-prop="hello"
    someProp: 'hello',
    // equivalent of @update="() => {}"
    onUpdate: () => {}
  })

  // passing single default slot
  h(Foo, () => 'default slot')

  // passing named slots
  // notice the `null` is required to avoid
  // slots object being treated as props
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **See also** [Guide - Render Functions - Creating VNodes](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Gộp nhiều đối tượng props với xử lý đặc biệt cho một số props nhất định.

- **Type**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Details**

  `mergeProps()` hỗ trợ gộp nhiều đối tượng props với xử lý đặc biệt cho các props sau:

  - `class`
  - `style`
  - `onXxx` event listeners - nhiều listener với cùng tên sẽ được gộp thành một mảng.

  Nếu bạn không cần hành vi gộp và muốn ghi đè đơn giản, bạn có thể sử dụng object spread của JavaScript thay thế.

- **Example**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Sao chép một vnode.

- **Type**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Details**

  Trả về một vnode đã sao chép, tùy chọn với các props bổ sung để gộp với vnode gốc.

  Vnodes nên được coi là bất biến sau khi tạo, và bạn không nên thay đổi props của một vnode hiện có. Thay vào đó, hãy sao chép nó với các props khác nhau/bổ sung.

  Vnodes có các thuộc tính nội bộ đặc biệt, nên việc sao chép chúng không đơn giản như object spread. `cloneVNode()` xử lý hầu hết logic nội bộ.

- **Example**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Kiểm tra xem một giá trị có phải là vnode hay không.

- **Type**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Để giải quyết thủ công một component đã đăng ký theo tên.

- **Type**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Details**

  **Lưu ý: bạn không cần cái này nếu bạn có thể import component trực tiếp.**

  `resolveComponent()` phải được gọi bên trong<span class="composition-api"> `setup()` hoặc</span> hàm render để giải quyết từ ngữ cảnh component đúng.

  Nếu component không được tìm thấy, một cảnh báo runtime sẽ được phát ra, và chuỗi tên sẽ được trả về.

- **Example**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **See also** [Guide - Render Functions - Components](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Để giải quyết thủ công một directive đã đăng ký theo tên.

- **Type**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Details**

  **Lưu ý: bạn không cần cái này nếu bạn có thể import directive trực tiếp.**

  `resolveDirective()` phải được gọi bên trong<span class="composition-api"> `setup()` hoặc</span> hàm render để giải quyết từ ngữ cảnh component đúng.

  Nếu directive không được tìm thấy, một cảnh báo runtime sẽ được phát ra, và hàm trả về `undefined`.

- **See also** [Guide - Render Functions - Custom Directives](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Để thêm các directive tùy chỉnh vào vnodes.

- **Type**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Details**

  Bọc một vnode hiện có với các directive tùy chỉnh. Tham số thứ hai là một mảng các directive tùy chỉnh. Mỗi directive tùy chỉnh cũng được biểu diễn dưới dạng một mảng theo dạng `[Directive, value, argument, modifiers]`. Các phần tử cuối của mảng có thể được bỏ qua nếu không cần thiết.

- **Example**

  ```js
  import { h, withDirectives } from 'vue'

  // a custom directive
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **See also** [Guide - Render Functions - Custom Directives](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Để thêm các modifier [`v-on` tích hợp sẵn](/guide/essentials/event-handling#event-modifiers) vào một hàm xử lý sự kiện.

- **Type**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **Example**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // equivalent of v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **See also** [Guide - Render Functions - Event Modifiers](/guide/extras/render-function#event-modifiers)

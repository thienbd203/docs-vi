# Component Instance {#component-instance}

:::info
Trang này tài liệu hóa các thuộc tính và phương thức tích hợp sẵn được expose trên instance công khai của component, tức là `this`.

Tất cả các thuộc tính được liệt kê trên trang này đều là chỉ đọc (trừ các thuộc tính lồng nhau trong `$data`).
:::

## $data {#data}

Đối tượng được trả về từ tùy chọn [`data`](./options-state#data), được component biến thành reactive. Instance của component proxy truy cập đến các thuộc tính trên đối tượng data của nó.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Đối tượng đại diện cho các props hiện tại và đã được resolve của component.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Details**

  Chỉ các props được khai báo thông qua tùy chọn [`props`](./options-state#props) mới được bao gồm. Instance của component proxy truy cập đến các thuộc tính trên đối tượng props của nó.

## $el {#el}

Nút DOM gốc mà instance của component đang quản lý.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $el: any
  }
  ```

- **Details**

  `$el` sẽ là `undefined` cho đến khi component được [mounted](./options-lifecycle#mounted).

  - Đối với component có một phần tử gốc, `$el` sẽ trỏ đến phần tử đó.
  - Đối với component có gốc là văn bản, `$el` sẽ trỏ đến nút văn bản.
  - Đối với component có nhiều nút gốc, `$el` sẽ là nút DOM placeholder mà Vue sử dụng để theo dõi vị trí của component trong DOM (một nút văn bản, hoặc một nút comment trong chế độ hydratation SSR).

  :::tip
  Để đảm bảo tính nhất quán, nên sử dụng [template refs](/guide/essentials/template-refs) để truy cập trực tiếp đến các phần tử thay vì dựa vào `$el`.
  :::

## $options {#options}

Các tùy chọn component đã được resolve được sử dụng để khởi tạo instance component hiện tại.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Details**

  Đối tượng `$options` expose các tùy chọn đã được resolve cho component hiện tại và là kết quả merge từ các nguồn có thể có sau:

  - Global mixins
  - Component `extends` base
  - Component mixins

  Nó thường được sử dụng để hỗ trợ các tùy chọn component tùy chỉnh:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **See also** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

Instance cha, nếu instance hiện tại có instance cha. Nó sẽ là `null` đối với instance gốc.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

Instance component gốc của cây component hiện tại. Nếu instance hiện tại không có cha, giá trị này sẽ là chính nó.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Đối tượng đại diện cho các [slots](/guide/components/slots) được truyền bởi component cha.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Details**

  Thường được sử dụng khi viết thủ công [render functions](/guide/extras/render-function), nhưng cũng có thể được sử dụng để phát hiện xem một slot có tồn tại hay không.

  Mỗi slot được expose trên `this.$slots` dưới dạng một hàm trả về một mảng các vnode dưới khóa tương ứng với tên của slot đó. Slot mặc định được expose là `this.$slots.default`.

  Nếu một slot là [scoped slot](/guide/components/slots#scoped-slots), các đối số được truyền cho các hàm slot sẽ có sẵn cho slot dưới dạng slot props của nó.

- **See also** [Render Functions - Rendering Slots](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

Đối tượng chứa các phần tử DOM và instance component, được đăng ký thông qua [template refs](/guide/essentials/template-refs).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **See also**

  - [Template refs](/guide/essentials/template-refs)
  - [Special Attributes - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Đối tượng chứa các thuộc tính fallthrough của component.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Details**

  [Fallthrough Attributes](/guide/components/attrs) là các thuộc tính và xử lý sự kiện được truyền bởi component cha, nhưng không được khai báo là prop hoặc sự kiện được emit bởi component con.

  Theo mặc định, mọi thứ trong `$attrs` sẽ được tự động kế thừa trên phần tử gốc của component nếu chỉ có một phần tử gốc. Hành vi này bị vô hiệu hóa nếu component có nhiều nút gốc, và có thể được vô hiệu hóa một cách rõ ràng với tùy chọn [`inheritAttrs`](./options-misc#inheritattrs).

- **See also**

  - [Fallthrough Attributes](/guide/components/attrs)

## $watch() {#watch}

API mệnh lệnh để tạo watchers.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Details**

  Đối số đầu tiên là nguồn watch. Nó có thể là chuỗi tên thuộc tính component, chuỗi đường dẫn được phân tách bằng dấu chấm đơn giản, hoặc một [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description).

  Đối số thứ hai là hàm callback. Callback nhận giá trị mới và giá trị cũ của nguồn được watch.

  - **`immediate`**: kích hoạt callback ngay lập tức khi tạo watcher. Giá trị cũ sẽ là `undefined` trong lần gọi đầu tiên.
  - **`deep`**: buộc duyệt sâu nguồn nếu nó là một đối tượng, để callback kích hoạt khi có thay đổi sâu. Xem [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: điều chỉnh thời điểm flush của callback. Xem [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) và [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug các dependency của watcher. Xem [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Example**

  Watch một tên thuộc tính:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Watch một đường dẫn được phân tách bằng dấu chấm:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Sử dụng getter cho các biểu thức phức tạp hơn:

  ```js
  this.$watch(
    // mỗi khi biểu thức `this.a + this.b` trả về
    // một kết quả khác nhau, handler sẽ được gọi.
    // Giống như chúng ta đang watch một computed property
    // mà không cần định nghĩa computed property đó.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Dừng watcher:

  ```js
  const unwatch = this.$watch('a', cb)

  // sau đó...
  unwatch()
  ```

- **See also**
  - [Options - `watch`](/api/options-state#watch)
  - [Guide - Watchers](/guide/essentials/watchers)

## $emit() {#emit}

Kích hoạt một sự kiện tùy chỉnh trên instance hiện tại. Bất kỳ đối số bổ sung nào sẽ được truyền vào hàm callback của listener.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Example**

  ```js
  export default {
    created() {
      // chỉ sự kiện
      this.$emit('foo')
      // với các đối số bổ sung
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **See also**

  - [Component - Events](/guide/components/events)
  - [`emits` option](./options-state#emits)

## $forceUpdate() {#forceupdate}

Buộc instance component render lại.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Details**

  Điều này hiếm khi cần thiết vì hệ thống reactivity hoàn toàn tự động của Vue. Các trường hợp duy nhất bạn có thể cần nó là khi bạn đã tạo ra trạng thái component non-reactive một cách rõ ràng bằng cách sử dụng các API reactivity nâng cao.

## $nextTick() {#nexttick}

Phiên bản được gắn với instance của [`nextTick()`](./general#nexttick) toàn cục.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Details**

  Sự khác biệt duy nhất so với phiên bản toàn cục của `nextTick()` là callback được truyền cho `this.$nextTick()` sẽ có ngữ cảnh `this` được gắn với instance component hiện tại.

- **See also** [`nextTick()`](./general#nexttick)

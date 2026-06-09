# Reactivity API: Nâng cao {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Phiên bản shallow của [`ref()`](./reactivity-core#ref).

- **Type**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Chi tiết**

  Khác với `ref()`, giá trị bên trong của một shallow ref được lưu trữ và hiển thị nguyên vẹn, và sẽ không được chuyển đổi thành reactive sâu. Chỉ có truy cập `.value` là reactive.

  `shallowRef()` thường được sử dụng để tối ưu hóa hiệu suất cho các cấu trúc dữ liệu lớn, hoặc tích hợp với các hệ thống quản lý trạng thái bên ngoài.

- **Ví dụ**

  ```js
  const state = shallowRef({ count: 1 })

  // KHÔNG kích hoạt thay đổi
  state.value.count = 2

  // CÓ kích hoạt thay đổi
  state.value = { count: 2 }
  ```

- **Xem thêm**
  - [Hướng dẫn - Giảm Chi Phí Reactivity cho Các Cấu Trúc Bất Biến Lớn](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Hướng dẫn - Tích hợp với Các Hệ Thống Trạng Thái Bên Ngoài](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Buộc kích hoạt các effect phụ thuộc vào một [shallow ref](#shallowref). Thường được sử dụng sau khi thực hiện các thay đổi sâu vào giá trị bên trong của một shallow ref.

- **Type**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Ví dụ**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Log "Hello, world" một lần cho lần chạy đầu tiên
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Điều này sẽ không kích hoạt effect vì ref là shallow
  shallow.value.greet = 'Hello, universe'

  // Log "Hello, universe"
  triggerRef(shallow)
  ```

## customRef() {#customref}

Tạo một ref tùy chỉnh với quyền kiểm soát rõ ràng theo dõi dependency và kích hoạt cập nhật.

- **Type**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Chi tiết**

  `customRef()` mong đợi một factory function, nhận các hàm `track` và `trigger` làm đối số và nên trả về một đối tượng với các phương thức `get` và `set`.

  Nói chung, `track()` nên được gọi bên trong `get()`, và `trigger()` nên được gọi bên trong `set()`. Tuy nhiên, bạn có toàn quyền kiểm soát khi chúng nên được gọi, hoặc liệu chúng có nên được gọi hay không.

- **Ví dụ**

  Tạo một debounced ref chỉ cập nhật giá trị sau một khoảng thời gian nhất định sau lần gọi set gần nhất:

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Sử dụng trong component:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Thử trong Playground](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

  :::warning Sử dụng cẩn thận
  Khi sử dụng customRef, chúng ta nên cẩn thận về giá trị trả về của getter, đặc biệt là khi tạo ra các kiểu dữ liệu object mới mỗi lần getter được chạy. Điều này ảnh hưởng đến mối quan hệ giữa component cha và con, nơi customRef như vậy đã được truyền như một prop.

  Hàm render của component cha có thể được kích hoạt bởi các thay đổi đến một trạng thái reactive khác. Trong quá trình render lại, giá trị của customRef của chúng ta được đánh giá lại, trả về một kiểu dữ liệu object mới như một prop cho component con. Prop này được so sánh với giá trị cuối cùng của nó trong component con, và vì chúng khác nhau, các dependency reactive của customRef được kích hoạt trong component con. Trong khi đó, các dependency reactive trong component cha không chạy vì setter của customRef không được gọi, và các dependency của nó không được kích hoạt kết quả.

  [Xem trong Playground](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN/PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/bW17nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWXgpu6ek1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEz9OLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5kXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

  :::

## shallowReactive() {#shallowreactive}

Phiên bản shallow của [`reactive()`](./reactivity-core#reactive).

- **Type**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Chi tiết**

  Khác với `reactive()`, không có chuyển đổi sâu: chỉ có các thuộc tính cấp gốc là reactive cho một đối tượng shallow reactive. Giá trị thuộc tính được lưu trữ và hiển thị nguyên vẹn - điều này cũng có nghĩa là các thuộc tính với giá trị ref sẽ **không** được tự động unwrap.

  :::warning Sử dụng Cẩn thận
  Cấu trúc dữ liệu shallow chỉ nên được sử dụng cho trạng thái cấp gốc trong một component. Tránh lồng nó bên trong một đối tượng reactive sâu vì nó tạo ra một cây với hành vi reactivity không nhất quán có thể khó hiểu và debug.
  :::

- **Ví dụ**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // thay đổi các thuộc tính riêng của state là reactive
  state.foo++

  // ...nhưng không chuyển đổi các đối tượng lồng nhau
  isReactive(state.nested) // false

  // KHÔNG reactive
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

Phiên bản shallow của [`readonly()`](./reactivity-core#readonly).

- **Type**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Chi tiết**

  Khác với `readonly()`, không có chuyển đổi sâu: chỉ có các thuộc tính cấp gốc được làm readonly. Giá trị thuộc tính được lưu trữ và hiển thị nguyên vẹn - điều này cũng có nghĩa là các thuộc tính với giá trị ref sẽ **không** được tự động unwrap.

  :::warning Sử dụng Cẩn thận
  Cấu trúc dữ liệu shallow chỉ nên được sử dụng cho trạng thái cấp gốc trong một component. Tránh lồng nó bên trong một đối tượng reactive sâu vì nó tạo ra một cây với hành vi reactivity không nhất quán có thể khó hiểu và debug.
  :::

- **Ví dụ**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // thay đổi các thuộc tính riêng của state sẽ thất bại
  state.foo++

  // ...nhưng hoạt động trên các đối tượng lồng nhau
  isReadonly(state.nested) // false

  // hoạt động
  state.nested.bar++
  ```

## toRaw() {#toraw}

Trả về đối tượng gốc, nguyên bản của một proxy được tạo bởi Vue.

- **Type**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Chi tiết**

  `toRaw()` có thể trả về đối tượng gốc từ các proxy được tạo bởi [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) hoặc [`shallowReadonly()`](#shallowreadonly).

  Đây là một escape hatch có thể được sử dụng để đọc tạm thời mà không chịu chi phí truy cập/theo dõi proxy hoặc viết mà không kích hoạt thay đổi. **Không** được khuyến nghị giữ một tham chiếu liên tục đến đối tượng gốc. Sử dụng cẩn thận.

- **Ví dụ**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Đánh dấu một đối tượng để nó không bao giờ được chuyển đổi thành proxy. Trả về chính đối tượng đó.

- **Type**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Ví dụ**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // cũng hoạt động khi lồng bên trong các đối tượng reactive khác
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Sử dụng Cẩn thận
  `markRaw()` và các API shallow như `shallowReactive()` cho phép bạn chọn loại bỏ chuyển đổi reactive/readonly sâu mặc định và nhúng các đối tượng gốc, không được proxy vào đồ thị trạng thái của bạn. Chúng có thể được sử dụng vì nhiều lý do:

  - Một số giá trị đơn giản không nên được làm reactive, ví dụ một instance class bên thứ ba phức tạp, hoặc một đối tượng component Vue.

  - Bỏ qua chuyển đổi proxy có thể cung cấp cải thiện hiệu suất khi render các danh sách lớn với nguồn dữ liệu bất biến.

  Chúng được coi là nâng cao vì việc loại bỏ gốc chỉ ở cấp gốc, vì vậy nếu bạn đặt một đối tượng gốc lồng nhau, không được đánh dấu vào một đối tượng reactive và sau đó truy cập nó lại, bạn nhận lại phiên bản được proxy. Điều này có thể dẫn đến **rủi ro nhận dạng** - tức là thực hiện một thao tác dựa vào nhận dạng đối tượng nhưng sử dụng cả phiên bản gốc và phiên bản được proxy của cùng một đối tượng:

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // mặc dù `foo` được đánh dấu là raw, foo.nested thì không.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Rủi ro nhận dạng nói chung là hiếm. Tuy nhiên, để sử dụng đúng các API này trong khi tránh an toàn các rủi ro nhận dạng đòi hỏi sự hiểu biết vững chắc về cách hệ thống reactivity hoạt động.

  :::

## effectScope() {#effectscope}

Tạo một đối tượng effect scope có thể bắt giữ các reactive effects (tức là computed và watchers) được tạo bên trong nó để các effect này có thể được dispose cùng nhau. Để biết các trường hợp sử dụng chi tiết của API này, vui lòng tham khảo [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) tương ứng của nó.

- **Type**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined nếu scope không hoạt động
    stop(): void
  }
  ```

- **Ví dụ**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // để dispose tất cả các effect trong scope
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Trả về [effect scope](#effectscope) đang hoạt động hiện tại nếu có.

- **Type**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Đăng ký một callback dispose trên [effect scope](#effectscope) đang hoạt động hiện tại. Callback sẽ được gọi khi effect scope liên kết được dừng lại.

Phương thức này có thể được sử dụng như một thay thế không gắn với component của `onUnmounted` trong các hàm composition có thể tái sử dụng, vì hàm `setup()` của mỗi component Vue cũng được gọi trong một effect scope.

Một cảnh báo sẽ được ném ra nếu hàm này được gọi mà không có effect scope đang hoạt động. Trong 3.5+, cảnh báo này có thể được ngăn chặn bằng cách truyền `true` làm đối số thứ hai.

- **Type**

  ```ts
  function onScopeDispose(fn: () => void, failSilently?: boolean): void
  ```

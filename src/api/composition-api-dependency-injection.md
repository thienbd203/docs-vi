# Composition API: <br>Dependency Injection {#composition-api-dependency-injection}

## provide() {#provide}

Cung cấp một giá trị có thể được inject bởi các component con.

- **Type**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Chi tiết**

  `provide()` nhận hai đối số: key, có thể là một chuỗi hoặc một symbol, và giá trị để inject.

  Khi sử dụng TypeScript, key có thể là một symbol được cast thành `InjectionKey` - một kiểu tiện ích do Vue cung cấp mở rộng `Symbol`, có thể được sử dụng để đồng bộ hóa kiểu giá trị giữa `provide()` và `inject()`.

  Tương tự như các API đăng ký lifecycle hook, `provide()` phải được gọi đồng bộ trong giai đoạn `setup()` của component.

- **Ví dụ**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // provide static value
  provide('path', '/project/')

  // provide reactive value
  const count = ref(0)
  provide('count', count)

  // provide with Symbol keys
  provide(countSymbol, count)
  </script>
  ```

- **Xem thêm**
  - [Hướng dẫn - Provide / Inject](/guide/components/provide-inject)
  - [Hướng dẫn - Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Inject một giá trị được cung cấp bởi một component tổ tiên hoặc ứng dụng (thông qua `app.provide()`).

- **Type**

  ```ts
  // without default value
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // with default value
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // with factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Chi tiết**

  Đối số đầu tiên là key injection. Vue sẽ đi lên chuỗi cha để định vị một giá trị được cung cấp với key khớp. Nếu nhiều component trong chuỗi cha cung cấp cùng một key, component gần nhất với component đang inject sẽ "che" những component ở trên chuỗi và giá trị của nó sẽ được sử dụng. Nếu không tìm thấy giá trị với key khớp, `inject()` trả về `undefined` trừ khi có cung cấp giá trị mặc định.

  Đối số thứ hai là tùy chọn và là giá trị mặc định sẽ được sử dụng khi không tìm thấy giá trị khớp.

  Đối số thứ hai cũng có thể là một factory function trả về các giá trị tốn kém để tạo. Trong trường hợp này, `true` phải được truyền làm đối số thứ ba để chỉ ra rằng function nên được sử dụng như một factory thay vì chính giá trị đó.

  Tương tự như các API đăng ký lifecycle hook, `inject()` phải được gọi đồng bộ trong giai đoạn `setup()` của component.

  Khi sử dụng TypeScript, key có thể là kiểu `InjectionKey` - một kiểu tiện ích do Vue cung cấp mở rộng `Symbol`, có thể được sử dụng để đồng bộ hóa kiểu giá trị giữa `provide()` và `inject()`.

- **Ví dụ**

  Giả sử một component cha đã cung cấp các giá trị như được hiển thị trong ví dụ `provide()` trước đó:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // inject static value without default
  const path = inject('path')

  // inject reactive value
  const count = inject('count')

  // inject with Symbol keys
  const count2 = inject(countSymbol)

  // inject with default value
  const bar = inject('path', '/default-path')

  // inject with function default value
  const fn = inject('function', () => {})

  // inject with default value factory
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```

- **Xem thêm**
  - [Hướng dẫn - Provide / Inject](/guide/components/provide-inject)
  - [Hướng dẫn - Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() {#has-injection-context}

- Chỉ được hỗ trợ từ 3.3+

Trả về true nếu [inject()](#inject) có thể được sử dụng mà không có cảnh báo về việc được gọi ở sai chỗ (ví dụ: bên ngoài `setup()`). Phương thức này được thiết kế để được sử dụng bởi các thư viện muốn sử dụng `inject()` nội bộ mà không kích hoạt cảnh báo cho người dùng cuối.

- **Type**

  ```ts
  function hasInjectionContext(): boolean
  ```

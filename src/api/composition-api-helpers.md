# Composition API: Các hàm trợ giúp {#composition-api-helpers}

## useAttrs() {#useattrs}

Trả về đối tượng `attrs` từ [Setup Context](/api/composition-api-setup#setup-context), bao gồm các [fallthrough attributes](/guide/components/attrs#fallthrough-attributes) của component hiện tại. Hàm này được dùng trong `<script setup>` nơi đối tượng setup context không khả dụng.

- **Type**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Trả về đối tượng `slots` từ [Setup Context](/api/composition-api-setup#setup-context), bao gồm các slot được truyền từ component cha dưới dạng các hàm có thể gọi trả về các node Virtual DOM. Hàm này được dùng trong `<script setup>` nơi đối tượng setup context không khả dụng.

Nếu sử dụng TypeScript, nên ưu tiên sử dụng [`defineSlots()`](/api/sfc-script-setup#defineslots) thay thế.

- **Type**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

Đây là hàm trợ giúp cơ bản hỗ trợ [`defineModel()`](/api/sfc-script-setup#definemodel). Nếu sử dụng `<script setup>`, nên ưu tiên sử dụng `defineModel()` thay thế.

- Chỉ có sẵn từ phiên bản 3.4+

- **Type**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Ví dụ**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Chi tiết**

  `useModel()` có thể được sử dụng trong các component không phải SFC, ví dụ khi sử dụng hàm `setup()` thuần. Hàm này mong đợi đối tượng `props` làm đối số đầu tiên, và tên model làm đối số thứ hai. Đối số thứ ba tùy chọn có thể được sử dụng để khai báo getter và setter tùy chỉnh cho model ref kết quả. Lưu ý rằng không giống như `defineModel()`, bạn phải tự chịu trách nhiệm khai báo props và emits.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Trả về một shallow ref có giá trị sẽ được đồng bộ với phần tử template hoặc component có thuộc tính ref tương ứng.

- **Type**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Ví dụ**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Xem thêm**
  - [Guide - Template Refs](/guide/essentials/template-refs)
  - [Guide - Typing Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typing Component Template Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Được sử dụng để tạo các ID duy nhất cho mỗi ứng dụng cho các thuộc tính accessibility hoặc các phần tử form.

- **Type**

  ```ts
  function useId(): string
  ```

- **Ví dụ**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Chi tiết**

  Các ID được tạo bởi `useId()` là duy nhất cho mỗi ứng dụng. Hàm này có thể được sử dụng để tạo ID cho các phần tử form và thuộc tính accessibility. Nhiều lần gọi trong cùng một component sẽ tạo ra các ID khác nhau; nhiều instance của cùng một component gọi `useId()` cũng sẽ có các ID khác nhau.

  Các ID được tạo bởi `useId()` cũng được đảm bảo ổn định giữa server và client renders, vì vậy chúng có thể được sử dụng trong các ứng dụng SSR mà không gây ra hydration mismatches.

  Nếu bạn có nhiều hơn một instance ứng dụng Vue trên cùng một trang, bạn có thể tránh xung đột ID bằng cách cung cấp tiền tố ID cho mỗi ứng dụng thông qua [`app.config.idPrefix`](/api/application#app-config-idprefix).

  :::warning Cảnh báo
  `useId()` không nên được gọi bên trong thuộc tính `computed()` vì nó có thể gây ra xung đột instance. Thay vào đó, hãy khai báo ID bên ngoài `computed()` và tham chiếu nó trong hàm computed.
  :::

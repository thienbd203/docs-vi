# Global API: General {#global-api-general}

## version {#version}

Cung cấp phiên bản hiện tại của Vue.

- **Kiểu:** `string`

- **Ví dụ**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Một tiện ích để chờ đợi lần cập nhật DOM tiếp theo được flush (xử lý).

- **Kiểu**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Chi tiết**

  Khi bạn thay đổi (mutate) trạng thái reactive trong Vue, các cập nhật DOM kết quả không được áp dụng đồng bộ. Thay vào đó, Vue sẽ buffer chúng cho đến "next tick" để đảm bảo rằng mỗi component chỉ cập nhật một lần bất kể bạn đã thực hiện bao nhiêu thay đổi trạng thái.

  `nextTick()` có thể được sử dụng ngay sau khi thay đổi trạng thái để chờ các cập nhật DOM hoàn tất. Bạn có thể truyền một callback làm đối số, hoặc await Promise được trả về.

- **Ví dụ**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM chưa được cập nhật
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM đã được cập nhật
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM chưa được cập nhật
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM đã được cập nhật
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Xem thêm** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Một type helper để định nghĩa một Vue component với type inference (suy luận kiểu).

- **Kiểu**

  ```ts
  // cú pháp options
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // cú pháp function (yêu cầu 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Type được đơn giản hóa để dễ đọc.

- **Chi tiết**

  Đối số đầu tiên mong đợi một object chứa các tùy chọn của component. Giá trị trả về sẽ là cùng một object tùy chọn đó, vì hàm này về cơ bản là một no-op (không làm gì) ở runtime chỉ để phục vụ mục đích suy luận kiểu.

  Lưu ý rằng kiểu trả về hơi đặc biệt: nó sẽ là một constructor type có instance type là kiểu instance component được suy luận dựa trên các tùy chọn. Điều này được sử dụng để suy luận kiểu khi kiểu trả về được dùng làm tag trong TSX.

  Bạn có thể trích xuất instance type của một component (tương đương với kiểu của `this` trong các tùy chọn của nó) từ kiểu trả về của `defineComponent()` như sau:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Function Signature {#function-signature}

  - Chỉ được hỗ trợ từ 3.3+

  `defineComponent()` cũng có một signature thay thế được dùng với Composition API và [render functions hoặc JSX](/guide/extras/render-function.html).

  Thay vì truyền vào một object tùy chọn, một function được mong đợi thay thế. Function này hoạt động giống như function Composition API [`setup()`](/api/composition-api-setup.html#composition-api-setup): nó nhận props và context setup. Giá trị trả về nên là một render function - cả `h()` và JSX đều được hỗ trợ:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // sử dụng Composition API ở đây giống như trong <script setup>
      const count = ref(0)

      return () => {
        // render function hoặc JSX
        return h('div', count.value)
      }
    },
    // các tùy chọn bổ sung, ví dụ: khai báo props và emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  Use case chính của signature này là với TypeScript (đặc biệt là TSX), vì nó hỗ trợ generics:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // sử dụng Composition API ở đây giống như trong <script setup>
      const count = ref(0)

      return () => {
        // render function hoặc JSX
        return <div>{count.value}</div>
      }
    },
    // khai báo props runtime thủ công hiện tại vẫn cần thiết.
    {
      props: ['msg', 'list']
    }
  )
  ```

  Trong tương lai, chúng tôi dự định cung cấp một Babel plugin tự động suy luận và inject runtime props (như với `defineProps` trong SFCs) để có thể bỏ qua khai báo props runtime.

  ### Note on webpack Treeshaking {#note-on-webpack-treeshaking}

  Vì `defineComponent()` là một function call, nó có thể trông giống như sẽ tạo ra side-effects đối với một số build tools, ví dụ webpack. Điều này sẽ ngăn component được tree-shaken ngay cả khi component không bao giờ được sử dụng.

  Để báo cho webpack biết rằng function call này an toàn để tree-shaken, bạn có thể thêm ký hiệu comment `/*#__PURE__*/` trước function call:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Lưu ý điều này không cần thiết nếu bạn đang sử dụng Vite, vì Rollup (bundler sản phẩm cơ bản được Vite sử dụng) đủ thông minh để xác định rằng `defineComponent()` thực sự không có side-effect mà không cần annotation thủ công.

- **Xem thêm** [Guide - Using Vue with TypeScript](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Định nghĩa một async component được lazy load chỉ khi nó được render. Đối số có thể là một loader function, hoặc một object tùy chọn để kiểm soát hành vi loading nâng cao hơn.

- **Type**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Xem thêm** [Guide - Async Components](/guide/components/async)

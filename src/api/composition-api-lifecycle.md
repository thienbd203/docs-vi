# Composition API: Lifecycle Hooks {#composition-api-lifecycle-hooks}

:::info Lưu ý sử dụng
Tất cả API được liệt kê trong trang này phải được gọi đồng bộ trong giai đoạn `setup()` của một component. Xem [Hướng dẫn - Lifecycle Hooks](/guide/essentials/lifecycle) để biết thêm chi tiết.
:::

## onMounted() {#onmounted}

Đăng ký một callback để được gọi sau khi component đã được mount.

- **Kiểu**

  ```ts
  function onMounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Một component được coi là đã được mount sau khi:

  - Tất cả các component con đồng bộ của nó đã được mount (không bao gồm các component bất đồng bộ hoặc các component bên trong cây `<Suspense>`).

  - Cây DOM của chính nó đã được tạo và chèn vào container cha. Lưu ý rằng nó chỉ đảm bảo cây DOM của component nằm trong tài liệu nếu container gốc của ứng dụng cũng nằm trong tài liệu.

  Hook này thường được sử dụng để thực hiện các side effects cần truy cập vào DOM đã render của component, hoặc để giới hạn code liên quan đến DOM ở phía client trong một [ứng dụng được render ở phía server](/guide/scaling-up/ssr).

  **Hook này không được gọi trong quá trình render phía server.**

- **Ví dụ**

  Truy cập một phần tử thông qua template ref:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Đăng ký một callback để được gọi sau khi component đã cập nhật cây DOM của nó do sự thay đổi trạng thái reactivity.

- **Kiểu**

  ```ts
  function onUpdated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Hook updated của component cha được gọi sau hook của các component con.

  Hook này được gọi sau bất kỳ cập nhật DOM nào của component, có thể được gây ra bởi các thay đổi trạng thái khác nhau, vì nhiều thay đổi trạng thái có thể được gộp thành một chu kỳ render duy nhất vì lý do hiệu suất. Nếu bạn cần truy cập vào DOM đã cập nhật sau một thay đổi trạng thái cụ thể, hãy sử dụng [nextTick()](/api/general#nexttick) thay thế.

  **Hook này không được gọi trong quá trình render phía server.**

  :::warning
  Không thay đổi trạng thái component trong hook updated - điều này có thể dẫn đến vòng lặp cập nhật vô hạn!
  :::

- **Ví dụ**

  Truy cập DOM đã cập nhật:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // nội dung văn bản nên giống với `count.value` hiện tại
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Đăng ký một callback để được gọi sau khi component đã được unmount.

- **Kiểu**

  ```ts
  function onUnmounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Một component được coi là đã được unmount sau khi:

  - Tất cả các component con của nó đã được unmount.

  - Tất cả các reactive effect liên quan của nó (render effect và computed / watchers được tạo trong `setup()`) đã được dừng.

  Sử dụng hook này để dọn dẹp các side effects được tạo thủ công như timers, DOM event listeners hoặc kết nối server.

  **Hook này không được gọi trong quá trình render phía server.**

- **Example**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Đăng ký một hook để được gọi ngay trước khi component được mount.

- **Kiểu**

  ```ts
  function onBeforeMount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Khi hook này được gọi, component đã hoàn thành việc thiết lập trạng thái reactivity của nó, nhưng chưa có nút DOM nào được tạo. Nó sắp thực hiện render effect DOM lần đầu tiên.

  **Hook này không được gọi trong quá trình render phía server.**

## onBeforeUpdate() {#onbeforeupdate}

Đăng ký một hook để được gọi ngay trước khi component sắp cập nhật cây DOM của nó do sự thay đổi trạng thái reactivity.

- **Kiểu**

  ```ts
  function onBeforeUpdate(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Hook này có thể được sử dụng để truy cập trạng thái DOM trước khi Vue cập nhật DOM. Việc thay đổi trạng thái component bên trong hook này cũng an toàn.

  **Hook này không được gọi trong quá trình render phía server.**

## onBeforeUnmount() {#onbeforeunmount}

Đăng ký một hook để được gọi ngay trước khi một instance component được unmount.

- **Kiểu**

  ```ts
  function onBeforeUnmount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Chi tiết**

  Khi hook này được gọi, instance component vẫn hoạt động đầy đủ.

  **Hook này không được gọi trong quá trình render phía server.**

## onErrorCaptured() {#onerrorcaptured}

Đăng ký một hook để được gọi khi một lỗi lan truyền từ một component con đã được bắt.

- **Kiểu**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Chi tiết**

  Lỗi có thể được bắt từ các nguồn sau:

  - Component renders
  - Event handlers
  - Lifecycle hooks
  - Hàm `setup()`
  - Watchers
  - Custom directive hooks
  - Transition hooks

  Hook nhận ba đối số: lỗi, instance component đã kích hoạt lỗi, và một chuỗi thông tin chỉ định loại nguồn lỗi.

  :::tip
  Trong môi trường production, đối số thứ 3 (`info`) sẽ là một mã rút gọn thay vì chuỗi thông tin đầy đủ. Bạn có thể tìm thấy ánh xạ mã sang chuỗi trong [Tham khảo Mã Lỗi Production](/error-reference/#runtime-errors).
  :::

  Bạn có thể thay đổi trạng thái component trong `onErrorCaptured()` để hiển thị trạng thái lỗi cho người dùng. Tuy nhiên, điều quan trọng là trạng thái lỗi không nên render nội dung gốc đã gây ra lỗi; nếu không component sẽ bị ném vào vòng lặp render vô hạn.

  Hook có thể trả về `false` để ngăn lỗi lan truyền thêm. Xem chi tiết lan truyền lỗi bên dưới.

  **Quy tắc Lan truyền Lỗi**

  - Theo mặc định, tất cả lỗi vẫn được gửi đến [`app.config.errorHandler`](/api/application#app-config-errorhandler) cấp ứng dụng nếu được định nghĩa, để các lỗi này vẫn có thể được báo cáo cho dịch vụ phân tích ở một nơi duy nhất.

  - Nếu nhiều hook `errorCaptured` tồn tại trên chuỗi kế thừa hoặc chuỗi cha của component, tất cả chúng sẽ được gọi cho cùng một lỗi, theo thứ tự từ dưới lên trên. Điều này tương tự như cơ chế bubbling của sự kiện DOM gốc.

  - Nếu hook `errorCaptured` tự nó ném một lỗi, cả lỗi này và lỗi gốc đã bắt đều được gửi đến `app.config.errorHandler`.

  - Một hook `errorCaptured` có thể trả về `false` để ngăn lỗi lan truyền thêm. Về cơ bản điều này có nghĩa là "lỗi này đã được xử lý và nên bị bỏ qua." Nó sẽ ngăn bất kỳ hook `errorCaptured` bổ sung hoặc `app.config.errorHandler` nào được gọi cho lỗi này.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Đăng ký một hook debug để được gọi khi một dependency reactivity đã được theo dõi bởi render effect của component.

**Hook này chỉ dành cho chế độ development và không được gọi trong quá trình render phía server.**

- **Kiểu**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Xem thêm** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Đăng ký một hook debug để được gọi khi một dependency reactivity kích hoạt render effect của component để chạy lại.

**Hook này chỉ dành cho chế độ development và không được gọi trong quá trình render phía server.**

- **Kiểu**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **Xem thêm** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Đăng ký một callback để được gọi sau khi instance component được chèn vào DOM như một phần của cây được cache bởi [`<KeepAlive>`](/api/built-in-components#keepalive).

**Hook này không được gọi trong quá trình render phía server.**

- **Kiểu**

  ```ts
  function onActivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Xem thêm** [Hướng dẫn - Lifecycle của Instance được Cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Đăng ký một callback để được gọi sau khi instance component được xóa khỏi DOM như một phần của cây được cache bởi [`<KeepAlive>`](/api/built-in-components#keepalive).

**Hook này không được gọi trong quá trình render phía server.**

- **Kiểu**

  ```ts
  function onDeactivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Xem thêm** [Hướng dẫn - Lifecycle của Instance được Cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" /> {#onserverprefetch}

Đăng ký một hàm async để được giải quyết trước khi instance component được render trên server.

- **Kiểu**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Chi tiết**

  Nếu callback trả về một Promise, server renderer sẽ đợi cho đến khi Promise được giải quyết trước khi render component.

  Hook này chỉ được gọi trong quá trình render phía server và có thể được sử dụng để thực hiện việc lấy dữ liệu chỉ ở phía server.

- **Ví dụ**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // component được render như một phần của yêu cầu ban đầu
    // pre-fetch dữ liệu trên server vì nó nhanh hơn trên client
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // nếu dữ liệu là null khi mount, điều đó có nghĩa là component
      // được render động trên client. Thực hiện
      // fetch phía client thay thế.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **Xem thêm** [Server-Side Rendering](/guide/scaling-up/ssr)

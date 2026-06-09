# Options: Lifecycle {#options-lifecycle}

:::info Xem thêm
Để biết cách sử dụng chung của lifecycle hooks, xem [Hướng dẫn - Lifecycle Hooks](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Được gọi khi instance được khởi tạo.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Được gọi ngay lập tức khi instance được khởi tạo và props được giải quyết.

  Sau đó props sẽ được định nghĩa là các reactive properties và state như `data()` hoặc `computed` sẽ được thiết lập.

  Lưu ý rằng hook `setup()` của Composition API được gọi trước bất kỳ hook nào của Options API, kể cả `beforeCreate()`.

## created {#created}

Được gọi sau khi instance đã hoàn thành việc xử lý tất cả các tùy chọn liên quan đến state.

- **Type**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Khi hook này được gọi, những thứ sau đã được thiết lập: reactive data, computed properties, methods, và watchers. Tuy nhiên, giai đoạn mounting chưa được bắt đầu, và property `$el` sẽ chưa có sẵn.

## beforeMount {#beforemount}

Được gọi ngay trước khi component được mount.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Khi hook này được gọi, component đã hoàn thành việc thiết lập reactive state, nhưng chưa có DOM node nào được tạo. Nó sắp thực thi DOM render effect lần đầu tiên.

  **Hook này không được gọi trong quá trình server-side rendering.**

## mounted {#mounted}

Được gọi sau khi component đã được mount.

- **Type**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Một component được coi là đã được mount sau khi:

  - Tất cả các component con đồng bộ đã được mount (không bao gồm async components hoặc các component bên trong cây `<Suspense>`).

  - Cây DOM của chính nó đã được tạo và chèn vào container cha. Lưu ý rằng nó chỉ đảm bảo cây DOM của component nằm trong tài liệu nếu container gốc của ứng dụng cũng nằm trong tài liệu.

  Hook này thường được dùng để thực hiện các side effects cần truy cập vào DOM đã render của component, hoặc để giới hạn code liên quan đến DOM ở client trong một [ứng dụng được render ở server](/guide/scaling-up/ssr).

  **Hook này không được gọi trong quá trình server-side rendering.**

## beforeUpdate {#beforeupdate}

Được gọi ngay trước khi component sắp cập nhật cây DOM do thay đổi của reactive state.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Hook này có thể được dùng để truy cập vào trạng thái DOM trước khi Vue cập nhật DOM. Việc sửa đổi component state bên trong hook này cũng an toàn.

  **Hook này không được gọi trong quá trình server-side rendering.**

## updated {#updated}

Được gọi sau khi component đã cập nhật cây DOM do thay đổi của reactive state.

- **Type**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Hook updated của component cha được gọi sau hook của các component con.

  Hook này được gọi sau bất kỳ cập nhật DOM nào của component, có thể do các thay đổi state khác nhau. Nếu bạn cần truy cập vào DOM đã cập nhật sau một thay đổi state cụ thể, hãy sử dụng [nextTick()](/api/general#nexttick) thay thế.

  **Hook này không được gọi trong quá trình server-side rendering.**

  :::warning
  Không nên thay đổi component state trong hook updated - điều này có thể dẫn đến vòng lặp cập nhật vô tận!
  :::

## beforeUnmount {#beforeunmount}

Được gọi ngay trước khi một instance component được unmount.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Khi hook này được gọi, instance component vẫn hoạt động đầy đủ.

  **Hook này không được gọi trong quá trình server-side rendering.**

## unmounted {#unmounted}

Được gọi sau khi component đã được unmount.

- **Type**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Chi tiết**

  Một component được coi là đã được unmount sau khi:

  - Tất cả các component con đã được unmount.

  - Tất cả các reactive effects liên quan (render effect và computed / watchers được tạo trong `setup()`) đã được dừng.

  Sử dụng hook này để dọn dẹp các side effects được tạo thủ công như timers, DOM event listeners hoặc các kết nối server.

  **Hook này không được gọi trong quá trình server-side rendering.**

## errorCaptured {#errorcaptured}

Được gọi khi một lỗi lan truyền từ component con đã được bắt.

- **Type**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
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
  Trong môi trường production, đối số thứ 3 (`info`) sẽ là một mã rút gọn thay vì chuỗi thông tin đầy đủ. Bạn có thể tìm ánh xạ từ mã sang chuỗi trong [Production Error Code Reference](/error-reference/#runtime-errors).
  :::

  Bạn có thể sửa đổi component state trong `errorCaptured()` để hiển thị trạng thái lỗi cho người dùng. Tuy nhiên, điều quan trọng là trạng thái lỗi không nên render nội dung gốc đã gây ra lỗi; nếu không component sẽ bị đưa vào vòng lặp render vô tận.

  Hook có thể trả về `false` để ngăn lỗi lan truyền thêm. Xem chi tiết lan truyền lỗi bên dưới.

  **Quy tắc Lan truyền Lỗi**

  - Theo mặc định, tất cả lỗi vẫn được gửi đến [`app.config.errorHandler`](/api/application#app-config-errorhandler) ở cấp ứng dụng nếu nó được định nghĩa, để các lỗi này vẫn có thể được báo cáo cho một dịch vụ analytics ở một nơi duy nhất.

  - Nếu có nhiều hook `errorCaptured` trên chuỗi kế thừa hoặc chuỗi cha của component, tất cả chúng sẽ được gọi cho cùng một lỗi, theo thứ tự từ dưới lên trên. Điều này tương tự như cơ chế bubbling của các sự kiện DOM gốc.

  - Nếu hook `errorCaptured` tự nó ném lỗi, cả lỗi này và lỗi gốc đã bắt đều được gửi đến `app.config.errorHandler`.

  - Hook `errorCaptured` có thể trả về `false` để ngăn lỗi lan truyền thêm. Về cơ bản điều này có nghĩa là "lỗi này đã được xử lý và nên bị bỏ qua." Nó sẽ ngăn bất kỳ hook `errorCaptured` thêm nào hoặc `app.config.errorHandler` được gọi cho lỗi này.

  **Lưu ý về Bắt Lỗi**

  - Trong các component có hàm `setup()` async (với `await` ở cấp cao nhất) Vue **luôn luôn** sẽ cố gắng render template component, ngay cả khi `setup()` đã ném lỗi. Điều này có thể gây ra nhiều lỗi hơn vì trong quá trình render, template của component có thể cố gắng truy cập các thuộc tính không tồn tại của context `setup()` thất bại. Khi bắt lỗi trong các component như vậy, hãy sẵn sàng xử lý lỗi từ cả `setup()` async thất bại (chúng sẽ luôn đến trước) và quá trình render thất bại.

  - <sup class="vt-badge" data-text="SSR only"></sup> Thay thế component con bị lỗi trong component cha sâu bên trong `<Suspense>` sẽ gây ra sự không khớp hydration trong SSR. Thay vào đó, hãy cố gắng tách logic có thể ném lỗi từ `setup()` con thành hàm riêng và thực thi nó trong `setup()` của component cha, nơi bạn có thể an toàn `try/catch` quá trình thực thi và thực hiện thay thế nếu cần trước khi render component con thực tế.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Được gọi khi một reactive dependency đã được theo dõi bởi render effect của component.

**Hook này chỉ hoạt động trong chế độ development và không được gọi trong quá trình server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Xem thêm** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Được gọi khi một reactive dependency kích hoạt render effect của component để chạy lại.

**Hook này chỉ hoạt động trong chế độ development và không được gọi trong quá trình server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

## activated {#activated}

Được gọi sau khi instance component được chèn vào DOM như một phần của cây được cache bởi [`<KeepAlive>`](/api/built-in-components#keepalive).

**Hook này không được gọi trong quá trình server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Xem thêm** [Hướng dẫn - Lifecycle của Instance được Cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Được gọi sau khi instance component được xóa khỏi DOM như một phần của cây được cache bởi [`<KeepAlive>`](/api/built-in-components#keepalive).

**Hook này không được gọi trong quá trình server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Xem thêm** [Hướng dẫn - Lifecycle của Instance được Cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Hàm async sẽ được giải quyết trước khi instance component được render trên server.

- **Type**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Chi tiết**

  Nếu hook trả về một Promise, server renderer sẽ đợi cho đến khi Promise được giải quyết trước khi render component.

  Hook này chỉ được gọi trong quá trình server-side rendering và có thể được dùng để thực hiện việc lấy dữ liệu chỉ trên server.

- **Ví dụ**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // component được render như một phần của yêu cầu ban đầu
      // pre-fetch dữ liệu trên server vì nó nhanh hơn trên client
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // nếu data là null khi mount, điều này có nghĩa là component
        // được render động trên client. Thực hiện
        // client-side fetch thay thế.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Xem thêm** [Server-Side Rendering](/guide/scaling-up/ssr)

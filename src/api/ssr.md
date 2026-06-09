# API Server-Side Rendering {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Được xuất từ `vue/server-renderer`**

- **Kiểu**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Ví dụ**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR Context {#ssr-context}

  Bạn có thể truyền một đối tượng context tùy chọn, có thể được sử dụng để ghi lại dữ liệu bổ sung trong quá trình render, ví dụ [truy cập nội dung của Teleports](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  Hầu hết các API SSR khác trên trang này cũng tùy chọn chấp nhận một đối tượng context. Đối tượng context có thể được truy cập trong mã component thông qua helper [useSSRContext](#usessrcontext).

- **Xem thêm** [Hướng dẫn - Server-Side Rendering](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Render đầu vào thành [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Được xuất từ `vue/server-renderer`**

- **Kiểu**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Ví dụ**

  ```js
  // bên trong một http handler của Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Lưu ý
  Phương thức này không được hỗ trợ trong bản build ESM của `vue/server-renderer`, được tách rời khỏi môi trường Node.js. Thay vào đó hãy sử dụng [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Render và pipe đến một instance [Node.js Writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) hiện có.

- **Được xuất từ `vue/server-renderer`**

- **Kiểu**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Ví dụ**

  ```js
  // bên trong một http handler của Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Render đầu vào thành [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Được xuất từ `vue/server-renderer`**

- **Kiểu**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Ví dụ**

  ```js
  // trong môi trường có hỗ trợ ReadableStream
  return new Response(renderToWebStream(app))
  ```

  :::tip Lưu ý
  Trong các môi trường không expose constructor `ReadableStream` trong global scope, nên sử dụng [`pipeToWebWritable()`](#pipetowebwritable) thay thế.
  :::

## pipeToWebWritable() {#pipetowebwritable}

Render và pipe đến một instance [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) hiện có.

- **Được xuất từ `vue/server-renderer`**

- **Kiểu**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Ví dụ**

  Phương thức này thường được sử dụng kết hợp với [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream có sẵn trong các môi trường như CloudFlare workers.
  // trong Node.js, TransformStream cần được import rõ ràng từ 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Renders input in streaming mode using a simple readable interface.

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Example**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // done
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // error encountered
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Một API runtime được sử dụng để lấy đối tượng context được truyền vào `renderToString()` hoặc các API render server khác.

- **Type**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Example**

  The retrieved context can be used to attach information that is needed for rendering the final HTML (e.g. head metadata).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // make sure to only call it during SSR
  // https://vite.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...attach properties to the context
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

Một thuộc tính đặc biệt có thể được sử dụng để chặn các cảnh báo [hydration mismatch](/guide/scaling-up/ssr#hydration-mismatch).

- **Example**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  The value can limit the allowed mismatch to a specific type. Allowed values are:

  - `text`
  - `children` (only allows mismatch for direct children)
  - `class`
  - `style`
  - `attribute`

  If no value is provided, all types of mismatches will be allowed.

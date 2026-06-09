# API Custom Renderer {#custom-renderer-api}

## createRenderer() {#createrenderer}

Tạo một custom renderer. Bằng cách cung cấp các API tạo và thao tác node cụ thể cho nền tảng, bạn có thể tận dụng runtime cốt lõi của Vue để nhắm đến các môi trường không phải DOM.

- **Kiểu**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      namespace?: ElementNamespace,
      parentComponent?: ComponentInternalInstance | null,
    ): void
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
    remove(el: HostNode): void
    createElement(
      type: string,
      namespace?: ElementNamespace,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      namespace: ElementNamespace,
      start?: HostNode | null,
      end?: HostNode | null,
    ): [HostNode, HostNode]
  }
  ```

- **Ví dụ**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` là API cấp thấp
  // `createApp` trả về một instance của app
  export { render, createApp }

  // re-export các API cốt lõi của Vue
  export * from '@vue/runtime-core'
  ```

  `@vue/runtime-dom` của chính Vue được [triển khai sử dụng cùng API này](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts). Để xem một triển khai đơn giản hơn, hãy kiểm tra [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts) - đây là package riêng tư cho unit testing của chính Vue.

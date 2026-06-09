# Các Kiểu Tiện Ích {#utility-types}

:::info
Trang này chỉ liệt kê một vài kiểu tiện ích thường được sử dụng có thể cần giải thích về cách sử dụng. Để xem danh sách đầy đủ các kiểu được xuất, hãy tham khảo [mã nguồn](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Được sử dụng để annotate một prop với các kiểu nâng cao hơn khi sử dụng khai báo props runtime.

- **Ví dụ**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // provide more specific type to `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Xem thêm** [Hướng dẫn - Typing Component Props](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

- Chỉ được hỗ trợ từ 3.3+

Alias cho `T | Ref<T>`. Hữu ích để annotate các đối số của [Composables](/guide/reusability/composables.html).

## MaybeRefOrGetter\<T> {#maybereforgetter}

- Chỉ được hỗ trợ từ 3.3+

Alias cho `T | Ref<T> | (() => T)`. Hữu ích để annotate các đối số của [Composables](/guide/reusability/composables.html).

## ExtractPropTypes\<T> {#extractproptypes}

Trích xuất các kiểu prop từ một đối tượng tùy chọn props runtime. Các kiểu được trích xuất là nội bộ - tức là các props được giải quyết nhận bởi component. Điều này có nghĩa là boolean props và props với giá trị mặc định luôn được định nghĩa, ngay cả khi chúng không được yêu cầu.

Để trích xuất các props công khai, tức là props mà cha được phép truyền, hãy sử dụng [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Ví dụ**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

- Only supported in 3.3+

Extract prop types from a runtime props options object. The extracted types are public facing - i.e. the props that the parent is allowed to pass.

- **Ví dụ**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Được sử dụng để augment kiểu instance component để hỗ trợ các thuộc tính toàn cục tùy chỉnh.

- **Ví dụ**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

- **See also** [Guide - Augmenting Global Properties](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Được sử dụng để augment kiểu tùy chọn component để hỗ trợ các tùy chọn tùy chỉnh.

- **Ví dụ**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

- **See also** [Guide - Augmenting Custom Options](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Được sử dụng để augment các props TSX được phép để sử dụng các props không được khai báo trên các phần tử TSX.

- **Ví dụ**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // now works even if hello is not a declared prop
  <MyComponent hello="world" />
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

## CSSProperties {#cssproperties}

Được sử dụng để augment các giá trị được phép trong các bindings thuộc tính style.

- **Ví dụ**

  Allow any custom CSS property

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Các augmentations phải được đặt trong một file module `.ts` hoặc `.d.ts`. Xem [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) để biết thêm chi tiết.
:::

:::info See also
SFC `<style>` tags support linking CSS values to dynamic component state using the `v-bind` CSS function. This allows for custom properties without type augmentation.

- [v-bind() in CSS](/api/sfc-css-features#v-bind-in-css)
  :::

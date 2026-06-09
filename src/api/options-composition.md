# Options: Composition {#options-composition}

## provide {#provide}

Cung cấp các giá trị có thể được inject bởi các thành phần con.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Details**

  `provide` và [`inject`](#inject) được sử dụng cùng nhau để cho phép một thành phần tổ tiên đóng vai trò là dependency injector cho tất cả các thành phần con cháu của nó, bất kể hệ thống phân cấp thành phần sâu đến đâu, miễn là chúng nằm trong cùng một chuỗi cha.

  Tùy chọn `provide` nên là một object hoặc một hàm trả về một object. Object này chứa các thuộc tính có sẵn để inject vào các thành phần con cháu. Bạn có thể sử dụng Symbols làm khóa trong object này.

- **Example**

  Cách sử dụng cơ bản:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Sử dụng hàm để cung cấp trạng thái theo từng thành phần:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Lưu ý trong ví dụ trên, `msg` được cung cấp sẽ KHÔNG reactive. Xem [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) để biết thêm chi tiết.

- **See also** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Khai báo các thuộc tính để inject vào thành phần hiện tại bằng cách định vị chúng từ các provider tổ tiên.

- **Type**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Details**

  Tùy chọn `inject` nên là:

  - Một mảng chuỗi, hoặc
  - Một object trong đó các khóa là tên binding cục bộ và giá trị là:
    - Khóa (chuỗi hoặc Symbol) để tìm kiếm trong các injection có sẵn, hoặc
    - Một object trong đó:
      - Thuộc tính `from` là khóa (chuỗi hoặc Symbol) để tìm kiếm trong các injection có sẵn, và
      - Thuộc tính `default` được sử dụng làm giá trị dự phòng. Tương tự như giá trị mặc định của props, một hàm factory cần thiết cho các kiểu object để tránh chia sẻ giá trị giữa nhiều instance thành phần.

  Một thuộc tính được inject sẽ là `undefined` nếu không có thuộc tính khớp hoặc giá trị mặc định nào được cung cấp.

  Lưu ý rằng các binding được inject KHÔNG reactive. Điều này là có chủ đích. Tuy nhiên, nếu giá trị được inject là một object reactive, các thuộc tính trên object đó vẫn giữ tính reactive. Xem [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) để biết thêm chi tiết.

- **Example**

  Cách sử dụng cơ bản:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Using an injected value as the default for a prop:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Using an injected value as data entry:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Injections can be optional with default value:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  If it needs to be injected from a property with a different name, use `from` to denote the source property:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Similar to prop defaults, you need to use a factory function for non-primitive values:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **See also** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Một mảng các đối tượng tùy chọn sẽ được mix vào component hiện tại.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Details**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options like normal instance objects, and they will be merged against the eventual options using the certain option merging logic. For example, if your mixin contains a `created` hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

  :::warning No Longer Recommended
  In Vue 2, mixins were the primary mechanism for creating reusable chunks of component logic. While mixins continue to be supported in Vue 3, [Composable functions using Composition API](/guide/reusability/composables) is now the preferred approach for code reuse between components.
  :::

- **Example**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Một component "lớp cơ sở" để extend từ.

- **Type**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Details**

  Allows one component to extend another, inheriting its component options.

  From an implementation perspective, `extends` is almost identical to `mixins`. The component specified by `extends` will be treated as though it were the first mixin.

  However, `extends` and `mixins` express different intents. The `mixins` option is primarily used to compose chunks of functionality, whereas `extends` is primarily concerned with inheritance.

  As with `mixins`, any options (except for `setup()`) will be merged using the relevant merge strategy.

- **Example**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Not Recommended for Composition API
  `extends` is designed for Options API and does not handle the merging of the `setup()` hook.

  In Composition API, the preferred mental model for logic reuse is "compose" over "inheritance". If you have logic from a component that needs to be reused in another one, consider extracting the relevant logic into a [Composable](/guide/reusability/composables#composables).

  If you still intend to "extend" a component using Composition API, you can call the base component's `setup()` in the extending component's `setup()`:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // local bindings
      }
    }
  }
  ```
  :::

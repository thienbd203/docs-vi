---
outline: deep
---

# Cơ chế Rendering {#rendering-mechanism}

Làm thế nào Vue lấy một template và biến nó thành các node DOM thực tế? Làm thế nào Vue cập nhật các node DOM đó một cách hiệu quả? Chúng ta sẽ cố gắng làm sáng tỏ những câu hỏi này ở đây bằng cách đi sâu vào cơ chế rendering nội bộ của Vue.

## Virtual DOM {#virtual-dom}

Bạn có thể đã nghe về thuật ngữ "virtual DOM", mà hệ thống rendering của Vue dựa vào.

Virtual DOM (VDOM) là một khái niệm lập trình nơi một đại diện lý tưởng, hoặc "ảo", của một UI được giữ trong bộ nhớ và đồng bộ hóa với DOM "thực". Khái niệm này được tiên phong bởi [React](https://react.dev/), và đã được chấp nhận trong nhiều framework khác với các triển khai khác nhau, bao gồm Vue.

Virtual DOM là một pattern hơn là một công nghệ cụ thể, vì vậy không có một triển khai chuẩn nào. Chúng ta có thể minh họa ý tưởng bằng một ví dụ đơn giản:

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* more vnodes */
  ]
}
```

Ở đây, `vnode` là một đối tượng JavaScript đơn giản (một "virtual node") đại diện cho một phần tử `<div>`. Nó chứa tất cả thông tin chúng ta cần để tạo phần tử thực tế. Nó cũng chứa nhiều vnode con, làm cho nó trở thành root của một cây virtual DOM.

Một runtime renderer có thể đi qua một cây virtual DOM và xây dựng một cây DOM thực tế từ nó. Quá trình này được gọi là **mount**.

Nếu chúng ta có hai bản sao của cây virtual DOM, renderer cũng có thể đi qua và so sánh hai cây đó, tìm ra sự khác biệt, và áp dụng những thay đổi đó vào DOM thực tế. Quá trình này được gọi là **patch**, cũng được biết là "diffing" hoặc "reconciliation".

Lợi ích chính của virtual DOM là nó mang lại cho nhà phát triển khả năng tạo, kiểm tra và soạn thảo các cấu trúc UI mong muốn theo cách lập trình, trong khi để việc thao tác DOM trực tiếp cho renderer.

## Render Pipeline {#render-pipeline}

Ở mức cao, đây là những gì xảy ra khi một component Vue được mount:

1. **Biên dịch**: Các template Vue được biên dịch thành **render functions**: các hàm trả về cây virtual DOM. Bước này có thể được thực hiện trước thời gian thông qua một bước build, hoặc ngay lập tức bằng cách sử dụng trình biên dịch runtime.

2. **Mount**: Runtime renderer gọi các render functions, đi qua cây virtual DOM được trả về, và tạo các node DOM thực tế dựa trên nó. Bước này được thực hiện như một [reactive effect](./reactivity-in-depth), vì vậy nó theo dõi tất cả các phụ thuộc phản ứng được sử dụng.

3. **Patch**: Khi một phụ thuộc được sử dụng trong mount thay đổi, effect chạy lại. Lần này, một cây Virtual DOM mới, được cập nhật được tạo ra. Runtime renderer đi qua cây mới, so sánh nó với cái cũ, và áp dụng các cập nhật cần thiết cho DOM thực tế.

![render pipeline](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## Templates vs. Render Functions {#templates-vs-render-functions}

Vue templates are compiled into virtual DOM render functions. Vue also provides APIs that allow us to skip the template compilation step and directly author render functions. Render functions are more flexible than templates when dealing with highly dynamic logic, because you can work with vnodes using the full power of JavaScript.

So why does Vue recommend templates by default? There are a number of reasons:

1. Templates are closer to actual HTML. This makes it easier to reuse existing HTML snippets, apply accessibility best practices, style with CSS, and for designers to understand and modify.

2. Templates are easier to statically analyze due to their more deterministic syntax. This allows Vue's template compiler to apply many compile-time optimizations to improve the performance of the virtual DOM (which we will discuss below).

In practice, templates are sufficient for most use cases in applications. Render functions are typically only used in reusable components that need to deal with highly dynamic rendering logic. Render function usage is discussed in more detail in [Render Functions & JSX](./render-function).

## Compiler-Informed Virtual DOM {#compiler-informed-virtual-dom}

The virtual DOM implementation in React and most other virtual-DOM implementations are purely runtime: the reconciliation algorithm cannot make any assumptions about the incoming virtual DOM tree, so it has to fully traverse the tree and diff the props of every vnode in order to ensure correctness. In addition, even if a part of the tree never changes, new vnodes are always created for them on each re-render, resulting in unnecessary memory pressure. This is one of the most criticized aspect of virtual DOM: the somewhat brute-force reconciliation process sacrifices efficiency in return for declarativeness and correctness.

But it doesn't have to be that way. In Vue, the framework controls both the compiler and the runtime. This allows us to implement many compile-time optimizations that only a tightly-coupled renderer can take advantage of. The compiler can statically analyze the template and leave hints in the generated code so that the runtime can take shortcuts whenever possible. At the same time, we still preserve the capability for the user to drop down to the render function layer for more direct control in edge cases. We call this hybrid approach **Compiler-Informed Virtual DOM**.

Below, we will discuss a few major optimizations done by the Vue template compiler to improve the virtual DOM's runtime performance.

### Cache Static {#cache-static}

Quite often there will be parts in a template that do not contain any dynamic bindings:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- cached -->
  <div>bar</div> <!-- cached -->
  <div>{{ dynamic }}</div>
</div>
```

[Inspect in Template Explorer](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGNhY2hlZCAtLT5cbiAgPGRpdj5iYXI8L2Rpdj4gPCEtLSBjYWNoZWQgLS0+XG4gIDxkaXY+e3sgZHluYW1pYyB9fTwvZGl2PlxuPC9kaXY+XG4iLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)

The `foo` and `bar` divs are static - re-creating vnodes and diffing them on each re-render is unnecessary. The renderer creates these vnodes during the initial render, caches them, and reuses the same vnodes for every subsequent re-render. The renderer is also able to completely skip diffing them when it notices the old vnode and the new vnode are the same one.

In addition, when there are enough consecutive static elements, they will be condensed into a single "static vnode" that contains the plain HTML string for all these nodes ([Example](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). These static vnodes are mounted by directly setting `innerHTML`.

### Patch Flags {#patch-flags}

Đối với một phần tử đơn với các liên kết động, chúng ta cũng có thể suy ra nhiều thông tin từ nó tại thời điểm biên dịch:

```vue-html
<!-- class binding only -->
<div :class="{ active }"></div>

<!-- id and value bindings only -->
<input :id="id" :value="value">

<!-- text children only -->
<div>{{ dynamic }}</div>
```

[Inspect in Template Explorer](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

When generating the render function code for these elements, Vue encodes the type of update each of them needs directly in the vnode creation call:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

The last argument, `2`, is a [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts). An element can have multiple patch flags, which will be merged into a single number. The runtime renderer can then check against the flags using [bitwise operations](https://en.wikipedia.org/wiki/Bitwise_operation) to determine whether it needs to do certain work:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // update the element's class
}
```

Bitwise checks are extremely fast. With the patch flags, Vue is able to do the least amount of work necessary when updating elements with dynamic bindings.

Vue also encodes the type of children a vnode has. For example, a template that has multiple root nodes is represented as a fragment. In most cases, we know for sure that the order of these root nodes will never change, so this information can also be provided to the runtime as a patch flag:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

The runtime can thus completely skip child-order reconciliation for the root fragment.

### Tree Flattening {#tree-flattening}

Taking another look at the generated code from the previous example, you'll notice the root of the returned virtual DOM tree is created using a special `createElementBlock()` call:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Conceptually, a "block" is a part of the template that has stable inner structure. In this case, the entire template has a single block because it does not contain any structural directives like `v-if` and `v-for`.

Each block tracks any descendant nodes (not just direct children) that have patch flags. For example:

```vue-html{3,5}
<div> <!-- root block -->
  <div>...</div>         <!-- not tracked -->
  <div :id="id"></div>   <!-- tracked -->
  <div>                  <!-- not tracked -->
    <div>{{ bar }}</div> <!-- tracked -->
  </div>
</div>
```

The result is a flattened array that contains only the dynamic descendant nodes:

```
div (block root)
- div with :id binding
- div with {{ bar }} binding
```

When this component needs to re-render, it only needs to traverse the flattened tree instead of the full tree. This is called **Tree Flattening**, and it greatly reduces the number of nodes that need to be traversed during virtual DOM reconciliation. Any static parts of the template are effectively skipped.

`v-if` and `v-for` directives will create new block nodes:

```vue-html
<div> <!-- root block -->
  <div>
    <div v-if> <!-- if block -->
      ...
    </div>
  </div>
</div>
```

A child block is tracked inside the parent block's array of dynamic descendants. This retains a stable structure for the parent block.

### Impact on SSR Hydration {#impact-on-ssr-hydration}

Both patch flags and tree flattening also greatly improve Vue's [SSR Hydration](/guide/scaling-up/ssr#client-hydration) performance:

- Single element hydration can take fast paths based on the corresponding vnode's patch flag.

- Only block nodes and their dynamic descendants need to be traversed during hydration, effectively achieving partial hydration at the template level.

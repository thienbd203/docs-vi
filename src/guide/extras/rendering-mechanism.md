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

Các template Vue được biên dịch thành các render function của virtual DOM. Vue cũng cung cấp các API cho phép chúng ta bỏ qua bước biên dịch template và trực tiếp viết các render function. Render function linh hoạt hơn template khi xử lý logic động cao, vì bạn có thể làm việc với vnodes bằng toàn bộ sức mạnh của JavaScript.

Vậy tại sao Vue lại khuyến nghị sử dụng template theo mặc định? Có một số lý do:

1. Template gần với HTML thực tế hơn. Điều này giúp dễ dàng tái sử dụng các đoạn HTML hiện có, áp dụng các phương pháp tốt về khả năng truy cập, style với CSS, và cho các nhà thiết kế hiểu và sửa đổi.

2. Template dễ phân tích tĩnh hơn nhờ cú pháp xác định hơn. Điều này cho phép trình biên dịch template của Vue áp dụng nhiều tối ưu hóa tại thời điểm biên dịch để cải thiện hiệu suất của virtual DOM (chúng ta sẽ thảo luận dưới đây).

Trong thực tế, template đủ cho hầu hết các trường hợp sử dụng trong ứng dụng. Render function thường chỉ được sử dụng trong các component có thể tái sử dụng cần xử lý logic rendering động cao. Việc sử dụng render function được thảo luận chi tiết hơn trong [Render Functions & JSX](./render-function).

## Compiler-Informed Virtual DOM {#compiler-informed-virtual-dom}

Triển khai virtual DOM trong React và hầu hết các triển khai virtual DOM khác hoàn toàn ở runtime: thuật toán reconciliation không thể đưa ra bất kỳ giả định nào về cây virtual DOM đầu vào, vì vậy nó phải đi qua toàn bộ cây và diff props của mỗi vnode để đảm bảo tính chính xác. Ngoài ra, ngay cả khi một phần của cây không bao giờ thay đổi, các vnode mới luôn được tạo cho chúng trên mỗi lần re-render, dẫn đến áp lực bộ nhớ không cần thiết. Đây là một trong những khía cạnh bị chỉ trích nhiều nhất của virtual DOM: quá trình reconciliation kiểu brute-force hy sinh hiệu suất để đổi lấy tính khai báo và tính chính xác.

Nhưng không nhất thiết phải như vậy. Trong Vue, framework kiểm soát cả trình biên dịch và runtime. Điều này cho phép chúng ta triển khai nhiều tối ưu hóa tại thời điểm biên dịch mà chỉ có một renderer kết nối chặt chẽ mới có thể tận dụng. Trình biên dịch có thể phân tích tĩnh template và để lại các gợi ý trong mã được tạo ra để runtime có thể đi tắt bất cứ khi nào có thể. Đồng thời, chúng ta vẫn giữ khả năng cho người dùng chuyển xuống lớp render function để kiểm soát trực tiếp hơn trong các trường hợp đặc biệt. Chúng ta gọi phương pháp lai này là **Compiler-Informed Virtual DOM**.

Dưới đây, chúng ta sẽ thảo luận về một số tối ưu hóa chính được thực hiện bởi trình biên dịch template của Vue để cải thiện hiệu suất runtime của virtual DOM.

### Cache Static {#cache-static}

Rất thường xuyên sẽ có các phần trong template không chứa bất kỳ liên kết động nào:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- cached -->
  <div>bar</div> <!-- cached -->
  <div>{{ dynamic }}</div>
</div>
```

[Inspect in Template Explorer](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGNhY2hlZCAtLT5cbiAgPGRpdj5iYXI8L2Rpdj4gPCEtLSBjYWNoZWQgLS0+XG4gIDxkaXY+e3sgZHluYW1pYyB9fTwvZGl2PlxuPC9kaXY+XG4iLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)

Các div `foo` và `bar` là tĩnh - việc tạo lại vnode và diff chúng trên mỗi lần re-render là không cần thiết. Renderer tạo các vnode này trong lần render đầu tiên, lưu chúng vào cache, và tái sử dụng cùng các vnode đó cho mọi lần re-render tiếp theo. Renderer cũng có thể hoàn toàn bỏ qua việc diff chúng khi nhận thấy vnode cũ và vnode mới là cùng một cái.

Ngoài ra, khi có đủ các phần tử tĩnh liên tiếp, chúng sẽ được gộp thành một "static vnode" duy nhất chứa chuỗi HTML thuần túy cho tất cả các node này ([Ví dụ](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). Các vnode tĩnh này được mount bằng cách trực tiếp thiết lập `innerHTML`.

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

Khi tạo mã render function cho các phần tử này, Vue mã hóa loại cập nhật mà mỗi phần tử cần trực tiếp trong lệnh tạo vnode:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

Đối số cuối cùng, `2`, là một [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts). Một phần tử có thể có nhiều patch flag, sẽ được gộp thành một số duy nhất. Runtime renderer sau đó có thể kiểm tra các flag bằng cách sử dụng [các thao tác bitwise](https://en.wikipedia.org/wiki/Bitwise_operation) để xác định xem nó có cần thực hiện công việc cụ thể nào không:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // cập nhật class của phần tử
}
```

Kiểm tra bitwise cực kỳ nhanh. Với patch flags, Vue có thể thực hiện lượng công việc tối thiểu cần thiết khi cập nhật các phần tử có liên kết động.

Vue cũng mã hóa loại children mà một vnode có. Ví dụ, một template có nhiều node root được đại diện như một fragment. Trong hầu hết các trường hợp, chúng ta biết chắc chắn rằng thứ tự của các node root này sẽ không bao giờ thay đổi, vì vậy thông tin này cũng có thể được cung cấp cho runtime như một patch flag:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Runtime do đó có thể hoàn toàn bỏ qua reconciliation thứ tự children cho fragment root.

### Tree Flattening {#tree-flattening}

Nhìn lại mã được tạo từ ví dụ trước, bạn sẽ nhận thấy root của cây virtual DOM được trả về được tạo bằng một lệnh `createElementBlock()` đặc biệt:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Về mặt khái niệm, một "block" là một phần của template có cấu trúc bên trong ổn định. Trong trường hợp này, toàn bộ template có một block duy nhất vì nó không chứa bất kỳ directive cấu trúc nào như `v-if` và `v-for`.

Mỗi block theo dõi bất kỳ node con cháu nào (không chỉ là con trực tiếp) có patch flag. Ví dụ:

```vue-html{3,5}
<div> <!-- root block -->
  <div>...</div>         <!-- not tracked -->
  <div :id="id"></div>   <!-- tracked -->
  <div>                  <!-- not tracked -->
    <div>{{ bar }}</div> <!-- tracked -->
  </div>
</div>
```

Kết quả là một mảng được làm phẳng chỉ chứa các node con cháu động:

```
div (block root)
- div with :id binding
- div with {{ bar }} binding
```

Khi component này cần re-render, nó chỉ cần đi qua cây được làm phẳng thay vì cây đầy đủ. Điều này được gọi là **Tree Flattening**, và nó giảm đáng kể số lượng node cần đi qua trong quá trình reconciliation của virtual DOM. Bất kỳ phần tĩnh nào của template đều được bỏ qua hiệu quả.

Các directive `v-if` và `v-for` sẽ tạo các node block mới:

```vue-html
<div> <!-- root block -->
  <div>
    <div v-if> <!-- if block -->
      ...
    </div>
  </div>
</div>
```

Một block con được theo dõi bên trong mảng các con cháu động của block cha. Điều này giữ cấu trúc ổn định cho block cha.

### Impact on SSR Hydration {#impact-on-ssr-hydration}

Cả patch flags và tree flattening cũng cải thiện đáng kể hiệu suất [SSR Hydration](/guide/scaling-up/ssr#client-hydration) của Vue:

- Hydration phần tử đơn có thể đi theo đường dẫn nhanh dựa trên patch flag của vnode tương ứng.

- Chỉ các node block và các con cháu động của chúng cần được đi qua trong quá trình hydration, đạt được hiệu quả hydration một phần ở mức template.

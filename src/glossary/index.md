# Bảng thuật ngữ {#glossary}

Bảng thuật ngữ này nhằm cung cấp một số hướng dẫn về ý nghĩa của các thuật ngữ kỹ thuật thường được sử dụng khi nói về Vue. Nó mang tính *mô tả* cách các thuật ngữ thường được sử dụng, không phải là một đặc tả *quy định* cách chúng phải được sử dụng. Một số thuật ngữ có thể có ý nghĩa hoặc sắc thái hơi khác nhau tùy thuộc vào ngữ cảnh xung quanh.

[[TOC]]

## async component {#async-component}

Một *async component* (component bất đồng bộ) là một bao bọc xung quanh một component khác cho phép component được bao bọc đó được lazy load (tải lười). Điều này thường được sử dụng như một cách để giảm kích thước của các file `.js` đã build, cho phép chúng được chia thành các phần nhỏ hơn chỉ được tải khi cần thiết.

Vue Router có một tính năng tương tự cho [lazy loading của các component route](https://router.vuejs.org/guide/advanced/lazy-loading.html), mặc dù tính năng này không sử dụng tính năng async component của Vue.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Async Components](/guide/components/async.html)

## compiler macro {#compiler-macro}

Một *compiler macro* (macro trình biên dịch) là mã đặc biệt được xử lý bởi một trình biên dịch và chuyển đổi thành một thứ khác. Chúng thực chất là một hình thức thông minh của thay thế chuỗi.

Trình biên dịch [SFC](#single-file-component) của Vue hỗ trợ nhiều macro khác nhau, chẳng hạn như `defineProps()`, `defineEmits()` và `defineExpose()`. Các macro này được thiết kế có chủ đích để trông giống như các hàm JavaScript bình thường để chúng có thể tận dụng cùng một trình phân tích cú pháp và công cụ suy luận kiểu xung quanh JavaScript / TypeScript. Tuy nhiên, chúng không phải là các hàm thực sự được chạy trong trình duyệt. Đây là các chuỗi đặc biệt mà trình biên dịch phát hiện và thay thế bằng mã JavaScript thực sự sẽ được chạy.

Macro có những hạn chế về cách sử dụng không áp dụng cho mã JavaScript bình thường. Ví dụ, bạn có thể nghĩ rằng `const dp = defineProps` sẽ cho phép bạn tạo một bí danh cho `defineProps`, nhưng nó thực sự sẽ gây ra lỗi. Cũng có những hạn chế về những giá trị nào có thể được truyền cho `defineProps()`, vì các 'đối số' phải được xử lý bởi trình biên dịch chứ không phải tại thời điểm chạy.

Để biết thêm chi tiết, xem:
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## component {#component}

Thuật ngữ *component* (thành phần) không phải là độc quyền của Vue. Nó phổ biến trong nhiều framework UI. Nó mô tả một phần của UI, chẳng hạn như một nút hoặc checkbox. Các component cũng có thể được kết hợp để tạo thành các component lớn hơn.

Component là cơ chế chính mà Vue cung cấp để chia UI thành các phần nhỏ hơn, cả để cải thiện khả năng bảo trì và cho phép tái sử dụng mã.

Một component Vue là một đối tượng. Tất cả các thuộc tính là tùy chọn, nhưng một template hoặc hàm render là bắt buộc để component có thể render. Ví dụ, đối tượng sau đây sẽ là một component hợp lệ:

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

Trong thực tế, hầu hết các ứng dụng Vue được viết bằng cách sử dụng [Single-File Components](#single-file-component) (các file `.vue`). Mặc dù các component này có thể không xuất hiện là các đối tượng khi nhìn lần đầu, trình biên dịch SFC sẽ chuyển đổi chúng thành một đối tượng, được sử dụng làm export mặc định cho file. Từ góc độ bên ngoài, một file `.vue` chỉ là một ES module export một đối tượng component.

Các thuộc tính của một đối tượng component thường được gọi là *options* (tùy chọn). Đây là nơi [Options API](#options-api) có tên của nó.

Các tùy chọn cho một component xác định cách các instance của component đó nên được tạo. Các component về mặt khái niệm tương tự như các lớp (classes), mặc dù Vue không sử dụng các lớp JavaScript thực sự để định nghĩa chúng.

Thuật ngữ component cũng có thể được sử dụng một cách lỏng lẻo hơn để đề cập đến các instance component.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Component Basics](/guide/essentials/component-basics.html)

Từ 'component' cũng xuất hiện trong một số thuật ngữ khác:
- [async component](#async-component)
- [dynamic component](#dynamic-component)
- [functional component](#functional-component)
- [Web Component](#web-component)

## composable {#composable}

Thuật ngữ *composable* mô tả một mẫu sử dụng phổ biến trong Vue. Nó không phải là một tính năng riêng biệt của Vue, nó chỉ là một cách sử dụng [Composition API](#composition-api) của framework.

* Một composable là một hàm.
* Composables được sử dụng để đóng gói và tái sử dụng logic có trạng thái.
* Tên hàm thường bắt đầu bằng `use`, để các nhà phát triển khác biết đó là một composable.
* Hàm thường được mong đợi được gọi trong quá trình thực thi đồng bộ của hàm `setup()` của một component (hoặc, tương đương, trong quá trình thực thi của một khối `<script setup>`). Điều này gắn kết việc gọi composable với ngữ cảnh component hiện tại, ví dụ thông qua các cuộc gọi đến `provide()`, `inject()` hoặc `onMounted()`.
* Composables thường trả về một đối tượng đơn giản, không phải một đối tượng phản ứng. Đối tượng này thường chứa các refs và hàm và được mong đợi được destructure trong mã gọi.

Như với nhiều mẫu, có thể có một số bất đồng về việc mã cụ thể có đủ điều kiện cho nhãn này hay không. Không phải tất cả các hàm tiện ích JavaScript đều là composables. Nếu một hàm không sử dụng Composition API thì nó có lẽ không phải là một composable. Nếu nó không mong đợi được gọi trong quá trình thực thi đồng bộ của `setup()` thì nó có lẽ không phải là một composable. Composables được sử dụng cụ thể để đóng gói logic có trạng thái, chúng không chỉ là một quy ước đặt tên cho các hàm.

Xem [Hướng dẫn - Composables](/guide/reusability/composables.html) để biết thêm chi tiết về việc viết composables.

## Composition API {#composition-api}

*Composition API* là một tập hợp các hàm được sử dụng để viết các component và composables trong Vue.

Thuật ngữ này cũng được sử dụng để mô tả một trong hai phong cách chính được sử dụng để viết các component, phong cách kia là [Options API](#options-api). Các component được viết bằng cách sử dụng Composition API sử dụng `<script setup>` hoặc một hàm `setup()` rõ ràng.

Xem [Composition API FAQ](/guide/extras/composition-api-faq) để biết thêm chi tiết.

## custom element {#custom-element}

Một *custom element* (phần tử tùy chỉnh) là một tính năng của tiêu chuẩn [Web Components](#web-component), được triển khai trong các trình duyệt web hiện đại. Nó đề cập đến khả năng sử dụng một phần tử HTML tùy chỉnh trong đánh dấu HTML của bạn để bao gồm một Web Component tại điểm đó trên trang.

Vue có hỗ trợ tích hợp để render các custom element và cho phép chúng được sử dụng trực tiếp trong các template component Vue.

Custom element không nên bị nhầm lẫn với khả năng bao gồm các component Vue dưới dạng thẻ trong template của một component Vue khác. Custom element được sử dụng để tạo Web Components, không phải component Vue.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Vue và Web Components](/guide/extras/web-components.html)

## directive {#directive}

Thuật ngữ *directive* (chỉ thị) đề cập đến các thuộc tính template bắt đầu bằng tiền tố `v-`, hoặc các viết tắt tương đương của chúng.

Các directive tích hợp bao gồm `v-if`, `v-for`, `v-bind`, `v-on` và `v-slot`.

Vue cũng hỗ trợ tạo các directive tùy chỉnh, mặc dù chúng thường chỉ được sử dụng như một 'cách thoát' để thao tác trực tiếp với các nút DOM. Các directive tùy chỉnh thường không thể được sử dụng để tái tạo chức năng của các directive tích hợp.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Cú pháp Template - Directives](/guide/essentials/template-syntax.html#directives)
- [Hướng dẫn - Custom Directives](/guide/reusability/custom-directives.html)

## dynamic component {#dynamic-component}

Thuật ngữ *dynamic component* (component động) được sử dụng để mô tả các trường hợp mà việc chọn component con nào để render cần được thực hiện một cách động. Thông thường, điều này đạt được bằng cách sử dụng `<component :is="type">`.

Một dynamic component không phải là một loại component đặc biệt. Bất kỳ component nào cũng có thể được sử dụng như một dynamic component. Chính việc chọn component là động, chứ không phải bản thân component.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Component Basics - Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

Xem [reactive effect](#reactive-effect) và [side effect](#side-effect).

## event {#event}

Việc sử dụng sự kiện để giao tiếp giữa các phần khác nhau của một chương trình là phổ biến trong nhiều lĩnh vực lập trình khác nhau. Trong Vue, thuật ngữ này thường được áp dụng cho cả sự kiện phần tử HTML gốc và sự kiện component Vue. Directive `v-on` được sử dụng trong các template để lắng nghe cả hai loại sự kiện.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Xử lý sự kiện](/guide/essentials/event-handling.html)
- [Hướng dẫn - Component Events](/guide/components/events.html)

## fragment {#fragment}

Thuật ngữ *fragment* (mảnh) đề cập đến một loại đặc biệt của [VNode](#vnode) được sử dụng làm cha cho các VNode khác, nhưng không render bất kỳ phần tử nào.

Tên này xuất phát từ khái niệm tương tự của [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) trong API DOM gốc.

Fragments được sử dụng để hỗ trợ các component có nhiều nút gốc. Mặc dù các component như vậy có thể xuất hiện có nhiều gốc, nhưng ở phía sau chúng sử dụng một nút fragment làm một gốc duy nhất, làm cha của các nút 'gốc'.

Fragments cũng được trình biên dịch template sử dụng như một cách để bao bọc nhiều nút động, ví dụ những nút được tạo qua `v-for` hoặc `v-if`. Điều này cho phép các gợi ý bổ sung được truyền đến thuật toán vá [VDOM](#virtual-dom). Phần lớn việc này được xử lý nội bộ, nhưng một nơi bạn có thể gặp trực tiếp điều này là sử dụng `key` trên thẻ `<template>` với `v-for`. Trong kịch bản đó, `key` được thêm như một [prop](#prop) vào VNode fragment.

Các nút fragment hiện được render vào DOM dưới dạng các nút văn bản trống, mặc dù đó là một chi tiết triển khai. Bạn có thể gặp các nút văn bản đó nếu bạn sử dụng `$el` hoặc cố gắng duyệt DOM với các API trình duyệt tích hợp.

## functional component {#functional-component}

Một định nghĩa component thường là một đối tượng chứa các tùy chọn. Nó có thể không xuất hiện như vậy nếu bạn đang sử dụng `<script setup>`, nhưng component được export từ file `.vue` vẫn sẽ là một đối tượng.

Một *functional component* (component chức năng) là một dạng thay thế của component được khai báo bằng cách sử dụng một hàm thay vì một đối tượng. Hàm đó đóng vai trò là [hàm render](#render-function) cho component.

Một functional component không thể có bất kỳ trạng thái nào của riêng nó. Nó cũng không đi qua vòng đời component bình thường, do đó các hook vòng đời không thể được sử dụng. Điều này làm cho chúng nhẹ hơn một chút so với các component có trạng thái bình thường.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Render Functions & JSX - Functional Components](/guide/extras/render-function.html#functional-components)

## hoisting {#hoisting}

Thuật ngữ *hoisting* (nâng lên) được sử dụng để mô tả việc chạy một phần mã trước khi đến được nó, trước các mã khác. Việc thực thi được 'kéo lên' đến một điểm trước đó.

JavaScript sử dụng hoisting cho một số cấu trúc, chẳng hạn như `var`, `import` và khai báo hàm.

Trong ngữ cảnh Vue, trình biên dịch áp dụng *hoisting* để cải thiện hiệu suất. Khi biên dịch một component, các giá trị tĩnh được di chuyển ra khỏi phạm vi của component. Các giá trị tĩnh này được mô tả là 'được nâng lên' vì chúng được tạo ra bên ngoài component.

## cache static {#cache-static}

Thuật ngữ *cache* (bộ nhớ đệm) được sử dụng để mô tả việc lưu trữ tạm thời dữ liệu được truy cập thường xuyên để cải thiện hiệu suất.

Trình biên dịch template Vue xác định các VNode tĩnh đó, lưu trữ chúng trong bộ nhớ đệm trong lần render đầu tiên, và tái sử dụng cùng các VNode đó cho mọi lần render lại sau đó.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Cơ chế Render - Cache Static](/guide/extras/rendering-mechanism.html#cache-static)

## in-DOM template {#in-dom-template}

Có nhiều cách để chỉ định một template cho một component. Trong hầu hết các trường hợp, template được cung cấp dưới dạng một chuỗi.

Thuật ngữ *in-DOM template* đề cập đến kịch bản mà template được cung cấp dưới dạng các nút DOM thay vì một chuỗi. Sau đó Vue chuyển đổi các nút DOM thành một chuỗi template bằng cách sử dụng `innerHTML`.

Thông thường, một in-DOM template bắt đầu dưới dạng đánh dấu HTML được viết trực tiếp trong HTML của trang. Sau đó trình duyệt phân tích cú pháp điều này thành các nút DOM, mà Vue sau đó sử dụng để đọc `innerHTML`.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Tạo ứng dụng - In-DOM Root Component Template](/guide/essentials/application.html#in-dom-root-component-template)
- [Hướng dẫn - Component Basics - in-DOM Template Parsing Caveats](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [Options: Rendering - template](/api/options-rendering.html#template)

## inject {#inject}

Xem [provide / inject](#provide-inject).

## lifecycle hooks {#lifecycle-hooks}

Một instance component Vue đi qua một vòng đời. Ví dụ, nó được tạo, gắn (mount), cập nhật và gỡ bỏ (unmount).

Các *lifecycle hooks* (hook vòng đời) là một cách để lắng nghe các sự kiện vòng đời này.

Với Options API, mỗi hook được cung cấp như một tùy chọn riêng biệt, ví dụ `mounted`. Composition API sử dụng các hàm thay thế, chẳng hạn như `onMounted()`.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Lifecycle Hooks](/guide/essentials/lifecycle.html)

## macro {#macro}

Xem [compiler macro](#compiler-macro).

## named slot {#named-slot}

Một component có thể có nhiều slot, được phân biệt theo tên. Các slot khác với slot mặc định được gọi là *named slots* (slot có tên).

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Slots - Named Slots](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Các component Vue được định nghĩa bằng cách sử dụng các đối tượng. Các thuộc tính của các đối tượng component này được gọi là *options* (tùy chọn).

Các component có thể được viết theo hai phong cách. Một phong cách sử dụng [Composition API](#composition-api) kết hợp với `setup` (thông qua tùy chọn `setup()` hoặc `<script setup>`). Phong cách kia sử dụng rất ít trực tiếp Composition API, thay vào đó sử dụng các tùy chọn component khác nhau để đạt được kết quả tương tự. Các tùy chọn component được sử dụng theo cách này được gọi là *Options API*.

Options API bao gồm các tùy chọn như `data()`, `computed`, `methods` và `created()`.

Một số tùy chọn, chẳng hạn như `props`, `emits` và `inheritAttrs`, có thể được sử dụng khi viết các component với API nào. Vì chúng là các tùy chọn component, chúng có thể được coi là một phần của Options API. Tuy nhiên, vì các tùy chọn này cũng được sử dụng kết hợp với `setup()`, thường hữu ích hơn khi coi chúng được chia sẻ giữa hai phong cách component.

Hàm `setup()` bản thân nó là một tùy chọn component, do đó nó *có thể* được mô tả là một phần của Options API. Tuy nhiên, đây không phải là cách thuật ngữ 'Options API' thường được sử dụng. Thay vào đó, hàm `setup()` được coi là một phần của Composition API.

## plugin {#plugin}

Mặc dù thuật ngữ *plugin* có thể được sử dụng trong nhiều ngữ cảnh khác nhau, Vue có một khái niệm cụ thể về plugin như một cách để thêm chức năng vào một ứng dụng.

Các plugin được thêm vào một ứng dụng bằng cách gọi `app.use(plugin)`. Plugin bản thân nó là một hàm hoặc một đối tượng có một hàm `install`. Hàm đó sẽ được truyền instance ứng dụng và sau đó có thể làm bất cứ điều gì nó cần.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Plugins](/guide/reusability/plugins.html)

## prop {#prop}

Có ba cách sử dụng phổ biến của thuật ngữ *prop* trong Vue:

* Component props
* VNode props
* Slot props

*Component props* là những gì hầu hết mọi người nghĩ là props. Chúng được định nghĩa rõ ràng bởi một component bằng cách sử dụng `defineProps()` hoặc tùy chọn `props`.

Thuật ngữ *VNode props* đề cập đến các thuộc tính của đối tượng được truyền làm đối số thứ hai cho `h()`. Chúng có thể bao gồm component props, nhưng chúng cũng có thể bao gồm component events, DOM events, DOM attributes và DOM properties. Bạn thường chỉ gặp VNode props nếu bạn đang làm việc với các hàm render để thao tác trực tiếp với các VNode.

*Slot props* là các thuộc tính được truyền cho một scoped slot.

Trong mọi trường hợp, props là các thuộc tính được truyền từ nơi khác.

Mặc dù từ props có nguồn gốc từ từ *properties*, thuật ngữ props có ý nghĩa cụ thể hơn nhiều trong ngữ cảnh của Vue. Bạn nên tránh sử dụng nó như một viết tắt của properties.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Props](/guide/components/props.html)
- [Hướng dẫn - Render Functions & JSX](/guide/extras/render-function.html)
- [Hướng dẫn - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` và `inject` là một hình thức giao tiếp giữa các component.

Khi một component *cung cấp* (provides) một giá trị, tất cả các hậu duệ của component đó sau đó có thể chọn lấy giá trị đó, sử dụng `inject`. Không giống như với props, component cung cấp không biết chính xác component nào đang nhận giá trị.

`provide` và `inject` đôi khi được sử dụng để tránh *prop drilling*. Chúng cũng có thể được sử dụng như một cách ngầm định để một component giao tiếp với nội dung slot của nó.

`provide` cũng có thể được sử dụng ở cấp ứng dụng, làm cho một giá trị có sẵn cho tất cả các component trong ứng dụng đó.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - provide / inject](/guide/components/provide-inject.html)

## reactive effect {#reactive-effect}

Một *reactive effect* (hiệu ứng phản ứng) là một phần của hệ thống phản ứng của Vue. Nó đề cập đến quá trình theo dõi các phụ thuộc của một hàm và chạy lại hàm đó khi các giá trị của các phụ thuộc đó thay đổi.

`watchEffect()` là cách trực tiếp nhất để tạo một effect. Nhiều phần khác của Vue sử dụng các effect nội bộ. Ví dụ: cập nhật render component, `computed()` và `watch()`.

Vue chỉ có thể theo dõi các phụ thuộc phản ứng trong một reactive effect. Nếu giá trị của một thuộc tính được đọc bên ngoài một reactive effect, nó sẽ 'mất' tính phản ứng, theo nghĩa là Vue sẽ không biết phải làm gì nếu thuộc tính đó sau đó thay đổi.

Thuật ngữ này có nguồn gốc từ 'side effect' (tác dụng phụ). Việc gọi hàm effect là một tác dụng phụ của việc giá trị thuộc tính được thay đổi.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## reactivity {#reactivity}

Nói chung, *reactivity* (tính phản ứng) đề cập đến khả năng tự động thực hiện các hành động để phản hồi các thay đổi dữ liệu. Ví dụ, cập nhật DOM hoặc thực hiện yêu cầu mạng khi một giá trị dữ liệu thay đổi.

Trong ngữ cảnh Vue, reactivity được sử dụng để mô tả một tập hợp các tính năng. Các tính năng đó kết hợp để tạo thành một *hệ thống phản ứng*, được tiếp xúc thông qua [Reactivity API](#reactivity-api).

Có nhiều cách khác nhau mà một hệ thống phản ứng có thể được triển khai. Ví dụ, nó có thể được thực hiện bằng cách phân tích tĩnh mã để xác định các phụ thuộc của nó. Tuy nhiên, Vue không sử dụng hình thức hệ thống phản ứng đó.

Thay vào đó, hệ thống phản ứng của Vue theo dõi quyền truy cập thuộc tính tại thời điểm chạy. Nó thực hiện điều này bằng cách sử dụng cả các bao bọc Proxy và các hàm [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)/[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) cho các thuộc tính.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html)
- [Hướng dẫn - Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## Reactivity API {#reactivity-api}

*Reactivity API* là một tập hợp các hàm Vue cốt lõi liên quan đến [reactivity](#reactivity). Chúng có thể được sử dụng độc lập với các component. Nó bao gồm các hàm như `ref()`, `reactive()`, `computed()`, `watch()` và `watchEffect()`.

Reactivity API là một tập con của Composition API.

Để biết thêm chi tiết, xem:
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## ref {#ref}

> Mục này nói về việc sử dụng `ref` cho tính phản ứng. Đối với thuộc tính `ref` được sử dụng trong các template, xem [template ref](#template-ref) thay thế.

Một `ref` là một phần của hệ thống phản ứng của Vue. Nó là một đối tượng có một thuộc tính phản ứng duy nhất, được gọi là `value`.

Có nhiều loại ref khác nhau. Ví dụ, refs có thể được tạo bằng cách sử dụng `ref()`, `shallowRef()`, `computed()`, và `customRef()`. Hàm `isRef()` có thể được sử dụng để kiểm tra xem một đối tượng có phải là ref hay không, và `isReadonly()` có thể được sử dụng để kiểm tra xem ref có cho phép gán lại trực tiếp giá trị của nó hay không.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html)
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## render function {#render-function}

Một *render function* (hàm render) là phần của một component tạo ra các VNode được sử dụng trong quá trình render. Các template được biên dịch thành các hàm render.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Render Functions & JSX](/guide/extras/render-function.html)

## scheduler {#scheduler}

*Scheduler* (trình lập lịch) là phần nội bộ của Vue kiểm soát thời điểm khi các [reactive effects](#reactive-effect) được chạy.

Khi trạng thái phản ứng thay đổi, Vue không kích hoạt ngay lập tức các cập nhật render. Thay vào đó, nó gộp chúng lại với nhau bằng cách sử dụng một hàng đợi. Điều này đảm bảo rằng một component chỉ render lại một lần, ngay cả khi nhiều thay đổi được thực hiện đối với dữ liệu cơ bản.

Các [Watchers](/guide/essentials/watchers.html) cũng được gộp bằng cách sử dụng hàng đợi scheduler. Các watcher với `flush: 'pre'` (mặc định) sẽ chạy trước khi render component, trong khi những watcher với `flush: 'post'` sẽ chạy sau khi render component.

Các công việc trong scheduler cũng được sử dụng để thực hiện nhiều nhiệm vụ nội bộ khác, chẳng hạn như kích hoạt một số [lifecycle hooks](#lifecycle-hooks) và cập nhật [template refs](#template-ref).

## scoped slot {#scoped-slot}

Thuật ngữ *scoped slot* (slot có phạm vi) được sử dụng để đề cập đến một [slot](#slot) nhận [props](#prop).

Về mặt lịch sử, Vue đã tạo ra sự phân biệt lớn hơn nhiều giữa các slot có phạm vi và không có phạm vi. Ở một mức độ nào đó, chúng có thể được coi là hai tính năng riêng biệt, được thống nhất sau một cú pháp template chung.

Trong Vue 3, các API slot được đơn giản hóa để làm cho tất cả các slot hoạt động như các slot có phạm vi. Tuy nhiên, các trường hợp sử dụng cho slot có phạm vi và không có phạm vi thường khác nhau, do đó thuật ngữ này vẫn chứng minh hữu ích như một cách để đề cập đến các slot có props.

Các props được truyền cho một slot chỉ có thể được sử dụng trong một vùng cụ thể của template cha, chịu trách nhiệm định nghĩa nội dung của slot. Vùng này của template hoạt động như một phạm vi biến cho các props, do đó tên 'scoped slot'.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

Xem [Single-File Component](#single-file-component).

## side effect {#side-effect}

Thuật ngữ *side effect* (tác dụng phụ) không đặc thù cho Vue. Nó được sử dụng để mô tả các hoạt động hoặc hàm làm một cái gì đó ngoài phạm vi cục bộ của chúng.

Ví dụ, trong ngữ cảnh của việc đặt một thuộc tính như `user.name = null`, người ta mong đợi điều này sẽ thay đổi giá trị của `user.name`. Nếu nó cũng làm một cái gì đó khác, như kích hoạt hệ thống phản ứng của Vue, thì điều này sẽ được mô tả là một tác dụng phụ. Đây là nguồn gốc của thuật ngữ [reactive effect](#reactive-effect) trong Vue.

Khi một hàm được mô tả là có tác dụng phụ, điều đó có nghĩa là hàm thực hiện một số hành động có thể quan sát được bên ngoài hàm, ngoài việc chỉ trả về một giá trị. Điều này có thể có nghĩa là nó cập nhật một giá trị trong trạng thái, hoặc kích hoạt một yêu cầu mạng.

Thuật ngữ này thường được sử dụng khi mô tả render hoặc các thuộc tính tính toán. Được coi là thực hành tốt nhất để render không có tác dụng phụ. Tương tự, hàm getter cho một thuộc tính tính toán không nên có tác dụng phụ.

## Single-File Component {#single-file-component}

Thuật ngữ *Single-File Component* (Component file đơn), hoặc SFC, đề cập đến định dạng file `.vue` thường được sử dụng cho các component Vue.

Xem thêm:
- [Hướng dẫn - Single-File Components](/guide/scaling-up/sfc.html)
- [SFC Syntax Specification](/api/sfc-spec.html)

## slot {#slot}

Các slot được sử dụng để truyền nội dung cho các component con. Trong khi props được sử dụng để truyền các giá trị dữ liệu, slot được sử dụng để truyền nội dung phong phú hơn bao gồm các phần tử HTML và các component Vue khác.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Slots](/guide/components/slots.html)

## template ref {#template-ref}

Thuật ngữ *template ref* đề cập đến việc sử dụng thuộc tính `ref` trên một thẻ trong một template. Sau khi component render, thuộc tính này được sử dụng để điền một thuộc tính tương ứng với phần tử HTML hoặc instance component tương ứng với thẻ trong template.

Nếu bạn đang sử dụng Options API thì các refs được tiếp xúc thông qua các thuộc tính của đối tượng `$refs`.

Với Composition API, template refs điền một [ref](#ref) phản ứng với cùng tên.

Template ref không nên bị nhầm lẫn với các refs phản ứng được tìm thấy trong hệ thống phản ứng của Vue.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

Xem [virtual DOM](#virtual-dom).

## virtual DOM {#virtual-dom}

Thuật ngữ *virtual DOM* (VDOM) không phải là độc quyền của Vue. Nó là một cách tiếp cận phổ biến được sử dụng bởi một số framework web để quản lý các cập nhật cho UI.

Trình duyệt sử dụng một cây nút để đại diện cho trạng thái hiện tại của trang. Cây đó và các API JavaScript được sử dụng để tương tác với nó được gọi là *document object model* (mô hình đối tượng tài liệu), hoặc *DOM*.

Thao tác DOM là một nút thắt hiệu suất lớn. Virtual DOM cung cấp một chiến lược để quản lý điều đó.

Thay vì tạo các nút DOM trực tiếp, các component Vue tạo ra một mô tả về các nút DOM mà chúng muốn. Các mô tả này là các đối tượng JavaScript đơn giản, được gọi là VNodes (nút DOM ảo). Tạo VNodes tương đối rẻ.

Mỗi khi một component render lại, cây VNode mới được so sánh với cây VNode trước đó và mọi khác biệt sau đó được áp dụng cho DOM thực. Nếu không có gì thay đổi thì DOM không cần được chạm vào.

Vue sử dụng một cách tiếp cận lai mà chúng tôi gọi là [Compiler-Informed Virtual DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). Trình biên dịch template của Vue có thể áp dụng các tối ưu hóa hiệu suất dựa trên phân tích tĩnh của template. Thay vì thực hiện so sánh đầy đủ của các cây VNode cũ và mới của một component tại thời điểm chạy, Vue có thể sử dụng thông tin được trích xuất bởi trình biên dịch để giảm so sánh chỉ đến các phần của cây thực sự có thể thay đổi.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Cơ chế Render](/guide/extras/rendering-mechanism.html)
- [Hướng dẫn - Render Functions & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

Một *VNode* là một *nút DOM ảo*. Chúng có thể được tạo bằng cách sử dụng hàm [`h()`](/api/render-function.html#h).

Xem [virtual DOM](#virtual-dom) để biết thêm thông tin.

## Web Component {#web-component}

Tiêu chuẩn *Web Components* là một tập hợp các tính năng được triển khai trong các trình duyệt web hiện đại.

Các component Vue không phải là Web Components, nhưng `defineCustomElement()` có thể được sử dụng để tạo một [custom element](#custom-element) từ một component Vue. Vue cũng hỗ trợ việc sử dụng các custom element bên trong các component Vue.

Để biết thêm chi tiết, xem:
- [Hướng dẫn - Vue và Web Components](/guide/extras/web-components.html)

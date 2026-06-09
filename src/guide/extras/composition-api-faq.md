---
outline: deep
---

# Câu hỏi thường gặp về Composition API {#composition-api-faq}

:::tip
FAQ này giả định bạn có kinh nghiệm trước đó với Vue - cụ thể là kinh nghiệm với Vue 2 khi chủ yếu sử dụng Options API.
:::

## Composition API là gì? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Free Composition API Lesson"/>

Composition API là một tập hợp các API cho phép chúng ta viết các component Vue bằng cách sử dụng các hàm được import thay vì khai báo các options. Đây là một thuật ngữ bao gồm các API sau:

- [Reactivity API](/api/reactivity-core), ví dụ `ref()` và `reactive()`, cho phép chúng ta tạo trực tiếp reactive state, computed state, và watchers.

- [Lifecycle Hooks](/api/composition-api-lifecycle), ví dụ `onMounted()` và `onUnmounted()`, cho phép chúng ta hook vào lifecycle của component theo cách lập trình.

- [Dependency Injection](/api/composition-api-dependency-injection), tức là `provide()` và `inject()`, cho phép chúng ta tận dụng hệ thống dependency injection của Vue trong khi sử dụng Reactivity APIs.

Composition API là một tính năng tích hợp sẵn của Vue 3 và [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Đối với các phiên bản Vue 2 cũ hơn, hãy sử dụng plugin [`@vue/composition-api`](https://github.com/vuejs/composition-api) được duy trì chính thức. Trong Vue 3, nó cũng chủ yếu được sử dụng cùng với cú pháp [`<script setup>`](/api/sfc-script-setup) trong Single-File Components. Dưới đây là ví dụ cơ bản về một component sử dụng Composition API:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// các hàm thay đổi state và kích hoạt cập nhật
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`Giá trị ban đầu là ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Giá trị là: {{ count }}</button>
</template>
```

Mặc dù có phong cách API dựa trên composition của hàm, **Composition API KHÔNG phải là lập trình hàm (functional programming)**. Composition API dựa trên mô hình reactivity có thể thay đổi (mutable) và chi tiết (fine-grained) của Vue, trong khi lập trình hàm nhấn mạnh tính bất biến (immutability).

Nếu bạn quan tâm đến việc học cách sử dụng Vue với Composition API, bạn có thể đặt API preference toàn trang thành Composition API bằng cách sử dụng nút chuyển ở đầu thanh bên trái, sau đó đọc lại hướng dẫn từ đầu.

## Tại sao là Composition API? {#why-composition-api}

### Tái sử dụng Logic Tốt hơn {#better-logic-reuse}

Lợi thế chính của Composition API là nó cho phép tái sử dụng logic một cách sạch sẽ và hiệu quả dưới dạng [Hàm Composable](/guide/reusability/composables). Nó giải quyết [tất cả các nhược điểm của mixins](/guide/reusability/composables#vs-mixins), cơ chế tái sử dụng logic chính của Options API.

Khả năng tái sử dụng logic của Composition API đã tạo ra các dự án cộng đồng ấn tượng như [VueUse](https://vueuse.org/), một bộ sưu tập các tiện ích composable ngày càng phát triển. Nó cũng đóng vai trò như một cơ chế sạch sẽ để dễ dàng tích hợp các dịch vụ hoặc thư viện bên thứ ba có trạng thái (stateful) vào hệ thống reactivity của Vue, ví dụ [dữ liệu bất biến (immutable data)](/guide/extras/reactivity-in-depth#immutable-data), [state machines](/guide/extras/reactivity-in-depth#state-machines), và [RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Tổ chức Code Linh hoạt hơn {#more-flexible-code-organization}

Nhiều người dùng thích việc chúng ta viết code có tổ chức theo mặc định với Options API: mọi thứ đều có vị trí của nó dựa trên option mà nó thuộc về. Tuy nhiên, Options API đặt ra các hạn chế nghiêm trọng khi logic của một component duy nhất phát triển vượt quá ngưỡng phức tạp nhất định. Hạn chế này đặc biệt nổi bật trong các component cần xử lý nhiều **mối quan tâm logic (logical concerns)**, điều mà chúng ta đã chứng kiến trực tiếp trong nhiều ứng dụng Vue 2 thực tế.

Hãy lấy component folder explorer từ GUI của Vue CLI làm ví dụ: component này chịu trách nhiệm cho các mối quan tâm logic sau:

- Theo dõi trạng thái thư mục hiện tại và hiển thị nội dung của nó
- Xử lý điều hướng thư mục (mở, đóng, làm mới...)
- Xử lý tạo thư mục mới
- Bật/tắt chỉ hiển thị thư mục yêu thích
- Bật/tắt hiển thị thư mục ẩn
- Xử lý thay đổi thư mục làm việc hiện tại

[Phiên bản gốc](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) của component được viết bằng Options API. Nếu chúng ta tô màu từng dòng code dựa trên mối quan tâm logic mà nó đang xử lý, đây là cách nó trông:

<img alt="folder component before" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Hãy chú ý cách code xử lý cùng một mối quan tâm logic bị buộc phải chia nhỏ dưới các options khác nhau, nằm ở các phần khác nhau của file. Trong một component dài vài trăm dòng, việc hiểu và điều hướng một mối quan tâm logic duy nhất yêu cầu phải cuộn lên xuống file liên tục, làm cho việc này khó khăn hơn nhiều so với mức cần thiết. Ngoài ra, nếu chúng ta định trích xuất một mối quan tâm logic thành một tiện ích có thể tái sử dụng, sẽ mất khá nhiều công việc để tìm và trích xuất các đoạn code phù hợp từ các phần khác nhau của file.

Đây là cùng một component, trước và sau khi [refactor sang Composition API](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e):

![folder component after](./images/composition-api-after.png)

Hãy chú ý cách code liên quan đến cùng một mối quan tâm logic giờ đây có thể được nhóm lại với nhau: chúng ta không còn cần phải nhảy giữa các khối options khác nhau khi làm việc trên một mối quan tâm logic cụ thể. Hơn nữa, chúng ta giờ đây có thể di chuyển một nhóm code vào một file bên ngoài với công sức tối thiểu, vì chúng ta không còn cần phải sắp xếp lại code để trích xuất chúng. Sự giảm ma sát cho việc refactor này là chìa khóa cho khả năng bảo trì lâu dài trong các codebase lớn.

### Type Inference Tốt hơn {#better-type-inference}

Trong những năm gần đây, ngày càng nhiều nhà phát triển frontend sử dụng [TypeScript](https://www.typescriptlang.org/) vì nó giúp chúng ta viết code mạnh mẽ hơn, thực hiện các thay đổi với sự tự tin hơn, và cung cấp trải nghiệm phát triển tuyệt vời với hỗ trợ IDE. Tuy nhiên, Options API, được hình thành ban đầu vào năm 2013, được thiết kế mà không có type inference trong tâm trí. Chúng ta đã phải thực hiện một số [type gymnastics phức tạp một cách phi lý](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165) để làm cho type inference hoạt động với Options API. Ngay cả với tất cả nỗ lực này, type inference cho Options API vẫn có thể bị lỗi với mixins và dependency injection.

Điều này đã khiến nhiều nhà phát triển muốn sử dụng Vue với TS hướng tới Class API được hỗ trợ bởi `vue-class-component`. Tuy nhiên, một API dựa trên class phụ thuộc nhiều vào ES decorators, một tính năng ngôn ngữ chỉ là đề xuất stage 2 khi Vue 3 đang được phát triển vào năm 2019. Chúng tôi cảm thấy quá rủi ro để dựa một API chính thức trên một đề xuất không ổn định. Kể từ đó, đề xuất decorators đã trải qua một cuộc đại tu hoàn toàn khác và cuối cùng đạt stage 3 vào năm 2022. Ngoài ra, API dựa trên class cũng gặp phải các hạn chế về tái sử dụng và tổ chức logic tương tự như Options API.

So sánh lại, Composition API chủ yếu sử dụng các biến và hàm thông thường, vốn thân thiện với type một cách tự nhiên. Code được viết bằng Composition API có thể tận hưởng type inference đầy đủ với ít nhu cầu về type hints thủ công. Hầu hết thời gian, code Composition API sẽ trông gần như giống hệt nhau trong TypeScript và JavaScript thuần. Điều này cũng cho phép người dùng JavaScript thuần có thể hưởng lợi từ type inference một phần.

### Bundle Sản xuất Nhỏ hơn và Ít Overhead hơn {#smaller-production-bundle-and-less-overhead}

Code được viết bằng Composition API và `<script setup>` cũng hiệu quả hơn và thân thiện với minification hơn so với phiên bản Options API tương đương. Điều này là do template trong một component `<script setup>` được biên dịch thành một hàm được inline trong cùng scope với code `<script setup>`. Khác với việc truy cập thuộc tính từ `this`, code template được biên dịch có thể truy cập trực tiếp các biến được khai báo bên trong `<script setup>`, không cần một instance proxy ở giữa. Điều này cũng dẫn đến minification tốt hơn vì tất cả tên biến có thể được rút ngắn một cách an toàn.

## Mối quan hệ với Options API {#relationship-with-options-api}

### Sự đánh đổi {#trade-offs}

Một số người dùng chuyển từ Options API thấy code Composition API của họ kém tổ chức hơn, và kết luận rằng Composition API "tệ hơn" về mặt tổ chức code. Chúng tôi khuyến nghị những người dùng có ý kiến như vậy hãy nhìn vấn đề từ một góc độ khác.

Đúng là Composition API không còn cung cấp các "guard rails" hướng dẫn bạn đặt code vào các nhóm tương ứng. Đổi lại, bạn có thể viết code component giống như cách bạn viết JavaScript thông thường. Điều này có nghĩa là **bạn có thể và nên áp dụng bất kỳ best practices tổ chức code nào cho code Composition API của bạn giống như khi bạn viết JavaScript thông thường**. Nếu bạn có thể viết JavaScript được tổ chức tốt, bạn cũng nên có thể viết code Composition API được tổ chức tốt.

Options API thực sự cho phép bạn "nghĩ ít hơn" khi viết code component, đó là lý do nhiều người dùng thích nó. Tuy nhiên, trong việc giảm tải tinh thần, nó cũng khóa bạn vào một mô hình tổ chức code được quy định mà không có lối thoát, điều này có thể làm cho việc refactor hoặc cải thiện chất lượng code trở nên khó khăn trong các dự án quy mô lớn. Về mặt này, Composition API cung cấp khả năng mở rộng dài hạn tốt hơn.

### Composition API có bao phủ tất cả các use case không? {#does-composition-api-cover-all-use-cases}

Có về mặt stateful logic. Khi sử dụng Composition API, chỉ có một vài options có thể vẫn cần thiết: `props`, `emits`, `name`, và `inheritAttrs`.

:::tip

Kể từ phiên bản 3.3, bạn có thể trực tiếp sử dụng `defineOptions` trong `<script setup>` để đặt tên component hoặc thuộc tính `inheritAttrs`

:::

Nếu bạn định sử dụng độc quyền Composition API (cùng với các options được liệt kê ở trên), bạn có thể giảm vài kbs khỏi bundle sản xuất của mình thông qua một [compile-time flag](/api/compile-time-flags) loại bỏ code liên quan đến Options API khỏi Vue. Lưu ý rằng điều này cũng ảnh hưởng đến các component Vue trong các dependency của bạn.

### Tôi có thể sử dụng cả hai API trong cùng một component không? {#can-i-use-both-apis-in-the-same-component}

Có. Bạn có thể sử dụng Composition API thông qua option [`setup()`](/api/composition-api-setup) trong một component Options API.

Tuy nhiên, chúng tôi chỉ khuyến nghị làm như vậy nếu bạn có một codebase Options API hiện tại cần tích hợp với các tính năng mới / thư viện bên ngoài được viết bằng Composition API.

### Options API có bị loại bỏ không? {#will-options-api-be-deprecated}

Không, chúng tôi không có kế hoạch nào để làm như vậy. Options API là một phần không thể thiếu của Vue và là lý do nhiều nhà phát triển yêu thích nó. Chúng tôi cũng nhận ra rằng nhiều lợi ích của Composition API chỉ thể hiện trong các dự án quy mô lớn, và Options API vẫn là một lựa chọn vững chắc cho nhiều trường hợp có độ phức tạp thấp đến trung bình.

## Mối quan hệ với Class API {#relationship-with-class-api}

Chúng tôi không còn khuyến nghị sử dụng Class API với Vue 3, vì Composition API cung cấp tích hợp TypeScript tuyệt vời với các lợi ích bổ sung về tái sử dụng logic và tổ chức code.

## So sánh với React Hooks {#comparison-with-react-hooks}

Composition API cung cấp cùng cấp độ khả năng composition logic như React Hooks, nhưng với một số khác biệt quan trọng.

React Hooks được gọi lặp lại mỗi khi component cập nhật. Điều này tạo ra một số cảnh báo có thể gây nhầm lẫn ngay cả với các nhà phát triển React dày dạn kinh nghiệm. Nó cũng dẫn đến các vấn đề tối ưu hóa hiệu suất có thể ảnh hưởng nghiêm trọng đến trải nghiệm phát triển. Dưới đây là một số ví dụ:

- Hooks nhạy cảm với thứ tự gọi và không thể có điều kiện.

- Các biến được khai báo trong một component React có thể bị bắt bởi một hook closure và trở nên "stale" (cũ) nếu nhà phát triển không truyền vào mảng dependencies đúng. Điều này dẫn đến việc các nhà phát triển React dựa vào các quy tắc ESLint để đảm bảo dependencies đúng được truyền. Tuy nhiên, quy tắc thường không đủ thông minh và bù đắp quá mức cho tính chính xác, dẫn đến việc vô hiệu hóa không cần thiết và đau đầu khi gặp các trường hợp ngoại lệ.

- Các tính toán tốn kém yêu cầu sử dụng `useMemo`, lại đòi hỏi phải truyền thủ công mảng dependencies đúng.

- Các event handler được truyền cho các component con gây ra các cập nhật con không cần thiết theo mặc định, và yêu cầu `useCallback` rõ ràng như một tối ưu hóa. Điều này hầu như luôn cần thiết, và lại yêu cầu một mảng dependencies đúng. Việc bỏ qua điều này dẫn đến việc ứng dụng over-render theo mặc định và có thể gây ra các vấn đề hiệu suất mà không nhận ra.

- Vấn đề stale closure, kết hợp với các tính năng Concurrent, làm cho việc suy luận về khi nào một đoạn code hooks được chạy trở nên khó khăn, và làm cho việc làm việc với state có thể thay đổi nên tồn tại qua các lần render (thông qua `useRef`) trở nên cồng kềnh.

> Lưu ý: một số vấn đề ở trên liên quan đến memoization có thể được giải quyết bởi [React Compiler](https://react.dev/learn/react-compiler) sắp tới.

So sánh lại, Vue Composition API:

- Gọi `setup()` hoặc code `<script setup>` chỉ một lần. Điều này làm cho code phù hợp hơn với trực giác của việc sử dụng JavaScript chuẩn vì không có stale closure nào phải lo lắng. Các gọi Composition API cũng không nhạy cảm với thứ tự gọi và có thể có điều kiện.

- Hệ thống reactivity runtime của Vue tự động thu thập các reactive dependencies được sử dụng trong computed properties và watchers, vì vậy không cần khai báo dependencies thủ công.

- Không cần phải cache thủ công các hàm callback để tránh các cập nhật con không cần thiết. Nói chung, hệ thống reactivity chi tiết của Vue đảm bảo các component con chỉ cập nhật khi chúng cần. Các tối ưu hóa cập nhật con thủ công hiếm khi là mối quan tâm của các nhà phát triển Vue.

Chúng tôi ghi nhận sự sáng tạo của React Hooks, và nó là một nguồn cảm hứng chính cho Composition API. Tuy nhiên, các vấn đề được đề cập ở trên thực sự tồn tại trong thiết kế của nó và chúng tôi nhận thấy mô hình reactivity của Vue tình cờ cung cấp một cách để giải quyết chúng.

# Bảo mật {#security}

## Báo cáo Lỗ hổng Bảo mật {#reporting-vulnerabilities}

Khi một lỗ hổng được báo cáo, nó sẽ ngay lập tức trở thành mối quan tâm hàng đầu của chúng tôi, với một người đóng góp toàn thời gian sẽ dừng mọi công việc để xử lý nó. Để báo cáo lỗ hổng, vui lòng gửi email đến [security@vuejs.org](mailto:security@vuejs.org).

Mặc dù việc phát hiện ra các lỗ hổng mới là rất hiếm, chúng tôi cũng khuyến nghị bạn luôn sử dụng các phiên bản mới nhất của Vue và các thư viện đồng hành chính thức để đảm bảo ứng dụng của bạn luôn an toàn nhất có thể.

## Quy tắc số 1: Không bao giờ Sử dụng Template Không đáng tin cậy {#rule-no-1-never-use-non-trusted-templates}

Quy tắc bảo mật cơ bản nhất khi sử dụng Vue là **không bao giờ sử dụng nội dung không đáng tin cậy làm template của component**. Việc làm này tương đương với việc cho phép thực thi JavaScript tùy ý trong ứng dụng của bạn - và tệ hơn, có thể dẫn đến việc bị xâm nhập máy chủ nếu mã được thực thi trong quá trình server-side rendering. Một ví dụ về cách sử dụng như vậy:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NEVER DO THIS
}).mount('#app')
```

Template của Vue được biên dịch thành JavaScript, và các biểu thức bên trong template sẽ được thực thi như một phần của quá trình render. Mặc dù các biểu thức được đánh giá trong một ngữ cảnh render cụ thể, do sự phức tạp của các môi trường thực thi toàn cầu tiềm năng, nên không thực tế đối với một framework như Vue để hoàn toàn bảo vệ bạn khỏi việc thực thi mã độc hại tiềm năng mà không phải chịu chi phí hiệu năng không thực tế. Cách đơn giản nhất để tránh hoàn toàn danh mục vấn đề này là đảm bảo nội dung của template Vue của bạn luôn đáng tin cậy và hoàn toàn do bạn kiểm soát.

## Những gì Vue làm để Bảo vệ Bạn {#what-vue-does-to-protect-you}

### Nội dung HTML {#html-content}

Cho dù sử dụng template hay hàm render, nội dung sẽ được tự động escape. Điều này có nghĩa là trong template này:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

nếu `userProvidedString` chứa:

```js
'<script>alert("hi")</script>'
```

thì nó sẽ được escape thành HTML sau:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

do đó ngăn chặn việc chèn script. Việc escape này được thực hiện bằng cách sử dụng các API trình duyệt gốc, như `textContent`, nên lỗ hổng chỉ có thể tồn tại nếu chính trình duyệt có lỗ hổng.

### Binding thuộc tính {#attribute-bindings}

Tương tự, các binding thuộc tính động cũng được tự động escape. Điều này có nghĩa là trong template này:

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

nếu `userProvidedString` chứa:

```js
'" onclick="alert(\'hi\')'
```

thì nó sẽ được escape thành HTML sau:

```vue-html
&quot; onclick=&quot;alert('hi')
```

do đó ngăn chặn việc đóng thuộc tính `title` để chèn HTML tùy ý mới. Việc escape này được thực hiện bằng cách sử dụng các API trình duyệt gốc, như `setAttribute`, nên lỗ hổng chỉ có thể tồn tại nếu chính trình duyệt có lỗ hổng.

## Nguy cơ Tiềm ẩn {#potential-dangers}

Trong bất kỳ ứng dụng web nào, việc cho phép nội dung do người dùng cung cấp chưa được sanitize để thực thi dưới dạng HTML, CSS hoặc JavaScript đều có nguy cơ tiềm ẩn, vì vậy nên tránh càng nhiều càng tốt. Tuy nhiên, có những lúc một số rủi ro có thể chấp nhận được.

Ví dụ, các dịch vụ như CodePen và JSFiddle cho phép nội dung do người dùng cung cấp được thực thi, nhưng nó nằm trong một ngữ cảnh mà điều này được mong đợi và được sandbox ở một mức độ nào đó bên trong iframe. Trong các trường hợp khi một tính năng quan trọng vốn dĩ yêu cầu một mức độ lỗ hổng nhất định, tùy thuộc vào đội ngũ của bạn để cân nhắc tầm quan trọng của tính năng đó với các kịch bản tồi tệ nhất mà lỗ hổng đó cho phép.

### Chèn HTML {#html-injection}

Như bạn đã học trước đó, Vue tự động escape nội dung HTML, ngăn chặn bạn vô tình chèn HTML có thể thực thi vào ứng dụng của mình. Tuy nhiên, **trong các trường hợp bạn biết HTML đó an toàn**, bạn có thể render nội dung HTML một cách rõ ràng:

- Sử dụng template:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Sử dụng hàm render:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Sử dụng hàm render với JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
HTML do người dùng cung cấp không bao giờ có thể được coi là 100% an toàn trừ khi nó nằm trong iframe được sandbox hoặc trong một phần của ứng dụng mà chỉ người dùng đã viết HTML đó mới có thể tiếp xúc với nó. Ngoài ra, việc cho phép người dùng viết template Vue của riêng họ cũng mang lại những nguy cơ tương tự.
:::

### Chèn URL {#url-injection}

Trong một URL như sau:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Có một vấn đề bảo mật tiềm ẩn nếu URL chưa được "sanitize" để ngăn chặn việc thực thi JavaScript bằng cách sử dụng `javascript:`. Có các thư viện như [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) để giúp việc này, nhưng lưu ý: nếu bạn đang thực hiện sanitize URL trên frontend, bạn đã có vấn đề bảo mật. **URL do người dùng cung cấp luôn nên được sanitize bởi backend của bạn trước khi được lưu vào cơ sở dữ liệu.** Sau đó vấn đề sẽ được tránh đối với _mọi_ client kết nối với API của bạn, bao gồm cả các ứng dụng di động native. Ngoài ra, lưu ý rằng ngay cả với URL đã được sanitize, Vue không thể giúp bạn đảm bảo rằng chúng dẫn đến các đích an toàn.

### Chèn Style {#style-injection}

Xem xét ví dụ này:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Giả sử rằng `sanitizedUrl` đã được sanitize, vì vậy nó chắc chắn là một URL thực chứ không phải JavaScript. Với `userProvidedStyles`, người dùng độc hại vẫn có thể cung cấp CSS để "click jack", ví dụ: định dạng liên kết thành một hộp trong suốt trên nút "Log in". Sau đó nếu `https://user-controlled-website.com/` được xây dựng để giống trang đăng nhập của ứng dụng của bạn, họ có thể vừa thu thập thông tin đăng nhập thực của người dùng.

Bạn có thể hình dung việc cho phép nội dung do người dùng cung cấp cho một phần tử `<style>` sẽ tạo ra một lỗ hổng lớn hơn, cho người dùng đó toàn quyền kiểm soát cách định dạng toàn bộ trang. Đó là lý do tại sao Vue ngăn chặn việc render các thẻ style bên trong template, chẳng hạn như:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Để giữ cho người dùng của bạn hoàn toàn an toàn khỏi clickjacking, chúng tôi khuyến nghị chỉ cho phép toàn quyền kiểm soát CSS bên trong iframe được sandbox. Ngoài ra, khi cung cấp quyền kiểm soát người dùng thông qua binding style, chúng tôi khuyến nghị sử dụng [cú pháp đối tượng](/guide/essentials/class-and-style#binding-to-objects-1) và chỉ cho phép người dùng cung cấp giá trị cho các thuộc tính cụ thể mà an toàn để họ kiểm soát, như sau:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Chèn JavaScript {#javascript-injection}

Chúng tôi cực kỳ không khuyến nghị việc render một phần tử `<script>` với Vue, vì template và hàm render không bao giờ nên có các tác dụng phụ. Tuy nhiên, đây không phải là cách duy nhất để bao gồm các chuỗi sẽ được đánh giá là JavaScript tại runtime.

Mọi phần tử HTML đều có các thuộc tính với giá trị chấp nhận chuỗi JavaScript, chẳng hạn như `onclick`, `onfocus` và `onmouseenter`. Binding JavaScript do người dùng cung cấp cho bất kỳ thuộc tính sự kiện nào trong số này là một rủi ro bảo mật tiềm ẩn, vì vậy nên tránh.

:::warning
JavaScript do người dùng cung cấp không bao giờ có thể được coi là 100% an toàn trừ khi nó nằm trong iframe được sandbox hoặc trong một phần của ứng dụng mà chỉ người dùng đã viết JavaScript đó mới có thể tiếp xúc với nó.
:::

Đôi khi chúng tôi nhận được báo cáo lỗ hổng về cách có thể thực hiện cross-site scripting (XSS) trong template Vue. Nói chung, chúng tôi không coi các trường hợp như vậy là lỗ hổng thực tế vì không có cách thực tế để bảo vệ các nhà phát triển khỏi hai kịch bản sẽ cho phép XSS:

1. Nhà phát triển đang yêu cầu Vue một cách rõ ràng để render nội dung do người dùng cung cấp, chưa được sanitize dưới dạng template Vue. Điều này vốn dĩ không an toàn, và không có cách nào để Vue biết nguồn gốc.

2. Nhà phát triển đang mount Vue lên một trang HTML hoàn toàn tình cờ chứa nội dung được render bởi máy chủ và do người dùng cung cấp. Về cơ bản, đây là vấn đề giống như #1, nhưng đôi khi các nhà phát triển có thể làm điều đó mà không nhận ra. Điều này có thể dẫn đến các lỗ hổng có thể xảy ra trong đó kẻ tấn công cung cấp HTML an toàn dưới dạng HTML thuần túy nhưng không an toàn dưới dạng template Vue. Thực hành tốt nhất là **không bao giờ mount Vue trên các nút có thể chứa nội dung được render bởi máy chủ và do người dùng cung cấp**.

## Thực hành Tốt nhất {#best-practices}

Quy tắc chung là nếu bạn cho phép nội dung do người dùng cung cấp chưa được sanitize để thực thi (dưới dạng HTML, JavaScript hoặc thậm chí CSS), bạn có thể mở ra các cuộc tấn công. Lời khuyên này thực sự đúng bất kể bạn sử dụng Vue, một framework khác hay thậm chí không sử dụng framework nào.

Ngoài các khuyến nghị được đưa ra ở trên cho [Nguy cơ Tiềm ẩn](#potential-dangers), chúng tôi cũng khuyến nghị bạn làm quen với các tài nguyên này:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Sau đó sử dụng những gì bạn học được để xem xét mã nguồn của các dependency của bạn về các mẫu nguy cơ tiềm ẩn, nếu bất kỳ trong số chúng bao gồm các thành phần bên thứ ba hoặc ảnh hưởng đến những gì được render vào DOM.

## Phối hợp Backend {#backend-coordination}

Các lỗ hổng bảo mật HTTP, chẳng hạn như cross-site request forgery (CSRF/XSRF) và cross-site script inclusion (XSSI), chủ yếu được giải quyết ở backend, vì vậy chúng không phải là mối quan tâm của Vue. Tuy nhiên, vẫn là một ý tưởng tốt để giao tiếp với đội ngũ backend của bạn để tìm hiểu cách tương tác tốt nhất với API của họ, ví dụ: bằng cách gửi CSRF token cùng với việc gửi biểu mẫu.

## Server-Side Rendering (SSR) {#server-side-rendering-ssr}

Có một số mối quan tâm bảo mật bổ sung khi sử dụng SSR, vì vậy hãy đảm bảo tuân theo các thực hành tốt nhất được mô tả trong [tài liệu SSR của chúng tôi](/guide/scaling-up/ssr) để tránh các lỗ hổng.

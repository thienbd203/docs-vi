# Câu hỏi thường gặp {#frequently-asked-questions}

## Ai bảo trì Vue? {#who-maintains-vue}

Vue là một dự án độc lập, do cộng đồng điều hành. Nó được tạo bởi [Evan You](https://x.com/youyuxi) vào năm 2014 như một dự án phụ cá nhân. Ngày nay, Vue được bảo trì tích cực bởi [một đội ngũ gồm cả thành viên toàn thời gian và tình nguyện viên từ khắp nơi trên thế giới](/about/team), với Evan là người dẫn dắt dự án. Bạn có thể tìm hiểu thêm về câu chuyện của Vue trong [bộ phim tài liệu](https://www.youtube.com/watch?v=OrxmtDw4pVI) này.

Sự phát triển của Vue chủ yếu được tài trợ thông qua các nhà tài trợ và chúng tôi đã tự chủ về tài chính từ năm 2016. Nếu bạn hoặc doanh nghiệp của bạn được lợi từ Vue, hãy cân nhắc [tài trợ cho chúng tôi](/sponsor/) để hỗ trợ sự phát triển của Vue!

## Sự khác biệt giữa Vue 2 và Vue 3 là gì? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 là phiên bản chính mới nhất hiện tại của Vue. Nó chứa các tính năng mới không có trong Vue 2, như Teleport, Suspense, và nhiều phần tử gốc (root elements) cho mỗi template. Nó cũng chứa các thay đổi không tương thích ngược khiến nó không tương thích với Vue 2. Chi tiết đầy đủ được ghi lại trong [Hướng dẫn nâng cấp lên Vue 3](https://v3-migration.vuejs.org/).

Mặc dù có sự khác biệt, phần lớn các API của Vue được chia sẻ giữa hai phiên bản chính, nên hầu hết kiến thức Vue 2 của bạn sẽ tiếp tục hoạt động trong Vue 3. Đáng chú ý, Composition API ban đầu là tính năng chỉ có trong Vue 3, nhưng hiện đã được backport sang Vue 2 và có sẵn trong [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

Nhìn chung, Vue 3 cung cấp kích thước bundle nhỏ hơn, hiệu suất tốt hơn, khả năng mở rộng tốt hơn, và hỗ trợ TypeScript / IDE tốt hơn. Nếu bạn đang bắt đầu một dự án mới ngay bây giờ, Vue 3 là lựa chọn được khuyến nghị. Chỉ có một vài lý do để bạn cân nhắc Vue 2 vào lúc này:

- Bạn cần hỗ trợ IE11. Vue 3 tận dụng các tính năng JavaScript hiện đại và không hỗ trợ IE11.

Nếu bạn định nâng cấp một ứng dụng Vue 2 hiện có lên Vue 3, hãy tham khảo [hướng dẫn nâng cấp](https://v3-migration.vuejs.org/).

## Vue 2 có còn được hỗ trợ không? {#is-vue-2-still-supported}

Vue 2.7, được phát hành vào tháng 7 năm 2022, là bản phát hành minor cuối cùng của dòng phiên bản Vue 2. Vue 2 đã bước vào chế độ bảo trì: nó sẽ không còn phát hành tính năng mới, nhưng sẽ tiếp tục nhận các bản sửa lỗi quan trọng và cập nhật bảo mật trong 18 tháng kể từ ngày phát hành 2.7. Điều này có nghĩa là **Vue 2 đã hết vòng đời (End of Life) vào ngày 31 tháng 12 năm 2023**.

Chúng tôi tin rằng điều này sẽ cung cấp đủ thời gian cho phần lớn hệ sinh thái để chuyển sang Vue 3. Tuy nhiên, chúng tôi cũng hiểu rằng có thể có các đội nhóm hoặc dự án không thể nâng cấp theo thời gian này nhưng vẫn cần đáp ứng các yêu cầu về bảo mật và tuân thủ. Chúng tôi đang hợp tác với các chuyên gia trong ngành để cung cấp hỗ trợ mở rộng cho Vue 2 cho các đội nhóm có nhu cầu như vậy - nếu đội nhóm của bạn dự kiến sẽ sử dụng Vue 2 sau cuối năm 2023, hãy đảm bảo lên kế hoạch trước và tìm hiểu thêm về [Vue 2 Extended LTS](https://v2.vuejs.org/lts/).

## Vue sử dụng giấy phép nào? {#what-license-does-vue-use}

Vue là một dự án miễn phí và mã nguồn mở được phát hành theo [Giấy phép MIT](https://opensource.org/licenses/MIT).

## Vue hỗ trợ những trình duyệt nào? {#what-browsers-does-vue-support}

Phiên bản mới nhất của Vue (3.x) chỉ hỗ trợ [các trình duyệt có hỗ trợ ES2016 gốc](https://caniuse.com/es2016). Điều này loại trừ IE11. Vue 3.x sử dụng các tính năng ES2016 không thể polyfill trong các trình duyệt cũ, vì vậy nếu bạn cần hỗ trợ các trình duyệt cũ, bạn sẽ cần sử dụng Vue 2.x thay thế.

## Vue có đáng tin cậy không? {#is-vue-reliable}

Vue là một framework trưởng thành và đã được kiểm chứng qua thực tế. Nó là một trong những framework JavaScript được sử dụng rộng rãi nhất trong production hiện nay, với hơn 1,5 triệu người dùng trên toàn thế giới, và được tải xuống gần 10 triệu lần mỗi tháng trên npm.

Vue được sử dụng trong production bởi các tổ chức nổi tiếng với nhiều quy mô khác nhau trên khắp thế giới, bao gồm Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou, và nhiều hơn nữa.

## Vue có nhanh không? {#is-vue-fast}

Vue 3 là một trong những framework frontend chính thống có hiệu suất cao nhất, và xử lý hầu hết các trường hợp sử dụng ứng dụng web một cách dễ dàng, mà không cần tối ưu hóa thủ công.

Trong các kịch bản kiểm tra áp lực, Vue vượt trội hơn React và Angular một khoảng khá lớn trong [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html). Nó cũng cạnh tranh sòng phẳng với một số framework không dùng Virtual-DOM nhanh nhất ở mức production trong benchmark.

Lưu ý rằng các benchmark tổng hợp như trên tập trung vào hiệu suất render thô với các tối ưu hóa chuyên biệt và có thể không đại diện đầy đủ cho kết quả hiệu suất trong thực tế. Nếu bạn quan tâm nhiều hơn đến hiệu suất tải trang, bạn được mời kiểm tra trang web này bằng [WebPageTest](https://www.webpagetest.org/lighthouse) hoặc [PageSpeed Insights](https://pagespeed.web.dev/). Trang web này được chạy bởi chính Vue, với SSG pre-rendering, full page hydration và điều hướng phía client SPA. Nó đạt điểm 100 về hiệu suất trên Moto G4 mô phỏng với 4x CPU throttling qua mạng 4G chậm.

Bạn có thể tìm hiểu thêm về cách Vue tự động tối ưu hóa hiệu suất runtime trong phần [Cơ chế Render](/guide/extras/rendering-mechanism), và cách tối ưu hóa ứng dụng Vue trong các trường hợp đặc biệt đòi hỏi cao trong [Hướng dẫn Tối ưu hóa Hiệu suất](/guide/best-practices/performance).

## Vue có nhẹ không? {#is-vue-lightweight}

Khi bạn sử dụng build tool, nhiều API của Vue có thể ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Ví dụ, nếu bạn không sử dụng component `<Transition>` tích hợp, nó sẽ không được bao gồm trong bundle production cuối cùng.

Một ứng dụng Vue hello world chỉ sử dụng các API tối thiểu tuyệt đối có kích thước cơ sở chỉ khoảng **16kb**, với minification và nén brotli. Kích thước thực tế của ứng dụng sẽ phụ thuộc vào bao nhiêu tính năng tùy chọn bạn sử dụng từ framework. Trong trường hợp hiếm hoi khi một ứng dụng sử dụng mọi tính năng mà Vue cung cấp, tổng kích thước runtime là khoảng **27kb**.

Khi sử dụng Vue mà không có build tool, chúng ta không chỉ mất tree-shaking, mà còn phải gửi template compiler đến trình duyệt. Điều này làm phình kích thước lên khoảng **41kb**. Do đó, nếu bạn sử dụng Vue chủ yếu cho progressive enhancement mà không có build step, hãy cân nhắc sử dụng [petite-vue](https://github.com/vuejs/petite-vue) (chỉ **6kb**) thay thế.

Một số framework, như Svelte, sử dụng chiến lược biên dịch tạo ra đầu cực kỳ nhẹ trong các kịch bản single-component. Tuy nhiên, [nghiên cứu của chúng tôi](https://github.com/yyx990803/vue-svelte-size-analysis) cho thấy sự khác biệt kích thước phụ thuộc nhiều vào số lượng component trong ứng dụng. Mặc dù Vue có kích thước cơ sở nặng hơn, nó tạo ra ít code hơn cho mỗi component. Trong các kịch bản thực tế, một ứng dụng Vue có thể kết thúc nhẹ hơn.

## Vue có khả năng mở rộng không? {#does-vue-scale}

Có. Mặc dù có một quan niệm sai lầm phổ biến rằng Vue chỉ phù hợp với các trường hợp sử dụng đơn giản, Vue hoàn toàn có khả năng xử lý các ứng dụng quy mô lớn:

- [Single-File Components](/guide/scaling-up/sfc) cung cấp mô hình phát triển mô-đun hóa cho phép các phần khác nhau của ứng dụng được phát triển độc lập.

- [Composition API](/guide/reusability/composables) cung cấp tích hợp TypeScript hạng nhất và cho phép các pattern sạch sẽ để tổ chức, trích xuất và tái sử dụng logic phức tạp.

- [Hỗ trợ công cụ toàn diện](/guide/scaling-up/tooling) đảm bảo trải nghiệm phát triển trơn tru khi ứng dụng phát triển.

- Rào cản gia nhập thấp và tài liệu xuất sắc chuyển thành chi phí onboarding và đào tạo thấp hơn cho các nhà phát triển mới.

## Tôi có thể đóng góp cho Vue như thế nào? {#how-do-i-contribute-to-vue}

Chúng tôi trân trọng sự quan tâm của bạn! Vui lòng xem [Hướng dẫn Cộng đồng](/about/community-guide) của chúng tôi.

## Tôi nên dùng Options API hay Composition API? {#should-i-use-options-api-or-composition-api}

Nếu bạn mới làm quen với Vue, chúng tôi cung cấp một so sánh ở mức cao giữa hai kiểu [tại đây](/guide/introduction#which-to-choose).

Nếu bạn đã từng sử dụng Options API và hiện đang đánh giá Composition API, hãy xem [FAQ này](/guide/extras/composition-api-faq).

## Tôi nên dùng JavaScript hay TypeScript với Vue? {#should-i-use-javascript-or-typescript-with-vue}

Mặc dù bản thân Vue được triển khai bằng TypeScript và cung cấp hỗ trợ TypeScript hạng nhất, nó không áp đặt quan điểm về việc bạn có nên sử dụng TypeScript hay không.

Hỗ trợ TypeScript là một cân nhắc quan trọng khi các tính năng mới được thêm vào Vue. Các API được thiết kế với TypeScript trong tâm trí thường dễ hiểu hơn cho IDE và linters, ngay cả khi bạn không sử dụng TypeScript. Mọi người đều thắng. Các API của Vue cũng được thiết kế để hoạt động theo cùng một cách trong cả JavaScript và TypeScript càng nhiều càng tốt.

Việc áp dụng TypeScript liên quan đến sự đánh đổi giữa độ phức tạp onboarding và lợi ích về khả năng bảo trì dài hạn. Việc đánh đổi đó có thể được biện minh hay không có thể thay đổi tùy thuộc vào nền tảng của đội nhóm và quy mô dự án, nhưng Vue không thực sự là một yếu tố ảnh hưởng trong việc đưa ra quyết định đó.

## Vue so với Web Components như thế nào? {#how-does-vue-compare-to-web-components}

Vue được tạo ra trước khi Web Components có sẵn theo cách gốc, và một số khía cạnh của thiết kế Vue (ví dụ: slots) được lấy cảm hứng từ mô hình Web Components.

Các đặc tả Web Components tương đối ở mức thấp, vì chúng tập trung vào việc định nghĩa các custom elements. Là một framework, Vue giải quyết các mối quan tâm cấp cao hơn như render DOM hiệu quả, quản lý state phản ứng, công cụ, định tuyến phía client, và render phía server.

Vue cũng hỗ trợ đầy đủ việc sử dụng hoặc xuất sang các custom elements gốc - xem [Hướng dẫn Vue và Web Components](/guide/extras/web-components) để biết thêm chi tiết.

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->

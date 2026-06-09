# Các cách sử dụng Vue {#ways-of-using-vue}

Chúng tôi tin rằng không có một giải pháp "phù hợp với mọi trường hợp" cho web. Đó là lý do Vue được thiết kế để linh hoạt và có thể áp dụng từng phần. Tùy thuộc vào trường hợp sử dụng của bạn, Vue có thể được sử dụng theo nhiều cách khác nhau để đạt được sự cân bằng tối ưu giữa độ phức tạp của stack, trải nghiệm nhà phát triển và hiệu suất cuối cùng.

## Script độc lập {#standalone-script}

Vue có thể được sử dụng như một tệp script độc lập - không cần bước build! Nếu bạn đã có một framework backend đang render phần lớn HTML, hoặc logic frontend của bạn không đủ phức tạp để biện minh cho một bước build, đây là cách dễ nhất để tích hợp Vue vào stack của bạn. Trong những trường hợp như vậy, bạn có thể coi Vue là một sự thay thế mang tính khai báo hơn cho jQuery.

Trước đây chúng tôi đã cung cấp một bản phân phối thay thế gọi là [petite-vue](https://github.com/vuejs/petite-vue) được tối ưu hóa cụ thể để nâng cấp dần (progressively enhancing) HTML hiện có. Tuy nhiên, petite-vue không còn được duy trì tích cực, với phiên bản cuối cùng được phát hành tại Vue 3.2.27. 

## Web Components nhúng {#embedded-web-components}

Bạn có thể sử dụng Vue để [xây dựng Web Components tiêu chuẩn](/guide/extras/web-components) có thể được nhúng vào bất kỳ trang HTML nào, bất kể chúng được render như thế nào. Tùy chọn này cho phép bạn tận dụng Vue theo cách hoàn toàn không phụ thuộc vào người tiêu dùng: các web components kết quả có thể được nhúng vào các ứng dụng cũ, HTML tĩnh, hoặc thậm chí các ứng dụng được xây dựng với các framework khác.

## Single-Page Application (SPA) {#single-page-application-spa}

Một số ứng dụng yêu cầu tính tương tác phong phú, độ sâu phiên (session depth) lớn, và logic có trạng thái (stateful logic) không tầm thường trên frontend. Cách tốt nhất để xây dựng các ứng dụng như vậy là sử dụng một kiến trúc mà Vue không chỉ kiểm soát toàn bộ trang, mà còn xử lý cập nhật dữ liệu và điều hướng mà không cần tải lại trang. Loại ứng dụng này thường được gọi là Single-Page Application (SPA).

Vue cung cấp các thư viện cốt lõi và [hỗ trợ công cụ toàn diện](/guide/scaling-up/tooling) với trải nghiệm nhà phát triển tuyệt vời để xây dựng các SPA hiện đại, bao gồm:

- Router phía client
- Chuỗi công cụ build cực nhanh
- Hỗ trợ IDE
- Devtools trình duyệt
- Tích hợp TypeScript
- Công cụ kiểm thử

SPAs thường yêu cầu backend cung cấp các API endpoint - nhưng bạn cũng có thể kết hợp Vue với các giải pháp như [Inertia.js](https://inertiajs.com) để nhận được lợi ích của SPA trong khi vẫn giữ mô hình phát triển tập trung vào server.

## Fullstack / SSR {#fullstack-ssr}

Các SPA phía client thuần túy gặp vấn đề khi ứng dụng nhạy cảm với SEO và thời gian hiển thị nội dung. Điều này là do trình duyệt sẽ nhận được một trang HTML phần lớn trống, và phải đợi cho đến khi JavaScript được tải trước khi render bất cứ thứ gì.

Vue cung cấp các API hàng đầu để "render" một ứng dụng Vue thành chuỗi HTML trên server. Điều này cho phép server gửi lại HTML đã được render sẵn, cho phép người dùng cuối nhìn thấy nội dung ngay lập tức trong khi JavaScript đang được tải xuống. Sau đó Vue sẽ "hydrate" ứng dụng ở phía client để làm cho nó tương tác. Điều này được gọi là [Server-Side Rendering (SSR)](/guide/scaling-up/ssr) và nó cải thiện đáng kể các chỉ số Core Web Vital như [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

Có các framework dựa trên Vue cấp cao hơn được xây dựng dựa trên mô hình này, chẳng hạn như [Nuxt](https://nuxt.com/), cho phép bạn phát triển một ứng dụng fullstack sử dụng Vue và JavaScript.

## JAMStack / SSG {#jamstack-ssg}

Server-side rendering có thể được thực hiện trước thời hạn nếu dữ liệu cần thiết là tĩnh. Điều này có nghĩa là chúng ta có thể pre-render toàn bộ ứng dụng thành HTML và phục vụ chúng dưới dạng tệp tĩnh. Điều này cải thiện hiệu suất trang web và làm cho việc triển khai đơn giản hơn nhiều vì chúng ta không còn cần render trang động trên mỗi yêu cầu. Vue vẫn có thể hydrate các ứng dụng như vậy để cung cấp tính tương tác phong phú ở phía client. Kỹ thuật này thường được gọi là Static-Site Generation (SSG), còn được gọi là [JAMStack](https://jamstack.org/what-is-jamstack/).

Có hai biến thể của SSG: single-page và multi-page. Cả hai biến thể đều pre-render trang web thành HTML tĩnh, sự khác biệt là:

- Sau khi tải trang ban đầu, một SSG single-page sẽ "hydrate" trang thành một SPA. Điều này yêu cầu tải JS ban đầu nhiều hơn và chi phí hydrate cao hơn, nhưng các điều hướng sau đó sẽ nhanh hơn, vì nó chỉ cần cập nhật một phần nội dung trang thay vì tải lại toàn bộ trang.

- Một SSG multi-page tải một trang mới trên mỗi điều hướng. Lợi thế là nó có thể gửi tối thiểu JS - hoặc không có JS nào nếu trang không yêu cầu tương tác! Một số framework SSG multi-page như [Astro](https://astro.build/) cũng hỗ trợ "partial hydration" - cho phép bạn sử dụng các component Vue để tạo các "island" tương tác bên trong HTML tĩnh.

SSG single-page phù hợp hơn nếu bạn mong đợi tính tương tác không tầm thường, độ dài phiên sâu, hoặc các phần tử / trạng thái được duy trì qua các điều hướng. Nếu không, SSG multi-page sẽ là lựa chọn tốt hơn.

Đội ngũ Vue cũng duy trì một trình tạo trang tĩnh gọi là [VitePress](https://vitepress.dev/), trang web bạn đang đọc ngay bây giờ được xây dựng bằng nó! VitePress hỗ trợ cả hai biến thể của SSG. [Nuxt](https://nuxt.com/) cũng hỗ trợ SSG. Bạn thậm chí có thể kết hợp SSR và SSG cho các route khác nhau trong cùng một ứng dụng Nuxt.

## Vượt ra ngoài Web {#beyond-the-web}

Mặc dù Vue được thiết kế chủ yếu để xây dựng các ứng dụng web, nhưng nó không bị giới hạn chỉ ở trình duyệt. Bạn có thể:

- Xây dựng ứng dụng desktop với [Electron](https://www.electronjs.org/) hoặc [Wails](https://wails.io)
- Xây dựng ứng dụng mobile với [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Xây dựng ứng dụng desktop và mobile từ cùng một codebase với [Quasar](https://quasar.dev/) hoặc [Tauri](https://tauri.app)
- Xây dựng trải nghiệm 3D WebGL với [TresJS](https://tresjs.org/)
- Sử dụng [Custom Renderer API](/api/custom-renderer) của Vue để xây dựng các renderer tùy chỉnh, như những renderer cho [terminal](https://github.com/vue-terminal/vue-termui)!

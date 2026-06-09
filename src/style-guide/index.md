---
outline: deep
---

# Hướng dẫn Phong cách {#style-guide}

::: warning Lưu ý
Hướng dẫn Phong cách Vue.js này đã lỗi thời và cần được xem xét lại. Nếu bạn có bất kỳ câu hỏi hoặc gợi ý nào, vui lòng [mở một issue](https://github.com/vuejs/docs/issues/new).
:::

Đây là hướng dẫn phong cách chính thức cho mã dành riêng cho Vue. Nếu bạn sử dụng Vue trong một dự án, đây là tài liệu tham khảo tuyệt vời để tránh lỗi, tranh luận không cần thiết, và các anti-pattern. Tuy nhiên, chúng tôi không tin rằng bất kỳ hướng dẫn phong cách nào là lý tưởng cho tất cả các nhóm hoặc dự án, vì vậy các điều chỉnh có ý thức được khuyến khích dựa trên kinh nghiệm quá khứ, stack công nghệ xung quanh, và giá trị cá nhân.

Phần lớn, chúng tôi cũng tránh đưa ra gợi ý về JavaScript hoặc HTML nói chung. Chúng tôi không quan tâm bạn có sử dụng dấu chấm phẩy hay dấu phẩy ở cuối hay không. Chúng tôi không quan tâm HTML của bạn có sử dụng dấu nháy đơn hay dấu nháy kép cho giá trị thuộc tính hay không. Tuy nhiên sẽ có một số ngoại lệ, nơi chúng tôi nhận thấy một mẫu cụ thể hữu ích trong ngữ cảnh của Vue.

Cuối cùng, chúng tôi đã chia các quy tắc thành bốn danh mục:

## Danh mục Quy tắc {#rule-categories}

### Ưu tiên A: Cần thiết (Ngăn ngừa Lỗi) {#priority-a-essential-error-prevention}

Các quy tắc này giúp ngăn ngừa lỗi, vì vậy hãy học và tuân thủ chúng bằng mọi giá. Có thể có ngoại lệ, nhưng nên rất hiếm và chỉ được thực hiện bởi những người có kiến thức chuyên sâu về cả JavaScript và Vue.

- [Xem tất cả quy tắc ưu tiên A](./rules-essential)

### Ưu tiên B: Khuyên dùng Mạnh mẽ {#priority-b-strongly-recommended}

Các quy tắc này đã được tìm thấy để cải thiện khả năng đọc và/hoặc trải nghiệm của nhà phát triển trong hầu hết các dự án. Mã của bạn vẫn sẽ chạy nếu bạn vi phạm chúng, nhưng các vi phạm nên hiếm và được biện minh tốt.

- [Xem tất cả quy tắc ưu tiên B](./rules-strongly-recommended)

### Ưu tiên C: Khuyên dùng {#priority-c-recommended}

Khi có nhiều tùy chọn tốt như nhau, một lựa chọn tùy ý có thể được thực hiện để đảm bảo tính nhất quán. Trong các quy tắc này, chúng tôi mô tả mỗi tùy chọn chấp nhận được và gợi ý một lựa chọn mặc định. Điều đó có nghĩa là bạn có thể tự do thực hiện một lựa chọn khác trong codebase của mình, miễn là bạn nhất quán và có một lý do tốt. Tuy nhiên, hãy có một lý do tốt nhé! Bằng cách thích nghi với tiêu chuẩn cộng đồng, bạn sẽ:

1. Đào tạo bộ não của mình để dễ dàng phân tích hầu hết mã cộng đồng bạn gặp phải
2. Có thể sao chép và dán hầu hết các ví dụ mã cộng đồng mà không cần sửa đổi
3. Thường thấy rằng nhân viên mới đã quen với phong cách lập trình ưa thích của bạn, ít nhất là về Vue

- [Xem tất cả quy tắc ưu tiên C](./rules-recommended)

### Ưu tiên D: Sử dụng với Thận trọng {#priority-d-use-with-caution}

Một số tính năng của Vue tồn tại để đáp ứng các trường hợp hiếm gặp hoặc di chuyển mượt mà hơn từ codebase cũ. Tuy nhiên, khi bị lạm dụng, chúng có thể làm cho mã của bạn khó bảo trì hơn hoặc thậm chí trở thành nguồn gốc của lỗi. Các quy tắc này làm sáng tỏ các tính năng có khả năng rủi ro, mô tả khi và tại sao chúng nên được tránh.

- [Xem tất cả quy tắc ưu tiên D](./rules-use-with-caution)

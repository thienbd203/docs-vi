---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Bản Phát Hành {#releases}

<p v-if="version">
Phiên bản ổn định mới nhất hiện tại của Vue là <strong>{{ version }}</strong>.
</p>
<p v-else>
Đang kiểm tra phiên bản mới nhất...
</p>

Nhật ký thay đổi đầy đủ của các bản phát hành trước có sẵn trên [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Chu Kỳ Phát Hành {#release-cycle}

Vue không có chu kỳ phát hành cố định.

- Bản vá (patch) được phát hành khi cần thiết.

- Bản phát hành nhỏ (minor) luôn chứa các tính năng mới, với khoảng thời gian điển hình từ 3 đến 6 tháng giữa các bản. Bản phát hành nhỏ luôn trải qua giai đoạn beta trước khi phát hành chính thức.

- Bản phát hành lớn (major) sẽ được thông báo trước, và sẽ trải qua giai đoạn thảo luận sớm và các giai đoạn tiền phát hành alpha / beta.

## Các Trường Hợp Đặc Biệt Của Semantic Versioning {#semantic-versioning-edge-cases}

Các bản phát hành của Vue tuân theo [Semantic Versioning](https://semver.org/) với một số trường hợp đặc biệt.

### Định Nghĩa TypeScript {#typescript-definitions}

Chúng tôi có thể đưa ra các thay đổi không tương thích với định nghĩa TypeScript giữa các phiên bản **minor**. Điều này là do:

1. Đôi khi chính TypeScript cũng đưa ra các thay đổi không tương thích giữa các phiên bản minor, và chúng tôi có thể phải điều chỉnh các kiểu để hỗ trợ các phiên bản TypeScript mới hơn.

2. Thỉnh thoảng chúng tôi có thể cần áp dụng các tính năng chỉ có sẵn trong phiên bản TypeScript mới hơn, làm tăng phiên bản TypeScript tối thiểu được yêu cầu.

Nếu bạn đang sử dụng TypeScript, bạn có thể sử dụng phạm vi semver để khóa phiên bản minor hiện tại và nâng cấp thủ công khi một phiên bản minor mới của Vue được phát hành.

### Tương Thích Mã Được Biên Dịch Với Runtime Cũ Hơn {#compiled-code-compatibility-with-older-runtime}

Một phiên bản **minor** mới hơn của trình biên dịch Vue có thể tạo ra mã không tương thích với runtime Vue từ phiên bản minor cũ hơn. Ví dụ, mã được tạo bởi trình biên dịch Vue 3.2 có thể không hoàn toàn tương thích nếu được sử dụng bởi runtime từ Vue 3.1.

Điều này chỉ đáng quan ngại đối với các tác giả thư viện, vì trong các ứng dụng, phiên bản trình biên dịch và phiên bản runtime luôn giống nhau. Sự không khớp phiên bản chỉ có thể xảy ra nếu bạn gửi mã component Vue được biên dịch trước dưới dạng gói, và người dùng sử dụng nó trong một dự án sử dụng phiên bản Vue cũ hơn. Kết quả là, gói của bạn có thể cần khai báo rõ ràng phiên bản minor tối thiểu được yêu cầu của Vue.

## Bản Tiền Phát Hành {#pre-releases}

Các bản phát hành minor và major thường trải qua một loạt các giai đoạn tiền phát hành: **alpha**, **beta**, và **release candidate (RC)**. Số lượng và loại bản tiền phát hành phụ thuộc vào phạm vi thay đổi. Ví dụ, một bản phát hành minor với các cập nhật hạn chế có thể chỉ có giai đoạn beta, trong khi bản phát hành major thường sẽ bao gồm cả ba giai đoạn để cho phép kiểm tra kỹ lưỡng và phản hồi từ cộng đồng.

Bạn có thể cài đặt các bản tiền phát hành mới nhất từ npm bằng `npx install-vue@alpha`, `npx install-vue@beta`, hoặc `npx install-vue@rc`. Để kiểm tra các thay đổi chưa được bao gồm trong các bản tiền phát hành được gắn thẻ, mỗi commit vào kho lưu trữ [vuejs/core](https://github.com/vuejs/core) được xuất bản dưới dạng bản xem trước phát hành liên tục tạm thời, mà bạn có thể cài đặt bằng `npx install-vue@edge`.

Các bản tiền phát hành dành cho kiểm tra tích hợp / ổn định, và cho những người chấp nhận sớm để cung cấp phản hồi về các tính năng không ổn định. Không sử dụng các bản tiền phát hành trong môi trường sản xuất. Tất cả các bản tiền phát hành đều được coi là không ổn định và có thể có các thay đổi phá vỡ giữa các bản, vì vậy luôn luôn khóa phiên bản chính xác khi sử dụng các bản tiền phát hành.

## Deprecations {#deprecations}

We may periodically deprecate features that have new, better replacements in minor releases. Deprecated features will continue to work, and will be removed in the next major release after it entered deprecated status.

## RFCs {#rfcs}

New features with substantial API surface and major changes to Vue will go through the **Request for Comments** (RFC) process. The RFC process is intended to provide a consistent and controlled path for new features to enter the framework, and give the users an opportunity to participate and offer feedback in the design process.

Quy trình RFC được thực hiện trong repo [vuejs/rfcs](https://github.com/vuejs/rfcs) trên GitHub.

## Experimental Features {#experimental-features}

Một số tính năng được ship và ghi lại trong một phiên bản ổn định của Vue, nhưng được đánh dấu là thử nghiệm. Các tính năng thử nghiệm thường là các tính năng có một cuộc thảo luận RFC liên quan với hầu hết các vấn đề thiết kế được giải quyết trên giấy, nhưng vẫn thiếu phản hồi từ việc sử dụng thực tế.

Mục tiêu của các tính năng thử nghiệm là cho phép người dùng cung cấp phản hồi cho chúng bằng cách kiểm tra chúng trong cài đặt production, mà không cần sử dụng một phiên bản không ổn định của Vue. Các tính năng thử nghiệm bản thân được coi là không ổn định, và chỉ nên được sử dụng theo cách được kiểm soát, với kỳ vọng rằng tính năng có thể thay đổi giữa bất kỳ loại phát hành nào.

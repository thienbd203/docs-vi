---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# Trở thành Nhà tài trợ Vue.js {#become-a-vue-js-sponsor}

Vue.js là một dự án mã nguồn mở được cấp phép MIT và hoàn toàn miễn phí để sử dụng.
Số lượng công việc khổng lồ cần thiết để duy trì một hệ sinh thái lớn như vậy và phát triển các tính năng mới cho dự án chỉ có thể duy trì được nhờ sự hỗ trợ tài chính hào phóng từ các nhà tài trợ của chúng tôi.

## Cách Tài trợ {#how-to-sponsor}

Việc tài trợ có thể thực hiện thông qua [GitHub Sponsors](https://github.com/sponsors/yyx990803) hoặc [OpenCollective](https://opencollective.com/vuejs). Hóa đơn có thể được lấy thông qua hệ thống thanh toán của GitHub. Cả hai hình thức tài trợ định kỳ hàng tháng và đóng góp một lần đều được chấp nhận. Các gói tài trợ định kỳ sẽ được hưởng quyền hiển thị logo như được quy định trong [Các Gói Tài trợ](#tier-benefits).

Nếu bạn có câu hỏi về các gói tài trợ, quy trình thanh toán, hoặc dữ liệu tiếp xúc của nhà tài trợ, vui lòng liên hệ với [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Tài trợ Vue với tư cách Doanh nghiệp {#sponsoring-vue-as-a-business}

Việc tài trợ Vue mang lại cho bạn sự tiếp xúc tuyệt vời với hơn **2 triệu** nhà phát triển Vue trên toàn thế giới thông qua trang web của chúng tôi và các tệp README của dự án GitHub. Điều này không chỉ trực tiếp tạo ra khách hàng tiềm năng, mà còn cải thiện nhận diện thương hiệu của bạn như một doanh nghiệp quan tâm đến Mã nguồn mở. Đây là một tài sản vô hình nhưng cực kỳ quan trọng đối với các công ty xây dựng sản phẩm cho nhà phát triển, vì nó cải thiện tỷ lệ chuyển đổi của bạn.

Nếu bạn đang sử dụng Vue để xây dựng sản phẩm tạo ra doanh thu, việc tài trợ cho sự phát triển của Vue là hợp lý về mặt kinh doanh: **nó đảm bảo rằng dự án mà sản phẩm của bạn dựa vào vẫn khỏe mạnh và được duy trì tích cực.** Sự tiếp xúc và hình ảnh thương hiệu tích cực trong cộng đồng Vue cũng giúp việc thu hút và tuyển dụng các nhà phát triển Vue trở nên dễ dàng hơn.

Nếu bạn đang xây dựng sản phẩm mà khách hàng mục tiêu là các nhà phát triển, bạn sẽ có được lượng truy cập chất lượng cao thông qua sự tiếp xúc của tài trợ, vì tất cả khách truy cập của chúng tôi đều là nhà phát triển. Việc tài trợ cũng xây dựng nhận diện thương hiệu và cải thiện tỷ lệ chuyển đổi.

## Tài trợ Vue với tư cách Cá nhân {#sponsoring-vue-as-an-individual}

Nếu bạn là người dùng cá nhân và đã tận hưởng năng suất khi sử dụng Vue, hãy cân nhắc đóng góp như một lời cảm ơn - giống như mời chúng tôi uống cà phê thỉnh thoảng. Nhiều thành viên trong nhóm của chúng tôi chấp nhận tài trợ và đóng góp thông qua GitHub Sponsors. Hãy tìm nút "Sponsor" trên hồ sơ của từng thành viên trong nhóm trên [trang nhóm](/about/team) của chúng tôi.

Bạn cũng có thể cố gắng thuyết phục nhà tuyển dụng của mình tài trợ Vue với tư cách là một doanh nghiệp. Điều này có thể không dễ dàng, nhưng các gói tài trợ doanh nghiệp thường tạo ra tác động lớn hơn nhiều đối với tính bền vững của các dự án OSS so với các đóng góp cá nhân, vì vậy bạn sẽ giúp chúng tôi nhiều hơn nếu thành công.

## Quyền lợi theo Gói {#tier-benefits}

- **Nhà tài trợ Đặc biệt Toàn cầu**:
  - Giới hạn **một** nhà tài trợ trên toàn cầu. <span v-if="!data?.special">Hiện đang trống. [Liên hệ](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)!</span><span v-else>(Đã có người chiếm)</span>
  - (Độc quyền) Vị trí logo **trên phần hiển thị đầu tiên** trên trang chủ của [vuejs.org](/).
  - (Độc quyền) Lời kêu gọi đặc biệt và chia sẻ lại thường xuyên các đợt ra mắt sản phẩm lớn thông qua [tài khoản X chính thức của Vue](https://x.com/vuejs) (320k người theo dõi).
  - Vị trí logo nổi bật nhất ở tất cả các vị trí từ các gói dưới.
- **Bạch kim (USD$2,000/tháng)**:
  - Vị trí logo nổi bật trên trang chủ của [vuejs.org](/).
  - Vị trí logo nổi bật trong thanh bên của tất cả các trang nội dung.
  - Vị trí logo nổi bật trong README của [`vuejs/core`](https://github.com/vuejs/core) và [`vuejs/vue`](https://github.com/vuejs/core).
- **Vàng (USD$500/tháng)**:
  - Vị trí logo lớn trên trang chủ của [vuejs.org](/).
  - Vị trí logo lớn trong README của `vuejs/core` và `vuejs/vue`.
- **Bạc (USD$250/tháng)**:
  - Vị trí logo vừa trong tệp `BACKERS.md` của `vuejs/core` và `vuejs/vue`.
- **Đồng (USD$100/tháng)**:
  - Vị trí logo nhỏ trong tệp `BACKERS.md` của `vuejs/core` và `vuejs/vue`.
- **Người hào phóng (USD$50/tháng)**:
  - Tên được liệt kê trong tệp `BACKERS.md` của `vuejs/core` và `vuejs/vue`, ở trên các người đóng góp cá nhân khác.
- **Người đóng góp Cá nhân (USD$5/tháng)**:
  - Tên được liệt kê trong tệp `BACKERS.md` của `vuejs/core` và `vuejs/vue`.

## Nhà tài trợ Hiện tại {#current-sponsors}

### Nhà tài trợ Đặc biệt Toàn cầu {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Bạch kim {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Bạch kim (Trung Quốc) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Vàng {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Bạc {#silver}

<SponsorsGroup tier="silver" placement="page" />

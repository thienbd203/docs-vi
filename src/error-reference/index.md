<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Tham khảo Mã Lỗi Sản Xuất {#error-reference}

## Lỗi Thời gian Chạy {#runtime-errors}

Trong bản build sản xuất, đối số thứ 3 được truyền cho các API xử lý lỗi sau sẽ là một mã ngắn thay vì chuỗi thông tin đầy đủ:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

Bảng sau đây ánh xạ các mã đến chuỗi thông tin đầy đủ gốc của chúng.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Lỗi Trình biên dịch {#compiler-errors}

Bảng sau đây cung cấp ánh xạ từ các mã lỗi trình biên dịch sản xuất đến thông báo gốc của chúng.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />

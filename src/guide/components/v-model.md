# Component v-model {#component-v-model}

<ScrimbaLink href="https://scrimba.com/links/vue-component-v-model" title="Free Vue.js Component v-model Lesson" type="scrimba">
  Xem bài học video tương tác trên Scrimba
</ScrimbaLink>

## Cách sử dụng cơ bản {#basic-usage}

`v-model` có thể được sử dụng trên một component để implement two-way binding.

<div class="composition-api">

Bắt đầu từ Vue 3.4, cách tiếp cận được khuyến nghị để đạt được điều này là sử dụng macro [`defineModel()`](/api/sfc-script-setup#definemodel):

```vue [Child.vue]
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```

Component cha sau đó có thể bind một giá trị với `v-model`:

```vue-html [Parent.vue]
<Child v-model="countModel" />
```

Giá trị được trả về bởi `defineModel()` là một ref. Nó có thể được truy cập và thay đổi như bất kỳ ref nào khác, ngoại trừ việc nó hoạt động như một two-way binding giữa một giá trị của component cha và một giá trị cục bộ:

- Giá trị `.value` của nó được đồng bộ hóa với giá trị được bind bởi `v-model` của component cha;
- Khi nó được thay đổi bởi component con, nó làm cho giá trị được bind của component cha cũng được cập nhật.

Điều này có nghĩa là bạn cũng có thể bind ref này đến một phần tử input gốc với `v-model`, giúp việc wrap các phần tử input gốc trở nên đơn giản trong khi vẫn cung cấp cách sử dụng `v-model` giống nhau:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Try it in the playground](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### Bên dưới bức màn {#under-the-hood}

`defineModel` là một macro tiện lợi. Trình biên dịch mở rộng nó thành các phần sau:

- Một prop tên là `modelValue`, mà giá trị của ref cục bộ được đồng bộ hóa với;
- Một sự kiện tên là `update:modelValue`, được emit khi giá trị của ref cục bộ bị thay đổi.

Đây là cách bạn sẽ implement cùng một component con được hiển thị ở trên trước phiên bản 3.4:

```vue [Child.vue]
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

Sau đó, `v-model="foo"` trong component cha sẽ được biên dịch thành:

```vue-html [Parent.vue]
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

Như bạn có thể thấy, nó dài dòng hơn khá nhiều. Tuy nhiên, việc hiểu những gì đang diễn ra bên dưới là rất hữu ích.

Vì `defineModel` khai báo một prop, bạn có thể do đó khai báo các tùy chọn của prop cơ bản bằng cách truyền nó cho `defineModel`:

```js
// làm cho v-model bắt buộc
const model = defineModel({ required: true })

// cung cấp một giá trị mặc định
const model = defineModel({ default: 0 })
```

:::warning
Nếu bạn có một giá trị `default` cho prop `defineModel` và bạn không cung cấp bất kỳ giá trị nào cho prop này từ component cha, nó có thể gây ra sự mất đồng bộ hóa giữa component cha và component con. Trong ví dụ dưới đây, `myRef` của component cha là undefined, nhưng `model` của component con là 1:

```vue [Child.vue]
<script setup>
const model = defineModel({ default: 1 })
</script>
```

```vue [Parent.vue]
<script setup>
const myRef = ref()
</script>

<template>
  <Child v-model="myRef"></Child>
</template>
```

:::

</div>

<div class="options-api">

Đầu tiên hãy xem lại cách `v-model` được sử dụng trên một phần tử gốc:

```vue-html
<input v-model="searchText" />
```

Bên dưới, trình biên dịch template mở rộng `v-model` thành một dạng tương đương dài dòng hơn cho chúng ta. Vì vậy, đoạn code trên làm điều giống như sau:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Khi được sử dụng trên một component, `v-model` thay vào đó mở rộng thành:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

Để điều này thực sự hoạt động, component `<CustomInput>` phải làm hai việc:

1. Bind thuộc tính `value` của một phần tử `<input>` gốc đến prop `modelValue`
2. Khi một event `input` gốc được kích hoạt, emit một event tùy chỉnh `update:modelValue` với giá trị mới

Đây là cách thực hiện:

```vue [CustomInput.vue]
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Bây giờ `v-model` sẽ hoạt động hoàn hảo với component này:

```vue-html
<CustomInput v-model="searchText" />
```

[Try it in the Playground](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

Một cách khác để implement `v-model` trong component này là sử dụng một thuộc tính `computed` có thể ghi với cả getter và setter. Phương thức `get` nên trả về thuộc tính `modelValue` và phương thức `set` nên emit event tương ứng:

```vue [CustomInput.vue]
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## Tham số `v-model` {#v-model-arguments}

`v-model` trên một component cũng có thể chấp nhận một tham số:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

Trong component con, chúng ta có thể hỗ trợ tham số tương ứng bằng cách truyền một chuỗi vào `defineModel()` làm đối số đầu tiên:

```vue [MyComponent.vue]
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqFklFPwjAUhf9K05dhgiyGNzJI1PCgCWqUx77McQeFrW3aOxxZ9t+9LTAXA/q2nnN6+t12Db83ZrSvgE944jIrDTIHWJmZULI02iJrmIWctSy3umQRRaPOWhweNX0pUHiyR3FP870UZkyoTCuH7FPr3VJiAWzqSwfR/rbUKyhYatdV6VugTktTQHQjVBIfeYiEFgikpwi0YizZ3M2aplfXtklMWvD6UKf+CfrUVPBuh+AspngSd718yH+hX7iS4xihjUZYQS4VLPwJgyiI/3FLZSrafzAeBqFG4jgxeuEqGTo6OZfr0dZpRVxNuFWeEa4swL4alEQm+IQFx3tpUeiv56ChrWB41rMNZLsL+tbVXhP8zYIDuyeQzkN6HyBWb88/XgJ3ZxJ95bH/MN/B6aLyjMfYQ6VWhN3LBdqn8FdJtV66eY2g3HkoD+qTbcgLTo/jX+ra6D+449E47BOq5e039mr+gA==)

Nếu cũng cần các tùy chọn prop, chúng nên được truyền sau tên model:

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>Cách sử dụng trước 3.4</summary>

```vue [MyComponent.vue]
<script setup>
defineProps({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

Trong trường hợp này, thay vì prop `modelValue` mặc định và sự kiện `update:modelValue`, component con nên mong đợi một prop `title` và emit một sự kiện `update:title` để cập nhật giá trị của component cha:

```vue [MyComponent.vue]
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## Nhiều ràng buộc `v-model` {#multiple-v-model-bindings}

Bằng cách tận dụng khả năng nhắm đến một prop và sự kiện cụ thể như chúng ta đã học trước đó với [tham số `v-model`](#v-model-arguments), chúng ta giờ có thể tạo nhiều ràng buộc `v-model` trên một instance component duy nhất.

Mỗi `v-model` sẽ đồng bộ với một prop khác nhau, mà không cần các tùy chọn bổ sung trong component:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>Cách sử dụng trước 3.4</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## Xử lý Modifier `v-model` {#handling-v-model-modifiers}

Khi chúng ta học về ràng buộc input form, chúng ta đã thấy rằng `v-model` có [các modifier tích hợp sẵn](/guide/essentials/forms#modifiers) - `.trim`, `.number` và `.lazy`. Trong một số trường hợp, bạn cũng có thể muốn `v-model` trên component input tùy chỉnh của mình hỗ trợ các modifier tùy chỉnh.

Hãy tạo một ví dụ modifier tùy chỉnh, `capitalize`, viết hoa chữ cái đầu tiên của chuỗi được cung cấp bởi ràng buộc `v-model`:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

Các modifier được thêm vào `v-model` của component có thể được truy cập trong component con bằng cách destructure giá trị trả về của `defineModel()` như sau:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

Để điều chỉnh có điều kiện cách giá trị nên được đọc / ghi dựa trên các modifier, chúng ta có thể truyền các tùy chọn `get` và `set` cho `defineModel()`. Hai tùy chọn này nhận giá trị khi get / set của model ref và nên trả về một giá trị đã được chuyển đổi. Đây là cách chúng ta có thể sử dụng tùy chọn `set` để triển khai modifier `capitalize`:

```vue{4-6}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WRIkKksa5N9LybFrFG1OkvgeyccnHsWNc+UuoliIZai9cgQBKbpP0qjWWU9wBI8NnKDxtoUJUycDdH+4tXwzaOgMl/NRLNVlMoA0tTWBoD2scE9wnSoWk8lUmuW8a8rt+EHYOl0R8gtgtVUBlHGRoK6cokqrRwxAW4RGea6mkQg9HGwEboZ+kbKWY027961doy6f86+l6ERIAXNus5wPPcVMvNB+yZOaiZFw/cKYftI/ufEM+FCNQh/+8tRrbJTB+4QUxySWqxa7SkecQn4DqAaKIWekeyAAe0fRG8h5Zb2t/A0VH6Yl2d/Oob+tAhZTeHfGg1Y1Fh/Z6ZR66o5xhRTh8OnyXyy7f6CDSw5S59/Z3WRpOl91lAL70ahN+RCsYT/zFFIk95RG/92RYr+kWPTzSVFpbf9/zTHyEWd9vN5i/e+V+EPYp5gUPzwG9DuUYsCo8htkrQm++/Ut6x5AVh01sy+APzFYHZPGjvY5mjXLHvGy2i95K5TZrMLdntCEfqgkNDuc+VLwkqQNe2v0Z7lX5VX/M+L0BFEuPdc=)

<details>
<summary>Cách sử dụng trước 3.4</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="props.modelValue" @input="emitValue" />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

Các modifier được thêm vào `v-model` của component sẽ được cung cấp cho component thông qua prop `modelModifiers`. Trong ví dụ dưới đây, chúng ta đã tạo một component chứa prop `modelModifiers` mặc định là một object rỗng:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Lưu ý rằng prop `modelModifiers` của component chứa `capitalize` và giá trị của nó là `true` - do nó được đặt trên ràng buộc `v-model.capitalize="myText"`.

Bây giờ khi chúng ta đã thiết lập prop, chúng ta có thể kiểm tra các key của object `modelModifiers` và viết một handler để thay đổi giá trị được emit. Trong đoạn mã dưới đây, chúng ta sẽ viết hoa chuỗi bất cứ khi nào phần tử `<input />` kích hoạt một sự kiện `input`.

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### Modifier cho `v-model` với Đối số {#modifiers-for-v-model-with-arguments}

<div class="options-api">

Đối với các ràng buộc `v-model` có cả đối số và modifier, tên prop được tạo sẽ là `arg + "Modifiers"`. Ví dụ:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

Các khai báo tương ứng nên là:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

Dưới đây là một ví dụ khác về việc sử dụng các modifier với nhiều `v-model` có các đối số khác nhau:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

<details>
<summary>Cách sử dụng trước 3.4</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
  firstName: String,
  lastName: String,
  firstNameModifiers: { default: () => ({}) },
  lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true }
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true }
  }
}
</script>
```

</div>

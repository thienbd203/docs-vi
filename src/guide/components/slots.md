# Slots {#slots}

> Trang này giả định rằng bạn đã đọc [Kiến thức cơ bản về Component](/guide/essentials/component-basics). Hãy đọc nó trước nếu bạn mới làm quen với component.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="Free Vue.js Slots Lesson"/>

## Slot Content và Outlet {#slot-content-and-outlet}

Chúng ta đã học rằng component có thể chấp nhận props, có thể là các giá trị JavaScript của bất kỳ kiểu nào. Nhưng còn nội dung template thì sao? Trong một số trường hợp, chúng ta có thể muốn truyền một fragment template cho một component con, và để component con render fragment đó trong template của chính nó.

Ví dụ, chúng ta có thể có một component `<FancyButton>` hỗ trợ cách sử dụng như sau:

```vue-html{2}
<FancyButton>
  Click me! <!-- slot content -->
</FancyButton>
```

Template của `<FancyButton>` trông như sau:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- slot outlet -->
</button>
```

Phần tử `<slot>` là một **slot outlet** cho biết nơi **slot content** được cung cấp bởi component cha nên được render.

![slot diagram](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

Và DOM được render cuối cùng:

```html
<button class="fancy-btn">Click me!</button>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

Với slots, `<FancyButton>` chịu trách nhiệm render `<button>` bên ngoài (và styling đẹp của nó), trong khi nội dung bên trong được cung cấp bởi component cha.

Một cách khác để hiểu slots là so sánh chúng với các hàm JavaScript:

```js
// component cha truyền slot content
FancyButton('Click me!')

// FancyButton render slot content trong template của chính nó
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

Slot content không chỉ giới hạn ở văn bản. Nó có thể là bất kỳ nội dung template hợp lệ nào. Ví dụ, chúng ta có thể truyền nhiều phần tử, hoặc thậm chí các component khác:

```vue-html
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

Bằng cách sử dụng slots, `<FancyButton>` của chúng ta trở nên linh hoạt và có thể tái sử dụng hơn. Chúng ta giờ có thể sử dụng nó ở những nơi khác nhau với nội dung bên trong khác nhau, nhưng tất cả đều có cùng styling đẹp.

Cơ chế slot của Vue component được lấy cảm hứng từ [phần tử `<slot>` của Web Component gốc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), nhưng với các khả năng bổ sung mà chúng ta sẽ thấy sau.

## Render Scope {#render-scope}

Slot content có quyền truy cập vào scope dữ liệu của component cha, vì nó được định nghĩa trong component cha. Ví dụ:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Ở đây cả hai nội suy <span v-pre>`{{ message }}`</span> sẽ render cùng một nội dung.

Slot content **không** có quyền truy cập vào dữ liệu của component con. Các biểu thức trong template Vue chỉ có thể truy cập scope mà nó được định nghĩa, phù hợp với lexical scoping của JavaScript. Nói cách khác:

> Các biểu thức trong template cha chỉ có quyền truy cập scope cha; các biểu thức trong template con chỉ có quyền truy cập scope con.

## Fallback Content {#fallback-content}

Có những trường hợp khi hữu ích để chỉ định nội dung fallback (tức là mặc định) cho một slot, để được render chỉ khi không có nội dung nào được cung cấp. Ví dụ, trong một component `<SubmitButton>`:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

Chúng ta có thể muốn văn bản "Submit" được render bên trong `<button>` nếu component cha không cung cấp bất kỳ slot content nào. Để làm cho "Submit" trở thành fallback content, chúng ta có thể đặt nó giữa các thẻ `<slot>`:

```vue-html{3}
<button type="submit">
  <slot>
    Submit <!-- fallback content -->
  </slot>
</button>
```

Bây giờ khi chúng ta sử dụng `<SubmitButton>` trong một component cha, không cung cấp nội dung cho slot:

```vue-html
<SubmitButton />
```

Điều này sẽ render nội dung fallback, "Submit":

```html
<button type="submit">Submit</button>
```

Nhưng nếu chúng ta cung cấp nội dung:

```vue-html
<SubmitButton>Save</SubmitButton>
```

Sau đó nội dung được cung cấp sẽ được render thay thế:

```html
<button type="submit">Save</button>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## Slots Được Đặt Tên {#named-slots}

Có những lúc khi hữu ích để có nhiều slot outlet trong một component đơn lẻ. Ví dụ, trong một component `<BaseLayout>` với template sau:

```vue-html
<div class="container">
  <header>
    <!-- Chúng ta muốn nội dung header ở đây -->
  </header>
  <main>
    <!-- Chúng ta muốn nội dung main ở đây -->
  </main>
  <footer>
    <!-- Chúng ta muốn nội dung footer ở đây -->
  </footer>
</div>
```

Đối với các trường hợp này, phần tử `<slot>` có một thuộc tính đặc biệt, `name`, có thể được sử dụng để gán một ID duy nhất cho các slot khác nhau để bạn có thể xác định nơi nội dung nên được render:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Một slot outlet `<slot>` không có `name` ngầm định có tên "default".

Trong một component cha sử dụng `<BaseLayout>`, chúng ta cần một cách để truyền nhiều fragment nội dung slot, mỗi cái nhắm đến một slot outlet khác nhau. Đây là nơi **slots được đặt tên** phát huy tác dụng.

Để truyền một slot được đặt tên, chúng ta cần sử dụng một phần tử `<template>` với directive `v-slot`, và sau đó truyền tên của slot làm đối số cho `v-slot`:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- nội dung cho slot header -->
  </template>
</BaseLayout>
```

`v-slot` có một viết tắt chuyên dụng `#`, vì vậy `<template v-slot:header>` có thể được rút ngắn thành chỉ `<template #header>`. Hãy nghĩ về nó như "render fragment template này trong slot 'header' của component con".

![named slots diagram](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

Đây là mã truyền nội dung cho cả ba slot đến `<BaseLayout>` sử dụng cú pháp viết tắt:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

Khi một component chấp nhận cả slot mặc định và slots được đặt tên, tất cả các nút cấp cao nhất không phải `<template>` được ngầm định xử lý như nội dung cho slot mặc định. Vì vậy đoạn trên cũng có thể được viết như:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- slot mặc định ngầm định -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

Bây giờ mọi thứ bên trong các phần tử `<template>` sẽ được truyền đến các slot tương ứng. HTML cuối cùng được render sẽ là:

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

Một lần nữa, nó có thể giúp bạn hiểu slots được đặt tên tốt hơn bằng cách sử dụng tương tự hàm JavaScript:

```js
// truyền nhiều fragment slot với tên khác nhau
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> render chúng ở những nơi khác nhau
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Slots Điều Kiện {#conditional-slots}

Đôi khi bạn muốn render một cái gì đó dựa trên việc nội dung có được truyền cho một slot hay không.

Bạn có thể sử dụng thuộc tính [$slots](/api/component-instance.html#slots) kết hợp với [v-if](/guide/essentials/conditional.html#v-if) để đạt được điều này.

Trong ví dụ dưới đây chúng ta định nghĩa một component Card với ba slots điều kiện: `header`, `footer` và slot `default`.
Khi nội dung cho header / footer / default có mặt, chúng ta muốn bọc nó để cung cấp styling bổ sung:

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## Dynamic Slot Names {#dynamic-slot-names}

[Dynamic directive arguments](/guide/essentials/template-syntax.md#dynamic-arguments) also work on `v-slot`, allowing the definition of dynamic slot names:

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- with shorthand -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Lưu ý rằng biểu thức chịu các [ràng buộc cú pháp](/guide/essentials/template-syntax.md#dynamic-argument-syntax-constraints) của đối số directive động.

## Scoped Slots {#scoped-slots}

Như đã thảo luận trong [Render Scope](#render-scope), nội dung slot không có quyền truy cập state trong component con.

Tuy nhiên, có những trường hợp khi hữu ích nếu nội dung của một slot có thể sử dụng dữ liệu từ cả scope cha và scope con. Để đạt được điều đó, chúng ta cần một cách để component con truyền dữ liệu cho một slot khi render nó.

Thực tế, chúng ta có thể làm chính xác điều đó - chúng ta có thể truyền thuộc tính cho một slot outlet giống như truyền props cho một component:

```vue-html
<!-- template <MyComponent> -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Nhận props slot hơi khác nhau khi sử dụng một slot mặc định đơn lẻ so với sử dụng slots được đặt tên. Chúng ta sẽ chỉ ra cách nhận props sử dụng một slot mặc định đơn lẻ trước, bằng cách sử dụng `v-slot` trực tiếp trên thẻ component con:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![scoped slots diagram](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

Các props được truyền cho slot bởi component con có sẵn như giá trị của directive `v-slot` tương ứng, có thể được truy cập bởi các biểu thức bên trong slot.

Bạn có thể nghĩ về một scoped slot như một hàm được truyền vào component con. Component con sau đó gọi nó, truyền props làm đối số:

```js
MyComponent({
  // truyền slot mặc định, nhưng như một hàm
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // gọi hàm slot với props!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

Thực tế, điều này rất gần với cách scoped slots được biên dịch, và cách bạn sẽ sử dụng scoped slots trong [render functions](/guide/extras/render-function) thủ công.

Lưu ý cách `v-slot="slotProps"` khớp với chữ ký hàm slot. Giống như với đối số hàm, chúng ta có thể sử dụng destructuring trong `v-slot`:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Scoped Slots Được Đặt Tên {#named-scoped-slots}

Scoped slots được đặt tên hoạt động tương tự - props slot có sẵn như giá trị của directive `v-slot`: `v-slot:name="slotProps"`. Khi sử dụng viết tắt, nó trông như thế này:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Truyền props cho một slot được đặt tên:

```vue-html
<slot name="header" message="hello"></slot>
```

Lưu ý rằng `name` của một slot sẽ không được bao gồm trong props vì nó được dành riêng - vì vậy `headerProps` kết quả sẽ là `{ message: 'hello' }`.

Nếu bạn đang trộn slots được đặt tên với slot mặc định scoped, bạn cần sử dụng một thẻ `<template>` rõ ràng cho slot mặc định. Cố gắng đặt directive `v-slot` trực tiếp trên component sẽ dẫn đến lỗi biên dịch. Điều này là để tránh bất kỳ sự mơ hồ nào về scope của props của slot mặc định. Ví dụ:

```vue-html
<!-- <MyComponent> template -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>
```

```vue-html
<!-- This template won't compile -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- message belongs to the default slot, and is not available here -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

Using an explicit `<template>` tag for the default slot helps to make it clear that the `message` prop is not available inside the other slot:

```vue-html
<MyComponent>
  <!-- Use explicit default slot -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</MyComponent>
```

### Fancy List Example {#fancy-list-example}

You may be wondering what would be a good use case for scoped slots. Here's an example: imagine a `<FancyList>` component that renders a list of items - it may encapsulate the logic for loading remote data, using the data to display a list, or even advanced features like pagination or infinite scrolling. However, we want it to be flexible with how each item looks and leave the styling of each item to the parent component consuming it. So the desired usage may look like this:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

Bên trong `<FancyList>`, chúng ta có thể render cùng một `<slot>` nhiều lần với dữ liệu item khác nhau (lưu ý chúng ta đang sử dụng `v-bind` để truyền một object như props slot):

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### Renderless Components {#renderless-components}

Trường hợp sử dụng `<FancyList>` chúng ta thảo luận ở trên đóng gói cả logic có thể tái sử dụng (fetching dữ liệu, phân trang v.v.) và output hình ảnh, trong khi ủy quyền một phần output hình ảnh cho component tiêu thụ thông qua scoped slots.

Nếu chúng ta đẩy khái niệm này xa hơn một chút, chúng ta có thể nghĩ ra các component chỉ đóng gói logic và không render bất kỳ cái gì bởi chính chúng - output hình ảnh được ủy quyền hoàn toàn cho component tiêu thụ với scoped slots. Chúng ta gọi loại component này là **Renderless Component**.

Một ví dụ về renderless component có thể là một component đóng gói logic theo dõi vị trí chuột hiện tại:

```vue-html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

Mặc dù là một pattern thú vị, hầu hết những gì có thể đạt được với Renderless Components có thể đạt được theo cách hiệu quả hơn với Composition API, mà không phải chịu chi phí của việc lồng component bổ sung. Sau này, chúng ta sẽ thấy cách chúng ta có thể implement cùng chức năng theo dõi chuột như một [Composable](/guide/reusability/composables).

Nói như vậy, scoped slots vẫn hữu ích trong các trường hợp khi chúng ta cần cả đóng gói logic **và** compose output hình ảnh, như trong ví dụ `<FancyList>`.

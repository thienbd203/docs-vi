# Props {#props}

Một component con có thể chấp nhận đầu vào từ component cha thông qua **props**. Đầu tiên, nó cần khai báo các props nó chấp nhận:

<div class="composition-api">
<div class="sfc">

```vue [ChildComp.vue]
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Lưu ý `defineProps()` là một compile-time macro và không cần được import. Sau khi khai báo, prop `msg` có thể được sử dụng trong template của component con. Nó cũng có thể được truy cập trong JavaScript thông qua đối tượng được trả về của `defineProps()`.

</div>

<div class="html">

```js
// trong component con
export default {
  props: {
    msg: String
  },
  setup(props) {
    // truy cập props.msg
  }
}
```

Sau khi khai báo, prop `msg` được expose trên `this` và có thể được sử dụng trong template của component con. Các props nhận được được truyền vào `setup()` làm đối số đầu tiên.

</div>

</div>

<div class="options-api">

```js
// trong component con
export default {
  props: {
    msg: String
  }
}
```

Sau khi khai báo, prop `msg` được expose trên `this` và có thể được sử dụng trong template của component con.

</div>

Component cha có thể truyền prop cho component con giống như các thuộc tính. Để truyền một giá trị động, chúng ta cũng có thể sử dụng cú pháp `v-bind`:

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

Bây giờ hãy thử tự làm trong editor.

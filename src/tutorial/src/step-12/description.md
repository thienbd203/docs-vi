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
// in child component
export default {
  props: {
    msg: String
  },
  setup(props) {
    // access props.msg
  }
}
```

Once declared, the `msg` prop is exposed on `this` and can be used in the child component's template. The received props are passed to `setup()` as the first argument.

</div>

</div>

<div class="options-api">

```js
// in child component
export default {
  props: {
    msg: String
  }
}
```

Once declared, the `msg` prop is exposed on `this` and can be used in the child component's template.

</div>

The parent can pass the prop to the child just like attributes. To pass a dynamic value, we can also use the `v-bind` syntax:

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

Now try it yourself in the editor.

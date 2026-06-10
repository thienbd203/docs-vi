# Emits {#emits}

Ngoài việc nhận props, một component con cũng có thể emit sự kiện cho component cha:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// khai báo các sự kiện được emit
const emit = defineEmits(['response'])

// emit với đối số
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // khai báo các sự kiện được emit
  emits: ['response'],
  setup(props, { emit }) {
    // emit với đối số
    emit('response', 'hello from child')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // khai báo các sự kiện được emit
  emits: ['response'],
  created() {
    // emit với đối số
    this.$emit('response', 'hello from child')
  }
}
```

</div>

Đối số đầu tiên của <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> là tên sự kiện. Bất kỳ đối số bổ sung nào đều được chuyển tiếp cho event listener.

Component cha có thể lắng nghe các sự kiện được emit từ component con bằng cách sử dụng `v-on` - ở đây handler nhận đối số bổ sung từ lệnh emit của component con và gán nó cho local state:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Bây giờ hãy thử tự làm trong editor.

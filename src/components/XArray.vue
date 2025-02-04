<script setup>
import { computed, ref, nextTick } from 'vue';
//const props = defineProps(['modelValue'])
const props = defineProps({
  arrayOfStrings: {
    type: Array,
    required: true,
    default: () => [],
  },
});
const emit = defineEmits(['update:arrayOfStrings']);
const newString = ref('');
const inputListRef = ref(null);

const updateArray = (string, index) => {
  const updatedArray =
    string === ''
      ? props.arrayOfStrings.toSpliced(index, 1)
      : props.arrayOfStrings.toSpliced(index, 1, string);

  emit('update:arrayOfStrings', updatedArray);
};

const addNew = async (string) => {
  if (string === '') {
    return;
  }
  emit('update:arrayOfStrings', [...props.arrayOfStrings, string]);
  newString.value = '';
  await nextTick();
  const inputList = inputListRef.value.getElementsByTagName('input');
  inputList[inputList.length - 2].focus();
};
</script>

<template>
  <div>
    <ul ref="inputListRef">
      <li v-for="(string, index) in props.arrayOfStrings" :key="index">
        <label :for="index"> [{{ index }}] </label>
        <input
          type="text"
          :name="index"
          :id="index"
          :value="string"
          @input="($event) => updateArray($event.target.value, index)"
        />
      </li>
      <li key="extra">
        <label for="extra"> + </label>
        <input
          type="text"
          name="extra"
          id="extra"
          v-model.trim="newString"
          @keyup.enter="() => addNew(newString)"
        />
        <div id="add-element-button-wrapper">
          <button @click="() => addNew(newString)">Add element</button>
        </div>
      </li>
    </ul>
    {{ newString }}
  </div>
</template>

<style scoped>
ul {
  font-size: 26px;
  list-style-type: none;
  padding: 0;
}

li {
  display: grid;
  grid-template-columns: 64px 248px;
  place-items: center stretch;
  padding-right: 32px;
}

li:not(:first-of-type) {
  margin-top: 12px;
}

li:last-of-type {
  margin-top: 32px;
  background-color: #ffccea;
  border-radius: 8px;
  padding-block: 16px;
}

input {
  font-size: 20px;
  padding: 8px 12px;
}

label {
  font-weight: bold;
  display: inline;
}
#add-element-button-wrapper {
  grid-column: 2 / 3;
  place-self: stretch;
}
button {
  width: 100%;
  font-size: 20px;
  margin-top: 8px;
  border: 1px solid #222;
}
</style>

<script setup>
import XArray from './components/XArray.vue';
import { ref } from 'vue';

const myArray = ref(['one', 'two']);

// My instinct was to let <XArray> simply emit {event.target.value, index} and update state here, but I couldn't get it to work. For some reason it always overwrote the whole of myArray with the payload.
</script>

<template>
  <div>
    <XArray v-model:arrayOfStrings="myArray" />
    <pre>{{ myArray }}</pre>
  </div>
</template>

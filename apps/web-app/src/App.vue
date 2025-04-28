<script setup lang="ts">
import { MyComp, MyCustomBtn } from "@monorepo/ui-library"
</script>

<template>
  <div>
    <MyComp class="ma-4" />
    <v-btn class="ma-4" color="primary">btn from app</v-btn>
    <MyCustomBtn class="ma-4" />
  </div>
</template>

<style scoped></style>

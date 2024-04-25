<script setup>

const { data:articleList } = await useAsyncData('allArticles', () => $fetch('/api/articles'))

// Doesn't seem to work???
// const filteredList = articleList.filter(article => article.sectionCategory === "Highlights")


</script>
<template>
  <pre>{{ articleList }}</pre>
</template>

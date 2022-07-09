<template>
  <p>{{ type }}</p>
</template>

<script>
export default {
  name: "ContentList",
  async asyncData({ params, $axios }) {
    return {
      type: params.type,
    };
  },
};
</script>

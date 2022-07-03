<template>
  <Card :title="image.data.name">
    <div slot="content">
      <b-image :src="image.thumbnail" :alt="image.data.alt"></b-image>
      <slot />
    </div>
  </Card>
</template>

<script>
import Card from "../Card.vue";

export default {
  props: ["image"],
  name: "ImageCard",
  components: { Card },
};
</script>
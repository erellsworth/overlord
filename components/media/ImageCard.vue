<template>
  <Card :title="image.data.name">
    <b-image
      :src="image.thumbnail"
      :alt="image.data.alt"
      slot="content"
    ></b-image>

    <slot slot="footer" />
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
<template>
  <section class="section">
    <MediaLibrary :hideSelect="true" />
  </section>
</template>

<script>
import MediaLibrary from "../components/media/MediaLibrary.vue";

export default {
  name: "MediaPage",
  components: {
    MediaLibrary,
  },
};
</script>

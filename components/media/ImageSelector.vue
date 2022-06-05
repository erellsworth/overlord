<template>
  <section>
    <h4 class="subtitle" v-if="title">{{ title }}</h4>

    <div class="columns is-multiline">
      <ImageCard
        v-for="image in images"
        :key="image.data.id"
        class="is-half"
        :image="image"
      >
        <div class="buttons">
          <b-button
            type="is-primary is-light"
            icon-right="file-swap"
            @click="showLibrary = true"
          >
            Replace
          </b-button>

          <b-button
            type="is-primary is-light"
            icon-right="delete"
            @click="$emit('onRemove', image)"
          >
            Remove
          </b-button>
        </div>
      </ImageCard>

      <b-modal
        v-model="showLibrary"
        has-modal-card
        full-screen
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Example Modal"
        close-button-aria-label="Close"
        aria-modal
      >
        <MediaLibrary @onSelect="onSelect" />
      </b-modal>
    </div>
  </section>
</template>

<script>
import ImageCard from "../media/ImageCard.vue";
import MediaLibrary from "./MediaLibrary.vue";

export default {
  props: ["images", "limit", "title"],
  name: "ImageSelector",
  data() {
    return {
      showLibrary: false,
    };
  },
  methods: {
    onSelect(image) {
      this.$emit("onSelect", image);
      this.showLibrary = false;
    },
  },
  components: { ImageCard, MediaLibrary },
};
</script>
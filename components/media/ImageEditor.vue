<template>
  <div class="box">
    <b-tabs v-model="activeTab" @input="tabChanged" v-if="image.isNew">
      <b-tab-item
        v-for="(size, index) in sizes"
        :label="size.label"
        :key="size.label"
      >
        <ImageCropper
          :src="image.full"
          :size="size"
          :isActive="cropperHasLoaded(index)"
          @onChange="cropUpdated"
        />
      </b-tab-item>
    </b-tabs>

    <div class="box">
      <h3 class="title">{{ image.data.filename }}</h3>
      <b-field label="Name">
        <b-input v-model="image.data.name"></b-input>
      </b-field>
      <b-field label="Default Alt text">
        <b-input v-model="image.data.alt"></b-input>
      </b-field>
      <b-button type="is-primary" label="Save" @click="saveChanges()" />
    </div>
  </div>
</template>

<script>
import ImageCropper from "./ImageCropper.vue";

export default {
  name: "ImageEditor",
  props: ["media"],
  data() {
    return {
      image: this.media,
      activeTab: 0,
      loadedCroppers: [0],
      sizes: [
        {
          label: "Thumbnail",
          key: "thumb",
          stencil: {
            aspectRatio: 16 / 9,
          },
        },
        {
          label: "Full Size",
          key: "full",
        },
      ],
    };
  },
  watch: {
    media(media) {
      this.image = media;
    },
  },
  methods: {
    tabChanged(tab) {
      if (this.loadedCroppers.includes(tab)) {
        return;
      }
      this.loadedCroppers.push(tab);
    },
    cropperHasLoaded(index) {
      return this.loadedCroppers.includes(index);
    },
    cropUpdated(coordinates, key) {
      if (!this.image.crops) {
        this.image.crops = {};
      }
      this.image.crops[key] = coordinates;
    },
    saveChanges() {
      this.$emit("onSave", this.image);
    },
  },
  components: { ImageCropper },
};
</script>
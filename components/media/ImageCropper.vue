<template>
  <div v-if="src && size && isActive">
    <cropper
      ref="cropper"
      class="cropper"
      v-if="size.stencil"
      :stencil-props="size.stencil"
      :src="src"
      @change="cropChanged"
    />
    <cropper
      ref="cropper"
      class="cropper"
      v-else
      :src="src"
      @change="cropChanged"
      :default-size="defaultSize"
    />
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "ImageCropper",
  props: ["size", "src", "isActive"],
  methods: {
    cropChanged({ coordinates }) {
      this.$emit("onChange", coordinates, this.size.key);
    },
    defaultSize({ imageSize, visibleArea }) {
      return {
        width: (visibleArea || imageSize).width,
        height: (visibleArea || imageSize).height,
      };
    },
  },
  components: { Cropper },
};
</script>
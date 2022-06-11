<template>
  <div class="columns is-centered">
    <div
      class="
        content
        dynamic-content
        column
        is-two-thirds is-medium
        has-text-primary-light
      "
    >
      <b-field label="Title">
        <b-input v-model="contentInfo.title"></b-input>
      </b-field>

      <b-field label="Slug">
        <b-input v-model="contentInfo.slug"></b-input>
      </b-field>

      <TipTap
        v-if="content"
        :action="action"
        :content="content"
        :contentType="contentInfo.type"
        @onUpdate="onUpdate"
      />

      <b-field label="Description">
        <b-input
          v-model="contentInfo.seo.description"
          type="textarea"
        ></b-input>
      </b-field>

      <hr />

      <TagSelector
        :taxonomies="contentData.Taxonomies"
        @onSelected="onTagUpdate"
        @onTagAdded="onTagAdded"
      />

      <hr />

      <ImageSelector
        :images="[contentInfo.image]"
        title="Thumbnail"
        @onSelect="onImageSelected($event)"
        @onReplace="onImageSelected($event)"
        @onRemove="onImageRemove($event)"
      />

      <hr />

      <b-button class="is-primary" @click="save()">{{ action }}</b-button>
    </div>
  </div>
</template>

<script>
import TagSelector from "./TagSelector.vue";
import TipTap from "./editor/TipTap.vue";
import ImageSelector from "./media/ImageSelector.vue";

export default {
  name: "ContentForm",
  props: ["contentData", "action"],
  data() {
    return {
      contentInfo: this.contentData,
      content: null,
    };
  },
  mounted() {
    this.content = this.contentInfo.content
      ? this.contentInfo.content
      : this.contentInfo.html;

    if (!this.content) {
      this.content = " ";
    }
  },
  methods: {
    onImageSelected(images) {
      this.contentInfo.images = images;
    },
    onImageRemove(image) {
      console.log("onImageRemove", image);
    },
    onUpdate({ html, json }) {
      this.contentInfo.content = json;
      this.contentInfo.html = html;
    },
    onTagUpdate(tags) {
      this.contentInfo.Taxonomies = tags;
    },
    onTagAdded(tag) {
      if (!this.contentInfo.newTags) {
        this.contentInfo.newTags = [];
      }
      this.contentInfo.newTags.push(tag);
    },
    save() {
      this.$emit("onSave", this.contentInfo);
    },
  },
  components: { TipTap, TagSelector, ImageSelector },
};
</script>
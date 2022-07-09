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
        <b-input v-model="contentInfo.title" required ref="title"></b-input>
      </b-field>

      <b-field label="Slug">
        <b-input v-model="contentInfo.slug"></b-input>
      </b-field>

      <TipTap
        v-if="content"
        :content="content"
        :contentType="contentInfo.type"
        @onUpdate="onUpdate"
      />

      <b-field label="Description">
        <b-input
          v-model="contentInfo.seo.description"
          type="textarea"
          required
          ref="description"
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
      />

      <hr />

      <b-button class="is-primary" @click="save()">{{
        getButtonText
      }}</b-button>
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
  watch: {
    "contentInfo.title"(title) {
      this.contentInfo.slug = this.$helpers.slugify(title);
    },
  },
  computed: {
    getButtonText() {
      if (!this.$helpers) {
        return this.action;
      }
      return this.$helpers.getTitleCase(this.action);
    },
  },
  methods: {
    onImageSelected(images) {
      this.contentInfo.images = images;
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
      const validations = [
        this.$refs.title.checkHtml5Validity(),
        this.$refs.description.checkHtml5Validity(),
      ];

      if (validations.includes(false)) {
        this.$buefy.toast.open({
          type: "is-danger",
          message: "Missing required fields",
        });
      } else {
        this.$emit("onSave", this.contentInfo);
      }
    },
  },
  components: { TipTap, TagSelector, ImageSelector },
};
</script>
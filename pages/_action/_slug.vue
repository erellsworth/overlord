<template>
  <div class="container">
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
        <tiptap
          :action="action"
          :content="content"
          :contentType="contentData.type"
          @onUpdate="onUpdate"
        />
        <hr />
        <TagSelector :taxonomies="contentData.Taxonomies" />
        <hr />

        <ImageSelector
          :images="[contentData.image]"
          limit="1"
          title="Thumbnail"
          @onSelect="onImageSelected($event)"
          @onReplace="onImageSelected($event)"
          @onRemove="onImageRemove($event)"
        />
        <hr />
        <b-button class="is-primary" @click="save()">{{
          getActionName
        }}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import Tiptap from "../../components/editor/TipTap.vue";
import TagSelector from "../../components/TagSelector.vue";
import ImageSelector from "../../components/media/ImageSelector.vue";

const contentData = {
  data: {},
};

export default {
  name: "Content",
  components: {
    Tiptap,
    TagSelector,
    ImageSelector,
  },
  data() {
    return {
      contentData,
    };
  },
  async asyncData({ params, $axios }) {
    let content = "";
    let contentData = {
      type: "post",
      content: null,
      html: "",
    };

    if (params.slug && params.action === "update") {
      const response = await $axios.$get(`api/content/${params.slug}`);
      if (response.success) {
        contentData = response.data;
        content = contentData.content ? contentData.content : contentData.html;
      }
    }

    return {
      contentData,
      action: params.action,
      content,
    };
  },
  computed: {
    getActionName() {
      return this.action.charAt(0).toUpperCase() + this.action.slice(1);
    },
  },
  methods: {
    onImageSelected(image) {
      console.log("onImageSelected", image);
      this.contentData.image = image;
    },
    onImageRemove(image) {
      console.log("onImageRemove", image);
    },
    onUpdate(data) {
      console.log("content update", data);
      contentData.data = data;
    },
    save() {
      console.log("save", contentData);
      //await this.$axios.$post(`api/update/${this.$route.params.slug}`, data);
    },
  },
};
</script>

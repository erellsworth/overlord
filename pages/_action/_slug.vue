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
          :contentType="contentType"
          @onUpdate="onUpdate"
        />
        <hr />
        <TagSelector :taxonomies="taxonomies" />
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

const contentData = {
  data: {},
};

export default {
  name: "Content",
  components: {
    Tiptap,
    TagSelector,
  },
  data() {
    return {
      contentData,
    };
  },
  async asyncData({ params, $axios, error }) {
    let content = "";
    let contentType = "post";
    let taxonomies = [];

    if (params.slug && params.action === "update") {
      const response = await $axios.$get(`api/${params.slug}`);
      if (response.success) {
        content = response.data.html;
        contentType = response.data.type;
        taxonomies = response.data.Taxonomies;
      }
    }

    return {
      action: params.action,
      content,
      taxonomies,
      contentType,
    };
  },
  computed: {
    getActionName() {
      return this.action.charAt(0).toUpperCase() + this.action.slice(1);
    },
  },
  methods: {
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

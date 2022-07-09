<template>
  <section class="section">
    <h3 class="title">Recent content:</h3>
    <div class="buttons">
      <b-button
        size="is-small"
        type="is-primary"
        icon-left="pencil"
        v-for="content in contents"
        :key="content.id"
        tag="router-link"
        :to="`/update/${content.slug}`"
      >
        {{ content.title }}
      </b-button>
    </div>
    <hr />
    <h3 class="title">Create something</h3>
    <ContentForm action="create" :contentData="contentData" @onSave="save" />
  </section>
</template>

<script>
import ContentForm from "../components/ContentForm.vue";

export default {
  name: "HomePage",
  components: {
    ContentForm,
  },
  methods: {
    async save(data) {
      console.log("save data", data);
      const result = await this.$axios.$post("api/content", data);
      console.log("result", result);
    },
  },
  async asyncData({ $axios }) {
    let response = await $axios.$get("api/content");

    let contents = [];
    let contentData = {
      content: "",
      html: "",
      seo: {
        description: "",
      },
      type: "post",
    };

    if (response.success) {
      contents = response.data.contents;
    }

    return { contents, contentData };
  },
};
</script>

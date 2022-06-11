<template>
  <ContentForm
    :action="getActionName"
    :contentData="contentData"
    @onSave="save"
  />
</template>

<script>
import ContentForm from "../../components/ContentForm.vue";

export default {
  name: "Content",
  components: {
    ContentForm,
  },
  async asyncData({ params, $axios }) {
    let contentData = {
      type: "post",
      content: null,
      html: "",
    };

    if (params.slug && params.action === "update") {
      const response = await $axios.$get(`api/content/${params.slug}`);
      if (response.success) {
        contentData = response.data;
      }
    }

    return {
      contentData,
      action: params.action,
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
    onTagUpdate(tags) {
      console.log("onTagUpdate", tags);
    },
    onTagAdded(tag) {
      console.log("onTagAdded", tag);
    },
    save(newData) {
      console.log("content save", newData);
      //await this.$axios.$post(`api/update/${this.$route.params.slug}`, data);
    },
  },
};
</script>

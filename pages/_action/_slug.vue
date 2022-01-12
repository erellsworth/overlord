<template>
  <div class="container">
    <tiptap :action="action" :content="content" :contentType="contentType" />
  </div>
</template>

<script>
import Tiptap from "../../components/editor/TipTap.vue";

export default {
  name: "Content",
  components: {
    Tiptap,
  },
  async asyncData({ params, $axios, error }) {
    console.log("params", params);

    let content = "";
    let contentType = "post";

    if (params.slug && params.action === "update") {
      const response = await $axios.$get(`api/${params.slug}`);
      if (response.success) {
        content = response.data.html;
        contentType = response.data.type;
      }
    }

    return {
      action: params.action,
      content,
      contentType,
    };
  },
};
</script>

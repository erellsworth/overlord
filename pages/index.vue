<template>
  <section class="section">
    <ul>
      <li v-for="content in contents" :key="content.id">
        {{ content.title }}
      </li>
    </ul>
    <tiptap />
  </section>
</template>

<script>
import Tiptap from "../components/editor/TipTap.vue";

export default {
  name: "HomePage",
  components: {
    Tiptap,
  },
  async asyncData({ $axios }) {
    let response = await $axios.$get("api");

    let data = {
      contents: [],
    };

    if (response.success) {
      data.contents = response.data.contents;
    }

    return data;
  },
};
</script>

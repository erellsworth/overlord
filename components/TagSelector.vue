<template>
  <b-field label="Add some taxonomies">
    <b-taginput
      v-model="tags"
      ellipsis
      icon="label"
      placeholder="Add a tag"
      aria-close-label="Delete this tag"
    >
    </b-taginput>
  </b-field>
</template>

<script>
export default {
  name: "TagSelector",
  props: ["taxonomies"],
  data() {
    return {
      tags: this.taxonomies.map((tax) => tax.name),
    };
  },
  computed: {
    getTags() {
      if (this.taxonomies) {
        return this.taxonomies.map((tax) => tax.slug);
      }
      return [];
    },
  },
};
</script>

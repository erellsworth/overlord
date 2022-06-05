<template>
  <b-field label="Add some taxonomies">
    <b-taginput
      v-model="tags"
      :data="selectableTags"
      ellipsis
      autocomplete
      :allow-new="true"
      icon="label"
      placeholder="Add a tag"
      aria-close-label="Delete this tag"
      @typing="filterTags"
      @input="tagsUpdated"
      @add="tagAdded"
    >
    </b-taginput>
  </b-field>
</template>

<script>
export default {
  name: "TagSelector",
  props: ["taxonomies"],
  data() {
    let tags = [];

    if (this.taxonomies) {
      tags = this.taxonomies.map((tax) => tax.name);
    }

    return {
      tags,
      existingTags: [],
      selectableTags: [],
    };
  },
  async mounted() {
    const tags = await this.$axios.$get(`api/tags`);
    this.existingTags = tags.data;
    this.selectableTags = tags.data.map((tag) => tag.name);
  },
  methods: {
    tagsUpdated(tags) {
      const selected = tags.map((tag) => {
        return this.existingTags.find((t) => t.name === tag);
      });
      this.$emit("onSelected", selected);
    },
    tagAdded(tag) {
      this.$emit("onTagAdded", tag);
    },
    filterTags(tagName) {
      this.selectableTags = this.existingTags
        .filter((tag) => {
          return tag.name.toLowerCase().indexOf(tagName.toLowerCase()) >= 0;
        })
        .map((tag) => tag.name);
    },
  },
};
</script>

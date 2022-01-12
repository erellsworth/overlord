<template>
  <section>
    <label>Content type:</label>
    <b-field>
      <b-radio-button
        v-for="contentType in contentTypes"
        :key="contentType.slug"
        v-model="currentType"
        :native-value="contentType.slug"
      >
        <span @click="typeChanged()">{{ contentType.label }}</span>
      </b-radio-button>
    </b-field>
    <hr />
  </section>
</template>

<script>
export default {
  name: "TypeSelector",
  props: ["selectedType"],
  methods: {
    typeChanged() {
      this.$emit("onTypeChanged", this.currentType);
    },
  },
  data() {
    return {
      currentType: this.selectedType,
      contentTypes: [
        {
          slug: "post",
          label: "Post",
        },
        {
          slug: "page",
          label: "Page",
        },
      ],
    };
  },
};
</script>

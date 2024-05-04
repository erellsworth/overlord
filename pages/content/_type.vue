<template>
  <div>
  <b-table
    :data="contents"
    :columns="columns"
    :current-page.sync="currentPage"
    :paginated="true"
    :per-page="10"
    @select="rowSelected"
  ></b-table>
</div>
</template>

<script>
export default {
  name: "ContentList",
  methods: {
    rowSelected(row) {
      this.$router.push(`update/${row.slug}`)
    }
  },
  async asyncData({ params, $axios }) {
    let url = "api/contents/";

    if (params.type) {
      url += params.type;
    }

    const response = await $axios.$get(url);

    const { contents } = response.data;
    return {
      contents,
      currentPage: 1,
      columns: [
        {
          field: "id",
          label: "ID",
          width: "40",
          numeric: true,
          sortable: true,
        },
        {
          field: "title",
          label: "Title",
          sortable: true,
          searchable: true,
        },
      ],
    };
  },
};
</script>

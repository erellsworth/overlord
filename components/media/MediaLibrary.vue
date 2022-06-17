<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-dark">Media Library</p>
    </header>
    <section class="modal-card-body has-background-dark">
      <b-field class="is-flex is-justify-content-center">
        <b-upload v-model="dropFiles" drag-drop @input="filesLoaded">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <p>Drop your file here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>

      <div class="columns is-multiline">
        <div
          class="column is-one-third"
          v-for="file in media"
          :key="file.data.id"
        >
          <ImageCard :image="file">
            <div class="buttons">
              <b-button
                type="is-primary is-light"
                icon-right="file-swap"
                @click="$emit('onSelect', file)"
              >
                Select
              </b-button>

              <b-button
                type="is-primary is-light"
                icon-right="delete"
                @click="$emit('onDelete', file)"
              >
                Delete
              </b-button>
            </div>
          </ImageCard>
        </div>
      </div>
      <b-button
        size="is-medium"
        icon-left="image-plus"
        @click="loadMore"
        v-if="showLoadMore"
      >
        Load More
      </b-button>
      <p></p>
    </section>
  </div>
</template>

<script>
import ImageCard from "../media/ImageCard.vue";

export default {
  name: "MediaLibrary",
  data() {
    return {
      dropFiles: [],
      page: 1,
      media: [],
      total: 1,
    };
  },
  async mounted() {
    const media = await this.$axios.$get(`api/media/${this.page}`);
    this.media = media.data.images;
    this.total = media.data.total;
  },
  methods: {
    async filesLoaded(file) {
      console.log("files", file);

      const fd = new FormData();
      fd.append("file", file);

      const result = await this.$axios.post("api/media/create", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("result", result);
    },
    async loadMore() {
      this.page++;
      const media = await this.$axios.$get(`api/media/${this.page}`);
      this.media = this.media.concat(media.data.images);
    },
  },
  computed: {
    showLoadMore() {
      return this.media.length < this.total;
    },
  },
  components: { ImageCard },
};
</script>
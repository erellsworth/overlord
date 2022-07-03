<template>
  <div class="media-libary">
    <b-field class="is-flex is-justify-content-center">
      <b-upload v-model="dropFiles" drag-drop @input="fileDropped">
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
              v-if="!hideSelect"
              type="is-primary is-light"
              icon-right="file-swap"
              @click="$emit('onSelect', file)"
            >
              Select
            </b-button>

            <b-button
              type="is-primary is-light"
              icon-left="image-edit"
              @click="openEditor(file)"
            >
              Edit
            </b-button>

            <b-button
              type="is-primary is-light"
              icon-right="delete"
              @click="deleteFile(file)"
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

    <b-modal
      v-model="showEditor"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Edit Media"
      close-button-aria-label="Close"
      aria-modal
    >
      <div class="modal-card" v-if="imageToEdit">
        <header class="modal-card-head">
          <p class="modal-card-title has-text-dark">
            Edit {{ imageToEdit.data.filename }}
          </p>
        </header>
        <section class="modal-card-body has-background-dark">
          <ImageEditor :media="imageToEdit" @onSave="saveEdits($event)" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss">
.modal-card {
  width: 100%;
}
</style>

<script>
import ImageCard from "./ImageCard.vue";
import ImageEditor from "./ImageEditor.vue";

export default {
  name: "MediaLibrary",
  props: ["hideSelect"],
  data() {
    return {
      dropFiles: [],
      page: 1,
      media: [],
      total: 1,
      showEditor: false,
      imageToEdit: null,
    };
  },
  async mounted() {
    const media = await this.$axios.$get(`api/media/${this.page}`);
    this.media = media.data.images;
    this.total = media.data.total;
  },
  methods: {
    openEditor(file) {
      this.imageToEdit = file;
      this.showEditor = true;
    },
    saveEdits(data) {
      this.showEditor = false;
      if (data.isNew) {
        this.upload(data);
      } else {
        // send update request
      }
    },
    async upload(data) {
      console.log("data", data.crops);
      const fd = new FormData();
      fd.append("crops", JSON.stringify(data.crops));
      fd.append("file", data.file);

      const result = await this.$axios.post("api/media/create", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.data.success && result.data.data.success) {
        this.media.unshift(result.data.data.image);
      } else {
        alert("upload failed");
        // TODO: Replace with toast message
      }
    },

    async fileDropped(file) {
      console.log("file", file);
      const newNameResult = await this.$axios.get(
        `api/media/getValidFileName/${file.name}`
      );

      const newName = newNameResult.data.data.validName;

      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageToEdit = {
          full: reader.result,
          isNew: true,
          data: {
            name: newName,
            alt: newName,
            filename: newName,
          },
          file: file,
        };
        this.showEditor = true;
      };
      reader.readAsDataURL(file);
    },
    async loadMore() {
      this.page++;
      const media = await this.$axios.$get(`api/media/${this.page}`);
      this.media = this.media.concat(media.data.images);
    },
    async deleteFile(file) {
      this.$buefy.dialog.confirm({
        message: `Delete ${file.data.filename}?`,
        onConfirm: async () => {
          const media = await this.$axios.$delete(`api/media/${file.data.id}`);

          this.media = this.media.filter(
            (mediaRecord) => mediaRecord.data.id !== media.data.media.id
          );

          this.$buefy.toast.open(`${file.data.filename} deleted`);
        },
      });
    },
  },
  computed: {
    showLoadMore() {
      return this.media.length < this.total;
    },
  },
  components: { ImageCard, ImageEditor },
};
</script>
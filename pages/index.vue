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
    <tiptap action="create" :content="starterContent" contentType="post" />
    <b-button class="is-primary" @click="save()">Create</b-button>
  </section>
</template>

<script>
import Tiptap from "../components/editor/TipTap.vue";

export default {
  name: "HomePage",
  components: {
    Tiptap,
  },
  methods: {
    save() {},
  },
  async asyncData({ $axios }) {
    let response = await $axios.$get("api");

    let data = {
      contents: [],
      starterContent: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
    };

    if (response.success) {
      data.contents = response.data.contents;
    }

    return data;
  },
};
</script>

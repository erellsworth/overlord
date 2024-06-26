<template>
  <div v-if="editor" class="tiptap-editor box has-background-info-light">
    <TypeSelector
      :selectedType="contentType"
      @onTypeChanged="typeChanged($event)"
    />

    <ToolBar :editor="editor" @logOutput="output()" />

    <editor-content :editor="editor" class="box editor-box" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Video from "./nodes/VideoNode";
import ToolBar from "./ToolBar.vue";
import TypeSelector from "./TypeSelector.vue";
import FigCaption from "./nodes/FigCaption";
import FigureNode from "./nodes/FigureNode";
import CustomImage from "./nodes/CustomImage";

export default {
  name: "TipTap",
  components: {
    EditorContent,
    ToolBar,
    TypeSelector,
  },
  props: ["content", "contentType"],
  data() {
    return {
      editor: null,
      currentType: this.contentType,
    };
  },
  methods: {
    output() {
      const json = this.editor.getJSON();
      console.log(json);
    },
    typeChanged(type) {
      this.currentType = type;
    },
  },

  mounted() {
    const self = this;
    this.editor = new Editor({
      extensions: [StarterKit, Video, CustomImage, FigCaption, FigureNode],
      content: this.content,
      onUpdate({ editor }) {
        const json = editor.getJSON();
        const html = editor.getHTML();
        const text = editor.state.doc.textContent;

        self.$emit("onUpdate", {
          json,
          html,
          text,
        });
      },
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap-editor {
  .ProseMirror {
    min-height: 50vh;

    &:focus-visible {
      outline: none;
      box-shadow: 1px 1px 3px #ccc;
      padding: 5px;
    }

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }
    .videoBlock {
      width: 100%;
      margin: 15px auto;

      .videoWrap {
        position: relative;
        padding-bottom: 56.25%;
        padding-top: 25px;
        height: 0;

        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
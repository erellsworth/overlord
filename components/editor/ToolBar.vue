<template>
  <div class="notification is-info is-light">
    <div class="buttons">
      <b-button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-info': editor.isActive('bold') }"
      >
        bold
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-info': editor.isActive('italic') }"
      >
        italic
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-info': editor.isActive('strike') }"
      >
        strike
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-info': editor.isActive('code') }"
      >
        code
      </b-button>
      <b-button @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </b-button>
      <b-button @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </b-button>
      <b-button
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-info': editor.isActive('paragraph') }"
      >
        paragraph
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 1 }) }"
      >
        h1
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 2 }) }"
      >
        h2
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 3 }) }"
      >
        h3
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 4 }) }"
      >
        h4
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 5 }) }"
      >
        h5
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-info': editor.isActive('heading', { level: 6 }) }"
      >
        h6
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-info': editor.isActive('bulletList') }"
      >
        bullet list
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-info': editor.isActive('orderedList') }"
      >
        ordered list
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-info': editor.isActive('codeBlock') }"
      >
        code block
      </b-button>
      <b-button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-info': editor.isActive('blockquote') }"
      >
        blockquote
      </b-button>
      <b-button @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </b-button>
      <b-button @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </b-button>
      <b-button @click="editor.chain().focus().undo().run()">undo</b-button>
      <b-button @click="editor.chain().focus().redo().run()">redo</b-button>
      <b-button @click="buttonClicked('logOutput')">log output</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  props: ["editor"],
  methods: {
    buttonClicked(eventName) {
      this.$emit(eventName);
    },
  },
};
</script>
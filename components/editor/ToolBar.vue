<template>
  <div class="buttons">
    <b-button
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-info': editor.isActive('bold') }"
      icon-right="format-bold"
      title="Bold"
    />
    <b-button
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-info': editor.isActive('italic') }"
      icon-right="format-italic"
      title="italic"
    />
    <b-button
      @click="editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-info': editor.isActive('strike') }"
      icon-right="format-strikethrough"
      title="strikethrough"
    />

    <b-button
      @click="editor.chain().focus().toggleCode().run()"
      :class="{ 'is-info': editor.isActive('code') }"
      icon-right="code-tags"
      title="Inline code"
    />

    <b-button
      @click="clearFormat"
      icon-right="format-clear"
      title="remove inline formatting"
    />

    <b-button
      @click="editor.chain().focus().setParagraph().run()"
      :class="{
        'is-info': editor.isActive('paragraph'),
      }"
      label="P"
    />

    <b-button
      @click="toggleHeading(1)"
      :class="{ 'is-info': editor.isActive('heading', { level: 1 }) }"
      label="H1"
    />
    <b-button
      @click="toggleHeading(2)"
      :class="{ 'is-info': editor.isActive('heading', { level: 2 }) }"
      label="H2"
    />
    <b-button
      @click="toggleHeading(3)"
      :class="{ 'is-info': editor.isActive('heading', { level: 3 }) }"
      label="H3"
    />
    <b-button
      @click="toggleHeading(4)"
      :class="{ 'is-info': editor.isActive('heading', { level: 4 }) }"
      label="H4"
    />
    <b-button
      @click="toggleHeading(5)"
      :class="{ 'is-info': editor.isActive('heading', { level: 5 }) }"
      label="H5"
    />
    <b-button
      @click="toggleHeading(6)"
      :class="{ 'is-info': editor.isActive('heading', { level: 6 }) }"
      label="H6"
    />
    <b-button
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-info': editor.isActive('bulletList') }"
      icon-right="format-list-bulleted"
      title="Bullet list"
    />
    <b-button
      @click="editor.chain().focus().toggleOrderedList().run()"
      :class="{ 'is-info': editor.isActive('orderedList') }"
      icon-right="format-list-numbered"
      title="Ordered list"
    />
    <b-button
      @click="editor.chain().focus().toggleCodeBlock().run()"
      :class="{ 'is-info': editor.isActive('codeBlock') }"
      icon-right="code-not-equal-variant"
      title="code block"
    />
    <b-button
      @click="editor.chain().focus().toggleBlockquote().run()"
      :class="{ 'is-info': editor.isActive('blockquote') }"
      icon-right="format-quote-close"
      title="Blockquote"
    />

    <b-button
      @click="editor.chain().focus().setHorizontalRule().run()"
      title="horizontal rule"
      label="---"
    />

    <b-button
      @click="editor.chain().focus().undo().run()"
      title="Undo"
      icon-right="undo"
    />
    <b-button
      @click="editor.chain().focus().redo().run()"
      title="Redo"
      icon-right="redo"
    />
    <b-button
      @click="buttonClicked('logOutput')"
      title="Show output in console"
      icon-right="console"
    />
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
    clearFormat() {
      this.editor.chain().focus().unsetAllMarks().run();
      this.editor.chain().focus().clearNodes().run();
    },
    toggleHeading(level) {
      this.editor.chain().focus().toggleHeading({ level }).run();
    },
    launchMediaLibrary() {},
  },
};
</script>
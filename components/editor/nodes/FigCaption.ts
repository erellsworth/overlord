import { Node } from '@tiptap/core'

export default Node.create({
  name: 'figCaption',
  group: 'caption',
  content: 'inline*',
  parseHTML() {
    return [
      { tag: 'figcaption' }
    ];
  },
  renderHTML() {
    return [
      'figcaption',
      { class: 'caption' },
      0
    ];
  }
});
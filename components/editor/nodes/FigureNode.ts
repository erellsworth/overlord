import { Node } from '@tiptap/core'

export default Node.create({
  name: 'figureNode',
  group: 'block',
  content: 'image caption',
  parseHTML() {
    return [
      { tag: 'figure' }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'figure', { class: 'image center has_caption' }, 0
    ];
  },
});
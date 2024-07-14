import { Injector } from '@angular/core';
import { Node } from '@tiptap/core'

const FigCaption = (injector: Injector): Node => {
  return Node.create({
    name: 'figCaption',
    content: 'inline*',
    addOptions() {
      return {
        HTMLAttributes: {},
      }
    },
    addAttributes() {
      return {
        caption: {
          default: null,
        }
      }
    },
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

}

export default FigCaption;
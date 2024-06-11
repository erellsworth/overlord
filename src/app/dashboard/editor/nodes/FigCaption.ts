import { Injector } from '@angular/core';
import { Node } from '@tiptap/core'

const FigCaption = (injector: Injector): Node => {
  return Node.create({
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
}

export default FigCaption;
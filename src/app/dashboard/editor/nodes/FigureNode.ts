import { Injector } from '@angular/core';
import { Node } from '@tiptap/core'

const FigureNode = (injector: Injector): Node => {
  return Node.create({
    name: 'figureNode',
    group: 'block',
    content: 'customImage caption',
    parseHTML() {
      return [
        { tag: 'figure' }
      ];
    },
    renderHTML() {
      return [
        'figure',
        { class: 'text-center' },
        0
      ];
    },
  });
}

export default FigureNode;
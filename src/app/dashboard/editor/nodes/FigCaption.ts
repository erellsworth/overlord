import { Injector } from '@angular/core';
import { Node } from '@tiptap/core'
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import { TiptapFigureComponent } from '../tiptap-figure/tiptap-figure.component';

const FigCaption = (injector: Injector): Node => {
  return Node.create({
    name: 'figCaption',
    group: 'caption',
    content: 'inline*',
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
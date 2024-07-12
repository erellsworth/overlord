import { Injector } from '@angular/core';
import { mergeAttributes, Node } from '@tiptap/core'
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import { TiptapFigureComponent } from '../tiptap-figure/tiptap-figure.component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    FigureNode: {
      /**
       * Comments will be added to the autocomplete.
       */
      setCustomImage: (options: { src: string, imageId: number, alt?: string, caption?: string }) => ReturnType,
    }
  }
}

const FigureNode = (injector: Injector): Node => {
  return Node.create({
    name: 'figureNode',
    group: 'block',
    content: 'image caption',
    addAttributes() {
      return {
        imageId: {
          default: null,
        },
        alt: {
          default: null,
        },
        src: {
          default: null,
        },
        caption: {
          default: null,
        }
      }
    },
    renderHTML({ node, HTMLAttributes }): DOMOutputSpec {
      const output: DOMOutputSpec = [
        'figure',
        { class: 'text-center' }
      ];

      if (node.attrs.imageId) {
        const img: DOMOutputSpec = ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
        output.push(img);
      }

      if (node.attrs.caption) {
        output.push(['figcaption', { class: 'caption' }, node.attrs.caption]);
      }

      return output;
    },
    addNodeView() {
      return AngularNodeViewRenderer(TiptapFigureComponent, { injector });
    },
  });
}

export default FigureNode;
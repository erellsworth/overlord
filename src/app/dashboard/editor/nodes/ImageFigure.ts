import { Injector } from '@angular/core';
import { mergeAttributes, Node } from '@tiptap/core';
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import { TiptapImageComponent } from '../tiptap-image/tiptap-image.component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ImageFigure: {
      setCustomImage: (options: {
        src?: string;
        imageId?: number;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

const ImageFigure = (injector: Injector): Node => {
  return Node.create({
    name: 'imageFigure',
    group: 'block',
    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },
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
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: `figure[data-type="${this.name}"]`,
        },
      ];
    },
    renderHTML({ node, HTMLAttributes }): DOMOutputSpec {
      let figureClass = 'image';
      if (node.attrs.caption) {
        figureClass += ' has-caption';
      }
      const output: DOMOutputSpec = ['figure', { class: figureClass }];

      if (node.attrs.imageId) {
        const img: DOMOutputSpec = [
          'img',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ];
        output.push(img);
      }

      if (node.attrs.caption) {
        output.push(['figcaption', { class: 'caption' }, node.attrs.caption]);
      }

      return output;
    },
    addCommands() {
      return {
        setCustomImage:
          (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
      };
    },
    addNodeView() {
      return AngularNodeViewRenderer(TiptapImageComponent, { injector });
    },
  });
};

export default ImageFigure;

import Blockquote, { BlockquoteOptions } from '@tiptap/extension-blockquote';
import { mergeAttributes } from '@tiptap/core';
import { QuoteConfig } from '../quote-input/quote-input.interface';

interface QuoteOptions extends BlockquoteOptions {
  node: Node;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Quote: {
      /**
       * Set a blockquote node
       */
      setQuote: (options: QuoteConfig) => ReturnType;
      /**
       * Toggle a blockquote node
       */
      toggleQuote: () => ReturnType;
      /**
       * Unset a blockquote node
       */
      unsetQuote: () => ReturnType;
    };
  }
}

const Quote = Blockquote.extend<QuoteOptions>({
  name: 'quote',
  addCommands() {
    return {
      setQuote:
        (options: QuoteConfig) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, options);
        },
      toggleQuote:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
      unsetQuote:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
  addAttributes() {
    // Return an object with attribute configuration
    return {
      text: {
        default: null,
      },
      author: {
        default: null,
      },
      work: {
        default: null,
      },
      date: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.quote' }];
  },
  renderHTML({ node, HTMLAttributes }): DOMOutputSpec {
    const output: DOMOutputSpec = [
      'div',
      { class: 'quote' },
      [
        'blockquote',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        node.attrs.text,
      ],
    ];

    if (node.attrs.author) {
      output.push(['span', { class: 'author' }, `- ${node.attrs.author}`]);
    }
    if (node.attrs.work) {
      output.push(['span', { class: 'work' }, `, ${node.attrs.work}`]);
    }

    if (node.attrs.date) {
      output.push(['span', { class: 'date' }, `, ${node.attrs.date}`]);
    }
    return output;
  },
});

export default Quote;

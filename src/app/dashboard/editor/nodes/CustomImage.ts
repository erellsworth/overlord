import Image from "@tiptap/extension-image";
import { mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customImage: {
            /**
             * Comments will be added to the autocomplete.
             */
            setCustomImage: (options: { src: string, id: number, alt?: string, caption?: string, title?: string }) => ReturnType,
        }
    }
}

const CustomImage = Image.extend({
    name: 'customImage',
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            caption: {
                default: null,
            },
            id: {
                default: null
            }
        }
    },
    renderHTML({ node, HTMLAttributes }) {
        const img: DOMOutputSpec = ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];

        if (!node.attrs.caption) {
            return img;
        }

        return [
            'figure', { class: 'image center has_caption' },
            img,
            ['figcaption', { class: 'caption' }, node.attrs.caption]
        ];
    },

    addCommands() {
        return {
            setCustomImage: options => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },

});

export default CustomImage;


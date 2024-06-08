import Image from "@tiptap/extension-image";
import { mergeAttributes } from '@tiptap/core';

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

});

export default CustomImage;


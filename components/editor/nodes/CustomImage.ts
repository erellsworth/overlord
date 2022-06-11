import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/vue-2";
import { DOMOutputSpecArray } from 'prosemirror-model';

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
        }
    },
    renderHTML({ node, HTMLAttributes }) {
        // console.log('node', node);
        const img: DOMOutputSpecArray = ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];

        if (!node.attrs.caption) {
            return img;
        }

        return [
            'figure', { class: 'image center has_caption' },
            img,
            ['figcaption', { class: 'caption' }, node.attrs.caption]
        ];

        //return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

});

export default CustomImage;
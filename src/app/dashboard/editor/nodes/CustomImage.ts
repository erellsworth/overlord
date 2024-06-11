import { Injector } from '@angular/core';
import Image, { inputRegex } from "@tiptap/extension-image";
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { AngularNodeViewRenderer } from "ngx-tiptap";
import { TiptapImageComponent } from "../tiptap-image/tiptap-image.component";

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

const CustomImage = (injector: Injector): Node => {
    return Image.extend({
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

        addInputRules() {
            return [
                nodeInputRule({
                    find: inputRegex,
                    type: this.type,
                    getAttributes: match => {
                        const [id, caption, alt, src, title] = match

                        return { id, caption, src, alt, title }
                    },
                }),
            ]
        },

        addNodeView() {
            return AngularNodeViewRenderer(TiptapImageComponent, { injector });
        },

    });
};

export default CustomImage;


import { Node, mergeAttributes } from '@tiptap/core'

interface VideoOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        videoBlock: {
            setExternalVideo: (options: any) => ReturnType,
        }
    }
}

export default Node.create<VideoOptions>({
    name: 'videoBlock',

    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
            frameborder: {
                default: '0',
            },
            allow: {
                default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            },
            allowfullscreen: {
                default: 'allowfullscreen'
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div', { class: 'videoBlock' },
            ['div',
                { class: 'videoWrap' },
                ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
            ]
        ];
    },
    addCommands() {
        return {
            setExternalVideo: (options: any) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },

})
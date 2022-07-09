import { Plugin } from '@nuxt/types'

declare module '@nuxt/types' {
    interface Context {
        $helpers: {
            getTitleCase: (str: string) => string;
            slugify: (title: string) => string;
        }
    }
}

const Helpers: Plugin = ({ app }, inject) => {
    inject('helpers', {
        getTitleCase(str: string) {
            return str.split(' ')
                .map((word: string) => {
                    return `${word[0].toUpperCase()}${word.slice(1)}`;
                }).join(' ');
        },
        slugify(title: string) {
            return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
    });
}

export default Helpers;
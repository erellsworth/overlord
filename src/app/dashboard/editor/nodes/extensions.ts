import { Injector } from "@angular/core";
import { Node } from '@tiptap/core';
import FigureNode from "./FigureNode";
import FigCaption from "./FigCaption";
import VideoNode from "./VideoNode";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const Extensions = (injector: Injector): Node[] => {
    return [
        Image,
        FigCaption(injector),
        FigureNode(injector),
        VideoNode(injector),
        StarterKit as Node
    ]
}

export default Extensions;
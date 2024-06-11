import { Injector } from "@angular/core";
import { Node } from '@tiptap/core';
import CustomImage from "./CustomImage";
import FigureNode from "./FigureNode";
import FigCaption from "./FigCaption";
import VideoNode from "./VideoNode";
import StarterKit from "@tiptap/starter-kit";

const Extensions = (injector: Injector): Node[] => {
    return [
        CustomImage(injector),
        FigCaption(injector),
        FigureNode(injector),
        VideoNode(injector),
        StarterKit as Node
    ]
}

export default Extensions;
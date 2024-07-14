import { Injector } from "@angular/core";
import { Node } from '@tiptap/core';
import ImageFigure from "./ImageFigure";
import FigCaption from "./FigCaption";
import VideoNode from "./VideoNode";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const Extensions = (injector: Injector): Node[] => {
    return [
        StarterKit as Node,
        Image,
        FigCaption(injector),
        ImageFigure(injector),
        VideoNode(injector),
    ]
}

export default Extensions;
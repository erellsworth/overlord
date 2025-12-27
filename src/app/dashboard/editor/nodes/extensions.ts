import { Injector } from '@angular/core';
import { Extension, Mark, Node } from '@tiptap/core';
import ImageFigure from './ImageFigure';
import FigCaption from './FigCaption';
import VideoNode from './VideoNode';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ColumnExtension from './columns';
import Quote from './Quote';

type ExtensionTypes = Node | Mark | Extension;

const Extensions = (injector: Injector): ExtensionTypes[] => {
  return [
    ColumnExtension,
    StarterKit,
    Image,
    FigCaption(injector),
    ImageFigure(injector),
    VideoNode(injector),
    Quote,
  ];
};

export default Extensions;

import { Injector } from '@angular/core';
import { Extension, Mark, Node } from '@tiptap/core';
import ImageFigure from './ImageFigure';
import FigCaption from './FigCaption';
import VideoNode from './VideoNode';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import ColumnExtension from './columns';

type ExtensionTypes = Node | Mark | Extension;

const Extensions = (injector: Injector): ExtensionTypes[] => {
  return [
    ColumnExtension,
    StarterKit,
    Image,
    Link,
    FigCaption(injector),
    ImageFigure(injector),
    VideoNode(injector),
  ];
};

export default Extensions;

type DOMOutputSpec = string | DOMNode | {
    dom: DOMNode;
    contentDOM?: HTMLElement;
} | readonly [string, ...any[]];

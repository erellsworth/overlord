import { FormControl } from "@angular/forms";

export interface LinkConfig {
    href: string;
    target?: string;
    rel?: string;
    class?: string;
}

export interface LinkForm {
    href: FormControl<string>;
    target?: FormControl<string>;
    rel?: FormControl<string>;
    class?: FormControl<string>;
}
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ContentType } from "aws-sdk/clients/cloudsearchdomain";
import { ContentStatus } from "aws-sdk/clients/wisdom";
import { Content } from '@tiptap/core';

export interface ContentForm {
    id?: FormControl<number>;
    slug: FormControl<string>;
    title: FormControl<string>;
    type: FormControl<ContentType>;
    status: FormControl<ContentStatus>;
    text: FormControl<string>;
    html: FormControl<string>;
    content: FormControl<Content>;
    seo: FormGroup<{
        description: FormControl<string>;
        [key: string]: FormControl<string>;
    }>;
    metaData: FormGroup<{
        [key: string]: FormControl<string | number | undefined>;
    }>;
    taxonomyIds: FormControl<number[]>;
    newTaxonomies: FormControl<string[]>
}
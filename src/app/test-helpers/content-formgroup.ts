import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ContentForm } from "../dashboard/content-form/content-form.interface";

const fb = new FormBuilder();

const formData: ContentForm = {
    id: fb.nonNullable.control(1),
    title: fb.nonNullable.control('MOCK TITLE', Validators.required),
    slug: fb.nonNullable.control({
        value: 'mock-slug',
        disabled: true
    }, Validators.required),
    type: fb.nonNullable.control('post', Validators.required),
    status: fb.nonNullable.control('draft', Validators.required),
    text: fb.nonNullable.control(''),
    html: fb.nonNullable.control(''),
    content: fb.control([], Validators.required),
    seo: fb.nonNullable.group({ description: 'MOCK DESCRIPTION' }),
    metaData: fb.nonNullable.control({ media_id: 0, autosave_id: 'MOCK_ID' }),
    taxonomyIds: fb.nonNullable.control([]),
    newTaxonomies: fb.nonNullable.control([])
}

export const mockFormGroup: FormGroup<ContentForm> = fb.group(formData);
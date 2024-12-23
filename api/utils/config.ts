import {
  OverlordConfig,
  OverlordConfigFile,
  OverlordContentType,
  OverlordField,
} from '../../interfaces/overlord.config';
import { default as configFile } from '../../overlord.json';
import { slugger, titleCase } from './misc';

class Overlord {
  public config: OverlordConfig;
  public configFile: OverlordConfigFile;

  private defaultFields: OverlordField[] = [
    {
      name: 'content',
      type: 'editor',
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      group: 'seo',
    },
    {
      label: 'Tags',
      name: 'taxonomyIds',
      type: 'tags',
    },
    {
      label: 'Content Image',
      name: 'media_id',
      type: 'image',
      group: 'metaData',
    },
  ];

  constructor(configFile: OverlordConfigFile) {
    this.configFile = configFile;
    this.config = { ...configFile, ...{ contentTypes: this.contentTypes } };
  }

  public get contentTypes(): OverlordContentType[] {
    return Object.entries(this.configFile.contentTypes).map((entry) => {
      const [slug, contentType] = entry;

      const fields = contentType.fields
        ? (contentType.fields
            .map((field) => {
              if (typeof field === 'string') {
                return this.defaultFields.find(
                  (_field) => _field.type === field,
                );
              }
              return field;
            })
            .filter((field) => Boolean(field)) as OverlordField[])
        : this.defaultFields;

      return {
        label: contentType.label || titleCase(slug),
        slug: contentType.slug || slugger(slug),
        plural: contentType.plural || `${titleCase(slug)}s`,
        fields,
      };
    });
  }
}

const configurator = new Overlord(configFile as OverlordConfig);

export { configurator };

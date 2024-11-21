import {
  OverlordConfig,
  OverlordContentType,
} from '../../interfaces/overlord.config';
import { default as configFile } from '../../overlord.json';

class Overlord {
  public config: OverlordConfig;

  private defaultFieldTypes: OverlordConfig['fieldTypes'] = {
    editor: {
      name: 'content',
      type: 'editor',
    },
    description: {
      label: 'Description',
      name: 'description',
      type: 'textarea',
    },
    tags: {
      label: 'Tags',
      name: 'taxonomyIds',
      type: 'tags',
    },
    image: {
      label: 'Content Image',
      name: 'media_id',
      type: 'image',
    },
  };

  constructor(config: OverlordConfig) {
    this.config = {
      ...config,
      ...{
        fieldTypes: {
          ...config.fieldTypes,
          ...this.defaultFieldTypes,
        },
      },
    };
  }

  public get contentTypes(): OverlordContentType[] {
    return Object.entries(this.config.contentTypes).map((entry) => {
      return {
        label: entry[1].label || entry[0],
        slug: entry[1].slug || entry[0],
        plural: entry[1].plural || `${entry[0]}s`,
      };
    });
  }
}

const configurator = new Overlord(configFile as OverlordConfig);

export { configurator };

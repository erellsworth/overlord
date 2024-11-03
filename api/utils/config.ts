import {
  OverlordConfig,
  OverlordContentType,
} from '../../interfaces/overlord.config';
import * as config from '../../overlord.json';

class Overlord {
  private config: OverlordConfig;

  constructor(config: OverlordConfig) {
    this.config = config;
  }

  public get contentTypeSlugs(): string[] {
    return Object.entries(this.config.contentTypes).map(
      (entry) => entry[1].slug || entry[0]
    );
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

const configurator = new Overlord(config);

export { configurator };

import { Content, ContentModel } from './Content';
import { Taxonomy, TaxonomyModel } from './Taxonomy';
import { Media, MediaModel } from './Media';
import { ContentTaxonomyModel } from './ContentTaxonomy';
import { RevisionModel } from './Revision';

ContentModel.belongsToMany(TaxonomyModel, {
  through: ContentTaxonomyModel,
});
TaxonomyModel.belongsToMany(ContentModel, {
  through: ContentTaxonomyModel,
});

ContentModel.hasMany(RevisionModel);

const prepare = async () => {
  await RevisionModel.sync();
  await ContentModel.sync();
  await TaxonomyModel.sync();
  await MediaModel.sync();
  await ContentTaxonomyModel.sync();
};

prepare();

export { Content, Taxonomy, Media };

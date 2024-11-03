import { Content, ContentModel } from './Content';
import { Taxonomy, TaxonomyModel } from './Taxonomy';
import { Media, MediaModel } from './Media';
import { ContentTaxonomyModel } from './ContentTaxonomy';

ContentModel.belongsToMany(TaxonomyModel, {
  through: ContentTaxonomyModel,
});
TaxonomyModel.belongsToMany(ContentModel, {
  through: ContentTaxonomyModel,
});

const prepare = async () => {
  await ContentModel.sync();
  await TaxonomyModel.sync();
  await MediaModel.sync();
  await ContentTaxonomyModel.sync();
};

prepare();

export { Content, Taxonomy, Media };

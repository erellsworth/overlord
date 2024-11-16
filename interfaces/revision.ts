import { Model, Optional } from 'sequelize';
import { ContentBase } from './content';

export interface RevisionInterface extends ContentBase {
  ContentId: number;
}
// Some fields are optional when calling UserModel.create() or UserModel.build()
interface RevisionCreationAttributes
  extends Optional<RevisionInterface, 'id'> {}

// We need to declare an interface for our model that is basically what our class would be
export interface RevisionInstance
  extends Model<RevisionInterface, RevisionCreationAttributes>,
    RevisionInterface {}

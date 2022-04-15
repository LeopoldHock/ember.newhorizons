import StellarpediaArticleIdentifiableComponent from './identifiable';
import { inject as service } from '@ember/service';

export default class StellarpediaSkillComponent extends StellarpediaArticleIdentifiableComponent {
    @service database;
}
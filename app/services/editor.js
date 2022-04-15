//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// This service manages the character editing process.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class EditorService extends Service {
    @service manager;
    @service database;

    @tracked character;
}
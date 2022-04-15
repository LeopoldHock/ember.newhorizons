// Leopold Hock | 20.06.2020
// Description: Service that contains all app-related constants. For gameplay-related constants, see databse models.
import Service from '@ember/service';

export default class ConstantService extends Service {
    typeOfFunction = "function";
    databaseModelPrefix = "identifiables/"
    characterPresetIdDefault = "character-preset/default"
    sidebarIconSize = "1x";
}
import JSONSerializer from '@ember-data/serializer/json';

export default class ApplogSerializer extends JSONSerializer {

    serialize(options) {
        let result = super.serialize(options);
        return result;
    }
}
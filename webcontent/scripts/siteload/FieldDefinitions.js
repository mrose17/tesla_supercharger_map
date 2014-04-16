define(['siteload/FieldDefinition', 'siteload/FieldParsing'], function (FieldDefinition, FieldParsing) {


    /**
     *
     * @constructor
     */
    var FieldDefinitions =
    {
        'name': new FieldDefinition('name', true, FieldParsing.DISPLAY_NAME),

        'street': new FieldDefinition('street', true, FieldParsing.ADDRESS),
        'city': new FieldDefinition('city', true, FieldParsing.ADDRESS),
        'state': new FieldDefinition('state', false, FieldParsing.ADDRESS),
        'zip': new FieldDefinition('zip', true, FieldParsing.ADDRESS),
        'country': new FieldDefinition('country', true, FieldParsing.ADDRESS),

        'gps': new FieldDefinition('gps', true, FieldParsing.GPS),
        'elevation': new FieldDefinition('elevation', true, FieldParsing.I),

        'url': new FieldDefinition('url', true, FieldParsing.I),

        'urlDiscuss': new FieldDefinition('urlDiscuss', false, FieldParsing.I),

        'dateOpened': new FieldDefinition('dateOpened', false, FieldParsing.DATE),

        'status': new FieldDefinition('status', false, FieldParsing.STATUS),

        'count': new FieldDefinition('count', false, FieldParsing.BOOLEAN)
    };


    return FieldDefinitions;


})
;
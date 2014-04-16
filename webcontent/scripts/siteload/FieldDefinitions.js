/**
 * Collections of field definitions.  Defines possible supercharger fields for values that come from the source text file.
 */
define(['siteload/FieldDefinition', 'siteload/FieldParsing'], function (FieldDefinition, FieldParsing) {


    var FieldDefinitions = {};

    /**
     * List of field definitions.
     */
    FieldDefinitions.LIST = [

        new FieldDefinition('name', true, FieldParsing.DISPLAY_NAME),

        new FieldDefinition('street', true, FieldParsing.ADDRESS),
        new FieldDefinition('city', true, FieldParsing.ADDRESS),
        new FieldDefinition('state', false, FieldParsing.ADDRESS),
        new FieldDefinition('zip', true, FieldParsing.ADDRESS),
        new FieldDefinition('country', true, FieldParsing.ADDRESS),

        new FieldDefinition('gps', true, FieldParsing.GPS),
        new FieldDefinition('elevation', true, FieldParsing.I),

        new FieldDefinition('url', true, FieldParsing.I),

        new FieldDefinition('urlDiscuss', false, FieldParsing.I),

        new FieldDefinition('dateOpened', false, FieldParsing.DATE),

        new FieldDefinition('status', false, FieldParsing.STATUS),

        new FieldDefinition('count', false, FieldParsing.BOOLEAN)
    ];

    /**
     * Build a map from field name to field def for continence.
     */
    FieldDefinitions.MAP = {};
    $.each(FieldDefinitions.LIST, function (index, fieldDef) {
        FieldDefinitions.MAP[fieldDef.name] = fieldDef;
    });

    return FieldDefinitions;

});
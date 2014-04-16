define([], function () {

    /**
     * Represents one field in the source text file.
     *
     * @param name          Name of the field IN THE TEXT FILE.
     * @param required      TRUE if required.
     * @param parseFunction The function to use to parse the raw text value and assign a property in a supercharger object.
     *
     * @constructor
     */
    var FieldDefinition = function (name, required, parseFunction) {
        this.name = name;
        this.required = required;
        this.parseFunciton = parseFunction;
    };

    return FieldDefinition;


});
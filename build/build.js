({
    baseUrl: "../webcontent/scripts",
    name: "main",
    out: "../webcontent-built/scripts/main.js",
    inlineJSON: false,
    paths: {
        text: 'lib/text', //text is required
        json: 'lib/json' //alias to plugin
    }
})
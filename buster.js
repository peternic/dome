exports["Browser tests"] = {
    environment: "browser",
    libs: ["node_modules/culljs/lib/cull.js"],
    sources: ["lib/dome.js", "lib/*.js"],
    testHelpers: ["test/support.js"],
    tests: ["test/*.js"],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};

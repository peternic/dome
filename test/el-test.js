/*global document, dome*/

buster.testCase("Element", {
    "data": {
        "sets data attribute and property": function () {
            var el = document.createElement("div");
            dome.data.set({ something: 42 }, el);

            assert.equals(el["data-something"], 42);
            assert.equals(el.getAttribute("data-something"), 42);
        },

        "gets data attribute": function () {
            var el = document.createElement("div");
            dome.data.set({ something: 42 }, el);

            assert.equals(dome.data.get("something", el), 42);
        }
    },

    "setProp": {
        "sets property on element": function () {
            var el = document.createElement("div");
            dome.setProp({ "className": "hey" }, el);
            assert.className(el, "hey");
        },

        "does nothing if no properties": function () {
            refute.exception(function () {
                dome.setProp(null, document.createElement("div"));
            });
        },

        "delegates to setData for data attributes": function () {
            var el = document.createElement("div");
            dome.setProp({ data: { something: "hey" } }, el);

            assert.equals(el.getAttribute("data-something"), "hey");
        }
    },

    "setContent": {
        setUp: function () {
            this.el = document.createElement("div");
            this.el.innerHTML = "<h1>Hey</h1>";
        },

        "removes existing content": function () {
            dome.setContent("", this.el);
            refute.match(this.el.innerHTML, "Hey");
        },

        "adds string content": function () {
            dome.setContent("Vanilla", this.el);
            assert.equals(this.el.innerHTML, "Vanilla");
        },

        "adds DOM element content": function () {
            var child = document.createElement("h2");
            child.innerHTML = "Yes!";
            dome.setContent(child, this.el);
            assert.equals(this.el.innerHTML, "<h2>Yes!</h2>");
        },

        "adds mixed content": function () {
            var child = document.createElement("h2");
            child.innerHTML = "Yes!";
            dome.setContent([child, "Tihi"], this.el);
            assert.equals(this.el.innerHTML, "<h2>Yes!</h2>Tihi");
        },

        "escapes text content": function () {
            dome.setContent("<p>Tihi</p>", this.el);
            assert.equals(this.el.innerHTML, "&lt;p&gt;Tihi&lt;/p&gt;");
        }
    },

    "builder": {
        setUp: function () {
            this.div = dome.el.div;
        },

        "creates div element": function () {
            assert.tagName(this.div(), "div");
        },

        "creates element with attribute property": function () {
            assert.match(dome.el.a({ href: "/yo" }).href, /\/yo$/);
        },

        "creates element with multiple attribute properties": function () {
            var link = dome.el.a({ href: "/yo", className: "link-thingie" });

            assert.className(link, "link-thingie");
            assert.match(link.href, /\/yo$/);
        },

        "creates element with child": function () {
            var el = this.div(this.div());

            assert.equals(el.childNodes.length, 1);
        },

        "creates element with children": function () {
            var el = this.div([this.div(), this.div()]);

            assert.equals(el.childNodes.length, 2);
        },

        "doesn't get confused about select elements": function () {
            var el = this.div(dome.el.select([dome.el.option(),
                                              dome.el.option()]));

            assert.equals(el.childNodes.length, 1);
            assert.equals(el.firstChild.childNodes.length, 2);
        },

        "complains about multiple element arguments": function () {
            assert.exception(function () {
                this.div(this.div(), this.div(), this.div(), this.div());
            }, "TypeError");
        },

        "complains about tagName property for element": function () {
            assert.exception(function () {
                this.div(this.div(), this.div());
            }, "TypeError");
        },

        "creates element with children and properties": function () {
            var el = this.div({ className: "hey", id: "ho" }, this.div());

            assert.equals(el.childNodes.length, 1);
            assert.className(el, "hey");
            assert.equals(el.id, "ho");
        },

        "creates element with text content": function () {
            var el = dome.el.h2("Hey man");

            assert.equals(el.innerHTML, "Hey man");
        },

        "should not insert text as html": function () {
            var el = this.div("<p>x</p><p>s</p><p>s</p>");

            assert.equals(el.childNodes.length, 1);
        },

        "creates element with text and DOM element content": function () {
            var el = this.div(["Hey man", this.div(), "Awright"]);

            assert.match(el.innerHTML, /hey man\s*<div><\/div>awright/i);
        },

        "sets style properties": function () {
            var el = this.div({ style: { position: "relative" } });

            assert.equals(el.style.position, "relative");
        },

        "creates element with customly handled attribute": function () {
            dome.propmap["for"] = function (el, attr) {
                el.htmlFor = attr;
            };

            var el = this.div({ "for": "somebody" });

            assert.equals(el.htmlFor, "somebody");
        },

        "creates div element directly": function () {
            var el = dome.el("div", { className: "Yay" });

            assert.tagName(el, "div");
            assert.className(el, "Yay");
        }
    }
});

/*!
 * 
 *  leaflet.browser.print - v0.3.4 (https://github.com/Igor-Vladyka/leaflet.browser.print) 
 *  A leaflet plugin which allows users to print the map directly from the browser
 *  
 *  MIT (http://www.opensource.org/licenses/mit-license.php)
 *  (c) 2017  Igor Vladyka <igor.vladyka@gmail.com> (https://github.com/Igor-Vladyka/)
 * 
 */
! function(t) {
    function e(i) {
        if (n[i]) return n[i].exports;
        var o = n[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(o.exports, o, o.exports, e), o.l = !0, o.exports
    }
    var n = {};
    e.m = t, e.c = n, e.i = function(t) {
        return t
    }, e.d = function(t, n, i) {
        e.o(t, n) || Object.defineProperty(t, n, {
            configurable: !1,
            enumerable: !0,
            get: i
        })
    }, e.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return e.d(n, "a", n), n
    }, e.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, e.p = "", e(e.s = 2)
}([function(t, e) {
    L.Control.BrowserPrint = L.Control.extend({
        options: {
            title: "Print map",
            position: "topleft",
            printLayer: null,
            printModes: ["Portrait", "Landscape", "Auto", "Custom"],
            printModesNames: {
                Portrait: "Portrait",
                Landscape: "Landscape",
                Auto: "Auto",
                Custom: "Custom"
            },
            closePopupsOnPrint: !0
        },
        initialize: function(t) {
            this._appendControlStyles(), L.Control.prototype.initialize.call(this, t)
        },
        onAdd: function() {
            var t = L.DomUtil.create("div", "leaflet-control-browser-print leaflet-bar leaflet-control");
            L.DomEvent.disableClickPropagation(t);
            var e = L.DomUtil.create("a", "", t);
            this.link = e, this.link.id = "leaflet-browser-print", this.link.title = this.options.title, L.DomEvent.addListener(t, "mouseover", this._displayPageSizeButtons, this), L.DomEvent.addListener(t, "mouseout", this._hidePageSizeButtons, this), this.holder = L.DomUtil.create("ul", "browser-print-holder", t);
            for (var n = [], i = 0; i < this.options.printModes.length; i++) {
                var o = this.options.printModes[i],
                    r = o[0].toUpperCase() + o.substring(1).toLowerCase();
                if (this["_print" + r]) {
                    var a = L.DomUtil.create("li", "browser-print-mode", this.holder);
                    a.innerHTML = this.options.printModesNames[r], L.DomEvent.addListener(a, "click", this["_print" + r], this), n.push(a)
                }
            }
            return this.options.printModes = n, setTimeout(function() {
                t.className += parseInt(L.version) ? " v1" : " v0-7"
            }, 10), t
        },
        _displayPageSizeButtons: function() {
            this.holder.style.marginTop = "-" + this.link.clientHeight - 1 + "px", this.options.position.indexOf("left") > 0 ? (this.link.style.borderTopRightRadius = "0px", this.link.style.borderBottomRightRadius = "0px", this.holder.style.marginLeft = this.link.clientWidth + "px") : (this.link.style.borderTopLeftRadius = "0px", this.link.style.borderBottomLeftRadius = "0px", this.holder.style.marginRight = this.link.clientWidth + "px"), this.options.printModes.forEach(function(t) {
                t.style.display = "inline-block"
            })
        },
        _hidePageSizeButtons: function() {
            this.holder.style.marginTop = "", this.options.position.indexOf("left") > 0 ? (this.link.style.borderTopRightRadius = "", this.link.style.borderBottomRightRadius = "", this.holder.style.marginLeft = "") : (this.link.style.borderTopLeftRadius = "", this.link.style.borderBottomLeftRadius = "", this.holder.style.marginRight = ""), this.options.printModes.forEach(function(t) {
                t.style.display = ""
            })
        },
        _printLandscape: function() {
            this._addPrintClassToContainer(this._map, "leaflet-browser-print--landscape"), this._print("Landscape")
        },
        _printPortrait: function() {
            this._addPrintClassToContainer(this._map, "leaflet-browser-print--portrait"), this._print("Portrait")
        },
        _printAuto: function() {
            this._addPrintClassToContainer(this._map, "leaflet-browser-print--auto");
            var t = this._getBoundsForAllVisualLayers();
            this._print(this._getPageSizeFromBounds(t), t)
        },
        _printCustom: function() {
            this._addPrintClassToContainer(this._map, "leaflet-browser-print--custom"), this._map.on("mousedown", this._startAutoPoligon, this), this._map.on("mouseup", this._endAutoPoligon, this)
        },
        _addPrintClassToContainer: function(t, e) {
            var n = t.getContainer(); - 1 === n.className.indexOf(e) && (n.className += " " + e)
        },
        _removePrintClassFromContainer: function(t, e) {
            var n = t.getContainer();
            n.className && n.className.indexOf(e) > -1 && (n.className = n.className.replace(" " + e, ""))
        },
        _startAutoPoligon: function(t) {
            t.originalEvent.preventDefault(), this._map.dragging.disable(), this._map.off("mousedown", this._startAutoPoligon, this), this.options.custom = {
                start: t.latlng
            }, this._map.on("mousemove", this._moveAutoPoligon, this)
        },
        _moveAutoPoligon: function(t) {
            this.options.custom && (t.originalEvent.preventDefault(), this.options.custom.rectangle && this._map.removeLayer(this.options.custom.rectangle), this.options.custom.rectangle = L.rectangle([this.options.custom.start, t.latlng], {
                color: "gray",
                dashArray: "5, 10"
            }), this.options.custom.rectangle.addTo(this._map))
        },
        _endAutoPoligon: function(t) {
            t.originalEvent.preventDefault(), this._map.off("mousemove", this._moveAutoPoligon, this), this._map.off("mouseup", this._endAutoPoligon, this), this._map.removeLayer(this.options.custom.rectangle), this._map.dragging.enable();
            var e = this.options.custom.rectangle.getBounds();
            this.options.custom = void 0, this._print(this._getPageSizeFromBounds(e), e)
        },
        _getPageSizeFromBounds: function(t) {
            return Math.abs(t.getNorth() - t.getSouth()) > Math.abs(t.getEast() - t.getWest()) ? "Portrait" : "Landscape"
        },
        _setupMapSize: function(t, e) {
            switch (e) {
                case "Landscape":
                    t.style.width = "1040px", t.style.height = "715px";
                    break;
                default:
                case "Portrait":
                    t.style.width = "850px", t.style.height = "1100px"
            }
        },
        _print: function(t, e) {
        	this._map.fire("pre-print");
            var n = this,
                i = this._map.getContainer(),
                o = {
                    bounds: this._map.getBounds(),
                    width: i.style.width,
                    height: i.style.height,
                    printCss: this._addPrintCss(t),
                    printLayer: L.browserPrintUtils.cloneLayer(this._validatePrintLayer())
                },
                r = this._addPrintMapOverlay(this._map, t, o);

            this._map.fire("browser-print-start", {
                printLayer: o.printLayer,
                printMap: r
            }), r.fitBounds(e || o.bounds);
            var a = setInterval(function() {
                r.isLoading() || (clearInterval(a), n._completePrinting(r, o.printLayer, o.printCss))
            }, 50)
        },
        _completePrinting: function(t, e, n) {
            var i = this;
            setTimeout(function() {
                i._map.fire("browser-print", {
                    printLayer: e,
                    printMap: t
                }), window.print(), i._printEnd(t, e, n)
            }, 1e3)
        },
        _getBoundsForAllVisualLayers: function() {
            var t = null;
            for (var e in this._map._layers) {
                var n = this._map._layers[e];
                n._url || (t ? n.getBounds ? t.extend(n.getBounds()) : n.getLatLng && t.extend(n.getLatLng()) : n.getBounds ? t = n.getBounds() : n.getLatLng && (t = L.latLngBounds(n.getLatLng(), n.getLatLng())))
            }
            return t
        },
        _printEnd: function(t, e, n) {
            if (this._removePrintClassFromContainer(this._map, "leaflet-browser-print--landscape"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--portrait"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--auto"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--custom"), n.remove) n.remove(), t.getContainer().parentElement.remove();
            else {
                n.parentNode.removeChild(n);
                var i = t.getContainer().parentElement;
                i.parentElement.removeChild(i)
            }
            document.body.className = document.body.className.replace(" leaflet--printing", ""), this._map.invalidateSize({
                reset: !0,
                animate: !1,
                pan: !1
            }), this._map.fire("browser-print-end", {
                printLayer: e,
                printMap: t
            })
        },
        _validatePrintLayer: function() {
            var t = null;
            if (this.options.printLayer) t = this.options.printLayer;
            else
                for (var e in this._map._layers) {
                    var n = this._map._layers[e];
                    n._url && (t = n)
                }
            return t
        },
        _addPrintCss: function(t) {
            var e = document.createElement("style");
            switch (e.setAttribute("type", "text/css"), e.innerHTML = "@media print { .leaflet-control-container > .leaflet-bottom.leaflet-left, .leaflet-control-container > .leaflet-top.leaflet-left, .leaflet-control-container > .leaflet-top.leaflet-right { display: none!important; } }", e.innerHTML += "@media print { .leaflet-popup-content-wrapper, .leaflet-popup-tip { box-shadow: none; }", t) {
                case "Landscape":
                    e.innerText += "@media print { @page { size : landscape; }}";
                    break;
                default:
                case "Portrait":
                    e.innerText += "@media print { @page { size : portrait; }}"
            }
            return document.getElementsByTagName("head")[0].appendChild(e), e
        },
        _appendControlStyles: function() {
            var t = document.createElement("style");
            t.setAttribute("type", "text/css"), t.innerHTML += " .leaflet-control-browser-print a { background: #fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcCCi8Vjp+aNAAAAGhJREFUOMvFksENgDAMA68RC7BBN+Cf/ZU33QAmYAT6BolAGxB+RrrIsg1BpfNBVXcPMLMDI/ytpKozMHWwK7BJJ7yYWQbGdBea9wTIkRDzKy0MT7r2NiJACRgotCzxykFI34QY2Ea7KmtxGJ+uX4wfAAAAAElFTkSuQmCC') no-repeat 5px; background-size: 16px 16px; display: block; border-radius: 4px; }", t.innerHTML += " .v0-7.leaflet-control-browser-print a#leaflet-browser-print { width: 26px; height: 26px; } .v1.leaflet-control-browser-print a#leaflet-browser-print { background-position-x: 7px; }", t.innerHTML += " .browser-print-holder { margin: 0px; padding: 0px; list-style: none; white-space: nowrap; } .browser-print-holder-left li:last-child { border-top-right-radius: 2px; border-bottom-right-radius: 2px; } .browser-print-holder-right li:first-child { border-top-left-radius: 2px; border-bottom-left-radius: 2px; }", t.innerHTML += " .browser-print-mode { display: none; background-color: #919187; color: #FFF; font: 11px/19px 'Helvetica Neue', Arial, Helvetica, sans-serif; text-decoration: none; padding: 4px 10px; text-align: center; } .v1 .browser-print-mode { padding: 6px 10px; } .browser-print-mode:hover { background-color: #757570; cursor: pointer; }", t.innerHTML += " .leaflet-browser-print--custom, .leaflet-browser-print--custom path { cursor: crosshair!important; }", t.innerHTML += " .leaflet-print-overlay { width: 100%; height: 100%; position: absolute; top: 0; background-color: white; left: 0; z-index: 1001; display: block!important; } ", t.innerHTML += " .leaflet--printing { overflow: hidden!important; margin: 0px!important; padding: 0px!important; } body.leaflet--printing > * { display: none; }", document.getElementsByTagName("head")[0].appendChild(t)
        },
        _addPrintMapOverlay: function(t, e, n) {
            var i = document.createElement("div");
            i.id = "leaflet-print-overlay", i.className = t.getContainer().className + " leaflet-print-overlay", document.body.appendChild(i);
            var o = document.createElement("div");
            return o.id = t.getContainer().id + "-print", o.style.width = n.width, o.style.height = n.height, this._setupMapSize(o, e), i.appendChild(o), document.body.className += " leaflet--printing", this._setupPrintMap(o.id, t.options, n.printLayer, t._layers)
        },
        _setupPrintMap: function(t, e, n, i, o) {
            var r = L.map(t, e);
            n.addTo(r);
            for (var a in i) {
                var s = i[a];
                if (!s._url) {
                    var l = L.browserPrintUtils.cloneLayer(s, o);
                    l && (s instanceof L.Popup ? (s.isOpen || (s.isOpen = function() {
                        return this._isOpen
                    }), s.isOpen() && !this.options.closePopupsOnPrint && l.openOn(r)) : l.addTo(r))
                }
            }
            return r.isLoading || (r.isLoading = function() {
                return this._tilesToLoad || this._tileLayersToLoad
            }), r
        }
    }), L.browserPrint = function(t) {
        if (t && t.printModes && (!t.printModes.filter || !t.printModes.length)) throw "Please specify valid print modes for Print action. Example: printModes: ['Portrait', 'Landscape', 'Auto', 'Custom']";
        return new L.Control.BrowserPrint(t)
    }
}, function(t, e) {
    L.browserPrintUtils = {
        cloneOptions: function(t) {
            var e = this,
                n = {};
            for (var i in t) {
                var o = t[i];
                o && o.clone ? n[i] = o.clone() : o.onAdd ? n[i] = e.cloneLayer(o) : n[i] = o
            }
            return n
        },
        cloneLayer: function(t, e) {
            var n = t.options;
            return L.SVG && t instanceof L.SVG ? L.svg(n) : L.Canvas && t instanceof L.Canvas ? L.canvas(n) : t instanceof L.TileLayer ? L.tileLayer(t._url, n) : t instanceof L.ImageOverlay ? L.imageOverlay(t._url, t._bounds, n) : t instanceof L.Marker ? L.marker(t.getLatLng(), n) : t instanceof L.Popup ? L.popup().setLatLng(t.getLatLng()).setContent(t.getContent()) : t instanceof L.Circle ? L.circle(t.getLatLng(), t.getRadius(), n) : t instanceof L.CircleMarker ? L.circleMarker(t.getLatLng(), n) : t instanceof L.Rectangle ? L.rectangle(t.getBounds(), n) : t instanceof L.Polygon ? L.polygon(t.getLatLngs(), n) : L.MultiPolyline && t instanceof L.MultiPolyline ? L.polyline(t.getLatLngs(), n) : L.MultiPolygon && t instanceof L.MultiPolygon ? L.multiPolygon(t.getLatLngs(), n) : t instanceof L.Polyline ? L.polyline(t.getLatLngs(), n) : t instanceof L.GeoJSON ? L.geoJson(t.toGeoJSON(), n) : t instanceof L.FeatureGroup ? L.featureGroup() : t instanceof L.LayerGroup ? L.layerGroup() : (console.info("Unknown layer, cannot clone this layer. Leaflet-version: " + L.version), null)
        },
        cloneInnerLayers: function(t) {
            var e = this,
                n = [];
            return t.eachLayer(function(t) {
                var i = e.cloneLayer(t);
                i && n.push(i)
            }), n
        }
    }
}, function(t, e, n) {
    n(0), t.exports = n(1)
}]); 

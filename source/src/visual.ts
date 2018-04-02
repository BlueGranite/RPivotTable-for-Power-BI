/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";
    // below is a snippet of a definition for an object which will contain the property values
    // selected by the users
    /*interface VisualSettings {
        lineColor: string;
    }*/

    interface VisualSettingsRPivotTableParams {
        method: string;
        fontSize: string;
    }

    // to allow this scenario you should first the following JSON definition to the capabilities.json file
    // under the "objects" property:
    // "settings": {
    //     "displayName": "Visual Settings",
    //     "description": "Visual Settings Tooltip",
    //     "properties": {
    //         "lineColor": {
    //         "displayName": "Line Color",
    //         "type": { "fill": { "solid": { "color": true }}}
    //         }
    //     }
    // }

    // in order to improve the performance, one can update the <head> only in the initial rendering.
    // set to 'true' if you are using different packages to create the widgets
    const updateHTMLHead: boolean = false;
    const renderVisualUpdateType: number[] = [
        VisualUpdateType.Resize,
        VisualUpdateType.ResizeEnd,
        VisualUpdateType.Resize + VisualUpdateType.ResizeEnd
    ];

    export class Visual implements IVisual {
        private host: IVisualHost;

        private rootElement: HTMLElement;
        private headNodes: Node[];
        private bodyNodes: Node[];
        private settings: VisualSettings;
        private settings_rpivottable_params: VisualSettingsRPivotTableParams;

        private thePreviousSettingsInJson: string;

        public constructor(options: VisualConstructorOptions) {
            if (options && options.element) {
                this.rootElement = options.element;
            }

            this.host = options.host;

            this.headNodes = [];
            this.bodyNodes = [];

            this.settings_rpivottable_params = <VisualSettingsRPivotTableParams>{
                method: "Table",
                fontSize: "12px"
            };
        }

        public update(options: VisualUpdateOptions): void {

            if (!options ||
                !options.type ||
                !options.viewport ||
                !options.dataViews ||
                options.dataViews.length === 0 ||
                !options.dataViews[0]) {
                return;
            }
            const dataView: DataView = options.dataViews[0];
            this.settings = Visual.parseSettings(dataView);

            this.settings_rpivottable_params = <VisualSettingsRPivotTableParams>{
                method: getValue<string>(dataView.metadata.objects, 'settings_rpivottable_params', 'method', "Table"),
                fontSize: getValue<string>(dataView.metadata.objects, 'settings_rpivottable_params', 'fontSize', "12px"),
            };

            let payloadBase64: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                payloadBase64 = dataView.scriptResult.payloadBase64;
            }

            if (renderVisualUpdateType.indexOf(options.type) === -1) {
                if (payloadBase64) {
                    this.injectCodeFromPayload(payloadBase64);
                }
            } else {
                this.onResizing(options.viewport);
            }
        }

        public onResizing(finalViewport: IViewport): void {
            /* add code to handle resizing of the view port */
        }

        private keepSettings(settings: string): void {
            if (settings === this.thePreviousSettingsInJson) {
                return;
            }

            this.thePreviousSettingsInJson = settings;

            console.log(settings);

            this.host.persistProperties({
                merge: [{
                    objectName: "internal_settings",
                    properties: {
                        settings
                    },
                    selector: null
                }]
            });
        }

        private injectCodeFromPayload(payloadBase64: string): void {
            // inject HTML from payload, created in R
            // the code is injected to the 'head' and 'body' sections.
            // if the visual was already rendered, the previous DOM elements are cleared

            ResetInjector();

            if (!payloadBase64) {
                return;
            }

            // create 'virtual' HTML, so parsing is easier
            let el: HTMLHtmlElement = document.createElement("html");
            try {
                el.innerHTML = window.atob(payloadBase64);
            } catch (err) {
                return;
            }

            // if 'updateHTMLHead == false', then the code updates the header data only on the 1st rendering
            // this option allows loading and parsing of large and recurring scripts only once.
            if (updateHTMLHead || this.headNodes.length === 0) {
                while (this.headNodes.length > 0) {
                    let tempNode: Node = this.headNodes.pop();
                    document.head.removeChild(tempNode);
                }
                let headList: NodeListOf<HTMLHeadElement> = el.getElementsByTagName("head");
                if (headList && headList.length > 0) {
                    let head: HTMLHeadElement = headList[0];
                    this.headNodes = ParseElement(head, document.head);
                }
            }

            // User-selected Format option styles
            let css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = ".pvtVal { font-size: " + this.settings_rpivottable_params.fontSize + ";} " +
                ".pvtAttr { font-size: " + this.settings_rpivottable_params.fontSize + ";} " +
                ".pvtTotal { font-size: " + this.settings_rpivottable_params.fontSize + ";} " +
                ".pvtGrandTotal { font-size: " + this.settings_rpivottable_params.fontSize + ";} " +
                ".pvtAxisLabel { font-size: " + this.settings_rpivottable_params.fontSize + " !important;} " +
                ".pvtRowLabel { font-size: " + this.settings_rpivottable_params.fontSize + " !important;} " +
                ".pvtColLabel { font-size: " + this.settings_rpivottable_params.fontSize + " !important;} ";
            document.body.appendChild(css);

            // update 'body' nodes, under the rootElement
            while (this.bodyNodes.length > 0) {
                let tempNode: Node = this.bodyNodes.pop();
                this.rootElement.removeChild(tempNode);
            }
            let bodyList: NodeListOf<HTMLBodyElement> = el.getElementsByTagName("body");
            if (bodyList && bodyList.length > 0) {
                let body: HTMLBodyElement = bodyList[0];
                this.bodyNodes = ParseElement(body, this.rootElement);
            }

            RunHTMLWidgetRenderer((config) => {
                console.log(config);
                this.keepSettings(JSON.stringify(config));
            });
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /**
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
         * objects and properties you want to expose to the users in the property pane.
         *
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            // VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            // return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);

            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings_rpivottable_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            method: this.settings_rpivottable_params.method,
                            fontSize: this.settings_rpivottable_params.fontSize
                        },
                        selector: null
                    });
            }

            return objectEnumeration;
        }
    }
}
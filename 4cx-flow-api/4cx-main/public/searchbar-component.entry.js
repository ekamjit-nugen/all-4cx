import { r as registerInstance, h } from './index-262852fb.js';

const errorIconSvg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNy40OTMgMC4wMTUgQyA3LjQ0MiAwLjAyMSw3LjI2OCAwLjAzOSw3LjEwNyAwLjA1NSBDIDUuMjM0IDAuMjQyLDMuMzQ3IDEuMjA4LDIuMDcxIDIuNjM0IEMgMC42NjAgNC4yMTEsLTAuMDU3IDYuMTY4LDAuMDA5IDguMjUzIEMgMC4xMjQgMTEuODU0LDIuNTk5IDE0LjkwMyw2LjExMCAxNS43NzEgQyA4LjE2OSAxNi4yODAsMTAuNDMzIDE1LjkxNywxMi4yMjcgMTQuNzkxIEMgMTQuMDE3IDEzLjY2NiwxNS4yNzAgMTEuOTMzLDE1Ljc3MSA5Ljg4NyBDIDE1Ljk0MyA5LjE4NiwxNS45ODMgOC44MjksMTUuOTgzIDguMDAwIEMgMTUuOTgzIDcuMTcxLDE1Ljk0MyA2LjgxNCwxNS43NzEgNi4xMTMgQyAxNC45NzkgMi44NzgsMTIuMzE1IDAuNDk4LDkuMDAwIDAuMDY0IEMgOC43MTYgMC4wMjcsNy42ODMgLTAuMDA2LDcuNDkzIDAuMDE1IE04Ljg1MyAxLjU2MyBDIDkuOTY3IDEuNzA3LDExLjAxMCAyLjEzNiwxMS45NDQgMi44MzQgQyAxMi4yNzMgMy4wODAsMTIuOTIwIDMuNzI3LDEzLjE2NiA0LjA1NiBDIDEzLjcyNyA0LjgwNywxNC4xNDIgNS42OTAsMTQuMzMwIDYuNTM1IEMgMTQuNTQ0IDcuNTAwLDE0LjU0NCA4LjUwMCwxNC4zMzAgOS40NjUgQyAxMy45MTYgMTEuMzI2LDEyLjYwNSAxMi45NzgsMTAuODY3IDEzLjgyOCBDIDEwLjIzOSAxNC4xMzUsOS41OTEgMTQuMzM2LDguODgwIDE0LjQ0NCBDIDguNDU2IDE0LjUwOSw3LjU0NCAxNC41MDksNy4xMjAgMTQuNDQ0IEMgNS4xNzIgMTQuMTQ4LDMuNTI4IDEzLjA4NSwyLjQ5MyAxMS40NTEgQyAyLjI3OSAxMS4xMTQsMS45OTkgMTAuNTI2LDEuODU5IDEwLjExOSBDIDEuNjE4IDkuNDIyLDEuNTE0IDguNzgxLDEuNTE0IDguMDAwIEMgMS41MTQgNi45NjEsMS43MTUgNi4wNzUsMi4xNjAgNS4xNjAgQyAyLjUwMCA0LjQ2MiwyLjg0NiAzLjk4MCwzLjQxMyAzLjQxMyBDIDMuOTgwIDIuODQ2LDQuNDYyIDIuNTAwLDUuMTYwIDIuMTYwIEMgNi4zMTMgMS41OTksNy41NjcgMS4zOTcsOC44NTMgMS41NjMgTTcuNzA2IDQuMjkwIEMgNy40ODIgNC4zNjMsNy4zNTUgNC40OTEsNy4yOTMgNC43MDUgQyA3LjI1NyA0LjgyNyw3LjI1MyA1LjEwNiw3LjI1OSA2LjgxNiBDIDcuMjY3IDguNzg2LDcuMjY3IDguNzg3LDcuMzI1IDguODk2IEMgNy4zOTggOS4wMzMsNy41MzggOS4xNTcsNy42NzEgOS4yMDQgQyA3LjgwMyA5LjI1MCw4LjE5NyA5LjI1MCw4LjMyOSA5LjIwNCBDIDguNDYyIDkuMTU3LDguNjAyIDkuMDMzLDguNjc1IDguODk2IEMgOC43MzMgOC43ODcsOC43MzMgOC43ODYsOC43NDEgNi44MTYgQyA4Ljc0OSA0LjY2NCw4Ljc0OSA0LjY2Miw4LjU5NiA0LjQ4MSBDIDguNDcyIDQuMzMzLDguMzM5IDQuMjg0LDguMDQwIDQuMjc2IEMgNy44OTMgNC4yNzIsNy43NDMgNC4yNzgsNy43MDYgNC4yOTAgTTcuNzg2IDEwLjUzMCBDIDcuNTk3IDEwLjU5Miw3LjQxMCAxMC43NTMsNy4zMTkgMTAuOTMyIEMgNy4yNDkgMTEuMDcyLDcuMjM3IDExLjMyNSw3LjI5NCAxMS40OTUgQyA3LjM4OCAxMS43ODAsNy42OTcgMTIuMDAwLDguMDAwIDEyLjAwMCBDIDguMzAzIDEyLjAwMCw4LjYxMiAxMS43ODAsOC43MDYgMTEuNDk1IEMgOC43NjMgMTEuMzI1LDguNzUxIDExLjA3Miw4LjY4MSAxMC45MzIgQyA4LjYxNiAxMC44MDQsOC40NjAgMTAuNjQ2LDguMzMzIDEwLjU4MCBDIDguMjE3IDEwLjUyMCw3LjkwNCAxMC40OTEsNy43ODYgMTAuNTMwICIgc3Ryb2tlPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=';

const searchbarComponentCss = ":host{display:block;--font-size:16px;--font-style:normal;--font-family:Arial, sans-serif;--theme-color:#007bff;--width-dimension:100%}.search-container{width:var(--width-dimension);font-size:var(--font-size);font-style:var(--font-style);font-family:var(--font-family);color:#333}.search-container .subheading{color:#27274b;font-weight:700}.search-box{display:flex;align-items:center;margin-bottom:20px;padding:10px;border:1px solid #ddd;border-radius:4px;background-color:#fff;margin-top:12px}.search-box input{flex:1;border:none;outline:none;font-size:var(--font-size);font-family:var(--font-family);padding-left:10px}.search-box input::placeholder{color:#aaa}.search-box .search-icon{display:flex;align-items:center;justify-content:center;margin-right:10px}/*! ================================== RESPONSE STYLINGS ===========================================*/.response-section{margin-top:10px;height:500px;display:flex;box-shadow:rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;border-left-width:6px;border-left-color:var(--theme-color);border-left-style:solid}.response-text{overflow-wrap:break-word;overflow-y:scroll;flex:1;background:#f8f8f8;padding:20px;border-radius:4px}.response-text p{color:rgb(114, 114, 114);font-size:16px;text-align:justify}.references{flex:1;background:#e2e2e2;padding:20px;border-radius:4px}.references li{font-size:16px}.references ul{list-style:none;padding:0}.references li{margin-bottom:5px}.references a{color:var(--theme-color);text-decoration:none}.references a:hover{text-decoration:underline}.no-response{margin-top:14px;background:#d3f5ff;color:#12728f;padding:20px;border-radius:0.7rem;font-size:16px}.error-container{display:flex;flex-direction:column;align-items:center;justify-content:center;height:auto;width:fit-content;padding:1rem 2rem;border-radius:0.7rem;background-color:rgb(255, 197, 197);gap:8px;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;box-shadow:rgba(99, 99, 99, 0.2) 0px 2px 8px 0px}.error-container .image-container{display:flex;align-items:center;gap:4px}.error-container .image-container img{height:16px;fill:#8a0202}.error-container .error-title{font-weight:900;color:#8a0202;font-size:16px}.error-container .error-message{color:#2f2f2f;font-size:16px}";

const SearchComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.query = '';
        this.responseText = '';
        this.references = [];
        this.hasResponse = false;
        this.isLoading = true;
        this.errorMessage = '';
        this.userId = '';
        this.widgetId = '';
        this.apiKey = '';
        this.fontSize = '16px';
        this.fontStyle = 'normal';
        this.fontFamily = 'Arial, sans-serif';
        this.themeColor = '#007BFF';
        this.widthDimension = '100%';
        this.variant = 1;
        this.flowId = '';
    }
    async componentWillLoad() {
        try {
            if (!this.apiKey)
                throw new Error('API key is required.');
            if (!this.userId)
                throw new Error('Invalid user-id');
            const isValid = await this.validateApiKey(this.apiKey);
            if (!isValid)
                throw new Error();
            this.isLoading = false;
        }
        catch (error) {
            console.log('ERROR BLOCK', this.errorMessage);
            this.isLoading = false;
        }
    }
    async validateApiKey(apiKey) {
        try {
            const URI = `http://localhost:8000/main/api/widget/users/${this.userId}/widgetId/${this.widgetId}/validate-key?apiKey=${apiKey}`;
            const response = await fetch(URI, {
                method: 'GET',
            });
            const result = await response.json();
            if (response.ok && result.status)
                return true;
            else {
                console.error('API Key validation failed:', result.message);
                this.errorMessage = result.message;
                return false;
            }
        }
        catch (error) {
            console.error('Error validating API key:', error);
            return false;
        }
    }
    async searchApi(data) {
        try {
            this.isLoading = true;
            const response = await fetch(`http://localhost:8000/flow/api/v1/prediction/${this.flowId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: data }),
            });
            this.isLoading = false;
            const result = await response.json();
            this.responseText = result === null || result === void 0 ? void 0 : result.text;
            return result;
        }
        catch (error) {
            console.error('Error', error);
            return false;
        }
    }
    handleSearchChange(event) {
        const input = event.target;
        this.query = input.value;
    }
    async handleSearchSubmit(event) {
        if (event.key === 'Enter' && this.query.trim() !== '') {
            this.searchApi(this.query);
            this.references = ['https://example.com/reference1', 'https://example.com/reference2'];
            this.hasResponse = true;
        }
        else if (event.key === 'Enter') {
            this.responseText = '';
            this.references = [];
            this.hasResponse = false;
        }
    }
    renderLoading() {
        return h("div", { class: "loading" }, "Loading...");
    }
    renderError() {
        return (h("div", { class: "error-container" }, h("div", { class: 'image-container' }, h("img", { src: errorIconSvg, alt: "" }), h("span", { class: "error-title" }, "Fourcx-Error")), h("span", { class: "error-message" }, this.errorMessage)));
    }
    renderNoResponse() {
        return (h("div", { class: "no-response" }, h("p", null, "Here, you can experiment with design templates using realtime data rendered within the component. Simply enter a prompt in the search bar and press \"Enter\" to view the results.")));
    }
    renderResponseSectionVarient01() {
        return (h("div", { class: "response-section " }, h("div", { class: "response-text" }, this.isLoading && this.renderLoading(), !this.isLoading && h("p", null, this.responseText)), h("div", { class: "references" }, h("span", { class: "subheading" }, "References"), h("ol", null, this.references.map(ref => (h("li", null, h("a", { href: ref, target: "_blank" }, ref))))))));
    }
    renderResponseSectionVarient02() {
        return (h("div", { class: "response-section" }, h("div", { class: "response-text" }, this.isLoading && this.renderLoading(), !this.isLoading && h("p", null, this.responseText))));
    }
    render() {
        const styleVars = {
            '--font-size': this.fontSize,
            '--font-style': this.fontStyle,
            '--font-family': this.fontFamily,
            '--theme-color': this.themeColor,
            '--width-dimension': this.widthDimension,
        };
        // if (this.isLoading) {
        //   return (
        //     <div class="search-container" style={styleVars}>
        //       {this.renderLoading()}
        //     </div>
        //   );
        // }
        if (this.errorMessage) {
            return (h("div", { class: "search-container", style: styleVars }, this.renderError()));
        }
        return (h("div", { class: "search-container", style: styleVars }, h("span", { class: "subheading" }, "Search Bar"), h("div", { class: "search-box" }, h("span", { class: "search-icon" }, h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "24", height: "24", fill: "#27274b" }, h("path", { d: "M10 2a8 8 0 015.29 13.71l5 5a1 1 0 01-1.42 1.42l-5-5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" }))), h("input", { type: "text", placeholder: "Enter your search query...", value: this.query, onInput: event => this.handleSearchChange(event), onKeyDown: event => this.handleSearchSubmit(event) })), h("span", { class: "subheading" }, "Given Instruction"), this.hasResponse ? (this.variant === 1 ? this.renderResponseSectionVarient01() : this.renderResponseSectionVarient02()) : this.renderNoResponse()));
    }
};
SearchComponent.style = searchbarComponentCss;

export { SearchComponent as searchbar_component };

//# sourceMappingURL=searchbar-component.entry.js.map
import { r as registerInstance, h } from './index-262852fb.js';

const sendIconSvg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzZW5kIiBjbGFzcz0iaWNvbiBnbHlwaCI+PHBhdGggZD0iTTIxLjY2LDEyYTIsMiwwLDAsMS0xLjE0LDEuODFMNS44NywyMC43NUEyLjA4LDIuMDgsMCwwLDEsNSwyMWEyLDIsMCwwLDEtMS44Mi0yLjgyTDUuNDYsMTNIMTFhMSwxLDAsMCwwLDAtMkg1LjQ2TDMuMTgsNS44N0EyLDIsMCwwLDEsNS44NiwzLjI1aDBsMTQuNjUsNi45NEEyLDIsMCwwLDEsMjEuNjYsMTJaIiBzdHlsZT0iZmlsbDp3aGl0ZSI+PC9wYXRoPjwvc3ZnPg==';

const initialThemeConfig = {
    'header-component': {
        backgroundColor: 'white',
        textColor: '#344767',
        fontFamily: 'Arial',
        fontSize: '18px',
    },
    'avatar-component': {
        backgroundColor: '#674e80',
        textColor: 'white',
    },
    'message-container-component': {
        backgroundColor: '#e9e1f5',
        textColor: '#3b2b54',
        fontFamily: 'Arial',
        fontSize: '12px',
    },
    'bot-message-container': {
        backgroundColor: 'white',
        textColor: 'black',
        fontFamily: 'Arial',
        fontSize: '12px',
    },
    'send-button-component': {
        backgroundColor: '#222641',
    },
};
const initialMessage = [{ text: 'Hello, how can I assist you today?', sender: 'bot', time: new Date().toLocaleTimeString() }];

const chatbotComponentCss = "*{font-family:Arial, Helvetica, sans-serif}.icon-button{width:35px;height:35px;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg, #e5e5e5, #f8f9fa);border:none;border-radius:4px;cursor:pointer;transition:background-color 0.3s ease, transform 0.2s ease}.icon-button:hover{background-color:#d9eafd;transform:scale(1.1)}.icon-button.close{background:linear-gradient(90deg, #ffd1d1, #ffc3c3)}.icon-button.close:hover{background-color:#ff8a8a}.spinner-circle{width:20px;height:20px;border:4px solid rgba(0, 0, 0, 0.1);border-top:4px solid #40128a;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";

const ChatbotComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        // Methods
        this.handleSendMessage = async () => {
            if (this.newMessage.trim() === '')
                return;
            const message = {
                text: this.newMessage,
                sender: 'user',
                time: new Date().toLocaleTimeString(),
                isRead: false,
            };
            this.messages = [...this.messages, message];
            const fetchedResponse = await this.queryAPI(message.text);
            const botMessage = {
                text: fetchedResponse,
                sender: 'bot',
                time: new Date().toLocaleTimeString(),
                isRead: false,
            };
            this.messages = [...this.messages, botMessage];
            this.newMessage = '';
        };
        this.handleInputChange = (event) => {
            const input = event.target;
            this.newMessage = input.value;
        };
        // Toggle Chat Visibility
        this.toggleChat = () => {
            this.isChatOpen = !this.isChatOpen;
            this.isMinimized = false; // Reset minimized state
        };
        // Minimize Chat
        this.minimizeChat = () => {
            this.isChatOpen = false;
        };
        // Close Chat
        this.closeChat = () => {
            this.isChatOpen = false;
        };
        this.headerTitle = '';
        this.themeConfiguration = undefined;
        this.chatBubbleColor = '';
        this.height = '';
        this.width = '';
        this.isChatOpenOnLoad = false;
        this.flowId = '';
        this.messages = initialMessage;
        this.newMessage = '';
        this.isChatOpen = this.isChatOpenOnLoad;
        this.isMinimized = false;
        this.hasResponse = false;
        this.isLoading = false;
        this.errorMessage = '';
    }
    parseThemeConfig(newValue) {
        try {
            this.parsedThemeConfig = JSON.parse(newValue);
            // console.log('Parsed Theme Config:', this.parsedThemeConfig);
        }
        catch (error) {
            console.error('Invalid JSON passed to themeConfiguration:', error);
        }
    }
    componentWillLoad() {
        // Ensure it's parsed during initialization as well
        this.parseThemeConfig(this.themeConfiguration);
    }
    async queryAPI(data) {
        try {
            this.isLoading = true;
            const response = await fetch(`http://localhost:8000/flow/api/v1/prediction/${this.flowId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: data }),
            });
            const result = await response.json();
            const { text } = result;
            return text;
        }
        catch (error) {
            console.error('Error', error);
            return '';
        }
        finally {
            this.isLoading = false;
        }
    }
    componentDidRender() {
        if (this.messageContainerRef) {
            this.messageContainerRef.scrollTop = this.messageContainerRef.scrollHeight;
        }
    }
    loadingSpinner() {
        return (h("div", { class: "spinner", style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            } }, h("div", { class: "spinner-circle" })));
    }
    render() {
        return (h("div", { key: '1be9a0655bccc8f9e71db70e35694c7bab75b2b4', class: 'main-container' }, !this.isChatOpen && (h("div", { key: '8d585bc4019c0931421df841ad3ca107d48e2f34', onClick: this.toggleChat, style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: this.chatBubbleColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }, title: "Open Chat" }, h("svg", { key: 'e79a962a16ae629b6ee959575bd72ee804006da9', xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "#fff", width: "36", height: "36" }, h("path", { key: '2579d363846c92afe71ebff847be3d97e3afa6cf', d: "M12 2C6.48 2 2 6.48 2 12c0 2.64 1.03 5.05 2.73 6.87V22l4.36-2.42c.84.25 1.74.38 2.65.38 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.83 0-1.63-.13-2.39-.38l-.43-.14-2.79 1.55v-2.72l-.34-.36C5.37 16.96 4 14.6 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm-1-7h6v2h-6v-2zm0-4h6v2h-6v-2z" })))), this.isChatOpen && (h("div", { key: 'cd2ac3e46e1d6f24573d7b3a66447da1bdb0a650', style: {
                display: this.isMinimized ? 'none' : 'flex',
                flexDirection: 'column',
                height: this.height,
                border: '1px solid #ddd',
                width: this.width,
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                zIndex: '1000',
            } }, h("div", { key: '57e406b2c574050e1ea4e4bfb724642af4722078', id: "chatbot-header", style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                borderBottom: '1px solid #ddd',
                backgroundColor: this.parsedThemeConfig['header-component'].backgroundColor,
            } }, h("div", { key: 'e066d9e16507d28f45cf8a5203285334bc13ce8c', style: {
                fontSize: this.parsedThemeConfig['header-component'].fontSize,
                fontFamily: this.parsedThemeConfig['header-component'].fontFamily,
                fontWeight: 'bold',
                textAlign: 'center',
                color: this.parsedThemeConfig['header-component'].textColor,
            } }, this.headerTitle), h("div", { key: '402d1e70e2cef0d992d08905e5c9583372161e7a', style: { display: 'flex', gap: '0.5rem' } }, h("button", { key: 'a896e9b134b02bdcf35c452a8684bdef4ac08309', onClick: this.minimizeChat, class: "icon-button", title: "Minimize" }, "\u2500"), h("button", { key: '056de4f779e7a5552001f9655bcd4f487d5743b6', onClick: this.closeChat, class: "icon-button close", title: "Close" }, "\u2716"))), h("div", { key: '307dd31bcc3d86d38fe797c9f9986c31f0d64852', id: "message-container", ref: el => (this.messageContainerRef = el), style: {
                flex: '1',
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
            } }, this.messages.map((message, index) => (h("div", { key: index, style: {
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            } }, message.sender !== 'user' && (h("div", { style: {
                backgroundColor: this.parsedThemeConfig['avatar-component'].backgroundColor,
                color: this.parsedThemeConfig['avatar-component'].textColor,
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '14px',
                marginRight: '0.5rem',
            } }, message.sender.charAt(0).toUpperCase())), h("div", { style: {
                background: message.sender === 'user' ? this.parsedThemeConfig['message-container-component'].backgroundColor : 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                maxWidth: '70%',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                textAlign: message.sender === 'user' ? 'right' : 'left',
            } }, h("div", { style: { color: message.sender === 'user' ? this.parsedThemeConfig['message-container-component'].textColor : '#000', fontSize: '0.9rem' } }, message.text), h("div", { style: { fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' } }, message.time, " ", message.sender === 'user' && '✔'))))), this.isLoading && this.loadingSpinner()), h("div", { key: '1021c50e69338d8158f0b6a6c1f2abec9ac04c57', id: "input-section", style: {
                display: 'flex',
                padding: '1rem',
                borderTop: '1px solid #ddd',
                gap: '1rem',
            } }, h("input", { key: '26e121b1e0d35a7151bb6b28b59c5591f6c52a2e', type: "text", placeholder: "Type a message...", value: this.newMessage, onInput: this.handleInputChange, onKeyPress: e => e.key === 'Enter' && this.handleSendMessage(), style: {
                flex: '1',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '1rem',
            } }), h("button", { key: '893bcd2c1336dcc5fc0dd0484d8cf686c3ddde76', class: 'send-button', onClick: this.handleSendMessage, style: {
                backgroundColor: this.parsedThemeConfig['send-button-component'].backgroundColor,
                fill: 'white',
                padding: '0.5rem 0.75rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
            } }, h("img", { key: '99934a1a3bd368f6fb9e0c2e745d47003ec09095', src: sendIconSvg, height: 20, alt: "send-button-icon" })))))));
    }
    static get watchers() { return {
        "themeConfiguration": ["parseThemeConfig"]
    }; }
};
ChatbotComponent.style = chatbotComponentCss;

export { ChatbotComponent as chatbot_component };

//# sourceMappingURL=chatbot-component.entry.js.map
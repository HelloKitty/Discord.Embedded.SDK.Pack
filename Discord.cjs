'use strict';

var index = require('./_virtual/index.cjs');
var index$2 = require('./schema/index.cjs');
var index$1 = require('./commands/index.cjs');
var error = require('./error.cjs');
var events = require('./schema/events.cjs');
var Constants = require('./Constants.cjs');
var getDefaultSdkConfiguration = require('./utils/getDefaultSdkConfiguration.cjs');
var console$1 = require('./utils/console.cjs');
var _package = require('./package.json.cjs');
var common = require('./schema/common.cjs');
var v4 = require('./lib/uuid/dist/esm-browser/v4.cjs');

exports.Opcodes = void 0;
(function (Opcodes) {
    Opcodes[Opcodes["HANDSHAKE"] = 0] = "HANDSHAKE";
    Opcodes[Opcodes["FRAME"] = 1] = "FRAME";
    Opcodes[Opcodes["CLOSE"] = 2] = "CLOSE";
    Opcodes[Opcodes["HELLO"] = 3] = "HELLO";
})(exports.Opcodes || (exports.Opcodes = {}));
const ALLOWED_ORIGINS = new Set(getAllowedOrigins());
function getAllowedOrigins() {
    if (typeof window === 'undefined')
        return [];
    return [
        window.location.origin,
        'https://discord.com',
        'https://discordapp.com',
        'https://ptb.discord.com',
        'https://ptb.discordapp.com',
        'https://canary.discord.com',
        'https://canary.discordapp.com',
        'https://staging.discord.co',
        'http://localhost:3333',
        'https://pax.discord.com',
        'null',
    ];
}
/**
 * The embedded application is running in an IFrame either within the main Discord client window or in a popout. The RPC server is always running in the main Discord client window. In either case, the referrer is the correct origin.
 */
function getRPCServerSource() {
    var _a;
    return [(_a = window.parent.opener) !== null && _a !== void 0 ? _a : window.parent, !!document.referrer ? document.referrer : '*'];
}
class DiscordSDK {
    getTransfer(payload) {
        var _a;
        switch (payload.cmd) {
            case common.Commands.SUBSCRIBE:
            case common.Commands.UNSUBSCRIBE:
                return undefined;
            default:
                return (_a = payload.transfer) !== null && _a !== void 0 ? _a : undefined;
        }
    }
    constructor(clientId, configuration) {
        this.sdkVersion = _package.version;
        this.mobileAppVersion = null;
        this.source = null;
        this.sourceOrigin = '';
        this.eventBus = new index.default();
        this.pendingCommands = new Map();
        this.sendCommand = (payload) => {
            var _a;
            if (this.source == null)
                throw new Error('Attempting to send message before initialization');
            const nonce = v4.default();
            (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([exports.Opcodes.FRAME, Object.assign(Object.assign({}, payload), { nonce })], this.sourceOrigin, this.getTransfer(payload));
            const promise = new Promise((resolve, reject) => {
                this.pendingCommands.set(nonce, { resolve, reject });
            });
            return promise;
        };
        this.commands = index$1.default(this.sendCommand);
        /**
         * WARNING - All "console" logs are emitted as messages to the Discord client
         *  If you write "console.log" anywhere in handleMessage or subsequent message handling
         * there is a good chance you will cause an infinite loop where you receive a message
         * which causes "console.log" which sends a message, which causes the discord client to
         * send a reply which causes handleMessage to fire again, and again to inifinity
         *
         * If you need to log within handleMessage, consider setting
         * config.disableConsoleLogOverride to true when initializing the SDK
         */
        this.handleMessage = (event) => {
            if (!ALLOWED_ORIGINS.has(event.origin))
                return;
            const tuple = event.data;
            if (!Array.isArray(tuple)) {
                return;
            }
            const [opcode, data] = tuple;
            switch (opcode) {
                case exports.Opcodes.HELLO:
                    // backwards compat; the Discord client will still send HELLOs for old applications.
                    //
                    // TODO: figure out compatibility approach; it would be easier to maintain compatibility at the SDK level, not the underlying RPC protocol level...
                    return;
                case exports.Opcodes.CLOSE:
                    return this.handleClose(data);
                case exports.Opcodes.HANDSHAKE:
                    return this.handleHandshake();
                case exports.Opcodes.FRAME:
                    return this.handleFrame(data);
                default:
                    throw new Error('Invalid message format');
            }
        };
        this.isReady = false;
        this.clientId = clientId;
        this.configuration = configuration !== null && configuration !== void 0 ? configuration : getDefaultSdkConfiguration.default();
        if (typeof window !== 'undefined') {
            window.addEventListener('message', this.handleMessage);
        }
        if (typeof window === 'undefined') {
            this.frameId = '';
            this.instanceId = '';
            this.customId = null;
            this.referrerId = null;
            this.platform = Constants.Platform.DESKTOP;
            this.guildId = null;
            this.channelId = null;
            this.locationId = null;
            return;
        }
        // START Capture URL Query Params
        const urlParams = new URLSearchParams(this._getSearch());
        const frameId = urlParams.get('frame_id');
        if (!frameId) {
            throw new Error('frame_id query param is not defined');
        }
        this.frameId = frameId;
        const instanceId = urlParams.get('instance_id');
        if (!instanceId) {
            throw new Error('instance_id query param is not defined');
        }
        this.instanceId = instanceId;
        const platform = urlParams.get('platform');
        if (!platform) {
            throw new Error('platform query param is not defined');
        }
        else if (platform !== Constants.Platform.DESKTOP && platform !== Constants.Platform.MOBILE) {
            throw new Error(`Invalid query param "platform" of "${platform}". Valid values are "${Constants.Platform.DESKTOP}" or "${Constants.Platform.MOBILE}"`);
        }
        this.platform = platform;
        this.customId = urlParams.get('custom_id');
        this.referrerId = urlParams.get('referrer_id');
        this.guildId = urlParams.get('guild_id');
        this.channelId = urlParams.get('channel_id');
        this.locationId = urlParams.get('location_id');
        this.mobileAppVersion = urlParams.get('mobile_app_version');
        // END Capture URL Query Params
        [this.source, this.sourceOrigin] = getRPCServerSource();
        this.addOnReadyListener();
        this.handshake();
    }
    close(code, message) {
        var _a;
        window.removeEventListener('message', this.handleMessage);
        const nonce = v4.default();
        (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([exports.Opcodes.CLOSE, { code, message, nonce }], this.sourceOrigin);
    }
    async subscribe(event, listener, ...rest) {
        const [subscribeArgs] = rest;
        const listenerCount = this.eventBus.listenerCount(event);
        const emitter = this.eventBus.on(event, listener);
        // If first subscription, subscribe via RPC
        if (Object.values(events.Events).includes(event) && event !== events.Events.READY && listenerCount === 0) {
            await this.sendCommand({
                cmd: common.Commands.SUBSCRIBE,
                args: subscribeArgs,
                evt: event,
            });
        }
        return emitter;
    }
    async unsubscribe(event, listener, ...rest) {
        const [unsubscribeArgs] = rest;
        if (event !== events.Events.READY && this.eventBus.listenerCount(event) === 1) {
            await this.sendCommand({
                cmd: common.Commands.UNSUBSCRIBE,
                evt: event,
                args: unsubscribeArgs,
            });
        }
        return this.eventBus.off(event, listener);
    }
    async ready() {
        if (this.isReady) {
            return;
        }
        else {
            await new Promise((resolve) => {
                this.eventBus.once(events.Events.READY, resolve);
            });
        }
    }
    parseMajorMobileVersion() {
        if (this.mobileAppVersion && this.mobileAppVersion.includes('.')) {
            try {
                return parseInt(this.mobileAppVersion.split('.')[0]);
            }
            catch (_a) {
                return Constants.UNKNOWN_VERSION_NUMBER;
            }
        }
        return Constants.UNKNOWN_VERSION_NUMBER;
    }
    handshake() {
        var _a;
        const handshakePayload = {
            v: 1,
            encoding: 'json',
            client_id: this.clientId,
            frame_id: this.frameId,
        };
        const majorMobileVersion = this.parseMajorMobileVersion();
        if (this.platform === Constants.Platform.DESKTOP || majorMobileVersion >= Constants.HANDSHAKE_SDK_VERSION_MINIMUM_MOBILE_VERSION) {
            handshakePayload['sdk_version'] = this.sdkVersion;
        }
        (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([exports.Opcodes.HANDSHAKE, handshakePayload], this.sourceOrigin);
    }
    addOnReadyListener() {
        this.eventBus.once(events.Events.READY, () => {
            this.overrideConsoleLogging();
            this.isReady = true;
        });
    }
    overrideConsoleLogging() {
        if (this.configuration.disableConsoleLogOverride)
            return;
        const sendCaptureLogCommand = (level, message) => {
            this.commands.captureLog({
                level,
                message,
            });
        };
        console$1.consoleLevels.forEach((level) => {
            console$1.wrapConsoleMethod(console, level, sendCaptureLogCommand);
        });
    }
    handleClose(data) {
        index$2.ClosePayload.parse(data);
    }
    handleHandshake() { }
    handleFrame(payload) {
        var _a, _b;
        let parsed;
        try {
            parsed = index$2.parseIncomingPayload(payload);
        }
        catch (e) {
            console.error('Failed to parse', payload);
            console.error(e);
            return;
        }
        if (parsed.cmd === 'DISPATCH') {
            this.eventBus.emit(parsed.evt, parsed.data);
        }
        else {
            if (parsed.evt === events.ERROR) {
                // In response to a command
                if (parsed.nonce != null) {
                    (_a = this.pendingCommands.get(parsed.nonce)) === null || _a === void 0 ? void 0 : _a.reject(parsed.data);
                    this.pendingCommands.delete(parsed.nonce);
                    return;
                }
                // General error
                this.eventBus.emit('error', new error.SDKError(parsed.data.code, parsed.data.message));
            }
            if (parsed.nonce == null) {
                console.error('Missing nonce', payload);
                return;
            }
            (_b = this.pendingCommands.get(parsed.nonce)) === null || _b === void 0 ? void 0 : _b.resolve(parsed);
            this.pendingCommands.delete(parsed.nonce);
        }
    }
    _getSearch() {
        return typeof window === 'undefined' ? '' : window.location.search;
    }
}

exports.DiscordSDK = DiscordSDK;

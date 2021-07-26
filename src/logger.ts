import { isBrowser } from "./browser_or_node";

export type { OrdaLogger };
export { OrdaLoggerFactory };

interface OrdaLogger {
    trace: logFunction;
    debug: logFunction;
    info: logFunction;
    warn: logFunction;
    error: logFunction;
    log: logFunction;
}

type logFunction = (message?: unknown, ...optionalParams: unknown[]) => void;

interface IConsole {
    trace: logFunction;
    debug: logFunction;
    info: logFunction;
    warn: logFunction;
    error: logFunction;
}

export enum OrdaLogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    SILENT = "silent"
}

const logColors: Record<OrdaLogLevel, string> = {
    trace: '\x1B[36m',
    debug: '\x1B[33m',
    info: '\x1b[42m',
    warn: '\x1B[45m',
    error: '\x1B[41m',
    silent: '\x1B[107m',
};

const LogLevels: Record<OrdaLogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5,
};

const posToBackend = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        // anonymous function, not arrow
        descriptor.value = function (...args: any[]) {
            const posFile = getFilePos(2);
            args.push('at ', posFile);
            return originalMethod.apply(this, args);
        };
    };
};

const REGEX = /([at].*)/g;

function getFilePos(whichStack: number): string {
    const errStr = new Error()?.stack;
    if (errStr) {
        const results = errStr.match(REGEX);
        let errPos = results && results.length > whichStack + 1 ? results[whichStack] : '';
        errPos = errPos.replace(/\\/g, '/').replace(/[(|)]/g, '');
        const begin = Math.max(errPos.indexOf('/src/'), errPos.indexOf('/test/'), 0);
        return errPos.substring(begin);
    }
    return '';
}

function withFilePos(fn: logFunction, header?: string): logFunction {
    const errPos = getFilePos(3);
    return fn.bind(null, `${errPos} |${header}`);
}

class OrdaConsole implements IConsole {
    private readonly name: string;
    private withPos: boolean;
    private _logLevel: OrdaLogLevel;
    readonly original: IConsole;

    _trace: logFunction;
    _debug: logFunction;
    _info: logFunction;
    _warn: logFunction;
    _error: logFunction;

    constructor(name: string, withPos = true, logLevel?: OrdaLogLevel, iConsole?: IConsole) {
        this.name = name;
        if (iConsole) {
            this.original = iConsole;
        } else {
            this.original = console;
        }
        this.withPos = withPos;
        if (logLevel) {
            this._logLevel = logLevel;
        } else {
            this._logLevel = OrdaLogLevel.TRACE;
        }
        this._trace = this.original.trace.bind(this, this.head(OrdaLogLevel.TRACE));
        this._debug = this.original.debug.bind(this, this.head(OrdaLogLevel.DEBUG));
        this._info = this.original.info.bind(this, this.head(OrdaLogLevel.INFO));
        this._warn = this.original.warn.bind(this, this.head(OrdaLogLevel.WARN));
        this._error = this.original.error.bind(this, this.head(OrdaLogLevel.ERROR));
    }

    setWithPos(withPos: boolean) {
        this.withPos = withPos;
    }

    setLogLevel(level: OrdaLogLevel) {
        this._logLevel = level;
    }

    private dumb(): void {
        // do nothing
    }

    private isSilent(ll: OrdaLogLevel) {
        return LogLevels[this._logLevel] > LogLevels[ll]; //trace(0) >= trace(0) debug(1)
    }

    private head(ll: OrdaLogLevel): string {
        return `🎪|${logColors[ll]}${ll.toUpperCase()}|${this.name}\x1B[0m|`;
    }

    get trace(): logFunction {
        if (this.isSilent(OrdaLogLevel.TRACE)) {
            return this.dumb;
        }
        if (this.withPos && !isBrowser) {
            return withFilePos(this.original.trace, this.head(OrdaLogLevel.TRACE));
        }
        return this._trace;
    }

    get debug(): logFunction {
        if (this.isSilent(OrdaLogLevel.DEBUG)) {
            return this.dumb;
        }
        if (this.withPos && !isBrowser) {
            return withFilePos(this.original.debug, this.head(OrdaLogLevel.DEBUG));
        }
        return this._debug;
    }

    get info(): logFunction {
        if (this.isSilent(OrdaLogLevel.INFO)) {
            return this.dumb;
        }
        if (this.withPos && !isBrowser) {
            return withFilePos(this.original.info, this.head(OrdaLogLevel.INFO));
        }
        return this._info;
    }

    get warn(): logFunction {
        if (this.isSilent(OrdaLogLevel.WARN)) {
            return this.dumb;
        }
        if (this.withPos && !isBrowser) {
            return withFilePos(this.original.warn, this.head(OrdaLogLevel.WARN));
        }
        return this._warn;
    }

    get error(): logFunction {
        if (this.isSilent(OrdaLogLevel.ERROR)) {
            return this.dumb;
        }
        if (this.withPos && !isBrowser) {
            return withFilePos(this.original.error, this.head(OrdaLogLevel.ERROR));
        }
        return this._error;
    }

    @posToBackend()
    log(message?: unknown, ...optionalParams: unknown[]): void {
        this.original.info(message, ...optionalParams);
    }
}

class OrdaLoggerFactory {
    private _logLevel: OrdaLogLevel;
    private readonly iConsole: IConsole;

    constructor(logLevel: OrdaLogLevel = OrdaLogLevel.TRACE, iConsole?: IConsole) {
        this._logLevel = logLevel;
        if (iConsole) {
            this.iConsole = iConsole;
        } else {
            this.iConsole = console;
        }
    }

    set logLevel(value: OrdaLogLevel) {
        this._logLevel = value;
    }

    getLogger(name: string): OrdaLogger {
        return new OrdaConsole(name, true, this._logLevel, this.iConsole);
    }
}
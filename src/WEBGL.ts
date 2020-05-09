// Check if WebGL is available

export class WEBGL {
    static isWebGLAvailable() {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    static isWebGL2Available() {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    }

    static getWebGLErrorMessage() {
        return this.getErrorMessage(1);
    }

    static getWebGL2ErrorMessage() {
        return this.getErrorMessage(2);
    }

    static getErrorMessage(version: number) {
        var names: { [key: number]: any } = {
            1: 'WebGL',
            2: 'WebGL 2'
        };
        var contexts: { [key: number]: any } = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };

        var message = `Sorry, your ${contexts[version] ? 'graphics card' : 'browser'} does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">${names[version]}</a>.`;
        return message;
    }
}

// Check if WebGL is available

let WEBGL = {
    isWebGLAvailable: function () {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },
    isWebGL2Available: function () {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    },
    getWebGLErrorMessage: function () {
        return this.getErrorMessage(1);
    },
    getWebGL2ErrorMessage: function () {
        return this.getErrorMessage(2);
    },
    getErrorMessage: function (version: number) {
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
};

export default WEBGL;

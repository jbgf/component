window.BlackHoleSolver = {}, function(e, t) {
    e.computeBlackHoleAngleFunction = function(e, o, a, i, n) {
        for (var l = 45, u = i + l, c = r(e, a, u, n), s = function(e, t) {
                for (var r = 0, a = 0; o >= a; a++) r += e[a] * Math.pow(t, a);
                return r
            }, h = [], f = 0; o >= f; f++) h.push(1);
        var x = function(e) {
                for (var t = 0, r = 0; r < c.inAngles.length; r++) {
                    var o = s(e, c.inAngles[r]),
                        a = o - c.outAngles[r];
                    t += a * a
                }
                return t
            },
            d = t.uncmin(x, h);
        return {
            anglePolynomialCoefficients: d.solution,
            maxInBlackHoleAngle: c.maxInBlackHoleAngle
        }
    };
    var r = function(e, t, r, i) {
            for (var n = r / t, l = [], u = 0; r > u; u += n) l.push(u);
            for (var c = a(l, e, i), s = 0, h = [], f = [], x = 0; x < l.length; x++) if (c[x].inBlackHole) s = l[x];
            else if (!isNaN(l[x]) && !isNaN(c[x].angle)) {
                h.push(l[x] + Math.PI);
                var d = c[x].angle;
                d = 0 > d ? -180 - d : 180 - d, f.push(d)
            }
            return {
                maxInBlackHoleAngle: o(s),
                inAngles: h.map(o),
                outAngles: f.map(o)
            }
        },
        o = function(e) {
            return e * Math.PI / 180
        },
        a = function(e, t, r) {
            return e.map(function(e) {
                return c(e, t, 0, 20 * Math.PI, r)
            }).map(function(e) {
                return i(e)
            }).map(function(e) {
                if (n(e)) return {
                    inBlackHole: !0
                };
                var t = l(e),
                    r = {
                        angle: u(t)
                    };
                return r
            })
        },
        i = function(e) {
            for (var r = t.transpose(e.y)[0].map(function(e) {
                return 1 / e
            }), o = e.x, a = [], i = 0; i < r.length && !(r[i] < 0); i++) {
                var n = r[i] * Math.cos(o[i]),
                    l = r[i] * Math.sin(o[i]);
                a.push([n, l])
            }
            return a
        },
        n = function(e) {
            if (e.length < 1) throw "At least one photonPath coord required to compute whether ends in vicinity of black hole";
            var t = e[e.length - 1],
                r = t[0],
                o = t[1];
            return Math.abs(r) < 1 && Math.abs(o) < 1
        },
        l = function(e) {
            if (e.length < 2) throw "Not enough photonPath coords to compute a slope!";
            var t = e[e.length - 2],
                r = e[e.length - 1];
            return {
                xComponent: r[0] - t[0],
                yComponent: r[1] - t[1]
            }
        },
        u = function(e) {
            var t = Math.atan2(e.yComponent, e.xComponent),
                r = 180 * t / Math.PI;
            return r
        },
        c = function(e, r, o, a, i) {
            var n = i || 100;
            return t.dopri(o, a, [1 / r, 1 / (r * Math.tan(e * Math.PI / 180))], s, void 0, n)
        },
        s = function(e, t) {
            var r = t[0],
                o = t[1],
                a = 3 * r * r - r;
            return [o, a]
        }
}(window.BlackHoleSolver, window.numeric), window.BlackHole = {}, function(e, t) {
    window.counter = 0, e.blackHoleifyImage = function(e, t, o) {
        var a = new Image;
        a.crossOrigin = "Anonymous", a.onload = function() {
            r(e, a, o)
        }, a.src = t
    };
    var r = function(e, r, o) {
            var a = document.getElementById(e);
            try {
                var i = fx.canvas()
            } catch (n) {
                return void(a.innerHTML = n)
            }
            var l = i.texture(r);
            i.draw(l).update().replace(a), o = o || {};
            var u = o.distanceFromBlackHole || 80,
                c = o.polynomialDegree || 2,
                s = o.numAngleTableEntries || 1e3,
                h = o.fovAngleInDegrees || 73,
                f = h * Math.PI / 180,
                x = t.computeBlackHoleAngleFunction(u, c, s, h),
                d = !1;
            $(i).mousemove(function(e) {
                var t = $(i).offset(),
                    r = e.pageX - t.left,
                    o = e.pageY - t.top;
                i.draw(l).blackHole(r, o, x, f).update(), d = !0
            }), $(i).mouseleave(function() {
                d && (i.draw(l).update(), d = !1)
            })
        }
}(window.BlackHole, window.BlackHoleSolver);
var fx = function() {
        function e(e, t, r) {
            return Math.max(e, Math.min(t, r))
        }
        function t(e) {
            return {
                _: e,
                loadContentsOf: function(e) {
                    O = this._.gl, this._.loadContentsOf(e)
                },
                destroy: function() {
                    O = this._.gl, this._.destroy()
                }
            }
        }
        function r(e) {
            return t(L.fromElement(e))
        }
        function o(e, t) {
            var r = O.UNSIGNED_BYTE;
            if (O.getExtension("OES_texture_float") && O.getExtension("OES_texture_float_linear")) {
                var o = new L(100, 100, O.RGBA, O.FLOAT);
                try {
                    o.drawTo(function() {
                        r = O.FLOAT
                    })
                } catch (a) {}
                o.destroy()
            }
            this._.texture && this._.texture.destroy(), this._.spareTexture && this._.spareTexture.destroy(), this.width = e, this.height = t, this._.texture = new L(e, t, O.RGBA, r), this._.spareTexture = new L(e, t, O.RGBA, r), this._.extraTexture = this._.extraTexture || new L(0, 0, O.RGBA, r), this._.flippedShader = this._.flippedShader || new H(null, "        uniform sampler2D texture;        varying vec2 texCoord;        void main() {            gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));        }    "), this._.isInitialized = !0
        }
        function a(e, t, r) {
            return this._.isInitialized && e._.width == this.width && e._.height == this.height || o.call(this, t ? t : e._.width, r ? r : e._.height), e._.use(), this._.texture.drawTo(function() {
                H.getDefaultShader().drawRect()
            }), this
        }
        function i() {
            return this._.texture.use(), this._.flippedShader.drawRect(), this
        }
        function n(e, t, r, o) {
            (r || this._.texture).use(), this._.spareTexture.drawTo(function() {
                e.uniforms(t).drawRect()
            }), this._.spareTexture.swapWith(o || this._.texture)
        }
        function l(e) {
            return e.parentNode.insertBefore(this, e), e.parentNode.removeChild(e), this
        }
        function u() {
            var e = new L(this._.texture.width, this._.texture.height, O.RGBA, O.UNSIGNED_BYTE);
            return this._.texture.use(), e.drawTo(function() {
                H.getDefaultShader().drawRect()
            }), t(e)
        }
        function c() {
            var e = this._.texture.width,
                t = this._.texture.height,
                r = new Uint8Array(e * t * 4);
            return this._.texture.drawTo(function() {
                O.readPixels(0, 0, e, t, O.RGBA, O.UNSIGNED_BYTE, r)
            }), r
        }
        function s(e) {
            return function() {
                return O = this._.gl, e.apply(this, arguments)
            }
        }
        function h(e, t, r, o, a, i, n, l) {
            var u = r - a,
                c = o - i,
                s = n - a,
                h = l - i,
                f = e - r + a - n,
                x = t - o + i - l,
                d = u * h - s * c,
                m = (f * h - s * x) / d,
                g = (u * x - f * c) / d;
            return [r - e + m * r, o - t + m * o, m, n - e + g * n, l - t + g * l, g, e, t, 1]
        }
        function f(e) {
            var t = e[0],
                r = e[1],
                o = e[2],
                a = e[3],
                i = e[4],
                n = e[5],
                l = e[6],
                u = e[7],
                c = e[8],
                s = t * i * c - t * n * u - r * a * c + r * n * l + o * a * u - o * i * l;
            return [(i * c - n * u) / s, (o * u - r * c) / s, (r * n - o * i) / s, (n * l - a * c) / s, (t * c - o * l) / s, (o * a - t * n) / s, (a * u - i * l) / s, (r * l - t * u) / s, (t * i - r * a) / s]
        }
        function x(e, t) {
            return [e[0] * t[0] + e[1] * t[3] + e[2] * t[6], e[0] * t[1] + e[1] * t[4] + e[2] * t[7], e[0] * t[2] + e[1] * t[5] + e[2] * t[8], e[3] * t[0] + e[4] * t[3] + e[5] * t[6], e[3] * t[1] + e[4] * t[4] + e[5] * t[7], e[3] * t[2] + e[4] * t[5] + e[5] * t[8], e[6] * t[0] + e[7] * t[3] + e[8] * t[6], e[6] * t[1] + e[7] * t[4] + e[8] * t[7], e[6] * t[2] + e[7] * t[5] + e[8] * t[8]]
        }
        function d(e) {
            var t = e.length;
            this.xa = [], this.ya = [], this.u = [], this.y2 = [], e.sort(function(e, t) {
                return e[0] - t[0]
            });
            for (var r = 0; t > r; r++) this.xa.push(e[r][0]), this.ya.push(e[r][1]);
            this.u[0] = 0, this.y2[0] = 0;
            for (var r = 1; t - 1 > r; ++r) {
                var o = this.xa[r + 1] - this.xa[r - 1],
                    a = (this.xa[r] - this.xa[r - 1]) / o,
                    i = a * this.y2[r - 1] + 2;
                this.y2[r] = (a - 1) / i;
                var n = (this.ya[r + 1] - this.ya[r]) / (this.xa[r + 1] - this.xa[r]) - (this.ya[r] - this.ya[r - 1]) / (this.xa[r] - this.xa[r - 1]);
                this.u[r] = (6 * n / o - a * this.u[r - 1]) / i
            }
            this.y2[t - 1] = 0;
            for (var r = t - 2; r >= 0; --r) this.y2[r] = this.y2[r] * this.y2[r + 1] + this.u[r]
        }
        function m(e, t) {
            return new H(null, e + "    uniform sampler2D texture;    uniform vec2 texSize;    varying vec2 texCoord;    void main() {        vec2 coord = texCoord * texSize;        " + t + "        gl_FragColor = texture2D(texture, coord / texSize);        vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);        if (coord != clampedCoord) {            /* fade to transparent if we are outside the image */            gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));        }    }")
        }
        function g(t, r) {
            return O.brightnessContrast = O.brightnessContrast || new H(null, "        uniform sampler2D texture;        uniform float brightness;        uniform float contrast;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);            color.rgb += brightness;            if (contrast > 0.0) {                color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;            } else {                color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;            }            gl_FragColor = color;        }    "), n.call(this, O.brightnessContrast, {
                brightness: e(-1, t, 1),
                contrast: e(-1, r, 1)
            }), this
        }
        function v(t) {
            for (var r = new d(t), o = [], a = 0; 256 > a; a++) o.push(e(0, Math.floor(256 * r.interpolate(a / 255)), 255));
            return o
        }
        function p(e, t, r) {
            e = v(e), 1 == arguments.length ? t = r = e : (t = v(t), r = v(r));
            for (var o = [], a = 0; 256 > a; a++) o.splice(o.length, 0, e[a], t[a], r[a], 255);
            return this._.extraTexture.initFromBytes(256, 1, o), this._.extraTexture.use(1), O.curves = O.curves || new H(null, "        uniform sampler2D texture;        uniform sampler2D map;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);            color.r = texture2D(map, vec2(color.r)).r;            color.g = texture2D(map, vec2(color.g)).g;            color.b = texture2D(map, vec2(color.b)).b;            gl_FragColor = color;        }    "), O.curves.textures({
                map: 1
            }), n.call(this, O.curves, {}), this
        }
        function T(e) {
            O.denoise = O.denoise || new H(null, "        uniform sampler2D texture;        uniform float exponent;        uniform float strength;        uniform vec2 texSize;        varying vec2 texCoord;        void main() {            vec4 center = texture2D(texture, texCoord);            vec4 color = vec4(0.0);            float total = 0.0;            for (float x = -4.0; x <= 4.0; x += 1.0) {                for (float y = -4.0; y <= 4.0; y += 1.0) {                    vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);                    float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));                    weight = pow(weight, exponent);                    color += sample * weight;                    total += weight;                }            }            gl_FragColor = color / total;        }    ");
            for (var t = 0; 2 > t; t++) n.call(this, O.denoise, {
                exponent: Math.max(0, e),
                texSize: [this.width, this.height]
            });
            return this
        }
        function w(t, r) {
            return O.hueSaturation = O.hueSaturation || new H(null, "        uniform sampler2D texture;        uniform float hue;        uniform float saturation;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);                        /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */            float angle = hue * 3.14159265;            float s = sin(angle), c = cos(angle);            vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;            float len = length(color.rgb);            color.rgb = vec3(                dot(color.rgb, weights.xyz),                dot(color.rgb, weights.zxy),                dot(color.rgb, weights.yzx)            );                        /* saturation adjustment */            float average = (color.r + color.g + color.b) / 3.0;            if (saturation > 0.0) {                color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));            } else {                color.rgb += (average - color.rgb) * (-saturation);            }                        gl_FragColor = color;        }    "), n.call(this, O.hueSaturation, {
                hue: e(-1, t, 1),
                saturation: e(-1, r, 1)
            }), this
        }
        function _(t) {
            return O.noise = O.noise || new H(null, "        uniform sampler2D texture;        uniform float amount;        varying vec2 texCoord;        float rand(vec2 co) {            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);        }        void main() {            vec4 color = texture2D(texture, texCoord);                        float diff = (rand(texCoord) - 0.5) * amount;            color.r += diff;            color.g += diff;            color.b += diff;                        gl_FragColor = color;        }    "), n.call(this, O.noise, {
                amount: e(0, t, 1)
            }), this
        }
        function y(t) {
            return O.sepia = O.sepia || new H(null, "        uniform sampler2D texture;        uniform float amount;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);            float r = color.r;            float g = color.g;            float b = color.b;                        color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));            color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));            color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));                        gl_FragColor = color;        }    "), n.call(this, O.sepia, {
                amount: e(0, t, 1)
            }), this
        }
        function E(e, t) {
            return O.unsharpMask = O.unsharpMask || new H(null, "        uniform sampler2D blurredTexture;        uniform sampler2D originalTexture;        uniform float strength;        uniform float threshold;        varying vec2 texCoord;        void main() {            vec4 blurred = texture2D(blurredTexture, texCoord);            vec4 original = texture2D(originalTexture, texCoord);            gl_FragColor = mix(blurred, original, 1.0 + strength);        }    "), this._.extraTexture.ensureFormat(this._.texture), this._.texture.use(), this._.extraTexture.drawTo(function() {
                H.getDefaultShader().drawRect()
            }), this._.extraTexture.use(1), this.triangleBlur(e), O.unsharpMask.textures({
                originalTexture: 1
            }), n.call(this, O.unsharpMask, {
                strength: t
            }), this._.extraTexture.unuse(1), this
        }
        function b(t) {
            return O.vibrance = O.vibrance || new H(null, "        uniform sampler2D texture;        uniform float amount;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);            float average = (color.r + color.g + color.b) / 3.0;            float mx = max(color.r, max(color.g, color.b));            float amt = (mx - average) * (-amount * 3.0);            color.rgb = mix(color.rgb, vec3(mx), amt);            gl_FragColor = color;        }    "), n.call(this, O.vibrance, {
                amount: e(-1, t, 1)
            }), this
        }
        function C(t, r) {
            return O.vignette = O.vignette || new H(null, "        uniform sampler2D texture;        uniform float size;        uniform float amount;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);                        float dist = distance(texCoord, vec2(0.5, 0.5));            color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));                        gl_FragColor = color;        }    "), n.call(this, O.vignette, {
                size: e(0, t, 1),
                amount: e(0, r, 1)
            }), this
        }
        function A(t, r, o) {
            O.lensBlurPrePass = O.lensBlurPrePass || new H(null, "        uniform sampler2D texture;        uniform float power;        varying vec2 texCoord;        void main() {            vec4 color = texture2D(texture, texCoord);            color = pow(color, vec4(power));            gl_FragColor = vec4(color);        }    ");
            var a = "        uniform sampler2D texture0;        uniform sampler2D texture1;        uniform vec2 delta0;        uniform vec2 delta1;        uniform float power;        varying vec2 texCoord;        " + W + "        vec4 sample(vec2 delta) {            /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(delta, 151.7182), 0.0);                        vec4 color = vec4(0.0);            float total = 0.0;            for (float t = 0.0; t <= 30.0; t++) {                float percent = (t + offset) / 30.0;                color += texture2D(texture0, texCoord + delta * percent);                total += 1.0;            }            return color / total;        }    ";
            O.lensBlur0 = O.lensBlur0 || new H(null, a + "        void main() {            gl_FragColor = sample(delta0);        }    "), O.lensBlur1 = O.lensBlur1 || new H(null, a + "        void main() {            gl_FragColor = (sample(delta0) + sample(delta1)) * 0.5;        }    "), O.lensBlur2 = O.lensBlur2 || new H(null, a + "        void main() {            vec4 color = (sample(delta0) + 2.0 * texture2D(texture1, texCoord)) / 3.0;            gl_FragColor = pow(color, vec4(power));        }    ").textures({
                texture1: 1
            });
            for (var i = [], l = 0; 3 > l; l++) {
                var u = o + l * Math.PI * 2 / 3;
                i.push([t * Math.sin(u) / this.width, t * Math.cos(u) / this.height])
            }
            var c = Math.pow(10, e(-1, r, 1));
            return n.call(this, O.lensBlurPrePass, {
                power: c
            }), this._.extraTexture.ensureFormat(this._.texture), n.call(this, O.lensBlur0, {
                delta0: i[0]
            }, this._.texture, this._.extraTexture), n.call(this, O.lensBlur1, {
                delta0: i[1],
                delta1: i[2]
            }, this._.extraTexture, this._.extraTexture), n.call(this, O.lensBlur0, {
                delta0: i[1]
            }), this._.extraTexture.use(1), n.call(this, O.lensBlur2, {
                power: 1 / c,
                delta0: i[2]
            }), this
        }
        function R(e, t, r, o, a, i) {
            O.tiltShift = O.tiltShift || new H(null, "        uniform sampler2D texture;        uniform float blurRadius;        uniform float gradientRadius;        uniform vec2 start;        uniform vec2 end;        uniform vec2 delta;        uniform vec2 texSize;        varying vec2 texCoord;        " + W + "        void main() {            vec4 color = vec4(0.0);            float total = 0.0;                        /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);                        vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));            float radius = smoothstep(0.0, 1.0, abs(dot(texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;            for (float t = -30.0; t <= 30.0; t++) {                float percent = (t + offset - 0.5) / 30.0;                float weight = 1.0 - abs(percent);                vec4 sample = texture2D(texture, texCoord + delta / texSize * percent * radius);                                /* switch to pre-multiplied alpha to correctly blur transparent images */                sample.rgb *= sample.a;                                color += sample * weight;                total += weight;            }                        gl_FragColor = color / total;                        /* switch back from pre-multiplied alpha */            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;        }    ");
            var l = r - e,
                u = o - t,
                c = Math.sqrt(l * l + u * u);
            return n.call(this, O.tiltShift, {
                blurRadius: a,
                gradientRadius: i,
                start: [e, t],
                end: [r, o],
                delta: [l / c, u / c],
                texSize: [this.width, this.height]
            }), n.call(this, O.tiltShift, {
                blurRadius: a,
                gradientRadius: i,
                start: [e, t],
                end: [r, o],
                delta: [-u / c, l / c],
                texSize: [this.width, this.height]
            }), this
        }
        function D(e) {
            return O.triangleBlur = O.triangleBlur || new H(null, "        uniform sampler2D texture;        uniform vec2 delta;        varying vec2 texCoord;        " + W + "        void main() {            vec4 color = vec4(0.0);            float total = 0.0;                        /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);                        for (float t = -30.0; t <= 30.0; t++) {                float percent = (t + offset - 0.5) / 30.0;                float weight = 1.0 - abs(percent);                vec4 sample = texture2D(texture, texCoord + delta * percent);                                /* switch to pre-multiplied alpha to correctly blur transparent images */                sample.rgb *= sample.a;                                color += sample * weight;                total += weight;            }                        gl_FragColor = color / total;                        /* switch back from pre-multiplied alpha */            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;        }    "), n.call(this, O.triangleBlur, {
                delta: [e / this.width, 0]
            }), n.call(this, O.triangleBlur, {
                delta: [0, e / this.height]
            }), this
        }
        function S(e, t, r) {
            return O.zoomBlur = O.zoomBlur || new H(null, "        uniform sampler2D texture;        uniform vec2 center;        uniform float strength;        uniform vec2 texSize;        varying vec2 texCoord;        " + W + "        void main() {            vec4 color = vec4(0.0);            float total = 0.0;            vec2 toCenter = center - texCoord * texSize;                        /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);                        for (float t = 0.0; t <= 40.0; t++) {                float percent = (t + offset) / 40.0;                float weight = 4.0 * (percent - percent * percent);                vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);                                /* switch to pre-multiplied alpha to correctly blur transparent images */                sample.rgb *= sample.a;                                color += sample * weight;                total += weight;            }                        gl_FragColor = color / total;                        /* switch back from pre-multiplied alpha */            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;        }    "), n.call(this, O.zoomBlur, {
                center: [e, t],
                strength: r,
                texSize: [this.width, this.height]
            }), this
        }
        function F(e, t, r, o) {
            return O.colorHalftone = O.colorHalftone || new H(null, "        uniform sampler2D texture;        uniform vec2 center;        uniform float angle;        uniform float scale;        uniform vec2 texSize;        varying vec2 texCoord;                float pattern(float angle) {            float s = sin(angle), c = cos(angle);            vec2 tex = texCoord * texSize - center;            vec2 point = vec2(                c * tex.x - s * tex.y,                s * tex.x + c * tex.y            ) * scale;            return (sin(point.x) * sin(point.y)) * 4.0;        }                void main() {            vec4 color = texture2D(texture, texCoord);            vec3 cmy = 1.0 - color.rgb;            float k = min(cmy.x, min(cmy.y, cmy.z));            cmy = (cmy - k) / (1.0 - k);            cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);            k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);            gl_FragColor = vec4(1.0 - cmy - k, color.a);        }    "), n.call(this, O.colorHalftone, {
                center: [e, t],
                angle: r,
                scale: Math.PI / o,
                texSize: [this.width, this.height]
            }), this
        }
        function B(e, t, r, o) {
            return O.dotScreen = O.dotScreen || new H(null, "        uniform sampler2D texture;        uniform vec2 center;        uniform float angle;        uniform float scale;        uniform vec2 texSize;        varying vec2 texCoord;                float pattern() {            float s = sin(angle), c = cos(angle);            vec2 tex = texCoord * texSize - center;            vec2 point = vec2(                c * tex.x - s * tex.y,                s * tex.x + c * tex.y            ) * scale;            return (sin(point.x) * sin(point.y)) * 4.0;        }                void main() {            vec4 color = texture2D(texture, texCoord);            float average = (color.r + color.g + color.b) / 3.0;            gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);        }    "), n.call(this, O.dotScreen, {
                center: [e, t],
                angle: r,
                scale: Math.PI / o,
                texSize: [this.width, this.height]
            }), this
        }
        function P(e) {
            return O.edgeWork1 = O.edgeWork1 || new H(null, "        uniform sampler2D texture;        uniform vec2 delta;        varying vec2 texCoord;        " + W + "        void main() {            vec2 color = vec2(0.0);            vec2 total = vec2(0.0);                        /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);                        for (float t = -30.0; t <= 30.0; t++) {                float percent = (t + offset - 0.5) / 30.0;                float weight = 1.0 - abs(percent);                vec3 sample = texture2D(texture, texCoord + delta * percent).rgb;                float average = (sample.r + sample.g + sample.b) / 3.0;                color.x += average * weight;                total.x += weight;                if (abs(t) < 15.0) {                    weight = weight * 2.0 - 1.0;                    color.y += average * weight;                    total.y += weight;                }            }            gl_FragColor = vec4(color / total, 0.0, 1.0);        }    "), O.edgeWork2 = O.edgeWork2 || new H(null, "        uniform sampler2D texture;        uniform vec2 delta;        varying vec2 texCoord;        " + W + "        void main() {            vec2 color = vec2(0.0);            vec2 total = vec2(0.0);                        /* randomize the lookup values to hide the fixed number of samples */            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);                        for (float t = -30.0; t <= 30.0; t++) {                float percent = (t + offset - 0.5) / 30.0;                float weight = 1.0 - abs(percent);                vec2 sample = texture2D(texture, texCoord + delta * percent).xy;                color.x += sample.x * weight;                total.x += weight;                if (abs(t) < 15.0) {                    weight = weight * 2.0 - 1.0;                    color.y += sample.y * weight;                    total.y += weight;                }            }            float c = clamp(10000.0 * (color.y / total.y - color.x / total.x) + 0.5, 0.0, 1.0);            gl_FragColor = vec4(c, c, c, 1.0);        }    "), n.call(this, O.edgeWork1, {
                delta: [e / this.width, 0]
            }), n.call(this, O.edgeWork2, {
                delta: [0, e / this.height]
            }), this
        }
        function U(e, t, r) {
            return O.hexagonalPixelate = O.hexagonalPixelate || new H(null, "        uniform sampler2D texture;        uniform vec2 center;        uniform float scale;        uniform vec2 texSize;        varying vec2 texCoord;        void main() {            vec2 tex = (texCoord * texSize - center) / scale;            tex.y /= 0.866025404;            tex.x -= tex.y * 0.5;                        vec2 a;            if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) a = vec2(floor(tex.x), floor(tex.y));            else a = vec2(ceil(tex.x), ceil(tex.y));            vec2 b = vec2(ceil(tex.x), floor(tex.y));            vec2 c = vec2(floor(tex.x), ceil(tex.y));                        vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);            vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);            vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);            vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);                        float alen = length(TEX - A);            float blen = length(TEX - B);            float clen = length(TEX - C);                        vec2 choice;            if (alen < blen) {                if (alen < clen) choice = a;                else choice = c;            } else {                if (blen < clen) choice = b;                else choice = c;            }                        choice.x += choice.y * 0.5;            choice.y *= 0.866025404;            choice *= scale / texSize;            gl_FragColor = texture2D(texture, choice + center / texSize);        }    "), n.call(this, O.hexagonalPixelate, {
                center: [e, t],
                scale: r,
                texSize: [this.width, this.height]
            }), this
        }
        function k(e) {
            return O.ink = O.ink || new H(null, "        uniform sampler2D texture;        uniform float strength;        uniform vec2 texSize;        varying vec2 texCoord;        void main() {            vec2 dx = vec2(1.0 / texSize.x, 0.0);            vec2 dy = vec2(0.0, 1.0 / texSize.y);            vec4 color = texture2D(texture, texCoord);            float bigTotal = 0.0;            float smallTotal = 0.0;            vec3 bigAverage = vec3(0.0);            vec3 smallAverage = vec3(0.0);            for (float x = -2.0; x <= 2.0; x += 1.0) {                for (float y = -2.0; y <= 2.0; y += 1.0) {                    vec3 sample = texture2D(texture, texCoord + dx * x + dy * y).rgb;                    bigAverage += sample;                    bigTotal += 1.0;                    if (abs(x) + abs(y) < 2.0) {                        smallAverage += sample;                        smallTotal += 1.0;                    }                }            }            vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);            gl_FragColor = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);        }    "), n.call(this, O.ink, {
                strength: e * e * e * e * e,
                texSize: [this.width, this.height]
            }), this
        }
        function I(e, t, r, o) {
            var a = r.anglePolynomialCoefficients,
                i = a.length;
            O.blackHoleShaders = O.blackHoleShaders || {}, O.blackHoleShaders[i] = O.blackHoleShaders[i] || new H(null, "    /* black hole vars */    uniform float distanceFromViewerToImagePlane;    uniform float maxInBlackHoleAngle;    uniform vec2 blackHoleCenter;    uniform float anglePolynomialCoefficients[" + i + "];    /* texture vars */    uniform sampler2D texture;    uniform vec2 texSize;    varying vec2 texCoord;        float anglePolynomialFn(float inAngle) {      float outAngle = 0.0;      for (int i = 0; i < " + i + "; i++) {        outAngle += anglePolynomialCoefficients[i] * pow(inAngle, float(i));      }      return outAngle;    }        void main() {        vec2 coord = texCoord * texSize;        vec2 vecBetweenCoordAndCenter = coord - blackHoleCenter;        float distanceFromCenter = length(vecBetweenCoordAndCenter);        float inAngle = atan(distanceFromCenter, distanceFromViewerToImagePlane);        /* Completely black if in black hole */        if (inAngle <= maxInBlackHoleAngle) {            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);            return;        }        float outAngle = anglePolynomialFn(inAngle);        float outDistanceFromCenter = tan(outAngle) * distanceFromViewerToImagePlane;        vec2 unitVectorBetweenCoordAndCenter = vecBetweenCoordAndCenter / distanceFromCenter;        vec2 outCoord = blackHoleCenter + unitVectorBetweenCoordAndCenter * outDistanceFromCenter;        outCoord = clamp(outCoord, vec2(0.0), texSize);        gl_FragColor = texture2D(texture, outCoord / texSize);    }");
            var l = this.height,
                u = this.width,
                c = Math.sqrt(l * l + u * u) / Math.tan(o);
            return n.call(this, O.blackHoleShaders[i], {
                anglePolynomialCoefficients: {
                    uniformVectorType: "uniform1fv",
                    value: a
                },
                distanceFromViewerToImagePlane: c,
                maxInBlackHoleAngle: r.maxInBlackHoleAngle,
                blackHoleCenter: [e, t],
                texSize: [this.width, this.height]
            }), this
        }
        function z(t, r, o, a) {
            return O.bulgePinch = O.bulgePinch || m("        uniform float radius;        uniform float strength;        uniform vec2 center;    ", "        coord -= center;        float distance = length(coord);        if (distance < radius) {            float percent = distance / radius;            if (strength > 0.0) {                coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);            } else {                coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);            }        }        coord += center;    "), n.call(this, O.bulgePinch, {
                radius: o,
                strength: e(-1, a, 1),
                center: [t, r],
                texSize: [this.width, this.height]
            }), this
        }
        function M(e, t, r) {
            if (O.matrixWarp = O.matrixWarp || m("        uniform mat3 matrix;        uniform bool useTextureSpace;    ", "        if (useTextureSpace) coord = coord / texSize * 2.0 - 1.0;        vec3 warp = matrix * vec3(coord, 1.0);        coord = warp.xy / warp.z;        if (useTextureSpace) coord = (coord * 0.5 + 0.5) * texSize;    "), e = Array.prototype.concat.apply([], e), 4 == e.length) e = [e[0], e[1], 0, e[2], e[3], 0, 0, 0, 1];
            else if (9 != e.length) throw "can only warp with 2x2 or 3x3 matrix";
            return n.call(this, O.matrixWarp, {
                matrix: t ? f(e) : e,
                texSize: [this.width, this.height],
                useTextureSpace: 0 | r
            }), this
        }
        function X(e, t) {
            var r = h.apply(null, t),
                o = h.apply(null, e),
                a = x(f(r), o);
            return this.matrixWarp(a)
        }
        function G(e, t, r, o) {
            return O.swirl = O.swirl || m("        uniform float radius;        uniform float angle;        uniform vec2 center;    ", "        coord -= center;        float distance = length(coord);        if (distance < radius) {            float percent = (radius - distance) / radius;            float theta = percent * percent * angle;            float s = sin(theta);            float c = cos(theta);            coord = vec2(                coord.x * c - coord.y * s,                coord.x * s + coord.y * c            );        }        coord += center;    "), n.call(this, O.swirl, {
                radius: r,
                center: [e, t],
                angle: o,
                texSize: [this.width, this.height]
            }), this
        }
        var N = {};
        !
        function() {
            function e(e) {
                if (!e.getExtension("OES_texture_float")) return !1;
                var t = e.createFramebuffer(),
                    r = e.createTexture();
                e.bindTexture(e.TEXTURE_2D, r), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.bindFramebuffer(e.FRAMEBUFFER, t), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, r, 0);
                var o = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    a = e.createTexture();
                e.bindTexture(e.TEXTURE_2D, a), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 2, 2, 0, e.RGBA, e.FLOAT, new Float32Array(o));
                var i = e.createProgram(),
                    n = e.createShader(e.VERTEX_SHADER),
                    l = e.createShader(e.FRAGMENT_SHADER);
                e.shaderSource(n, "      attribute vec2 vertex;      void main() {        gl_Position = vec4(vertex, 0.0, 1.0);      }    "), e.shaderSource(l, "      uniform sampler2D texture;      void main() {        gl_FragColor = texture2D(texture, vec2(0.5));      }    "), e.compileShader(n), e.compileShader(l), e.attachShader(i, n), e.attachShader(i, l), e.linkProgram(i);
                var u = e.createBuffer();
                e.bindBuffer(e.ARRAY_BUFFER, u), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0]), e.STREAM_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0);
                var c = new Uint8Array(4);
                return e.useProgram(i), e.viewport(0, 0, 1, 1), e.bindTexture(e.TEXTURE_2D, a), e.drawArrays(e.POINTS, 0, 1), e.readPixels(0, 0, 1, 1, e.RGBA, e.UNSIGNED_BYTE, c), 127 === c[0] || 128 === c[0]
            }
            function t() {}
            function r(e) {
                return void 0 === e.$OES_texture_float_linear$ && Object.defineProperty(e, "$OES_texture_float_linear$", {
                    enumerable: !1,
                    configurable: !1,
                    writable: !1,
                    value: new t
                }), e.$OES_texture_float_linear$
            }
            function o(e) {
                return "OES_texture_float_linear" === e ? r(this) : l.call(this, e)
            }
            function a() {
                var e = u.call(this);
                return -1 === e.indexOf("OES_texture_float_linear") && e.push("OES_texture_float_linear"), e
            }
            try {
                var i = document.createElement("canvas").getContext("experimental-webgl")
            } catch (n) {}
            if (i && -1 === i.getSupportedExtensions().indexOf("OES_texture_float_linear") && e(i)) {
                var l = WebGLRenderingContext.prototype.getExtension,
                    u = WebGLRenderingContext.prototype.getSupportedExtensions;
                WebGLRenderingContext.prototype.getExtension = o, WebGLRenderingContext.prototype.getSupportedExtensions = a
            }
        }();
        var O;
        N.canvas = function() {
            var e = document.createElement("canvas");
            try {
                O = e.getContext("experimental-webgl", {
                    premultipliedAlpha: !1
                })
            } catch (t) {
                O = null
            }
            if (!O) throw "This browser does not support WebGL";
            return e._ = {
                gl: O,
                isInitialized: !1,
                texture: null,
                spareTexture: null,
                flippedShader: null
            }, e.texture = s(r), e.draw = s(a), e.update = s(i), e.replace = s(l), e.contents = s(u), e.getPixelArray = s(c), e.brightnessContrast = s(g), e.hexagonalPixelate = s(U), e.hueSaturation = s(w), e.colorHalftone = s(F), e.triangleBlur = s(D), e.unsharpMask = s(E), e.perspective = s(X), e.matrixWarp = s(M), e.bulgePinch = s(z), e.tiltShift = s(R), e.dotScreen = s(B), e.edgeWork = s(P), e.lensBlur = s(A), e.zoomBlur = s(S), e.noise = s(_), e.denoise = s(T), e.curves = s(p), e.swirl = s(G), e.ink = s(k), e.vignette = s(C), e.vibrance = s(b), e.sepia = s(y), e.blackHole = s(I), e
        }, N.splineInterpolate = v;
        var H = function() {
                function e(e) {
                    return "[object Array]" == Object.prototype.toString.call(e)
                }
                function t(e) {
                    return "[object Number]" == Object.prototype.toString.call(e)
                }
                function r(e, t) {
                    var r = O.createShader(e);
                    if (O.shaderSource(r, t), O.compileShader(r), !O.getShaderParameter(r, O.COMPILE_STATUS)) throw "compile error: " + O.getShaderInfoLog(r);
                    return r
                }
                function o(e, t) {
                    if (this.vertexAttribute = null, this.texCoordAttribute = null, this.program = O.createProgram(), e = e || a, t = t || i, t = "precision highp float;" + t, O.attachShader(this.program, r(O.VERTEX_SHADER, e)), O.attachShader(this.program, r(O.FRAGMENT_SHADER, t)), O.linkProgram(this.program), !O.getProgramParameter(this.program, O.LINK_STATUS)) throw "link error: " + O.getProgramInfoLog(this.program)
                }
                var a = "    attribute vec2 vertex;    attribute vec2 _texCoord;    varying vec2 texCoord;    void main() {        texCoord = _texCoord;        gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);    }",
                    i = "    uniform sampler2D texture;    varying vec2 texCoord;    void main() {        gl_FragColor = texture2D(texture, texCoord);    }";
                return o.prototype.destroy = function() {
                    O.deleteProgram(this.program), this.program = null
                }, o.prototype.uniforms = function(r) {
                    O.useProgram(this.program);
                    for (var o in r) if (r.hasOwnProperty(o)) {
                        var a = O.getUniformLocation(this.program, o);
                        if (null !== a) {
                            var i = r[o];
                            if (i.uniformVectorType) O[i.uniformVectorType](a, new Float32Array(i.value));
                            else if (e(i)) switch (i.length) {
                            case 1:
                                O.uniform1fv(a, new Float32Array(i));
                                break;
                            case 2:
                                O.uniform2fv(a, new Float32Array(i));
                                break;
                            case 3:
                                O.uniform3fv(a, new Float32Array(i));
                                break;
                            case 4:
                                O.uniform4fv(a, new Float32Array(i));
                                break;
                            case 9:
                                O.uniformMatrix3fv(a, !1, new Float32Array(i));
                                break;
                            case 16:
                                O.uniformMatrix4fv(a, !1, new Float32Array(i));
                                break;
                            default:
                                throw "dont't know how to load uniform \"" + o + '" of length ' + i.length
                            } else {
                                if (!t(i)) throw 'attempted to set uniform "' + o + '" to invalid value ' + (i || "undefined").toString();
                                O.uniform1f(a, i)
                            }
                        }
                    }
                    return this
                }, o.prototype.textures = function(e) {
                    O.useProgram(this.program);
                    for (var t in e) e.hasOwnProperty(t) && O.uniform1i(O.getUniformLocation(this.program, t), e[t]);
                    return this
                }, o.prototype.drawRect = function(e, t, r, o) {
                    var a, i = O.getParameter(O.VIEWPORT);
                    t = t !== a ? (t - i[1]) / i[3] : 0, e = e !== a ? (e - i[0]) / i[2] : 0, r = r !== a ? (r - i[0]) / i[2] : 1, o = o !== a ? (o - i[1]) / i[3] : 1, null == O.vertexBuffer && (O.vertexBuffer = O.createBuffer()), O.bindBuffer(O.ARRAY_BUFFER, O.vertexBuffer), O.bufferData(O.ARRAY_BUFFER, new Float32Array([e, t, e, o, r, t, r, o]), O.STATIC_DRAW), null == O.texCoordBuffer && (O.texCoordBuffer = O.createBuffer(), O.bindBuffer(O.ARRAY_BUFFER, O.texCoordBuffer), O.bufferData(O.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), O.STATIC_DRAW)), null == this.vertexAttribute && (this.vertexAttribute = O.getAttribLocation(this.program, "vertex"), O.enableVertexAttribArray(this.vertexAttribute)), null == this.texCoordAttribute && (this.texCoordAttribute = O.getAttribLocation(this.program, "_texCoord"), O.enableVertexAttribArray(this.texCoordAttribute)), O.useProgram(this.program), O.bindBuffer(O.ARRAY_BUFFER, O.vertexBuffer), O.vertexAttribPointer(this.vertexAttribute, 2, O.FLOAT, !1, 0, 0), O.bindBuffer(O.ARRAY_BUFFER, O.texCoordBuffer), O.vertexAttribPointer(this.texCoordAttribute, 2, O.FLOAT, !1, 0, 0), O.drawArrays(O.TRIANGLE_STRIP, 0, 4)
                }, o.getDefaultShader = function() {
                    return O.defaultShader = O.defaultShader || new o, O.defaultShader
                }, o
            }();
        d.prototype.interpolate = function(e) {
            for (var t = this.ya.length, r = 0, o = t - 1; o - r > 1;) {
                var a = o + r >> 1;
                this.xa[a] > e ? o = a : r = a
            }
            var i = this.xa[o] - this.xa[r],
                n = (this.xa[o] - e) / i,
                l = (e - this.xa[r]) / i;
            return n * this.ya[r] + l * this.ya[o] + ((n * n * n - n) * this.y2[r] + (l * l * l - l) * this.y2[o]) * i * i / 6
        };
        var L = function() {
                function e(e, t, r, o) {
                    this.gl = O, this.id = O.createTexture(), this.width = e, this.height = t, this.format = r, this.type = o, O.bindTexture(O.TEXTURE_2D, this.id), O.texParameteri(O.TEXTURE_2D, O.TEXTURE_MAG_FILTER, O.LINEAR), O.texParameteri(O.TEXTURE_2D, O.TEXTURE_MIN_FILTER, O.LINEAR), O.texParameteri(O.TEXTURE_2D, O.TEXTURE_WRAP_S, O.CLAMP_TO_EDGE), O.texParameteri(O.TEXTURE_2D, O.TEXTURE_WRAP_T, O.CLAMP_TO_EDGE), e && t && O.texImage2D(O.TEXTURE_2D, 0, this.format, e, t, 0, this.format, this.type, null)
                }
                function t(e) {
                    null == r && (r = document.createElement("canvas")), r.width = e.width, r.height = e.height;
                    var t = r.getContext("2d");
                    return t.clearRect(0, 0, r.width, r.height), t
                }
                e.fromElement = function(t) {
                    var r = new e(0, 0, O.RGBA, O.UNSIGNED_BYTE);
                    return r.loadContentsOf(t), r
                }, e.prototype.loadContentsOf = function(e) {
                    this.width = e.width || e.videoWidth, this.height = e.height || e.videoHeight, O.bindTexture(O.TEXTURE_2D, this.id), O.texImage2D(O.TEXTURE_2D, 0, this.format, this.format, this.type, e)
                }, e.prototype.initFromBytes = function(e, t, r) {
                    this.width = e, this.height = t, this.format = O.RGBA, this.type = O.UNSIGNED_BYTE, O.bindTexture(O.TEXTURE_2D, this.id), O.texImage2D(O.TEXTURE_2D, 0, O.RGBA, e, t, 0, O.RGBA, this.type, new Uint8Array(r))
                }, e.prototype.destroy = function() {
                    O.deleteTexture(this.id), this.id = null
                }, e.prototype.use = function(e) {
                    O.activeTexture(O.TEXTURE0 + (e || 0)), O.bindTexture(O.TEXTURE_2D, this.id)
                }, e.prototype.unuse = function(e) {
                    O.activeTexture(O.TEXTURE0 + (e || 0)), O.bindTexture(O.TEXTURE_2D, null)
                }, e.prototype.ensureFormat = function(e, t, r, o) {
                    if (1 == arguments.length) {
                        var a = arguments[0];
                        e = a.width, t = a.height, r = a.format, o = a.type
                    }(e != this.width || t != this.height || r != this.format || o != this.type) && (this.width = e, this.height = t, this.format = r, this.type = o, O.bindTexture(O.TEXTURE_2D, this.id), O.texImage2D(O.TEXTURE_2D, 0, this.format, e, t, 0, this.format, this.type, null))
                }, e.prototype.drawTo = function(e) {
                    if (O.framebuffer = O.framebuffer || O.createFramebuffer(), O.bindFramebuffer(O.FRAMEBUFFER, O.framebuffer), O.framebufferTexture2D(O.FRAMEBUFFER, O.COLOR_ATTACHMENT0, O.TEXTURE_2D, this.id, 0), O.checkFramebufferStatus(O.FRAMEBUFFER) !== O.FRAMEBUFFER_COMPLETE) throw new Error("incomplete framebuffer");
                    O.viewport(0, 0, this.width, this.height), e(), O.bindFramebuffer(O.FRAMEBUFFER, null)
                };
                var r = null;
                return e.prototype.fillUsingCanvas = function(e) {
                    return e(t(this)), this.format = O.RGBA, this.type = O.UNSIGNED_BYTE, O.bindTexture(O.TEXTURE_2D, this.id), O.texImage2D(O.TEXTURE_2D, 0, O.RGBA, O.RGBA, O.UNSIGNED_BYTE, r), this
                }, e.prototype.toImage = function(e) {
                    this.use(), H.getDefaultShader().drawRect();
                    var o = this.width * this.height * 4,
                        a = new Uint8Array(o),
                        i = t(this),
                        n = i.createImageData(this.width, this.height);
                    O.readPixels(0, 0, this.width, this.height, O.RGBA, O.UNSIGNED_BYTE, a);
                    for (var l = 0; o > l; l++) n.data[l] = a[l];
                    i.putImageData(n, 0, 0), e.src = r.toDataURL()
                }, e.prototype.swapWith = function(e) {
                    var t;
                    t = e.id, e.id = this.id, this.id = t, t = e.width, e.width = this.width, this.width = t, t = e.height, e.height = this.height, this.height = t, t = e.format, e.format = this.format, this.format = t
                }, e
            }(),
            W = "    float random(vec3 scale, float seed) {        /* use the fragment position for a different seed per-pixel */        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);    }";
        return N
    }();
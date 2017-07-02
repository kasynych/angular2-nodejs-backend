(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'angular2:': 'js/lib/angular2/'
        },
        // map tells the System loader where to look for things
        map: {
            // angular bundles
            '@angular/core': 'angular2:core.umd.js',
            '@angular/common': 'angular2:common.umd.js',
            '@angular/compiler': 'angular2:compiler.umd.js',
            '@angular/platform-browser': 'angular2:platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'angular2:platform-browser-dynamic.umd.js',
            '@angular/http': 'angular2:http.umd.js',
            '@angular/router': 'angular2:router.umd.js',
            '@angular/forms': 'angular2:forms.umd.js',
            // other libraries
            'rxjs': 'angular2:rxjs',
            'angular2-in-memory-web-api': 'angular2:angular2-in-memory-web-api',            
            'jquery': 'js/lib/jquery.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            js: {
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'angular2-in-memory-web-api': {
                main: './index.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);

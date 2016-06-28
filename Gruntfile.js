module.exports = function (grunt) {
    "use strict";

    grunt.registerMultiTask('sorcery', 'Use next generation JavaScript, today', function () {
		var options = this.options();

		this.files.forEach(function (el) {
           var fs = require("fs");
            var path = require('path');
			delete options.filename;
			delete options.filenameRelative;
           
		    //options.sourceFileName = path.relative(path.dirname(el.dest), el.src[0]);
            options.sourceFileName = el.src[0];

			//if (process.platform === 'win32') {
			//	options.sourceFileName = options.sourceFileName.replace(/\\/g, '/');
			//}
            console.log( "sourcery: " + options.sourceFileName );
            var sorcery = require( 'sorcery' );

            var chain = sorcery.loadSync( options.sourceFileName );
            var map = chain.apply();
            map.sourceRoot = "";
            chain.writeSync(el.dest,{ inline: true });
        });
	});

    grunt.initConfig({
        clean: ["obj" ],
        sorcery: {
            dev: {
              files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'obj/babelout/',      // Src matches are relative to this path.
                        src: ['**/*.js'], // Actual pattern(s) to match.
                        dest: './tssrc',   // Destination path prefix.
                    }
                ]
            }
        },
        babel: {
            options: {
                compact: false,
              sourceMap: true,
            },
     
            dev:{
                files: [
                    {
                        
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'obj/tsout/',      // Src matches are relative to this path.
                        src: ['**/*.js'], // Actual pattern(s) to match.
                        dest: 'obj/babelout/',   // Destination path prefix.
                       // ext: '.babel.js',   // Dest filepaths will have this extension.
                       // extDot: 'first'   // Extensions in filenames begin after the first dot
                    }
                ]
            }
        },

        ts: {
            // use to override the default options, See: http://gruntjs.com/configuring-tasks#options
            // these are the default options to the typescript compiler for grunt-ts:
            // see `tsc --help` for a list of supported options.
            default: {
                tsconfig: true,
            },
            // a particular target
            onestep: {
                tsconfig: {
                    tsconfig: 'tssrc/tsconfig.json',
                    ignoreFiles: false,
                    ignoreSettings: false,
                    overwriteFilesGlob: true,
                    updateFiles: true,
                    passThrough: false
                },
                //src: ["api-proxy-node-js/**/*.ts","!api-proxy-node-js/node_modules", "workspace/**/*.ts", "*.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
                src: ["tssrc/**/*.ts"] 
            },
            multistep: {
                tsconfig: {
                    tsconfig: 'tssrc/tsconfig.json',
                    ignoreFiles: false,
                    ignoreSettings: false,
                    overwriteFilesGlob: true,
                    updateFiles: true,
                    passThrough: false
                },
                //src: ["api-proxy-node-js/**/*.ts","!api-proxy-node-js/node_modules", "workspace/**/*.ts", "*.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
                src: ["tssrc/**/*.ts"] 
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks('grunt-contrib-clean');


    //fd: requires you define outDir accordingly in the tsconfig.json
    grunt.registerTask("multiplesteps", ["clean","ts:multistep", "babel:dev", "sorcery:dev"]);

    grunt.registerTask("default", ["ts:onestep" ]);

};
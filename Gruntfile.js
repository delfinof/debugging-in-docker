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
            chain.writeSync(el.dest);

            var map = JSON.parse( fs.readFileSync(el.dest +".map") );
            map.sourcesContent = [ fs.readFileSync(el.dest.replace(".js",".ts")).toString("utf8") ] ;
            map.sourceRoot = "";
            fs.writeFileSync(el.dest+".map",JSON.stringify(map));
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
                        dest: './',   // Destination path prefix.
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
            dev: {
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
            devwatch: {
                tsconfig: {
                   tsconfig: 'tssrc/tsconfig.json',
                    ignoreFiles: false,
                    ignoreSettings: false,
                    overwriteFilesGlob: true,
                    updateFiles: true,
                    passThrough: false
                },
                src: ["api-proxy-node-js/**/*.ts","!api-proxy-node-js/node_modules", "workspace/**/*.ts", "*.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
                watch: '.',                  // If specified, watches this directory for changes, and re-runs the current target
                options: {
                }
            }
        },
        watch: {
            scripts: {
               files:  ["api-proxy-node-js/**/*.ts","!api-proxy-node-js/node_modules",  "workspace/**/*.ts",  "*.ts"],  
             //   files:  ["api-proxy-node-js/lib/*.ts" ],  
                tasks: ["ts:dev","babel:dev","sorcery:dev" ]
            }
        },
        // Configure a mochaTest task
        mochaTest: {
            test_api_initialize: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['workspace/debug_project/mocha_test/mxm_api_initialize/*.js']
            },
            test_api_user: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['workspace/debug_project/mocha_test/mxm_api_user/*.js']
            },
            test_backend_initialize: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['workspace/debug_project/mocha_test/mxm_backend_initialize/*.js']
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask("default", ["clean","ts:dev", "babel:dev", "sorcery:dev"]);
};
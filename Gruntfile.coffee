module.exports = (grunt) ->
    (require 'time-grunt') grunt
    (require 'load-grunt-tasks') grunt
    grunt.initConfig
        bower: grunt.file.readJSON('bower.json'),
        dist: 'dist',
        jshint:
            options:
                jshintrc: '.jshintrc'
            all: ['*.js']
        uglify:
            xconsole:
                files:
                    '<%= dist %>/xconsole.min.js': 'xconsole.js'
        replace:
            version:
                options:
                    patterns: [
                        match: /@version@/,
                        replacement: '<%= bower.version %>'
                    ]
                src: 'xconsole.js',
                dest: 'xconsole.js'
    grunt.registerTask 'default', ['jshint','replace' ,'uglify']

module.exports = (grunt)->
    (require 'time-grunt') grunt
    (require 'load-grunt-tasks') grunt
    grunt.initConfig
        dist: 'dist',
        jshint:
            options:
                jshintrc: '.jshintrc'
            all: ['*.js']
        uglify:
            xconsole:
                files:
                    '<%= dist %>/xconsole.min.js': 'xconsole.js'
    grunt.registerTask 'default', ['jshint', 'uglify']

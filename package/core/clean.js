/*
* @Author: dylan
* @Date:   2015-11-20 10:51:27
* @Last Modified by:   dylan
* @Last Modified time: 2015-12-22 16:01:20
*/

'use strict';
const gulp = require('gulp');
const del = require('del');
const config = require('../config');

gulp.task('core.clean:tmp', del.bind(null, [config.tmpDist.path, config.tmpDist.views]));
gulp.task('core.clean:pro', del.bind(null, [config.proDist.path]));

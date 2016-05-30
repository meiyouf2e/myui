'use strict';
require('./build.scss');

const ReactMarkdown = require('react-markdown'),
	md = require('./doc/build.md');

window.AsyncBuild = React.createClass({
	render() {
		return (
			<div className="async-build">
				<ReactMarkdown source={md} />
			</div>
		);
	}
});

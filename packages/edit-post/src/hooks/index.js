/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { components } from '@wordpress/media-utils';

/**
 * Internal dependencies
 */
import './validate-multiple-use';

const replaceMediaUpload = () => components.MediaUpload;

addFilter(
	'editor.MediaUpload',
	'wordpress/media-utils/replace-media-upload',
	replaceMediaUpload
);

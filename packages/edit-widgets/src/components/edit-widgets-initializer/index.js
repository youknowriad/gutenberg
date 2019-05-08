/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import { addFilter, removeFilter } from '@wordpress/hooks';
import { components } from '@wordpress/media-utils';

const replaceMediaUpload = () => components.MediaUpload;

/**
 * Internal dependencies
 */
import Layout from '../layout';

function EditWidgetsInitializer( { setupWidgetAreas, settings } ) {
	useEffect( () => {
		setupWidgetAreas();
		addFilter(
			'editor.MediaUpload',
			'wordpress/media-utils/replace-media-upload',
			replaceMediaUpload
		);
		return () => {
			removeFilter(
				'editor.MediaUpload',
				'wordpress/media-utils/replace-media-upload'
			);
		};
	}, [] );
	return (
		<Layout
			blockEditorSettings={ settings }
		/>
	);
}

export default compose( [
	withDispatch( ( dispatch ) => {
		const { setupWidgetAreas } = dispatch( 'core/edit-widgets' );
		return {
			setupWidgetAreas,
		};
	} ),
] )( EditWidgetsInitializer );

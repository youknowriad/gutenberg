/**
 * External dependencies
 */
import { defaultTo } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { utils as mediaUtils } from '@wordpress/media-utils';
import { compose } from '@wordpress/compose';
import { Panel, PanelBody } from '@wordpress/components';
import {
	BlockEditorProvider,
	BlockList,
} from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';

const { mediaUpload } = mediaUtils;

function WidgetArea( {
	blockEditorSettings,
	blocks,
	initialOpen,
	updateBlocks,
	widgetAreaName,
	hasUploadPermissions,
} ) {
	const settings = useMemo(
		() => {
			if ( ! hasUploadPermissions ) {
				return blockEditorSettings;
			}
			const mediaUploadBlockEditor = ( { onError, ...argumentsObject } ) => {
				mediaUpload( {
					wpAllowedMimeTypes: settings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...argumentsObject,
				} );
			};
			return {
				...blockEditorSettings,
				__experimentalMediaUpload: mediaUploadBlockEditor,
			};
		},
		[ blockEditorSettings, hasUploadPermissions ]
	);
	return (
		<Panel className="edit-widgets-widget-area">
			<PanelBody
				title={ widgetAreaName }
				initialOpen={ initialOpen }
			>
				<BlockEditorProvider
					value={ blocks }
					onInput={ updateBlocks }
					onChange={ updateBlocks }
					settings={ settings }
				>
					<BlockList />
				</BlockEditorProvider>
			</PanelBody>
		</Panel>
	);
}

export default compose( [
	withSelect( ( select, { id } ) => {
		const {
			getBlocksFromWidgetArea,
			getWidgetArea,
		} = select( 'core/edit-widgets' );
		const { canUser } = select( 'core' );
		const blocks = getBlocksFromWidgetArea( id );
		const widgetAreaName = ( getWidgetArea( id ) || {} ).name;
		return {
			blocks,
			widgetAreaName,
			hasUploadPermissions: defaultTo( canUser( 'create', 'media' ), true ),
		};
	} ),
	withDispatch( ( dispatch, { id } ) => {
		return {
			updateBlocks( blocks ) {
				const { updateBlocksInWidgetArea } = dispatch( 'core/edit-widgets' );
				updateBlocksInWidgetArea( id, blocks );
			},
		};
	} ),
] )( WidgetArea );

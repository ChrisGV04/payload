import type { RichTextAdapter } from 'payload/types'

import { withMergedProps } from 'payload/components/utilities'

import type { EditorConfig, SanitizedEditorConfig } from './field/lexical/config/types'
import type { AdapterProps } from './types'

import { RichTextCell } from './cell'
import { RichTextField } from './field'
import { defaultEditorConfig, defaultSanitizedEditorConfig } from './field/lexical/config/default'
import { sanitizeEditorConfig } from './field/lexical/config/sanitize'
import { cloneDeep } from './field/lexical/utils/cloneDeep'
import { richTextRelationshipPromise } from './populate/richTextRelationshipPromise'

export function createLexical({
  userConfig,
}: {
  userConfig?: (defaultEditorConfig: EditorConfig) => EditorConfig
}): RichTextAdapter<AdapterProps> {
  const finalSanitizedEditorConfig: SanitizedEditorConfig =
    userConfig == null || typeof userConfig != 'function'
      ? cloneDeep(defaultSanitizedEditorConfig)
      : sanitizeEditorConfig(userConfig(cloneDeep(defaultEditorConfig)))

  return {
    CellComponent: withMergedProps({
      Component: RichTextCell,
      toMergeIntoProps: { editorConfig: finalSanitizedEditorConfig },
    }),
    FieldComponent: withMergedProps({
      Component: RichTextField,
      toMergeIntoProps: { editorConfig: finalSanitizedEditorConfig },
    }),
    afterReadPromise({
      currentDepth,
      depth,
      field,
      overrideAccess,
      req,
      showHiddenFields,
      siblingDoc,
    }) {
      // check if there are any features with nodes which have afterReadPromises for this field
      if (finalSanitizedEditorConfig?.features?.afterReadPromises?.size) {
        return richTextRelationshipPromise({
          afterReadPromises: finalSanitizedEditorConfig.features.afterReadPromises,
          currentDepth,
          depth,
          field,
          overrideAccess,
          req,
          showHiddenFields,
          siblingDoc,
        })
      }

      return null
    },
  }
}

export { BlockQuoteFeature } from './field/features/BlockQuote'
export { BlocksFeature } from './field/features/Blocks'
export { HeadingFeature } from './field/features/Heading'
export { LinkFeature, LinkFeatureProps } from './field/features/Link'
export { ParagraphFeature } from './field/features/Paragraph'
export { RelationshipFeature } from './field/features/Relationship'
export { UploadFeature, UploadFeatureProps } from './field/features/Upload'
export { AlignFeature } from './field/features/align'
export { TextDropdownSectionWithEntries } from './field/features/common/floatingSelectToolbarTextDropdownSection'
export { TreeviewFeature } from './field/features/debug/TreeView'
export { BoldTextFeature } from './field/features/format/Bold'
export { InlineCodeTextFeature } from './field/features/format/InlineCode'
export { ItalicTextFeature } from './field/features/format/Italic'
export { SectionWithEntries as FormatSectionWithEntries } from './field/features/format/common/floatingSelectToolbarSection'
export { StrikethroughTextFeature } from './field/features/format/strikethrough'
export { SubscriptTextFeature } from './field/features/format/subscript'
export { SuperscriptTextFeature } from './field/features/format/superscript'
export { UnderlineTextFeature } from './field/features/format/underline'
export { IndentFeature } from './field/features/indent'
export { CheckListFeature } from './field/features/lists/CheckList'
export { OrderedListFeature } from './field/features/lists/OrderedList'
export { UnoderedListFeature } from './field/features/lists/UnorderedList'

export {
  Feature,
  FeatureProvider,
  FeatureProviderMap,
  ResolvedFeature,
  ResolvedFeatureMap,
  SanitizedFeatures,
} from './field/features/types'
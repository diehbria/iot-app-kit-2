import { type Meta } from '@storybook/react';
import React, { useState } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';
import type { ResourceExplorerStoryControls } from './types';

import {
  AssetModelExplorer,
  type AssetModelExplorerProps,
} from '../../src/components/resource-explorers';
import type { AssetModelResource } from '../../src/components/resource-explorers/types/resources';

export default {
  title: 'Resource Explorers/Asset Model Explorer',
  component: AssetModelExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
    assetModelTypes: {
      type: 'radio',
      default: undefined,
      options: [undefined, 'ASSET_MODEL', 'COMPONENT_MODEL'],
      mapping: {
        undefined: [undefined],
        ASSET_MODEL: ['ASSET_MODEL'],
        COMPONENT_MODEL: ['COMPONENT_MODEL'],
      },
    },
  },
} satisfies Meta<typeof AssetModelExplorer>;

type AssetModelExplorerStoryControls =
  ResourceExplorerStoryControls<AssetModelResource> &
    Pick<AssetModelExplorerProps, 'parameters'>;

export function StandardExample({
  isTitleless,
  isFilterEnabled,
  isUserSettingsEnabled,
  ...assetModelExplorerProps
}: AssetModelExplorerStoryControls) {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);

  return (
    <AssetModelExplorer
      {...assetModelExplorerProps}
      requestFns={client}
      parameters={[
        { assetModelTypes: ['ASSET_MODEL'] },
        { assetModelTypes: ['COMPONENT_MODEL'] },
      ]}
      tableSettings={{
        isTitleless,
        isFilterEnabled,
        isUserSettingsEnabled,
      }}
      onSelectAssetModel={setSelectedAssetModels}
      selectedAssetModels={selectedAssetModels}
    />
  );
}

export function ZeroConfigurationTable() {
  return <AssetModelExplorer />;
}

export function ZeroConfigurationDropDown() {
  return <AssetModelExplorer variant='drop-down' />;
}
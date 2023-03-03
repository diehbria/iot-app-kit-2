import { AssetSummary, AssetHierarchy, DescribeAssetResponse, AssetCompositeModel } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export const isAlarm = (item: AssetCompositeModel | ExtendedPanelAssetSummary) => item.type === 'AWS/ALARM';

export interface ExtendedPanelAssetSummary {
  id?: string;
  name?: string;
  value?: unknown;
  description?: string;
  type?: string;
  assetCompositeModels?: AssetCompositeModel[];
  properties?: unknown[];
  hierarchies?: AssetHierarchy[];
  isHeader?: boolean;
  isAssetProperty?: boolean;
  queryAssetsParam?: SiteWiseAssetQuery['assets'];
}

export type EitherAssetSummary = AssetSummary | ExtendedPanelAssetSummary;

export const retrieveAlarms = (describedAsset: DescribeAssetResponse) => {
  if (!describedAsset?.assetCompositeModels?.length) return [];
  return describedAsset.assetCompositeModels?.filter((model: AssetCompositeModel) => isAlarm(model));
};
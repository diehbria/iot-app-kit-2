import React from 'react';
import { Widget } from '~/types';
import { ComponentLibraryComponentMap, ComponentLibraryComponentOrdering } from './componentLibraryComponentMap';
import { WidgetComponentMap } from './widgetComponentMap';
import { WidgetPropertiesGeneratorMap } from './widgetPropertiesGeneratorMap';

type RenderFunc<T extends Widget> = (widget: T) => React.ReactElement;

type WidgetRegistrationOptions<T extends Widget> = {
  render: RenderFunc<T>;
  componentLibrary?: {
    name: string;
    icon: React.FC;
  };
  properties?: () => T['properties'];
  initialSize?: Pick<Widget, 'height' | 'width'>;
};
type RegisterWidget = <T extends Widget>(type: string, options: WidgetRegistrationOptions<T>) => void;

/**
 * function to register a new widget type in the dashboard
 */
export const registerWidget: RegisterWidget = <T extends Widget>(
  type: string,
  options: WidgetRegistrationOptions<T>
) => {
  const { render, componentLibrary, properties, initialSize } = options;
  WidgetComponentMap[type] = render;

  if (componentLibrary) {
    const { name, icon } = componentLibrary;
    ComponentLibraryComponentMap[type] = [name, icon];
    ComponentLibraryComponentOrdering.push(type);
  }

  if (properties || initialSize) {
    WidgetPropertiesGeneratorMap[type] = {
      properties,
      initialSize,
    };
  }
};

export type DashboardPlugin = {
  install: (options: { registerWidget: RegisterWidget }) => void;
};

const resetMaps = () => {
  // eslint-disable-next-line
  const clearObj = (obj: Record<any, any>) => {
    for (const key in obj) {
      // eslint-disable-next-line
      if (obj.hasOwnProperty(key)) {
        delete obj[key];
      }
    }
  };
  // eslint-disable-next-line
  const clearArr = (arr: any[]) => {
    arr.splice(0, arr.length);
  };
  // resets for hotmodule reloading;
  clearObj(WidgetComponentMap);
  clearObj(ComponentLibraryComponentMap);
  clearObj(WidgetPropertiesGeneratorMap);
  clearArr(ComponentLibraryComponentOrdering);
};

export const setupDashboardPlugins = (plugins: DashboardPlugin[]) => {
  resetMaps();

  plugins.forEach((plugin) => plugin.install({ registerWidget }));
};
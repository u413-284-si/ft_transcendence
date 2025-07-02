import { LayoutMode } from "../Layout";
import AbstractView from "../views/AbstractView";

type RouteGuardResult = true | false | string;
export type RouteGuard = () => RouteGuardResult;

export type RouteConfig = {
  view: new () => AbstractView;
  guard?: RouteGuard;
  layout: LayoutMode;
  regex?: string;
};

export type RouteEntry = {
  path: string;
  regex: RegExp;
  dynamicParam?: string;
  config: RouteConfig;
};

export type routeEvent = "nav" | "view";
export type RouteChangeInfo = {
  event: routeEvent;
  from: string;
  to: string;
  view: AbstractView | null;
};
export type RouteChangeListener = (info: RouteChangeInfo) => void;

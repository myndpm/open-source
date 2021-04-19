// factory params
export interface DynControlFactoryParams {
  cssClass?: string;
}

// control params
export interface DynControlParams {
  // some custom params could be needed by custom handlers
  [key: string]: any;
}

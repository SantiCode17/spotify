// Tipos de navegación para Expo Router

export type RootStackParamList = {
  index: undefined;
  '(auth)': undefined;
  '(app)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};

export type AppTabsParamList = {
  index: undefined;
  search: undefined;
  library: undefined;
  add: undefined;
};

export type DetailParamList = {
  id: string;
};

export type DrawerParamList = {
  '(tabs)': undefined;
  profile: undefined;
  config: undefined;
  subscriptions: undefined;
};

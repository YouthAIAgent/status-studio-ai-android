declare const require: any;

require("react-native/Libraries/Core/InitializeCore");

const { registerRootComponent } = require("expo");
const App = require("./App").default;

// registerRootComponent calls AppRegistry.registerComponent('main', () => App).
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately.
registerRootComponent(App);

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css';

Vue.use(Vuetify);

// Outlined + dense by default for form controls (Vuetify 2.6 has no defaults API).
// Component-level props still win; guarded so a missing prop is skipped.
['VTextField', 'VSelect', 'VCombobox', 'VTextarea', 'VAutocomplete', 'VFileInput'].forEach((name) => {
  const component = Vue.options.components[name];
  if (!component || !component.options || !component.options.props) return;
  if ('outlined' in component.options.props) component.options.props.outlined.default = true;
  if ('dense' in component.options.props) component.options.props.dense.default = true;
});

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#2D6A4F',
        secondary: '#6b6b6b',
        accent: '#2D6A4F',
        error: '#c4242a',
        info: '#2D6A4F',
        success: '#2D6A4F',
        warning: '#92400e'
      },
      dark: {
        primary: '#40916c',
        secondary: '#a0a0a0',
        accent: '#52b788',
        error: '#e57373',
        info: '#40916c',
        success: '#40916c',
        warning: '#ffb74d'
      }
    },
  },
  icons: {
    iconfont: 'fa',
  },
});

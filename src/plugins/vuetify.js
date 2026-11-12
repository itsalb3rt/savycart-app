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
        primary: '#1d1f20',
        secondary: '#5f6368',
        accent: '#0277BD',
        error: '#c4242a',
        info: '#0277BD',
        success: '#247b50',
        warning: '#92400e'
      },
    },
  },
  icons: {
    iconfont: 'fa',
  },
});

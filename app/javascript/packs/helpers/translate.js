import { default as React } from 'react';

import en from './en';
import de from './de';

const languages = {
  en,
  de
};

function i18n_translate(first, second) {
  const namespace = second ? first : this.component;
  const key = second ? second : first;
  const value = this.strings[namespace] ? this.strings[namespace][key] : undefined;
  if (value === undefined && this.language !== 'en') {
    console.error(`Translation missing: '${key}' in component '${this.component}' for language ${this.language}`);
  }
  return value || key;
}

export default function translate(key) {
  return Component => {
    class TranslationComponent extends React.Component {
      render() {
        const strings = languages[this.context.currentLanguage];
        const t = i18n_translate.bind({ strings, component: key, language: this.context.currentLanguage });
        return (
          <Component {...this.props} {...this.state} strings={strings} translate={t}
            currentLanguage={this.context.currentLanguage} />
        );
      }
    }

    TranslationComponent.contextTypes = {
      currentLanguage: React.PropTypes.string
    };

    return TranslationComponent;
  };
}

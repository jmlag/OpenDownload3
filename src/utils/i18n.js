export function getMessage(messageName, substitutions = null) {
  return browser.i18n.getMessage(messageName, substitutions);
}

export function getUILanguage() {
  return browser.i18n.getUILanguage();
}

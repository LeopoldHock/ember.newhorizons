import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | interactable/button-square', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const handler = () => { return };
    this.set("icon", "some-icon");
    this.set("handler", handler);
    await render(hbs`<Interactable::ButtonSquare @icon={{this.icon}} @onClick={{this.handler}} />`);
    assert.dom(this.element.firstChild).hasTagName("button");
  });
});

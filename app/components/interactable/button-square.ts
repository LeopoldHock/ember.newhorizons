import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  onClick: () => void;
  icon: string;
  disabled?: boolean;
  tooltip?: string;
}

export default class InteractableButtonSquare extends Component<Args> {
  constructor(owner: unknown, args: unknown) {
    super(owner, args);
  }

  @action handleClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}

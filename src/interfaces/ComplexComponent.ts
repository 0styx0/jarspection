export interface ComplexComponent<Props> extends HTMLElement {
  setProps(props: Props): void;
}

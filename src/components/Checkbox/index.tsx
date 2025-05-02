import { CheckboxContainer, HiddenCheckbox, Icon, StyledCheckbox } from "./styles";

export const Checkbox = ({ className, checked, label, disabled, ...props }: any) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} disabled={disabled} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
    {label && <span>{label}</span>} {/* Renderiza o texto do label */}
  </CheckboxContainer>
);
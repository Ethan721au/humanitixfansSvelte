import styled from 'styled-svelte5';

export const Wrapper = styled<{ type?: string }>(
	'div',
	({ type }) => `
  display: flex;
  flex-direction: ${type === 'checkbox' ? 'row' : 'column'};

 & > label {
    order: ${type === 'checkbox' ? 1 : 0};
  }

   & > input {
    order: ${type === 'checkbox' ? 0 : 1};
  }
  `
);

export const InputField = styled<{ type?: string }>(
	'input',
	({ type }) => `
  appearance: none;
  outline: none;
  border-radius: 4px;
  border: 1px solid #e5e5e5;

  width: ${type === 'checkbox' ? '16px' : '100%'};
  height: ${type === 'checkbox' ? '16px' : '100%'};
  cursor: ${type === 'checkbox' ? 'pointer' : 'text'};

    &:checked {
    background-color: var(--primary-peach);
    border: none;
    }

    &:focus {
    transition: ${type === 'checkbox' ? 'none' : 'outline-offset 0.2s ease-out'};
    outline: ${type === 'checkbox' ? 'none' : 'var(--focused-base-outline)'};
    outline-offset: ${type === 'checkbox' ? 'none' : 'var(--focused-base-outline-offset)'};
    }
  `
);

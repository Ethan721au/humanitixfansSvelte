import styled from 'styled-svelte5';

export const Wrapper = styled<{ type: string }>(
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

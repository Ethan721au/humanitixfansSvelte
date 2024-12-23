import styled from 'styled-svelte5';

export const SampleDiv = styled<{ color: string; backgroundColor: string }>( //You can set types of props here.
	'div', //tag name
	({ backgroundColor, color }) => `
        background-color:${backgroundColor};
        color: ${color};
    ` // A function which returns scss or css. You can use props here.
);

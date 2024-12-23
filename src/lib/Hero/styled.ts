import styled from 'styled-svelte5';

export const Wrapper = styled<{ videoSize: { clipPath: string; matrix: string } }>(
	'div',
	({ videoSize }) => `
  --min-height: 600px;
  --max-height: 960px;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  position: relative;
  height: clamp(var(--min-height), -360px + 80vw, var(--max-height));
  clip-path: ${videoSize.clipPath};
  `
);

export const VideoOverlay = styled(
	'video',
	() => `
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-image: linear-gradient(
    270deg,
         #0000 16% 27%,
          #0003 36%,
    #0000006b 45%,
    #00000085 51%,
          #0009 58%,
    #000000ab 64%,
    #000000bf 72%,
    #000000d4 83%,
    #000000e0
  );
  animation: 2s ease 0s 1 normal none running fadein;
  height: 100%;
  width: 100%;
  `
);

export const VideoContainer = styled(
	'video',
	() => `
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  `
);

export const TextWrapper = styled(
	'div',
	() => `
  color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 1100px;
  `
);

export const Title = styled(
	'div',
	() => `
  text-align: center;
  font-size: 105px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -2.1px;
  `
);

export const Subtitle = styled(
	'div',
	() => `
  text-align: center;
  font-size: 23px;
  font-weight: 700;
  line-height: 120%;
  `
);

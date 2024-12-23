import { writable } from 'svelte/store';

// Store to hold window size and isMobile state
export const windowSize = writable({ width: 0, height: 0 });
export const isMobile = writable(false);

// Function to handle window resizing
export const useWindowSize = () => {
	const handleResize = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Update the window size store
		windowSize.set({ width, height });

		// Log the window width for debugging
		console.log('Window Width:', width);

		// Update the isMobile store based on window width
		isMobile.set(width < 600);
	};

	if (typeof window !== 'undefined') {
		// Call resize handler initially to set the initial values
		handleResize();

		// Add event listener for resizing the window
		window.addEventListener('resize', handleResize);
	}

	// Return the reactive store data (windowSize, isMobile)
	return { windowSize, isMobile };
};

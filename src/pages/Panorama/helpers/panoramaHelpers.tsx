export default function GetDescriptionHeader({ text }: { text: string }) {
  return `<p class="psv-panel-header">${text}</p>`;
}

// Helper.ts
export const PulseMarkerHTML = () => {
  return `
    <div class="relative flex items-center justify-center w-10 h-10">
      <!-- The Pulsing Glow -->
      <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
      
      <div class="relative flex items-center justify-center w-10 h-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info w-4 h-4 rounded-full bg-emerald-600 text-white" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
      </div>
    </div>
  `.trim();
};

export const getNormalMarkerHTML = () => {
  return `
    <div class="relative flex items-center justify-center w-6 h-6 transition-transform duration-200 ease-in-out hover:scale-125">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info w-6 h-6 rounded-full bg-emerald-600 text-white" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
    </div>
  `.trim();
};

// <!-- The Solid Center Dot -->
// <span class="relative inline-flex rounded-full h-4 w-4 bg-green-600 border-2 border-white shadow-lg">
// </span>

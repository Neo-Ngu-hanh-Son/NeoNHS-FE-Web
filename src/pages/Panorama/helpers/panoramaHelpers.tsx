export default function GetDescriptionHeader({ text }: { text: string }) {
  return `<p class="psv-panel-header">${text}</p>`;
}

// Helper.ts
export const PulseMarkerHTML = () => {
  return `
    <div class="relative flex items-center justify-center w-8 h-8">
      <!-- The Pulsing Glow -->
      <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
      
      <!-- The Solid Center Dot -->
      <span class="relative inline-flex rounded-full h-4 w-4 bg-green-600 border-2 border-white shadow-lg"></span>
      
      <!-- Optional: Tooltip/Label styling -->
      <div class="absolute -top-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Click for info
      </div>
    </div>
  `.trim();
};

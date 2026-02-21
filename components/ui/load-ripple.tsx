"use client";

import * as React from "react";

export const LoadRipple: React.FC = () => {
  return (
    <div className="relative mt-6 h-[220px] aspect-square">
      <span className="absolute inset-[40%] rounded-full border border-white/85 animate-[ripple_2s_infinite_ease-in-out] bg-gradient-to-tr from-white/20 to-white/12 backdrop-blur-sm z-[98]" />
      <span className="absolute inset-[30%] rounded-full border border-white/70 animate-[ripple_2s_infinite_ease-in-out_0.2s] bg-gradient-to-tr from-white/18 to-white/10 backdrop-blur-sm z-[97]" />
      <span className="absolute inset-[20%] rounded-full border border-white/55 animate-[ripple_2s_infinite_ease-in-out_0.4s] bg-gradient-to-tr from-white/16 to-white/8 backdrop-blur-sm z-[96]" />
      <span className="absolute inset-[10%] rounded-full border border-white/42 animate-[ripple_2s_infinite_ease-in-out_0.6s] bg-gradient-to-tr from-white/14 to-white/6 backdrop-blur-sm z-[95]" />
      <span className="absolute inset-0 rounded-full border border-white/30 animate-[ripple_2s_infinite_ease-in-out_0.8s] bg-gradient-to-tr from-white/12 to-white/4 backdrop-blur-sm z-[94]" />
    </div>
  );
};

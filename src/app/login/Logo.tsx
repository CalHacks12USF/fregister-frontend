interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 40, text: 'text-2xl', tagline: 'text-xs' },
    md: { icon: 64, text: 'text-5xl', tagline: 'text-sm' },
    lg: { icon: 80, text: 'text-6xl', tagline: 'text-base' }
  };

  const config = dimensions[size];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main Logo */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="relative">
          <svg
            width={config.icon}
            height={config.icon}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Outer refrigerator shape */}
            <rect
              x="12"
              y="4"
              width="40"
              height="56"
              rx="4"
              fill="white"
              stroke="#00543C"
              strokeWidth="2"
            />
            
            {/* Divider line (fridge door separator) */}
            <line
              x1="12"
              y1="28"
              x2="52"
              y2="28"
              stroke="#00543C"
              strokeWidth="2"
            />
            
            {/* Handle top */}
            <rect
              x="46"
              y="12"
              width="2"
              height="10"
              rx="1"
              fill="#00543C"
            />
            
            {/* Handle bottom */}
            <rect
              x="46"
              y="36"
              width="2"
              height="16"
              rx="1"
              fill="#00543C"
            />
            
            {/* Tech circuit pattern elements */}
            <circle cx="24" cy="16" r="2" fill="#FDBB30" opacity="0.9" />
            <circle cx="32" cy="16" r="2" fill="#FDBB30" opacity="0.9" />
            <circle cx="40" cy="16" r="2" fill="#FDBB30" opacity="0.9" />
            
            <line x1="24" y1="16" x2="32" y2="16" stroke="#FDBB30" strokeWidth="1.5" opacity="0.7" />
            <line x1="32" y1="16" x2="40" y2="16" stroke="#FDBB30" strokeWidth="1.5" opacity="0.7" />
            
            {/* Snowflake/cooling icon */}
            <g transform="translate(32, 44)">
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#00543C" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#00543C" strokeWidth="2" strokeLinecap="round" />
              <line x1="-4" y1="-4" x2="4" y2="4" stroke="#00543C" strokeWidth="2" strokeLinecap="round" />
              <line x1="-4" y1="4" x2="4" y2="-4" stroke="#00543C" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        
        {/* Company Name */}
        <div className="pb-1">
          <h1 className={`${config.text} tracking-tight bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent leading-tight`}>
            Fregister
          </h1>
        </div>
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <p className="text-slate-600 max-w-md text-center">
          Intelligent cooling solutions for the modern world
        </p>
      )}
    </div>
  );
}

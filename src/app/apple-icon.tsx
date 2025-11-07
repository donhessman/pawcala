import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Apple icon component (larger, rounded for iOS)
const AppleIcon = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main pad */}
          <ellipse cx="50" cy="65" rx="20" ry="18" fill="white" />

          {/* Top left toe */}
          <ellipse cx="30" cy="40" rx="9" ry="12" fill="white" />

          {/* Top middle-left toe */}
          <ellipse cx="42" cy="30" rx="9" ry="13" fill="white" />

          {/* Top middle-right toe */}
          <ellipse cx="58" cy="30" rx="9" ry="13" fill="white" />

          {/* Top right toe */}
          <ellipse cx="70" cy="40" rx="9" ry="12" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
};

export default AppleIcon;
